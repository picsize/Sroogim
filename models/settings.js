(function () {

    if ($('[data-role=panel]').lenght !== 0) {
        $('[data-role=panel]').panel().enhanceWithin();
    }

    if ($('#newsContainer p').lenght !== 0) {
        $('#newsContainer p').marquee();
    }
});


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


