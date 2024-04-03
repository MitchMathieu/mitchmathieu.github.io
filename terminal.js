var serverBaseUrl = 'http://localhost:3000';

$('#terminal').terminal(function (command) {
    var terminal = this;
    var commands = {
        'greet': function () {
            return 'Hello, user!';
        },
        'date': function () {
            return new Date().toLocaleString();
        },
        'ls': function () {
            return listDirectoriesAndFiles(terminal);
        },
        // Add more commands here
    };

    if (command !== '') {
        var commandFunction = commands[command];
        if (commandFunction) {
            try {
                var result = commandFunction();
                if (result !== undefined) {
                    this.echo(new String(result));
                }
            } catch (e) {
                this.error(new String(e));
            }
        }
        else {
            this.error('Unknown command: ' + command);
        }
    }
    else {
        this.echo('');
    }
}, {
    greetings: 'Mitch Mathieu - software developer',
    name: 'mitchs-pc',
    height: 500,
    prompt: '(base) mitchmathieu$ '
});

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