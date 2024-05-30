const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files serve karna
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Data submit route
app.post('/submit', (req, res) => {
  const userData = req.body;

  // Data validate karna
  if (!userData.name || !userData.surname || !userData.mobile || !userData.policeStation) {
    return res.status(400).send('All fields are required.');
  }

  // Data save karna
  fs.readFile('data.json', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).send('An error occurred.');
    }

    const parsedData = data ? JSON.parse(data) : [];
    parsedData.push(userData);

    fs.writeFile('data.json', JSON.stringify(parsedData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('An error occurred while saving data.');
      }
      res.send('Data saved successfully!');
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
