var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var pool = mysql.createPool({
    connectionLimit: 2,
    host: 'mysql.stud.iie.ntnu.no',
    user: 'haakaha',
    password: 'q0Qy977f',
    database: 'haakaha',
    debug: false
});

app.get('/article', (req, res) => {
    executeQuery(res, [], 'SELECT * FROM article ORDER BY hour DESC, minute DESC LIMIT 20');
});

app.get('/article/priority/:val', (req, res) => {
    let val = [req.params.val];
    executeQuery(res, val, 'SELECT * FROM article WHERE priority = ? ORDER BY hour DESC, minute DESC LIMIT 20');
});

app.get('/article/category/:category', (req, res) => {
    let val = [req.params.category];
    executeQuery(res, val, 'SELECT * FROM article WHERE category = ? ORDER BY hour DESC, minute DESC LIMIT 20');
});

app.get('/article/:article_id/comment', (req, res) => {
    let val = [req.params.article_id];
    executeQuery(res, val, 'SELECT nickname, comment FROM comment NATURAL JOIN article WHERE article_id = ?');
});

app.post('/article/:article_id/comment', (req, res) => {
    let val = [req.body.nickname, req.body.comment, req.params.article_id];
    executeQuery(res, val, 'INSERT INTO comment VALUES(DEFAULT, ?,?,?)');
});

app.post('/article', (req, res) => {
    let val = [req.body.title, req.body.hour, req.body.minute, req.body.text, req.body.image, req.body.category, req.body.priority];
    executeQuery(res, val, 'INSERT INTO article VALUES(DEFAULT, ?,?,?,?,?,?, ?)');
});

app.delete('/article/:id', (req, res) => {
    let val = [req.params.id];
    executeQuery(res, val, 'DELETE FROM article WHERE article_id = ?');
});

app.put('/article/:id', (req, res) => {
    let val = [req.body.title, req.body.text, req.body.image, req.body.category, req.body.priority, req.params.id];
    executeQuery(res, val, 'UPDATE article SET title=?, text=?, image=?, category=?, priority=? WHERE article_id=?');
});

function executeQuery(res, val, query) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error(error);
            return res.json({
                error: 'Could not connect to database.'
            });
        }

        connection.query(query, val, (error, rows) => {
            connection.release();
            if (error) {
                console.error(error);
                res.status(500);
                return res.json({
                    error: 'Query error.'
                });
            }
            res.json(rows);
        });
    });
}

var server = app.listen(8080);