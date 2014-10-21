$(function () {
    checkPhonegap();

    $('[data-role=panel]').panel().enhanceWithin();
    $('#newsContainer p').marquee();
});

function checkPhonegap() {
    if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
    if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
}


//$(document).on('pagebeforeshow', '#registerForm', function (e, data) {
//    if (data.prevPage.find('a[data-link]').attr('data-link') === 'register') {
//        $('div.ui-input-btn:last-child').hide();
//        $('div.ui-input-btn:first-child').show();
//        $('#userDetails span').show();
//    }
//    else {
//        $('div.ui-input-btn:last-child').show();
//        $('div.ui-input-btn:first-child').hide();
//        $('#userDetails span').hide();
//    }
//});


