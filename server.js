const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs'); // to access the filesystem so we can read/write db.json

app.use(express.static('public')); // location for our html files
app.use(express.json());  // for reading json data in incoming streams

// Route for index/home
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname,'/index.html'));
//   console.log(path.join(__dirname,'/index.html'));
// });

app.get('/notes', (req, res) => {
     res.sendFile(path.join(__dirname,'/public/notes.html'));
     console.log(path.join(__dirname,'/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname,"/db.json"));
    console.log("Notes db has been called by the client.");
    //console.log(path.join(__dirname,'/notes.html'));
});

app.post('/api/notes', (req, res) => {

  console.log("Server received a request to save a note.");

  // Add the note to db.json
  // Read from incoming JSON body
  const note = req.body;
  console.log(note);

  // Read db.json
  try {

    const data = fs.readFileSync('./db.json', 'utf8');

    // parse JSON string to JSON object
    const db_data = JSON.parse(data);

    // Add note to db.json
    db_data.push(note);

    // Convert db_data back into a string
    const db_string = JSON.stringify(db_data);

    // Save to db.json
    fs.writeFileSync('./db.json',db_string);

    // Return "success" indicator.
    res.sendStatus(200);

  } catch (err) {
      console.log(`Error reading file from disk: ${err}`);
      // Reply that there was a problem.

      res.sendStatus(500);
  }


});


app.delete('/api/notes/:id', (req, res) => {

  // read from db.json

  // convert string to an array

  // remove element from the array where index = id ?????

  // convert array back to a string

  // save the string to db.json

  // send a success note to the client


});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});