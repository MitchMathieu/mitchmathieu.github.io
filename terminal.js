$('#terminal').terminal(function (command) {
    if (command !== '') {
        try {
            var result = window.eval(command);
            if (result !== undefined) {
                this.echo(new String(result));
            }
        } catch (e) {
            this.error(new String(e));
        }
    } else {
        this.echo('');
    }
}, {
    greetings: 'Mitch Mathieu - software developer',
    name: 'mitchs-pc',
    height: 500,
    prompt: 'mitchmathieu$ '
});