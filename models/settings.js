$(function () {
    if ($('[data-role=panel]').lenght != 0) {
        $('[data-role=panel]').panel().enhanceWithin();
    }
    if ($('#newsContainer p').lenght != 0) {
        $('#newsContainer p').marquee();
    }
});

