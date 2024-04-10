var serverBaseUrl = 'http://localhost:3000';
var currentDirectory = 'mitchmathieu';
var count = 0;

$('#terminal').terminal({
    greet: function () {
        return 'Hello, user!';
    },
    date: function () {
        return new Date().toLocaleString();
    },
    ls: function () {
        return listDirectoriesAndFiles(this);
    },
    cd: function (directory) {
        changeDirectory(directory, (newDirectory) => {
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
    help: function () {
        var availableCommands = ['greet', 'date', 'ls', 'cd <dir>', 'pwd', 'pcd', 'figlet <text>', 'show <image link>', 'help'];
        this.echo('Available commands:\n-' + availableCommands.join('\n-'));
    }
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

function showImage(fileName, terminal) {
    const filePath = `${currentDirectory}/${fileName}`;
    $.ajax({
        url: `${serverBaseUrl}/get-file-type`,
        data: { filepath: filePath },
        method: 'GET',
        success: (fileType) => {
            if (fileType.mime.startsWith('image/')) {
                terminal.echo($(`<img src="${currentDirectory}/${fileName}" />`));
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
    $.ajax({
        url: `${serverBaseUrl}/go-to-root-directory`,
        method: 'GET',
        success: (newDirectory) => {
            currentDirectory = newDirectory;
            if (typeof callback === 'function') {
                return callback(newDirectory);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('An error occurred: ' + textStatus);
        }
    });
}

function buildGreetingString() {
    var lines = [];
    lines.push(new Date().toLocaleString());
    lines.push("The default interactive shell is now Mosh (Mitch's Own SHell).");
    return lines.join('\n');
}

function listDirectoriesAndFiles(terminal) {
    $.ajax({
        url: `${serverBaseUrl}/list-files`,
        method: 'GET',
        success: (files) => {
            files = files.filter(file => !file.startsWith('.'));
            terminal.echo(files.join('\n'));
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('An error occurred: ' + textStatus);
        }
    });
}

function changeDirectory(directory, callback) {
    if (directory === undefined) {
        return goToRootDirectory();
    }
    $.ajax({
        url: `${serverBaseUrl}/change-directory`,
        data: { directory: directory },
        method: 'GET',
        success: (newDirectory) => {
            currentDirectory = newDirectory;
            if (typeof callback === 'function') {
                callback(newDirectory);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('An error occurred: ' + textStatus);
        }
    });
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
    $.ajax({
        url: `${serverBaseUrl}/pwd`,
        method: 'GET',
        success: (directory) => {
            terminal.echo('/Users/' + directory);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('An error occurred: ' + textStatus);
        }
    });
}