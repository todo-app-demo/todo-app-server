'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const TOKEN = process.env.TOKEN;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/tasks', (req, res) => {
  client.query(`SELECT * from tasks;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('/admin', (req, res) => res.send(TOKEN === parseInt(req.query.token)))
// app.get('/admin', (req, res) => console.log(req.query.token))

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.post('/tasks/add', bodyParser, (req, res) => {
  let {title, description, category, contact, status} = req.body;

  client.query(`
      INSERT INTO tasks(title, description, category, contact, status)
      VALUES ($1, $2, $3, $4, $5)`,
      [title, description, category, contact, status]
    )
    .then(results => res.sendStatus(201))
    .catch(console.error);
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// PORT=3000
// CLIENT_URL=http://localhost:8080
// DATABASE_URL=postgres://localhost:5432/task_app
