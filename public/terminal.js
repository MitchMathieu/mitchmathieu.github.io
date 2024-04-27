var serverBaseUrl = 'http://localhost:3000';
// var serverBaseUrl = 'https://mitchmathieu.azurewebsites.net/';
const rootDirectory = 'mitchmathieu';
var currentDirectory = 'mitchmathieu';
var count = 0;

$('#terminal').terminal({
    date: function () {
        return new Date().toLocaleString();
    },
    ls: function () {
        return listDirectoriesAndFiles(this);
    },
    cd: function (directory) {
        changeDirectory(directory, this, (newDirectory) => {
            this.set_prompt(`(base) ${newDirectory}$ `);
        });
        return;
    },
    pwd: function () {
        return printWorkingDirectory(this);
    },
    pcd: function () {
        this.echo(currentDirectory);
    },
    figlet: function (...args) {
        return generateAsciiArt(args.join(' '));
    },
    show: function (fileName) {
        showImage(fileName, this);
    },
    rm: function () {
        this.error('I can\'t let you do that, amigo.');
    },
    read: function (fileName) {
        this.echo(`I understand that you would like to read a text file called ${fileName}.`);
    },
    typeof: function (fileName) {
        getFileType(this, fileName);
    },
    read: function (fileName) {
        readTextFile(this, fileName);
    },
    help: function () {
        helpCommands(this);
    },
}, {
    onInit() {
        this.echo(generateAsciiArt("MITCHS PC"));
        this.echo(buildGreetingString);
        goToRootDirectory((newDirectory) => {
            this.set_prompt(`(base) ${newDirectory}$ `);
        });
    },
    checkArity: false,
    greetings: false,
    name: 'mitchs-pc',
    prompt: `(base) ${currentDirectory}$ `
}
);

function helpCommands(terminal) {
    var availableCommands = [];
    availableCommands.push("");
    availableCommands.push("--Available Commands--");
    availableCommands.push("[[;green;]date]: display the current date and time");
    availableCommands.push("[[;green;]ls]: list files and directories in the current directory");
    availableCommands.push("[[;green;]cd <dir>]: change directory to <dir>");
    availableCommands.push("[[;green;]pwd]: print the current working directory");
    availableCommands.push("[[;green;]figlet <text>]: generate ASCII art from <text>");
    availableCommands.push("[[;green;]show <fileName>]: display an image file");
    availableCommands.push("[[;green;]help]: display this help message");
    availableCommands.push("[[;green;]read <fileName>.txt]: read a text file");
    availableCommands.push("");
    terminal.echo(availableCommands.join('\n'));
}

function readTextFile(terminal, fileName) {
    const filePath = `${currentDirectory}/${fileName}`;
    $.ajax({
        url: `${serverBaseUrl}/read-file`,
        data: { filepath: filePath },
        method: 'GET',
        success: (fileContents) => {
            terminal.echo(`[[;green;]"""]\n${fileContents}\n[[;green;]"""]`);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('An error occurred: ' + jqXHR.responseText);
        }
    });
}

function getFileType(terminal, fileName) {
    const filePath = `${currentDirectory}/${fileName}`;
    $.ajax({
        url: `${serverBaseUrl}/get-file-type`,
        data: { filepath: filePath },
        method: 'GET',
        success: (fileType) => {
            terminal.echo(`The file ${fileName} is of type ${fileType.mime}`);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('An error occurred: ' + jqXHR.responseText);
        }
    });
}

function showImage(fileName, terminal) {
    const filePath = `${currentDirectory}/${fileName}`;
    $.ajax({
        url: `${serverBaseUrl}/get-file-type`,
        data: { filepath: filePath },
        method: 'GET',
        success: (fileType) => {
            if (fileType.mime.startsWith('image/')) {
                terminal.echo($(`<img src="${currentDirectory}/${fileName}" class="scaled-image" />`));
            } else {
                terminal.error('cannot show non-image files');
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('Cannot show that item.');
        }
    });
}

function goToRootDirectory(callback) {
    currentDirectory = rootDirectory;
    if (typeof callback === 'function') {
        callback(currentDirectory);
    }
}

function buildGreetingString() {
    var lines = [];
    lines.push(new Date().toLocaleString());
    lines.push("The default interactive shell is now Mosh (Mitch's Own SHell).");
    lines.push("Type 'help' and press enter to see a list of available commands.");
    return lines.join('\n');
}

function listDirectoriesAndFiles(terminal) {
    $.ajax({
        url: `${serverBaseUrl}/list-files`,
        method: 'GET',
        data: { directory: currentDirectory },
        success: (files) => {
            files = files.filter(file => !file.startsWith('.'));
            terminal.echo(files.join('\n'));
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('An error occurred: ' + jqXHR.responseText);
        }
    });
}

function changeDirectory(targetDirectory, terminal, callback) {
    if (targetDirectory === undefined) {
        goToRootDirectory(callback);
    }
    else {
        $.ajax({
            url: `${serverBaseUrl}/change-directory`,
            data: { currentDirectory: currentDirectory, targetDirectory: targetDirectory },
            method: 'GET',
            success: (newDirectory) => {
                currentDirectory = newDirectory;
                if (typeof callback === 'function') {
                    callback(newDirectory);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                terminal.error('error: ' + jqXHR.responseText);
            }
        });
    }
}

function generateAsciiArt(text) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${serverBaseUrl}/generate-ascii`,
            data: { text: text },
            method: 'GET',
            success: (asciiArt) => {
                resolve(asciiArt);
            },
            error: () => {
                reject('An error occurred while generating ASCII art');
            }
        });
    });
}

function printWorkingDirectory(terminal) {
    terminal.echo(currentDirectory);
}