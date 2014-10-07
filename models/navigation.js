$(function () {
    var backBtn = '';

});

//go bage button 
$(document).on('click', '.backBtn img', function () {
    $.mobile.changePage(backBtn);
});

//navigate from main screen to register form
$(document).on('click', '#registerFromApp span', function () {
    backBtn = 'index.html';
    $.mobile.changePage('#registerForm');
});