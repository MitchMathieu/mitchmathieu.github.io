document.getElementById('main-menu-icon').addEventListener('click', function () {
    var dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu.style.display === 'none') {
        dropdownMenu.style.display = 'block';
    } else {
        dropdownMenu.style.display = 'none';
    }
});

document.getElementById('social-menu-option').addEventListener('click', function () {
    var userMenu = document.getElementById('social-menu');
    if (userMenu.style.display === 'none') {
        userMenu.style.display = 'block';
    } else {
        userMenu.style.display = 'none';
    }
});