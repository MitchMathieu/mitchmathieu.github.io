import express from 'express';
import fs from 'fs';
import cors from 'cors';
import figlet from 'figlet';
import { fileTypeFromFile } from 'file-type';

const rootDirectory = 'mitchmathieu';
var currentDirectory = 'mitchmathieu';

const app = express();

app.use(cors());

app.get('/read-file', (req, res) => {
    const filePath = req.query.filepath
    // check if file has .txt extension
    if (!filePath.endsWith('.txt')) {
        res.status(400).send('Cannot read files that are not .txt files');
        return;
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('An error occurred');
        } else {
            res.send(data);
        }
    });
});

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

app.get('/get-file-type', async (req, res) => {
    const filePath = req.query.filepath;
    try {
        const fileType = await fileTypeFromFile(filePath);
        res.send(fileType);
    } catch (error) {
        res.status(500).send('An error occurred: ' + error.message);
    }
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
                res.status(400).send(`Invalid directory '${directory}'`);
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