import express from 'express';
import fs from 'fs';
import cors from 'cors';
import figlet from 'figlet';
import { fileTypeFromFile } from 'file-type';

const rootDirectory = 'public/';
const lastAccessibleDirectory = 'users';

const app = express();

app.use(cors());

app.use(express.static('public'));

app.listen(3000, () => console.log('Server started on port 3000'));


app.get('/list-files', (req, res) => {
    const dirPath = rootDirectory + req.query.directory;
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(files);
        }
    });
});

app.get('/change-directory', (req, res) => {
    const currentDirectory = req.query.currentDirectory;
    const targetDirectory = req.query.targetDirectory;
    if (targetDirectory === '..') {
        if (currentDirectory === lastAccessibleDirectory) {
            res.status(400).send('This is the root directory.');
            return;
        }
        var parts = currentDirectory.split('/');
        parts.pop();
        var newDirectory = parts.join('/');
        res.send(newDirectory);
        return;
    }
    else {
        const newDirectory = `${currentDirectory}/${targetDirectory}`;
        const targetPath = rootDirectory + newDirectory;
        fs.stat(targetPath, (err, stats) => {
            if (err || !stats.isDirectory()) {
                res.status(400).send(`Invalid directory '${newDirectory}'`);
            } else {
                res.send(newDirectory);
            }
        });
    }
});

app.get('/read-file', (req, res) => {
    const filePath = rootDirectory + req.query.filepath
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

app.get('/get-file-type', async (req, res) => {
    const relativeFilePath = req.query.filepath;
    const absoluteFilePath = rootDirectory + relativeFilePath;
    try {
        const fileType = await fileTypeFromFile(absoluteFilePath);
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