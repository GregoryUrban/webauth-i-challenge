const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');
const protected = require('./auth/protected-middleware.js')

const server = express();

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
    res.send("It's alive!");
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
  
  server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    // we compare the password guess against the database hash
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  // protect this route, users must provide valid credentials to see the list of users
  server.get('/api/users', (req, res) => { // protected was here
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

  // middleware here: './protected/protected-middleware.js'
  
  
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
  