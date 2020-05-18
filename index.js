const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');
const protected = require('./auth/protected-middleware.js')

const server = express();

const sessionConfig = {
  name: 'monster', // by default would be sid, but you want to trick the hackers
  secret: 'super duper safe mf secret', // ONLY the server will know this
  cookie: {
    maxAge: 60 *60 *1000,
    secure: false, // we dont want to have a secure https in dev, just http. If production you say tru
    httpOnly: true //prevent access from javascript
  },
  resave: false, // resave session even if it didnt change?
  saveUninitialized: true, // Create new sessions automatically, OK to save with cookies - this is to comply with laws on security
}

server.use(session(sessionConfig)) 
server.use(helmet());
server.use(express.json());
// server.use(cors());

const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

server.use(cors(corsOptions));

// endpoints 

server.get('/', (req, res) => {
  const username = req.session.username || 'stranger';
  res.send(`Hello ${username}!`);
  });
  
  server.post('/api/register', (req, res) => {
    let user = req.body;
    // check for username and password
  
    const hash = bcrypt.hashSync(user.password, 10); // 2 to the 10 'rounds'
    // each round is taking the pass and hashing it
    // hash has the password
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  server.post('/api/auth/login',(req, res) => {
    let { username, password } = req.body;
  
    if (!username || !password) {
      res.status(400).json({
        errorMessage: "Please provide a username, and password."
      });
    } else {
    // we compare the password guess against the database hash
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.username = user.username;  // the cookie is sent by express-session library
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
    }
  });
  
  // protect this route, users must provide valid credentials to see the list of users
  server.get('/api/users', protected, (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
  

  server.delete('/api/users/:id', protected, async (req, res) => {
    try {
      const count = await db('users')
        .where({ id: req.params.id })
        .del();
  
      if (count > 0) {
        res.status(200).json({ message: 'User Nuked'});
      } else {
        res.status(404).json({ message: 'Records not found' });
      }
    } catch (error) {}
  });

  server.get('/api/auth/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) =>{
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Twas an error logging out'});
        }
        res.end();
      });
    } else {
      res.end();
    }
  
})

  // middleware here: './protected/protected-middleware.js'
  
  
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
  