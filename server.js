// Bring in Node Dependencies
const express = require('express');
const path = require('path')
const fs = require('fs')

// JSON data
let db = require('./db/db.json')

// Setup Express
const app = express();
const port = process.env.PORT || 3000;

// Setup Middleware to parse data
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// initial route to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// notes route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

// notes api route to return json data : GET method
app.get('/api/notes', (req, res) => {
    res.json(db)
})


// notes api route to add json data : POST method
app.post('/api/notes', (req, res) => {
    // const newNote = req.body
    console.log(db)
    const newNote = {
        title: "testing title",
        text: "testing text"
    }
    db.push(newNote);
    console.log(req.body)
    
})



app.listen(port, (err)=> {
    if (err){
        console.log(err)
    }
    else {
        console.log(`Server is listening on Port: ${port}`)
    }
})