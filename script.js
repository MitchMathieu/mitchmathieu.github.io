var i = 0; // counter for the text

function typeWriter(elementId, text) {
    document.getElementById(elementId).style.display = 'inline'; // show the element
    if (i < text.length) {
        document.getElementById(elementId).innerHTML += text.charAt(i);
        i++;
        setTimeout(function () { typeWriter(elementId, text); }, 100);
    } else {
        i = 0; // reset the counter for the next text
    }
}

function fadeIn(elementId, time) {
    var element = document.getElementById(elementId);
    element.style.opacity = 0;  // start from transparent
    element.style.display = 'inline';  // make sure the element is displayed

    var lastTime = Date.now();
    var tick = function () {
        element.style.opacity = +element.style.opacity + (Date.now() - lastTime) / time;
        lastTime = Date.now();

        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
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
    document.getElementById('name-cursor').style.display = 'none'; // remove name cursor
    document.getElementById('job-prompt').style.display = 'inline'; // show job title prompt
    document.getElementById('job-cursor').style.display = 'inline'; // show job title cursor
}

function typeJobTitle() {
    var jobText = document.getElementById('job').innerText;
    document.getElementById('job').innerText = '';
    typeWriter('job', jobText);
}

function showLastPrompt() {
    document.getElementById('job-cursor').style.display = 'none'; // remove job title cursor
    document.getElementById('last-prompt').style.display = 'inline'; // show last prompt
    document.getElementById('last-cursor').style.display = 'inline'; // show last cursor
}

function showSocials() {
    setTimeout(function () {
        fadeIn('github', 2000);
    }, 500);

    setTimeout(function () {
        fadeIn('linkedin', 2000);
    }, 1500);
}

window.onload = function () {
    showNamePrompt();

    setTimeout(function () {
        typeName();
    }, 2000);

    setTimeout(function () {
        showJobTitlePrompt();
    }, 4000);

    setTimeout(function () {
        typeJobTitle();
    }, 6000);

    setTimeout(function () {
        showLastPrompt();
    }, 9000);

    setTimeout(function () {
        showSocials();
    }, 10000);
};