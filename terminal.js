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
    }
}, {
    onInit() {
        this.echo(generateAsciiArt('Mitch Mathieu'));
        this.echo(buildGreetingString);
        goToRootDirectory();
    },
    checkArity: false,
    greetings: false,
    name: 'mitchs-pc',
    prompt: `(base) ${currentDirectory}$ `
}
);

function goToRootDirectory() {
    $.ajax({
        url: `${serverBaseUrl}/go-to-root-directory`,
        method: 'GET',
        success: (newDirectory) => {
            currentDirectory = newDirectory;
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
    // lines.push("(If this doesn't seem fun to you, the links above will get you to the essentials)");
    return lines.join('\n');
}

function listDirectoriesAndFiles(terminal) {
    $.ajax({
        url: `${serverBaseUrl}/list-files`,
        method: 'GET',
        success: (files) => {
            terminal.echo(files.join('\n'));
        },
        error: (jqXHR, textStatus, errorThrown) => {
            terminal.error('An error occurred: ' + textStatus);
        }
    });
}

function changeDirectory(directory, callback) {
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