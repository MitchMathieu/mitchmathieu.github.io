const express = require('express');
const fs = require('fs');
const cors = require('cors');
const figlet = require('figlet');

const rootDirectory = 'mitchmathieu';
var currentDirectory = 'mitchmathieu';

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

app.get('/generate-ascii', (req, res) => {
    const text = req.query.text;
    figlet.text(text, {
        font: 'Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }, function (err, data) {
        if (err) {
            res.status(500).send('An error occurred');
        } else {
            res.send(data);
        }
    });
});

app.get('/go-to-root-directory', (req, res) => {
    currentDirectory = rootDirectory;
    res.send(currentDirectory);
});

app.get('/change-directory', (req, res) => {
    const directory = req.query.directory;
    if (directory === '..') {
        if (currentDirectory === rootDirectory) {
            res.status(400).send('Cannot go back');
            return;
        }
        var parts = currentDirectory.split('/');
        parts.pop();
        currentDirectory = parts.join('/');
        res.send(currentDirectory);
        return;
    }
    else {
        const newDirectory = `${currentDirectory}/${directory}`;
        fs.stat(newDirectory, (err, stats) => {
            if (err || !stats.isDirectory()) {
                res.status(400).send('Invalid directory');
            } else {
                currentDirectory = newDirectory;
                res.send(currentDirectory);
            }
        });
    }
});

app.get('/pwd', (req, res) => {
    res.send(currentDirectory);
});

app.listen(3000, () => console.log('Server started on port 3000'));