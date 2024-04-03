const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const rootDirectory = 'mitchmathieu';
var currentDirectory = './mitchmathieu';

const app = express();

app.use(cors());

app.get('/list-files', (req, res) => {
    const dirPath = currentDirectory;

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            res.status(500).send('An error occurred');
        } else {
            res.json(files);
        }
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));