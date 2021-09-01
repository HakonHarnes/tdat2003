var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var apiRoutes = express.Router();

var pool = mysql.createPool({
    connectionLimit: 2,
    host: 'mysql.stud.iie.ntnu.no',
    user: 'haakaha',
    password: 'q0Qy977f',
    database: 'haakaha',
    debug: false
});

const PersonDao = require('./dao/persondao.js');
let personDao = new PersonDao(pool);

app.get('/person', (req, res) => {
    console.log('/person: fikk request fra klient');
    personDao.getAll((status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get('/person/:id', (req, res) => {
    console.log('/person/:id: fikk request fra klient');
    personDao.getPerson(req.params.id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post('/person', (req, res) => {
    console.log('/person: creating one person');
    personDao.createPerson(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

var server = app.listen(8080);