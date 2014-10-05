$(function () {
    var backBtn = '';

});

$(document).on('click', '.backBtn img', function () {
    $.mobile.changePage(backBtn, {transition: 'flip'});
});