
api = 'http://www.sroogim.co.il/SroogimCMS/app/api/Default.aspx/';
//api = '../SroogimCMS/app/api/Default.aspx/';
date = getAllDates();
present = getAllPresents();


$(function () {
    checkPhonegap();

    $('#menuSidebar').panel().enhanceWithin();
    $('#newsContainer p').marquee();

    //navigator.geolocation.getCurrentPosition(geolocationSuccess,[geolocationError],[geolocationOptions]);
});

function checkPhonegap() {
    if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
    if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
}

//get all dates
function getAllDates() {
    $.ajax({
        type: 'POST',
        url: api + 'getAllAppDates',
        data: '',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            date = JSON.parse(result.d);
        }
    });
}

//get all presents
function getAllPresents() {
    $.ajax({
        type: 'POST',
        url: api + 'getAllAppPresents',
        data: '',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            present = JSON.parse(result.d);
        }
    });
}

//create date page
function createDatePage(json) {
    $('#singleDate_dateHeader').text(json.DateHeader);
    $('#singleDate_dateLocation').text(json.DateLocation + ' - ' + json.CityName);
    $('#singleDate_dateWebsite').attr('href', 'waze://?q=' + json.DateGps);
    $('#singleDate_dateDesc').text(json.DateDescription);
    if (json.ShowDateTip == 'Y') {
        $('#singleDate_dateTip').text(json.DateTip);
    }
    else {
        $('#singleDate_dateTip').parent().parent().hide();
    }
    //var info = json.MoreInfoHeader.split('<br>');
    //var infoText = '';
    //for (var i = 0; i < info.length; i++) {
    //    infoText += info[i] + "<br>";
    //}
    $('#singleDate_dateStepsHeader').text(json.MoreInfoHeader);
    $('#singleDate_dateSteps').html(json.MoreInfoText);
}

//create present page
function createPresentPage(json) {
    $('#singlePresent_presentHeader').text(json.PresentHeader);
    $('#singlePresent_presentDesc').text(json.PresentDescription);
    if(json.PresentTip != ''){
        $('#singlePeresent_presentTip').text(json.PresentTip);
    }
    else {
        $('#singlePeresent_presentTip').parent().parent().hide();
    }
}

//create dates list
$(document).on('pagebeforecreate', '#datesList', function () {
    var dateLi = '';
    for (var i = 0; i < date.length; i++) {
        dateLi += '<li class="dataItem">' +
                        '<div><img src="essential/images/Favroites/imgFav.png" /></div>'+
                        '<div>'+
                            '<h3>' + date[i].DateHeader + '</h3>' + 
                            '<article>' + date[i].DateDescription.substring(0,70) + '</article>' +
                            '<section class="social">'+
                                '<ul>'+
                                    '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" /></li>'+
                                    '<li><img src="essential/images/General/sharegray.png" class="share" alt="שיתוף" /></li>'+
                                    '<li><section class="rating">'+
                                            '<span data-value="5" data-empty="true">'+
                                                '<img src="essential/images/General/blankStar.png" />'+
                                            '</span>'+
                                            '<span data-value="4" data-empty="true">'+
                                                '<img src="essential/images/General/blankStar.png" />'+
                                            '</span>'+
                                            '<span data-value="3" data-empty="true">'+
                                                '<img src="essential/images/General/blankStar.png" />'+
                                            '</span>'+
                                            '<span data-value="2" data-empty="false">'+
                                                '<img src="essential/images/General/goldenStar.png" />'+
                                            '</span>'+
                                            '<span data-value="1" data-empty="false">'+
                                                '<img src="essential/images/General/goldenStar.png" />'+
                                            '</span>'+
                                        '</section>'+
                                    '</li>'+
                                    '<li>'+
                                        '<p>10 ק"מ ממקומך</p>'+
                                    '</li>'+
                                '</ul>'+
                            '</section>'+
                        '</div>'+
                        '<div>'+
                            '<a data-ajax="false" href="index.html#singleDate" class="goToDate" data-date-id="' + date[i].DateID + '">'+
                                '<img src="essential/images/Favroites/arrow_gray.png" /></a>'+
                        '</div>'+
                        '</li>';
    }
    $('.dataList').html(dateLi);
});

//show date page
$(document).on('click', '.goToDate', function () {
    var dateID = parseInt($(this).attr('data-date-id'));
    for (var i = 0; i < date.length; i++) {
        if (dateID == date[i].DateID) {
            createDatePage(date[i]);
        }
    }
});

//create present list
$(document).on('pagebeforecreate', '#presentsList', function () {
    var presentLi = '';
    for (var i = 0; i < present.length; i++) {
        presentLi += '<li class="dataItem">' +
                        '<div><img src="essential/images/Presents/Category/neckles.jpg" /></div>' +
                        '<div>' +
                            '<h3>' + present[i].PresentHeader + '</h3>' +
                            '<article>' + present[i].PresentDescription.substring(0, 70) + '</article>' +
                            '<section class="social">' +
                                '<ul>' +
                                    '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" /></li>' +
                                    '<li><img src="essential/images/General/sharegray.png" class="share" alt="שיתוף" /></li>' +
                                    '<li><section class="rating">' +
                                            '<span data-value="5" data-empty="true">' +
                                                '<img src="essential/images/General/blankStar.png" />' +
                                            '</span>' +
                                            '<span data-value="4" data-empty="true">' +
                                                '<img src="essential/images/General/blankStar.png" />' +
                                            '</span>' +
                                            '<span data-value="3" data-empty="true">' +
                                                '<img src="essential/images/General/blankStar.png" />' +
                                            '</span>' +
                                            '<span data-value="2" data-empty="false">' +
                                                '<img src="essential/images/General/goldenStar.png" />' +
                                            '</span>' +
                                            '<span data-value="1" data-empty="false">' +
                                                '<img src="essential/images/General/goldenStar.png" />' +
                                            '</span>' +
                                        '</section>' +
                                    '</li>' +
                                '</ul>' +
                            '</section>' +
                        '</div>' +
                        '<div>' +
                            '<a data-ajax="false" href="index.html#singlePresent" class="goToPresent" data-present-id="' + present[i].PresentID + '">' +
                                '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                        '</div>' +
                        '</li>';
    }
    $('.dataList').html(presentLi);
});

//show present page
$(document).on('click', '.goToPresent', function () {
    var presentID = parseInt($(this).attr('data-present-id'));
    for (var i = 0; i < present.length; i++) {
        if (presentID == present[i].PresentID) {
            createPresentPage(present[i]);
        }
    }
});

//$(document).on('pagebeforecreate', '#datesPage', function () {
//    $('#datesPage .wrapper').append('<div data-role="collapsible"> <h4>דייטים באוויר הצח2 <img src="essential/images/Dates/Category/outside.jpg" /> </h4> <ul data-role="listview"> <li><a href="index.html#singleDate" data-dateId="1" class="goToDate ui-btn ui-shadow ui-btn-icon-right ui-icon-tree">טיילות</a></li> <li><a href="index.html#singleDate" data-dateId="1" class="goToDate ui-btn ui-shadow ui-btn-icon-right ui-icon-ship">מעיינות</a></li> <li><a href="index.html#singleDate" data-dateId="1" class="goToDate ui-btn ui-shadow ui-btn-icon-right ui-icon-old">מקומות עתיקים</a></li> </ul> </div>');
//});



