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
  const new_note = req.body;
  console.log(new_note);

  // Read db.json
  //try {

    const data = fs.readFileSync('./db.json', 'utf8');

    // parse JSON string to JS object
    let db_data = JSON.parse(data);

    // add an id number
    let id= -1;
    // Make an array of current id numbers.
    let id_arr = [];
    for (let note of db_data) {
      id_arr.push(note.id);
    }
    const max_id = Math.max(...id_arr);
    for (let i=1; i<max_id;i++) { // loop through all numbers between 0 and current max id
      if (id_arr.indexOf(i) == -1) { // if number isn't in current id_array, use as an id
        id = i;
        break;
      }
    }
    if (id_arr.length == 0) {
      id = 1;
    } else if (id == -1) id = max_id + 1;

    new_note.id = id;

    // Add note to db.json
    db_data.push(new_note);

    // Convert db_data back into a string
    const db_string = JSON.stringify(db_data);

    // Save to db.json
    fs.writeFileSync('./db.json',db_string);

    // Return "success" indicator.
    res.sendStatus(200);

  // } catch (err) {
  //     console.log(`Error reading file from disk: ${err}`);
  //     // Reply that there was a problem.

  //     res.sendStatus(500);
  // }


});


app.delete('/api/notes/:id', (req, res) => {

  //try {

    let id = req.params.id;

    console.log("Received request to delete note with id: " + id);
    // read from db.json
    const data = fs.readFileSync('./db.json', 'utf8');
    
    // convert string to an array
    const db_data = JSON.parse(data);

    // remove element from the array where index = id ?????
    // find the note with the matching id

    for (let i=0; i<db_data.length; i++) {
    //for (let note of db_data) {
      if (db_data[i].id == id) {
        db_data.splice(i,1);
        // convert array back to a string
        const db_string= JSON.stringify(db_data);
        // save the string to db.json
        fs.writeFileSync('./db.json',db_string);
        // send a success note to the client
        res.sendStatus(200);
        return;
      }
    }

    res.sendStatus(500);
    

  // }
  // catch (err) {
  //   console.log(`Error reading file from disk: ${err}`);
  //   // Something bad happened. Call the ghostbusters.
  //   res.sendStatus(500);
  // }

});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});