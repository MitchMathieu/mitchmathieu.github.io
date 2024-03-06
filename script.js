var i = 0; // counter for the text

function typeWriter(elementId, text) {
    document.getElementById(elementId).style.display = 'inline'; // show the element
    if (i < text.length) {
        document.getElementById(elementId).innerHTML += text.charAt(i);
        i++;
        setTimeout(function () { typeWriter(elementId, text); }, 150);
    } else {
        i = 0; // reset the counter for the next text
    }
}
function showNamePrompt() {
    var text = document.getElementById('name-prompt').innerText;
    document.getElementById('name-prompt').innerText = '';
    typeWriter('name-prompt', text);
}

function typeName() {
    var nameText = document.getElementById('name').innerText;
    document.getElementById('name').innerText = '';
    typeWriter('name', nameText);
}

function showJobTitlePrompt() {
    var text = document.getElementById('job-prompt').innerText;
    document.getElementById('job-prompt').innerText = '';
    typeWriter('job-prompt', text);
}

window.onload = function () {
    showNamePrompt();

    setTimeout(function () {
        typeName();
    }, 2000);

    setTimeout(function () {
        showJobTitlePrompt();
    }, 500);
};