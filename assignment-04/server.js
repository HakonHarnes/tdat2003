var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var app = express();
app.use(bodyParser.json()); // for å tolke JSON i body

// Burde vært ekte sertifikat, lest fra config...
let privateKey = (publicKey = 'shhhhhverysecret');

function loginOk(username, password) {
    return password == 'secret';
}

// Server klientapplikasjonen (i public-mappa) på rot-url'en http://localhost:8080
app.use(express.static('public'));

// Håndterer login og sender JWT-token tilbake som JSON
app.post('/login', (req, res) => {
    if (loginOk(req.body.username, req.body.password)) {
        console.log('LOGIN OK');
        let token = jwt.sign({ username: req.body.username }, privateKey, {
            expiresIn: 60
        });

        res.json({ jwt: token });
    } else {
        console.log('LOGIN NOT OK');
        res.status(401);
        res.json({ error: 'NOT AUTHORIZED' });
    }
});

// Plasserer denne MÌDDLEWARE-funksjonen
// foran alle endepunktene under samme path
app.use('/api', (req, res, next) => {
    var token = req.headers['x-access-token'];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            console.log('INVALID TOKEN');
            res.status(401);
            res.json({ error: 'NOT AUTHORIZED' });
        } else {
            console.log('VALID TOKEN');
            next();
        }
    });
});

app.get('/token', (req, res) => {
    var token = req.headers['x-access-token'];

    jwt.verify(token, publicKey, (error, decoded) => {
        if (error) {
            console.log('UNABLE TO REFRESH TOKEN');
            res.status(401);
            res.json({ error: 'NOT AUTHORIZED' });
        } else {
            console.log('REFRESHED TOKEN');
            let token = jwt.sign({ username: req.body.username }, privateKey, { expiresIn: 60 });
            return res.json({ jwt: token });
        }
    });
});

app.get('/api/person', (req, res) => {
    res.json([{ name: 'Hei Sveisen' }]);
});

app.get('/api/person/:personId', (req, res) => {
    res.json({ name: 'Hei Sveisen' });
});

app.post('/api/person', (req, res) => {
    res.send('');
});

var server = app.listen(8080);
