// Bring in Node Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// Utilizing node.js util function for promisification in order to convert callbacks to promises, using readFile and writeFile within GETs, POSTs, and DELETEs.
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Joining db.json file using noteArray variable
const noteArray = path.join(__dirname, "db/db.json");
console.log(noteArray);

// Setup Express App
const app = express();
const port = process.env.PORT || 3000;

// Setup Middleware to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// connect style and script sheets that reside in the public folder.
app.use(express.static("public"));

// notes api route to return json data : GET method

app.get("/api/notes", function (req, res) {
  // Convert data using parse
  readFile(noteArray, "utf8")
    .then((data) => res.json(JSON.parse(data)))
    .catch((error) => {
      // If error arises, display
      console.log(`Error reading file! ${noteArray}`);
    });
});

// Generating IDs to sort through array of objects. Setting original ID value at 0 will let us build up order of notes taken and target the IDs that we want to select, shown later in the delete function.
function generateNewId(currentNotes) {
  let highestId = 0;
  currentNotes.forEach((note) => {
    if (note.id > highestId) {
      highestId = note.id;
    }
  });
  return highestId + 1;
}

// POST - Create New Notes
app.post("/api/notes", function (req, res) {
  readFile(noteArray, "utf8")
    .then((data) => {
      let notes = JSON.parse(data);
      // Spread operators are used to expand elements of an iterable (think array-like) into situations where multiple elements can fit.
      const newNote = { ...req.body, id: generateNewId(notes) };
      notes.push(newNote);
      writeFile(noteArray, JSON.stringify(notes))
        .then(() => {
          res.json(newNote);
        })
        .catch((error) => {
          console.log(`Error writing file! ${noteArray}`);
        });
    })
    .catch((error) => {
      console.log(`Error reading file! ${noteArray}`);
    });
});

// DELETE
app.delete("/api/notes/:id", function (req, res) {
  // generating variable to reference request parameter ID - parsed as integer
  const idToBeDeleted = parseInt(req.params.id);
  readFile(noteArray, "utf8")
    .then((data) => {
      let notes = JSON.parse(data);
      // Filtering newNote to ensure its ID doesn't equate to  idToBeDeleted
      // REMINDER: filter() method generates a new array with all elements installed by the function provided
      notes = notes.filter((newNote) => newNote.id !== idToBeDeleted);
      writeFile(noteArray, JSON.stringify(notes))
        .then(() => {
          res.send("Got a DELETE request at /user");
        })
        .catch((error) => {
          console.log(`Error writing file! ${noteArray}`);
        });
    })
    .catch((error) => {
      console.log(`Error reading file! ${noteArray}`);
    });
});


// notes route to notes.html

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// initial route to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// listener

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listening on Port: ${port}`);
  }
});
