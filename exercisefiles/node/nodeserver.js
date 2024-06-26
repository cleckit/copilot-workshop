const express = require('express');
const url = require('url');
const colors = require('./colors.json');
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const API_KEY = 'your_api_key_here'; // replace with your actual API key


const app = express();

app.get('/get', (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { query } = parsedUrl;

    const key = query.key;
    if (!key) {
        res.send('hello world');
    } else {
        res.send(`hello ${key}`);
    }
});

app.get('/DaysBetweenDates', (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { query } = parsedUrl;

    const date1 = query.date1;
    const date2 = query.date2;
    if (!date1 || !date2) {
        res.send('Both date1 and date2 parameters are required');
    } else {
        const daysBetween = Math.floor((new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
        res.send(`Days between ${date1} and ${date2}: ${daysBetween}`);
    }
});
//validate phoneNumber with Spanish format, for example +34666777888
app.get('/Validatephonenumber', (req, res) => {
    const phoneNumber = req.query.phoneNumber;
    const phoneNumberRegex = /^\+34\d{9}$/;
    if (phoneNumberRegex.test(phoneNumber)) {
        res.send('valid');
    } else {
        res.send('invalid');
    }
});


// /ValidateSpanishDNI:

//     Receive by querystring a parameter called dni
//     calculate DNI letter
//     if DNI is valid return "valid"
//     if DNI is not valid return "invalid"

app.get('/ValidateSpanishDNI', (req, res) => {
    const dni = req.query.dni;
    const dniRegex = /^\d{8}[A-Z]$/;
    if (!dniRegex.test(dni)) {
        res.send('invalid');
    } else {
        const letter = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const letterIndex = parseInt(dni.substring(0, 8)) % 23;
        if (letter[letterIndex] === dni[8]) {
            res.send('valid');
        } else {
            res.send('invalid');
        }
    }
});
app.get('/ReturnColorCode', (req, res) => {
    const colorQuery = req.query.color;
    fs.readFile('./colors.json', (err, data) => {
        if (err) {
            res.send('Error reading colors.json');
        } else {
            const colors = JSON.parse(data);
            const color = colors.find(c => c.color === colorQuery);
            if (color) {
                res.send(color.rgba);
            } else {
                res.send('Color not found');
            }
        }
    });
});

app.get('/TellMeAJoke', (req, res) => {
    axios.get('https://official-joke-api.appspot.com/random_joke')
        .then(response => {
            res.send(response.data.setup + ' ' + response.data.punchline);
        })
        .catch(error => {
            res.send('Error fetching joke');
        });
});




app.get('/MoviesByDirector', (req, res) => {
    const director = req.query.director;
    axios.get(`http://movieapi.com/director?name=${director}&apiKey=${API_KEY}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.send('Error fetching movies');
        });
});

app.get('*', (req, res) => {
    res.send('method not supported');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
