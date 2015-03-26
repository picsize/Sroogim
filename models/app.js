
api = 'http://www.sroogim.co.il/SroogimCMS/app/api/Default.aspx/';
dateImgSrc = 'http://www.sroogim.co.il/SroogimCMS/content/dates/';
presentImgSrc = 'http://www.sroogim.co.il/SroogimCMS/content/presents/';
top5ImgSrc = 'http://www.sroogim.co.il/SroogimCMS/content/top5/'
categoriesSrc = 'http://www.sroogim.co.il/SroogimCMS/content/categories/';
presentCategoriesSrc = 'http://www.sroogim.co.il/SroogimCMS/content/presentCategories/';
subCategoriesSrc = 'http://www.sroogim.co.il/SroogimCMS/content/subCategories/';
userImgSrc = 'http://www.sroogim.co.il/SroogimCMS/content/users/';
//api = '../SroogimCMS/app/api/Default.aspx/';
//dateImgSrc = '../SroogimCMS/content/dates/';
//presentImgSrc = '../SroogimCMS/content/presents/';
//top5ImgSrc = '../SroogimCMS/content/top5/'
//categoriesSrc = '../SroogimCMS/content/categories/';
//presentCategoriesSrc = '../SroogimCMS/content/presentCategories/';
//subCategoriesSrc = '../SroogimCMS/content/subCategories/';
//userImgSrc = '../SroogimCMS/content/users/';
var dates, presents, categories, locations, news, lat, lng, thisDate, thisPresent, currentDateId, currentPresentId;
var favDates = [], favPresents = [];
var subCategories = [], gpsAddress = [], distance = [];
var dateCategoriesHTML = '', presentCategoriesHTML = '';
var userEmail, userFullName, userPassword = 0, userProfilePic, userCoverPic = 'private', userBirthDay, userGender, userDeviceID;
var userPermision = '', ratingValue = 0, applyGps = '1';
var facebookResponse;

document.addEventListener("deviceready", initApp, false);

$(document).on('pagebeforecreate', '#loadingScreen', function () {
    //alert('init panel and popup');
    $('#menuSidebar').panel().enhanceWithin();
    //$('#popup').enhanceWithin().popup();
});

//$(function () {
//    initApp();
//});


function initApp() {
    $.mobile.defaultPageTransition = 'none';

    try {
        userDeviceID = device.uuid;
    } catch (e) {
        userDeviceID = 'private_' + Math.floor((Math.random() * 10000) + 1);;
    }
    //alert('uuid: ' + userDeviceID);
    var count = 10;
    var loadComponents = function () {
        if (count <= 0) {
            $.mobile.changePage('index.html#welcomeScreen');
            $.mobile.loading('hide');
            getLoginStatus();
        }
        else {
            count--;
            $.mobile.loading('show', {
                textVisible: false,
                theme: 'b',
                textonly: false
            });
            setTimeout(loadComponents, 1000);
        }
    }
    loadComponents();
    checkPhonegap();
    loadAllData();
    getCurrentlatlong();
    getTop5App();
    loadFacebook();

    $.ajaxSetup({
        beforeSend: function () {
            $.mobile.loading('show', {
                text: '',
                textVisible: false,
                theme: 'a',
                textonly: false
            });
        },
        complete: function () {
            $.mobile.loading('hide');
        }
    });

    $(document).on('click', '[data-role="header"] h1', function () {
        $.mobile.changePage('index.html#mainScreen');
    });

    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
        $.mobile.activePage.find('.goBack').click();
    }, false);

    $(document).on('click', '[data-rel="back"]', goBackPage);

}

//#region Init

//check phonegap components
function checkPhonegap() {
    if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
    //if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    //if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
}

//load all data
function loadAllData() {
    getAllDates();
    getAllPresents();
    getAllCategories();
    getAllLocations();
    getAllNews();
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
            dates = JSON.parse(result.d);
            //alert('DATES: ' + JSON.stringify(dates));
            for (var i = 0; i < dates.length; i++) {
                // alert('i=' + i);
                codeAddress(dates[i].DateGps, dates[i].DateID);
            }
            //alert('done: ' + JSON.stringify(gpsAddress));
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
            presents = JSON.parse(result.d);
            //alert('PRESENTS: ' + JSON.stringify(presents));
        }
    });
}

//get all categories
function getAllCategories() {
    $.ajax({
        type: 'POST',
        url: api + 'getAllCategoriesForApp',
        data: '',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            categories = JSON.parse(result.d);
            //alert('CATEGORIES: ' + JSON.stringify(categories));
        }
    });
}

//get all locations
function getAllLocations() {
    $.ajax({
        type: 'POST',
        url: api + 'getAllAreasForApp',
        data: '',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            locations = JSON.parse(result.d);
            createLocationPage();
            //alert('LOCATIONS: ' + JSON.stringify(locations));
        }
    });
}

//get all news
function getAllNews() {
    $.ajax({
        type: 'POST',
        url: api + 'getAllNews',
        data: '',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            news = JSON.parse(result.d);
            setNewsMarquee(news);
            createNewsPage(news);
            //alert('NEWS: ' + JSON.stringify(news));
        }
    });
}

//top 5
function getTop5App() {
    $.ajax({
        type: "POST",
        url: api + "getTop5App",
        data: "",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                //alert(result.d);
            }
            else {
                var settings = JSON.parse(result.d);
                $('#dates p').html(settings[4]);
                $('#presents p').html(settings[5]);
                if (settings[0] == 0) {
                    $('.addComment').hide();
                }
                if (settings[3] == "Y") {
                    $('#top5').html('<iframe width="100%" style="height:13em" src="' + settings[2] + '?rel=0&autoplay=0&controls=0" frameborder="0" allowfullscreen></iframe>');
                }
                else {
                    var imagesString = settings[1].split(',');
                    var top5HTML = '';
                    for (var i = 0; i < imagesString.length; i++) {
                        top5HTML += '<img src="' + top5ImgSrc + imagesString[i] + '" />'
                    }
                    var c = 5 - imagesString.length;
                    if (c > 0) {
                        for (var j = 0; j < c; j++) {
                            top5HTML += '<img src="' + top5ImgSrc + imagesString[j] + '" />'
                        }
                    }
                    $('#top5').html(top5HTML);
                }
            }
        }
    });
}

//#endregion

//#region GPS & Location

//get my current location
function getCurrentlatlong() {

    if (navigator.geolocation) {
        //alert("navigator.geolocation is supported");
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
    }
    else {
        //alert("navigator.geolocation not supported");
    }
}

//success to get my location
function onSuccess(position) {
    //alert("onSuccess called");
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    //alert('lat: ' + lat + '\nlng: ' + lng);
}

//error while getting my location
function onError(error) {
    //alert("Getting the error" + error.code + "\nerror mesg :" + error.message);
}

//convert date location to lat & lng
function codeAddress(address, dateID) {
    //alert('codeAddress');
    var geocoder = new google.maps.Geocoder();
    //alert('g: ' + geocoder);
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var dGps = {
                'dateID': dateID,
                'lat': results[0].geometry.location.k,
                'lng': results[0].geometry.location.D
            };
            //alert('dGps: ' + JSON.stringify(dGps));
            gpsAddress.push(dGps);
        } else {
            return address
        }
    });
}

//calculate the distance between my curret location to date location
function calculateDistances(myLocation, dateJson) {
    thisDate = dateJson;
    //alert('fdfdf: ' + JSON.stringify(thisDate));
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
          origins: [myLocation],
          destinations: [dateJson.DateGps],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
      }, setDistance);
}

//set the distance in the app
function setDistance(response, status) {
    //alert('sss: ' + JSON.stringify(thisDate));
    if (status != google.maps.DistanceMatrixStatus.OK) {
        console.log('Error was: ' + status);
    } else {
        var origins = response.originAddresses;
        //alert(JSON.stringify(origins));
        var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                if (results[j].status == "ZERO_RESULTS") {
                    d = 'לא ניתן לחשב מרחק';
                }
                else {
                    d = results[j].distance.text.replace('km', 'ק"מ') + ' ממקומך';
                }

                distance.push(d);
                //alert(JSON.stringify(distance));
            }

        }
    }
}

//#endregion

//#region Facebook

function loginToSroogim(fbData) {
    //alert('fbData:\n' + JSON.stringify(fbData));
    //#region cover
    try {
        userCoverPic = fbData.cover.source;
        if (userCoverPic == '' || userCoverPic == undefined) {
            userCoverPic = 'private';
        } else {
            $('#sidebarCoverImg').attr('src', userCoverPic);
        }
    } catch (e) {
        userCoverPic = 'private';
    }
    //#endregion

    //#region email
    try {
        userEmail = fbData.email;
        if (userEmail == undefined) {
            userEmail = 'private';
        }
    } catch (e) {
        userEmail = 'private';
    }
    //#endregion

    //#region full name
    try {
        userFullName = fbData.first_name + ' ' + fbData.last_name;
        //alert('name: ' + response.first_name + ' ' + response.last_name);
        if (userFullName == '') {
            userFullName = 'private';
        }
    } catch (e) {
        userFullName = 'private';
    }
    //#endregion

    //#region profile
    try {
        userProfilePic = 'http://graph.facebook.com/' + fbData.id + '/picture?width=171&height=171';
        //alert('pImg: ' + 'http://graph.facebook.com/' + response.id + '/picture?width=171&height=171');
        if (fbData.id == undefined) {
            userProfilePic = 'private';
        }
        else {
            $('#sidebarProfileImg').css('background-image', 'url("' + userProfilePic + '")');
        }
    } catch (e) {
        userProfilePic = 'private';
    }
    //#endregion

    //alert('loginToSroogimAs:\n' + userEmail + '\n' + userFullName + '\n' + userPassword + '\n' + userProfilePic + '\n' + userCoverPic + '\n' + userDeviceID);
    checkFacebookUser();

}

function loadFacebook() {
    try {
        FB.init({
            appId: "988309234528102",
            nativeInterface: CDV.FB,
            useCachedDialogs: false,
            oauth: true
        });
    } catch (e) {

    }
}

function getLoginStatus() {
    FB.getLoginStatus(function (response) {
        if (response.status == 'connected') {
            fbApi(response);
        }
    });
}

function fbApi(d) {
    //alert('test api:\n' + JSON.stringify(d));
    var apiCall = function () {
        FB.api('/me/?fields=id,email,cover,first_name,last_name', function (response) {
            //console.log('Good to see you, ' + response.name + '.');
            if (response && !response.error) {
                loginToSroogim(response);
            }
        });
    }
    apiCall();
}

function facebookLogin() {
    FB.login(function (response) {
        if (response.authResponse) {
            fbApi(response);
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { scope: 'email, user_birthday, user_location' });
}

function checkFacebookUser() {
    //alert('cfu:\n' + userEmail + ', ' + userFullName + ', ' + userPassword + ', ' + userProfilePic + ', ' + userCoverPic + ', ' + userDeviceID);
    var json = createUserJsonFromFacebook();
    //alert('userJson from CFU: ' + JSON.stringify(json));
    $.ajax({
        type: "POST",
        url: api + "checkFacebookUser",
        data: "{userJson: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(textStatus);
            //alert(JSON.stringify(XMLHttpRequest));
            //alert(JSON.stringify(errorThrown));
        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                alert(result.d);
            }
            else {
                //alert('result.d cfu ok: \n' + result.d);
                if (result.d == '0') {
                    registerUserFromFacebook(json);
                    $('#userName').text(userFullName);
                }
                else if (result.d == '2') {
                    $('#popupContent').html('<h2>נרשמת כבר דרך פייסבוק. כנראה שאתה לא משתמש במכשירך</h2>');
                    openPopup();
                }
                else {
                    getUserFavoritsDates();
                    getUserFavoritsPresents();
                    $('#userName').text(json.userFullName);
                    userPermision = 1;
                    $.mobile.changePage('index.html#mainScreen');
                }
            }
        }
    });
    //else {
    //    //setInterval(checkFacebookUser, 7000);
    //}
}

$(document).on('click', '#facebookLogin', facebookLogin);

$(document).on('click', '.addComment', function () {
    $('#popupContent').html('<iframe src="http://sroogim.co.il/SroogimCMS/app/api/facebook.html" width="100%" style="border:none; height:auto; min-height:357px;"></iframe>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">סגור</button>');
    //$('#popup').on('popupbeforeposition', function () {
    //    $(this).css({
    //        'max-height': $(window).height() * 0.9,
    //        'width': '100%'
    //    });
    //});
    openPopup();
});

//#endregion

//#region Dates

//create date page
function createDatePage(json) {
    var dateRatingHTML = createRating(json.DateRating, 'white');
    $('#singleDate .rating').html(dateRatingHTML);
    try {
        if (json.ShowVideo == 'Y') {
            $('#dateImages').html('<iframe width="100%" height="205" src="' + json.DateVideo.Url + '?rel=0&autoplay=0&controls=0" frameborder="0" allowfullscreen></iframe>');
        }
        else {
            $('#dateImages').html('');
            switch (json.DateImages.length) {
                case 1: { $('#dateImages').addClass('cf1a'); } break;
                case 2: { $('#dateImages').addClass('cf2a'); } break;
                case 3: { $('#dateImages').addClass('cf3a'); } break;
                case 4: { $('#dateImages').addClass('cf4a'); } break;
                default: { $('#dateImages').addClass('cf4a'); } break;

            }
            for (var i = 0; i < json.DateImages.length; i++) {
                $('#dateImages').append('<img src="' + dateImgSrc + json.DateID + '/' + json.DateImages[i].Url + '" />');
            }
        }
    } catch (e) {

    }
    var gps = '';
    for (var i = 0; i < gpsAddress.length; i++) {
        if (json.DateID == gpsAddress[i].dateID) {
            gps = gpsAddress[i].lat + ',' + gpsAddress[i].lng;
        }
    }
    //var dateRatingHTML = createRating(json.DateRating,'white');
    $('#singleDate_dateHeader').text(json.DateHeader);
    $('#singleDate_dateLocation').text(json.DateLocation + ' - ' + json.CityName);
    $('#singleDate_dateWebsite').attr('href', json.DateLink);
    $('#gpsButton').attr('href', 'geo:' + gps);
    $('#singleDate_dateDesc').text(json.DateDescription);
    if (json.ShowDateTip == 'Y') {
        $('#singleDate_dateTip').text(json.DateTip);
    }
    else {
        $('#singleDate_dateTip').parent().parent().hide();
    }
    $('#singleDate_dateTel').attr('href', 'tel:' + json.DatePhone);
    if (json.MoreInfoHeader == '') {
        $('#singleDate_dateStepsHeader').parent().parent().hide();
    }
    else {
        $('#singleDate_dateStepsHeader').text(json.MoreInfoHeader);
        $('#singleDate_dateSteps').html(json.MoreInfoText);
    }
    $('#singleDate .share').attr('data-share', 'date');
    $('#singleDate .share').attr('data-id', json.DateID);

}

//create locations page
function createLocationPage() {
    //locationsList
    var html = '';
    for (var i = 0; i < locations.length; i++) {
        html += '<li class="area"><label>' + locations[i].AreaName + '</label><ul>';
        for (var j = 0; j < locations[i].Cities.length; j++) {
            html += '<li class="city" data-city-code="' + locations[i].Cities[j].CityCode + '">' + locations[i].Cities[j].CityName + '</li>';
        }
        html += '</ul></li>'
    }
    $('.locationsList').html(html);
}

//create date categories
$(document).on('click', '[href="index.html#datesPage"]', function () {
    dateCategoriesHTML = '';
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].CategoryType == "Date" && categories[i].SubList[0].Value != 0) {
            dateCategoriesHTML += '<div data-role="collapsible"> <h4>' + categories[i].Text + '<img src="' + categoriesSrc + categories[i].CategoryImage + '" /> </h4><ul data-role="listview">';
            for (var j = 0; j < categories[i].SubList.length; j++) {
                dateCategoriesHTML += '<li><a data-ajax="false" href="index.html#datesList" data-category-id="' + categories[i].SubList[j].Value + '" class="goToDateList"><img style="float:right !important;" class="subCategory" src="' + subCategoriesSrc + categories[i].SubList[j].CategoryImage + '" /> ' + categories[i].SubList[j].Text + '</a></li>';
            }
            dateCategoriesHTML += '</ul></div>';
        }

    };
    //alert(html);
});

$(document).on('pagebeforecreate', '#datesPage', function () {
    $('#datesPage .wrapper').html(dateCategoriesHTML);

    if (applyGps == '1') {
        $('.selectLocation').removeClass('active');
        $('.findGps').addClass('active');
    }
    else {
        $('.findGps').removeClass('active');
        $('.selectLocation').addClass('active');
    }
});

$(document).on('pagebeforecreate', '#location', function () { $('.findGps').removeClass('active'); $('.selectLocation').addClass('active'); });

//create dates list
$(document).on('click', '.goToDateList', function () {
    var categoryID = parseInt($(this).attr('data-category-id'));
    //alert(categoryID); alert('GPSADDRESS: ' + JSON.stringify(gpsAddress));
    $('#datesList .wrapper .title h2').text($(this).text());
    var dateLi = '';
    var previewImg;
    var favIcon;
    distance = [];
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].DateCategory == categoryID) {
            if (dates[i].ShowVideo == 'Y') {
                previewImg = 'http://img.youtube.com/vi/' + dates[i].DateVideo.Url + '/maxresdefault.jpg';
            }
            else {
                previewImg = dateImgSrc + dates[i].DateID + '/' + dates[i].DateImages[0].Url;
            }
            var dateRatingHTML = createRating(dates[i].DateRating, 'blank')
            var currentLocation = new google.maps.LatLng(lat, lng);
            //alert('cLocation: ' + JSON.stringify(currentLocation));
            calculateDistances(currentLocation, dates[i]);
            dateLi += '<li class="dataItem goToDate" data-date-id="' + dates[i].DateID + '">' +
                            '<div><img src="' + previewImg + '" class="goToDate" data-date-id="' + dates[i].DateID + '" data-from-img="true"/></div>' +
                            '<div>' +
                                '<h3>' + thisDate.DateHeader + '</h3>' +
                                '<article>' + thisDate.DateDescription.substring(0, 70) + '</article>' +
                                '<section class="social">' +
                                    '<ul>' +
                                        '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" data-fav="date" data-date-id="' + thisDate.DateID + '"/></li>' +
                                        '<li><img src="essential/images/General/sharegray.png" class="share" data-share="date" data-id="' + thisDate.DateID + '" alt="שיתוף" /></li>' +
                                        '<li><section class="rating">' + dateRatingHTML +
                                            '</section>' +
                                        '</li>' +
                                        '<li>' +
                                            '<p class="distance">מחשב מרחק<span class="one">.</span><span class="two">.</span><span class="three">.</span></p>' +
                                        '</li>' +
                                    '</ul>' +
                                '</section>' +
                            '</div>' +
                            '<div>' +
                                '<a data-ajax="false" href="index.html#singleDate" class="goToDate" data-date-id="' + thisDate.DateID + '">' +
                                    '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                            '</div>' +
                            '</li>';
        }
    }
    if (dateLi == '') {
        dateLi = 'אין מקומות בילוי בקטגוריה זו';
    } else {
        if (favDates.length > 0) {
            for (var j = 0; j < favDates.length; j++) {
                $('.addToFav').each(function () {
                    if (parseInt($(this).attr('data-date-id')) == favDates[j].DateID) {
                        $(this).attr('src', 'essential/images/General/favHover.png');
                    }
                });
            }
        }
    }

    $('.dataList').html(dateLi);

    if ($(this).attr('data-from-present') == 'true') {
        $('[href="index.html#datesPage"]').click();
        $.mobile.changePage('index.html#datesPage');
    }
});

//set distance to places
$(document).on('pageshow', '#datesList, #favorites', function () {
    var num = 4;
    var calcGPS = function () {
        if (num <= 0) {
            for (var i = 0; i < $('#datesList .distance').length; i++) {
                $('#datesList .distance')[i].innerHTML = distance[i]
            }
            for (var i = 0; i < $('#favorites .distance').length; i++) {
                $('#favorites .distance')[i].innerHTML = distance[i]
            }
        }
        else {
            num--;
            setTimeout(calcGPS, 1000);
        }
    };
    calcGPS();
});

//show date page
$(document).on('click', '.goToDate', function () {
    var dateID = parseInt($(this).attr('data-date-id'));
    currentDateId = parseInt($(this).attr('data-date-id'));
    for (var i = 0; i < dates.length; i++) {
        if (dateID == dates[i].DateID) {
            createDatePage(dates[i]);
        }
    }
    //console.log($(this));
    if ($(this).attr('data-from-img') == 'true') {
        $.mobile.changePage('index.html#singleDate');
    }
});

//apply location view
$(document).on('click', '.findGps', function () {
    applyGps = '1';
    $('.selectLocation').removeClass('active');
    $('.findGps').addClass('active');
    $('[href="index.html#datesPage"]').click();
    $.mobile.changePage('index.html#datesPage');
});

$(document).on('click', '.selectLocation', function () {
    applyGps = '0';
    $('.findGps').removeClass('active');
    $('.selectLocation').addClass('active');
    $.mobile.changePage('index.html#location');
});

//show dates in city
$(document).on('click', '.city', function () {
    applyGps = '0';
    $('.findGps').removeClass('active');
    $('.selectLocation').addClass('active');
    //getCurrentlatlong();
    var cityName = $(this).text();
    $('#datesList .wrapper .title h2').text($(this).text());
    var dateLi = '';
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].CityName == cityName) {
            if (dates[i].ShowVideo == 'Y') {
                previewImg = 'http://img.youtube.com/vi/' + dates[i].DateVideo.Url + '/maxresdefault.jpg';
            }
            else {
                previewImg = dateImgSrc + dates[i].DateID + '/' + dates[i].DateImages[0].Url;
            }
            var dateRatingHTML = createRating(dates[i].DateRating, 'blank')
            var currentLocation = new google.maps.LatLng(lat, lng);
            //alert('cLocation: ' + JSON.stringify(currentLocation));
            calculateDistances(currentLocation, dates[i]);
            dateLi += '<li class="dataItem goToDate" data-date-id="' + thisDate.DateID + '">' +
                            '<div><img src="' + previewImg + '" class="goToDate" data-date-id="' + thisDate.DateID + '" data-from-img="true"/></div>' +
                            '<div>' +
                                '<h3>' + thisDate.DateHeader + '</h3>' +
                                '<article>' + thisDate.DateDescription.substring(0, 70) + '</article>' +
                                '<section class="social">' +
                                    '<ul>' +
                                        '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" data-fav="date" data-date-id="' + thisDate.DateID + '"/></li>' +
                                        '<li><img src="essential/images/General/sharegray.png" class="share" data-share="date" data-id="' + thisDate.DateID + '" alt="שיתוף" /></li>' +
                                        '<li><section class="rating">' + dateRatingHTML +
                                            '</section>' +
                                        '</li>' +
                                        '<li>' +
                                            '<p class="distance">מחשב מרחק<span class="one">.</span><span class="two">.</span><span class="three">.</span></p>' +
                                        '</li>' +
                                    '</ul>' +
                                '</section>' +
                            '</div>' +
                            '<div>' +
                                '<a data-ajax="false" href="index.html#singleDate" class="goToDate" data-date-id="' + thisDate.DateID + '">' +
                                    '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                            '</div>' +
                            '</li>';
        }
    }
    if (dateLi == '') {
        dateLi = 'אין מקומות בילוי בעיר זו';
    } else {
        if (favDates.length > 0) {
            for (var j = 0; j < favDates.length; j++) {
                $('.addToFav').each(function () {
                    if (parseInt($(this).attr('data-date-id')) == favDates[j].DateID) {
                        $(this).attr('src', 'essential/images/General/favHover.png');
                    }
                });
            }
        }
    }

    $('.dataList').html(dateLi);
    $.mobile.changePage('index.html#datesList');
});

//show all dates all dates 
$(document).on('click', '.allDates', function () {
    $('.selectLocation').addClass('active');
    $('.findGps').removeClass('active');
    $('#datesList .wrapper .title h2').text('כל הארץ');
    var dateLi = '';
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].ShowVideo == 'Y') {
            previewImg = 'http://img.youtube.com/vi/' + dates[i].DateVideo.Url + '/maxresdefault.jpg';
        }
        else {
            previewImg = dateImgSrc + dates[i].DateID + '/' + dates[i].DateImages[0].Url;
        }
        var dateRatingHTML = createRating(dates[i].DateRating, 'blank')
        var currentLocation = new google.maps.LatLng(lat, lng);
        //alert('cLocation: ' + JSON.stringify(currentLocation));
        calculateDistances(currentLocation, dates[i]);
        dateLi += '<li class="dataItem goToDate" data-date-id="' + thisDate.DateID + '">' +
                        '<div><img src="' + previewImg + '" class="goToDate" data-date-id="' + thisDate.DateID + '" data-from-img="true"/></div>' +
                        '<div>' +
                            '<h3>' + thisDate.DateHeader + '</h3>' +
                            '<article>' + thisDate.DateDescription.substring(0, 70) + '</article>' +
                            '<section class="social">' +
                                '<ul>' +
                                    '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" /></li>' +
                                    '<li><img src="essential/images/General/sharegray.png" class="share" data-share="date" data-id="' + thisDate.DateID + '" alt="שיתוף" /></li>' +
                                    '<li><section class="rating">' + dateRatingHTML +
                                        '</section>' +
                                    '</li>' +
                                    '<li>' +
                                        '<p class="distance">מחשב מרחק<span class="one">.</span><span class="two">.</span><span class="three">.</span></p>' +
                                    '</li>' +
                                '</ul>' +
                            '</section>' +
                        '</div>' +
                        '<div>' +
                            '<a data-ajax="false" href="index.html#singleDate" class="goToDate" data-date-id="' + thisDate.DateID + '">' +
                                '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                        '</div>' +
                        '</li>';
    }
    if (dateLi == '') {
        dateLi = 'אין מקומות בילוי בעיר זו';
    }

    $('.dataList').html(dateLi);
    $.mobile.changePage('index.html#datesList');
});

//send date offer
$(document).on('click', '#dateSend', function () {
    dateHeader = 'כותרת הדייט: ' + $('#dateHeader').val();
    dateWebsite = 'כתובת אתר אינטרנט: ' + $('#dateSite').val();
    dateLocation = 'מיקום הדייט: ' + $('#dateAddress').val();
    dateTel = 'טלפון: ' + $('#dateTel').val();
    dateDesc = 'תיאור הדייט: ' + $('#dateDesc').val();
    dateTip = 'טיפ: ' + $('#dateTip').val();
    dateSteps = 'שלבי הדייט או שעות פעילות: ' + $('#dateStep').val();
    dateImg = $('#addDateImage').attr('src');
    email = {
        'userEmail': userEmail,
        'subject': 'הוספת דייט',
        'body': '<div style="direction:rtl; text-align:right;">' + dateHeader + '<br>' + dateWebsite + '<br>' + dateLocation + '<br>' + dateTel + '<br>' + dateDesc + '<br>' + dateTip + '<br>' + dateSteps + '<br><img src="' + dateImg + '"/></div>'
    };
    try {
        $.ajax({
            type: 'POST',
            url: 'https://mandrillapp.com/api/1.0/messages/send.json',
            data: {
                key: 'D-GkCQO5NO741XnIUPbXXQ',
                message: {
                    from_email: 'harel6666@gmail.com',
                    to: [{
                        email: 'harel6666@gmail.com',
                        type: 'to'
                    }
                    ],
                    autotext: 'true',
                    subject: 'הוספת דייט',
                    html: '<div style="direction:rtl; text-align:right;">' + dateHeader + '<br>' + dateWebsite + '<br>' + dateLocation + '<br>' + dateTel + '<br>' + dateDesc + '<br>' + dateTip + '<br>' + dateSteps + '</div>'
                }
            }
        }).done(function (response) {
            alert('הדייט ששלחת התקבל')
        });

    } catch (e) {

    }
});

//open rating popup
$(document).on('click', '#singleDate .rating', function () {
    var ratingHTML = '<h2 style="margin-bottom: 2%;">דרג/י את הדייט</h2><section class="rating clickable">' +
                                    '<span data-value="5">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                    '<span data-value="4">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                    '<span data-value="3">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                    '<span data-value="2">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                    '<span data-value="1">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                '</section>' + '<button class="ui-btn ui-shadow rating-button" data-theme="a" data-action="rating" data-rating="date">אישור</button>';
    $('#popupContent').html(ratingHTML);
    openPopup();
});

//click on date link
$(document).on('click', '#singleDate_dateWebsite', function () {
    event.preventDefault();
    var json = { 'dateID': currentDateId };
    $.ajax({
        type: "POST",
        url: api + "updateDateLinkCount",
        data: "{jsonDate: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
            $('.form-holder').html(JSON.stringify(errorThrown))
        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                alert(result.d);
            }
            else {
                //navigator.app.loadUrl($(this).attr('href'), { openExternal: true });
            }
        }
    });
    navigator.app.loadUrl($(this).attr('href'), { openExternal: true });
});

//#endregion

//#region Presents

//create present page
function createPresentPage(json) {
    currentPresentId = json.PresentID;
    if (json.ShowVideo == 'Y') {
        $('#presentImages').html('<iframe width="100%" height="205" src="' + json.PresentVideo.Url + '?rel=0&autoplay=0&controls=0" frameborder="0" allowfullscreen></iframe>');
    }
    else {
        $('#presentImages').html('');
        switch (json.PresentImages.length) {
            case 1: { $('#presentImages').addClass('cf1a'); } break;
            case 2: { $('#presentImages').addClass('cf2a'); } break;
            case 3: { $('#presentImages').addClass('cf3a'); } break;
            case 4: { $('#presentImages').addClass('cf4a'); } break;
            default: { } break;

        }
        for (var i = 0; i < json.PresentImages.length; i++) {
            try {
                $('#presentImages').append('<img src="' + presentImgSrc + json.PresentID + '/' + json.PresentImages[i].Url + '" />');
            } catch (e) {
                $('#presentImages').append('<img src="' + presentImgSrc + json.PresentID + '/#" />');
            }

        }
    }
    var presentRatingHTML = createRating(json.PresentRating, 'white');
    $('#singlePresent_presentHeader').text(json.PresentHeader);
    $('#singlePresent_presentDesc').text(json.PresentDescription);
    if (json.PresentTip != '') {
        $('#singlePeresent_presentTip').text(json.PresentTip);
    }
    else {
        $('#singlePeresent_presentTip').parent().parent().hide();
    }
    $('#singlePresent .share').attr('data-share', 'present');
    $('#singlePresent .share').attr('data-id', json.PresentID);
    var sellerLi = '';
    for (var i = 0; i < json.PresentSeller.length; i++) {
        sellerLi += '<div><img data-seller="' + json.PresentSeller[i].Url.split(',')[1] + '" src="' + presentImgSrc + json.PresentID + '/seller/' + json.PresentSeller[i].Url.split(',')[0] + '" /></div>';
    }
    $('#presentsSeller').html(sellerLi);
    $('#singlePresent .rating').html(presentRatingHTML);
}

function createPresentsCategoriesPage(gender) {
    if (presents.length > 0) {
        presentCategoriesHTML = '<ul class="dataList">';
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].CategoryType == "Present" && categories[i].CategoryGender == gender) {
                presentCategoriesHTML += '<li class="dataItem presentCategory"><div><img src="' + presentCategoriesSrc + categories[i].CategoryImage + '" /></div>' +
                  '<div><h3>' + categories[i].Text + '</h3><article>' + categories[i].CategoryDescription.substring(0, 70) + '</article></div>' +
                  '<div><a data-ajax="false" href="index.html#presentsList" class="goToPresentsList" data-category-id="' + categories[i].Value + '"><img src="essential/images/Favroites/arrow_gray.png" /></a></div>';
            }
        }
        presentCategoriesHTML += '</ul>';
    }
    else {
        presentCategoriesHTML = 'לא קיימות מתנות';
    }
}

//create present list
$(document).on('click', '[href="index.html#presentsCategories"]', function () {
    createPresentsCategoriesPage('Women');
});

$(document).on('pagebeforecreate', '#presentsCategories', function () {
    $('[href="index.html#presentsCategories"]').click();
    $('#presentsCategories .wrapper').html(presentCategoriesHTML);
});

//go to presents list
$(document).on('click', '.goToPresentsList', function () {
    var categoryID = parseInt($(this).attr('data-category-id'));
    $('#presentsList .wrapper .title h2').text($(this).text());
    var presentLi = '';
    var previewImg;
    var favIcon;
    for (var i = 0; i < presents.length; i++) {
        if (presents[i].PresentID == favPresents[j].PresentID) {
            favIcon = 'essential/images/General/favHover.png';
        }
        else {
            favIcon = 'essential/images/General/fav.png';
        }
        if (presents[i].ShowVideo == 'Y') {
            previewImg = 'http://img.youtube.com/vi/' + presents[i].PresentVideo.Url + '/maxresdefault.jpg';
        }
        else {
            if (presents[i].PresentImages.length > 0) {
                previewImg = presentImgSrc + presents[i].PresentID + '/' + presents[i].PresentImages[0].Url;
            }

            else {
                previewImg = '#';
            }
        }
        var presentRatingHTML = createRating(presents[i].PresentRating, 'blank')
        if (presents[i].PresentCategory == categoryID) {
            presentLi += '<li class="goToPresent dataItem" data-present-id="' + presents[i].PresentID + '">' +
                            '<div><img src="' + previewImg + '" class="goToPresent" data-present-id="' + presents[i].PresentID + '"/></div>' +
                            '<div>' +
                                '<h3>' + presents[i].PresentHeader + '</h3>' +
                                '<article>' + presents[i].PresentDescription.substring(0, 70) + '</article>' +
                                '<section class="social">' +
                                    '<ul>' +
                                        '<li><img src="' + favIcon + '" class="addToFav" alt="הוספה למועדפים" data-fav="present" data-present-id="' + presents[i].PresentID + '"/></li>' +
                                        '<li><img src="essential/images/General/sharegray.png" class="share" data-share="present" data-id="' + presents[i].PresentID + '" alt="שיתוף" /></li>' +
                                        '<li><section class="rating">' + presentRatingHTML +
                                            '</section>' +
                                        '</li>' +
                                    '</ul>' +
                                '</section>' +
                            '</div>' +
                            '<div>' +
                                '<a data-ajax="false" href="index.html#singlePresent" class="goToPresent" data-present-id="' + presents[i].PresentID + '">' +
                                    '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                            '</div>' +
                            '</li></a>';
        }
    }
    if (presentLi == '') {
        presentLi = 'אין מתנות בקטגוריה זו';
    } else {
        if (favPresents.length > 0) {
            for (var j = 0; j < favPresents.length; j++) {
                $('.addToFav').each(function () {
                    if (parseInt($(this).attr('data-present-id')) == favPresents[j].DateID) {
                        $(this).attr('src', 'essential/images/General/favHover.png');
                    }
                });
            }
        }
    }

    $('#presentsList .dataList').html(presentLi);
});

//filter categories by gender
$(document).on('click', '.women, .men', function () {
    if ($(this).hasClass('women')) {
        createPresentsCategoriesPage('Women');
        $('.women').addClass('active');
        $('.men').removeClass('active');
    }
    else {
        createPresentsCategoriesPage('Men');
        $('.men').addClass('active');
        $('.women').removeClass('active');
    }

    $('#presentsCategories .wrapper').html(presentCategoriesHTML);
    $.mobile.changePage('#presentsCategories');
});

//show present page
$(document).on('click', '.goToPresent', function () {
    var presentID = parseInt($(this).attr('data-present-id'));
    for (var i = 0; i < presents.length; i++) {
        if (presentID == presents[i].PresentID) {
            thisPresent = presents[i];
            createPresentPage(thisPresent);
        }
    }
});

//send present offer
$(document).on('click', '#presentSend', function () {
    presentHeader = 'כותרת המתנה: ' + $('#presentHeader').val();
    presentDesc = 'תיאור המתנה: ' + $('#presentDesc').val();
    presentTip = 'טיפ: ' + $('#presentTip').val();
    presentImg = $('#addPresentImage').attr('src');
    presentSellerImg = '';
    $('.uploadPresentSupplier').each(function () {
        presentSellerImg += 'מקומות לרכישה: <br>';
        if ($(this).attr('src') != 'essential/images/Add/upload.png') {
            presentSellerImg += '<img src="' + $(this).attr('src') + '"/><br>';
        }
    });
    email = {
        'userEmail': userEmail,
        'subject': 'הוספת מתנה',
        'body': '<div style="direction:rtl; text-align:right;">' + presentHeader + '<br>' + presentDesc + '<br>' + presentTip + '<br><img src="'+presentImg+'"/><br>'+presentSellerImg+'</div>'
    };
    try {
        $.ajax({
            type: 'POST',
            url: 'https://mandrillapp.com/api/1.0/messages/send.json',
            data: {
                key: 'D-GkCQO5NO741XnIUPbXXQ',
                message: {
                    from_email: 'harel6666@gmail.com',
                    to: [{
                        email: 'harel6666@gmail.com',
                        type: 'to'
                    }
                    ],
                    autotext: 'true',
                    subject: 'הוספת מתנה',
                    html: '<div style="direction:rtl; text-align:right;">' + presentHeader + '<br>' + presentDesc + '<br>' + presentTip + '</div>'
                }
            }
        }).done(function (response) {
            alert('המתנה ששלחת התקבלה')
        });

    } catch (e) {

    }
});

//open rating popup
$(document).on('click', '#singlePresent .rating', function () {
    var ratingHTML = '<h2 style="margin-bottom: 2%;">דרג/י את המתנה</h2><section class="rating clickable">' +
                                    '<span data-value="5">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                    '<span data-value="4">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                    '<span data-value="3">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                    '<span data-value="2">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                    '<span data-value="1">' +
                                        '<img src="essential/images/General/whiteStar.png" />' +
                                    '</span>' +
                                '</section>' + '<button class="ui-btn ui-shadow rating-button" data-theme="a" data-action="rating" data-rating="present">אישור</button>';
    $('#popupContent').html(ratingHTML);
    openPopup();
});

//link to seller website
$(document).on('click', '[data-seller]', function () {
    var json = {
        'presentID': currentPresentId,
        'sellerLink': $(this).attr('data-seller')
    };

    $.ajax({
        type: "POST",
        url: api + "updateSellerLinkCount",
        data: "{jsonPresent: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);

        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                alert(result.d);
            }
            else {
                navigator.app.loadUrl($(this).attr('data-seller'), { openExternal: true });
            }
        }
    });

});

//#endregion

//#region Popup

function openPopup() {
    //$('#popup').popup({
    //    positionTo: 'window',
    //    transition: 'slidedown'
    //}).on('popupafteropen', function () {
    //    $(this).popup('reposition', {positionTo: 'window'});
    //        });

    //setTimeout($('#popup').popup('open'), 100);

    //$('#popup').show();
    $('#popup').show();
    $('#popup #popupContent').show();
}

function closePopup() {
    $('#popup #popupContent').hide();
    $('#popup').hide();
}

//#endregion

//#region Share

$(document).on('click', '.share', function () {
    if (userPermision == 1) {
        var share = '';
        if ($(this).attr('data-share') == 'date') {
            share = getDateForShare(parseInt($(this).attr('data-id')));
        }
        else {
            share = getPresentForShare(parseInt($(this).attr('data-id')));
        }
        //alert('share: ' + share);
        window.plugins.socialsharing.share(share + 'נשלח מאפליקציית SROOGIM');
    }

});

function getDateForShare(dateID) {
    var dateString = '';
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].DateID == dateID) {
            dateString += 'שם הדייט: ' + dates[i].DateHeader + '\n' +
            'מיקום הדייט: ' + dates[i].DateLocation + '\n' +
            'תיאור הדייט: ' + dates[i].DateDescription + '\n';
        }
    }
    return dateString;
}

function getPresentForShare(presentID) {
    var presentString = '';
    for (var i = 0; i < presents.length; i++) {
        if (presents[i].PresentID == presentID) {
            presentString += 'שם המתנה: ' + presents[i].PresentHeader + '\n' +
            'תיאור המתנה: ' + presents[i].PresentDescription + '\n';

        }
    }
    return presentString;
}

//#endregion

//#region News

function setNewsMarquee(json) {
    var newsLi = '';
    for (var i = 0; i < json.length; i++) {
        newsLi += '<a data-ajax="false" href="index.html#newsPage" class="ui-link">' + json[i].Header + '</a>&nbsp;&nbsp;';
    }

    $('#news #newsContainer').html(newsLi);
}

function createNewsPage(json) {
    var newsDiv = '';
    var months = {
        '01': 'ינואר',
        '02': 'פברואר',
        '03': 'מרץ',
        '04': 'אפריל',
        '05': 'מאי',
        '06': 'יוני',
        '07': 'יולי',
        '08': 'אוגוסט',
        '09': 'ספטמבר',
        '10': 'אוטובר',
        '11': 'נובמבר',
        '12': 'דצמבר'
    };
    for (var i = 0; i < json.length; i++) {
        newsDiv += '<div class="newsContent">' +
                        '<div class="newsDate">' +
                            '<p>' + json[i].NewsDate.split('T')[0].split('-')[2] + '</p>' +
                            '<p>' + months[json[i].NewsDate.split('T')[0].split('-')[1]] + '</p>' +
                        '</div>' +
                        '<div class="newsInfo">' +
                            '<header>' +
                                '<h3>' + json[i].Header + '</h3>' +
                            '</header>' +
                       '</div>' +
                       '<article>' +
                            '<p style="width:100%; white-space: pre-line;">' + json[i].Description + '</p>' +
                        '</article>' +
                    '</div>'
    }

    $('#newsPage .wrapper').html(newsDiv);
}

//#endregion

//#region Permission

function showPermission() {
    if (userPermision != 1) {
        event.preventDefault();
        $('#popupContent').html('<h2>לצפייה באפשרות זו, יש לבצע הרשמה</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
        openPopup();
    }
}

$(document).on('click', '#panelLinks a, .ideas [href="index.html#addDate"], .ideas [href="index.html#addPresent"], .addComment, .share, .rating.clickable span', function () {
    showPermission();
});

//#endregion

//#region Register

//register to sroogim
$(document).on('click', '#register-button', function () {
    var json = createUserJson();
    //alert('register: \n' + JSON.stringify(json));
    if (json != '') {
        $.ajax({
            type: "POST",
            url: api + "registerUser",
            data: "{userJson: '" + JSON.stringify(json) + "'}",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
            success: function (result) {
                if (result.d.indexOf('שגיאה') != -1) {
                    alert(result.d);
                }
                else {
                    userPermision = 1;
                    var images = new Object();
                    images.name = ['profile', 'cover'];
                    images.data = [userProfilePic, userCoverPic];

                    userImageJson = {
                        'userDeviceID': userDeviceID,
                        'images': images
                    }

                    $.ajax({
                        type: "POST",
                        url: api + "updateUserImg",
                        data: "{userJson: '" + JSON.stringify(userImageJson) + "'}",
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                        },
                        success: function (result) {
                            if (result.d.indexOf("שגיאה") != -1) {
                                alert(result.d);
                            }
                            else {
                                alert('התמונות נשמרו בהצלחה');
                            }

                        }
                    });
                    var n = 5;
                    var f = function () {
                        if (n <= 0) {
                            $.mobile.loading('hide');
                            $.mobile.changePage('index.html#mainScreen');
                        }
                        else {
                            n--;
                            $.mobile.loading('show', {
                                text: 'נרשמת בהצלחה. כבר עוברים לדף הבא...',
                                textVisible: true,
                                theme: 'a',
                                textonly: false
                            });
                            setTimeout(f, 1000);
                        }
                    }
                    f();
                }
            }
        });
    }
});

function createUserJson() {
    var images = new Object();
    images.name = new Array();
    images.data = new Array();

    images.name.push('profile');
    images.data.push(userProfilePic)

    images.name.push('cover');
    images.data.push(userCoverPic)

    var user = {
        'userFullName': $('#userFullName').val(),
        'userEmail': $('#userEmail').val(),
        'userPassword': $('#userPassword').val(),
        'facebookUser': 0,
        'userDeviceID': userDeviceID,
        'images': images.name
    };

    userEmail = $('#userEmail').val();
    userFullName = $('#userFullName').val();
    userPassword = $('#userPassword').val();

    return user;
}

function registerUserFromFacebook(json) {
    //var json = createUserJsonFromFacebook();
    //alert('ruff:\n' + JSON.stringify(json));
    if (json != '') {
        $.ajax({
            type: "POST",
            url: api + "registerUser",
            data: "{userJson: '" + JSON.stringify(json) + "'}",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
            success: function (result) {
                if (result.d.indexOf('שגיאה') != -1) {
                    alert(result.d);
                }
                else {
                    //userPermision = 1;
                    var n = 3;
                    var f = function () {
                        if (n <= 0) {
                            $.mobile.loading('hide');
                            $.mobile.changePage('index.html#mainScreen');
                            userPermision = 1;
                        }
                        else {
                            n--;
                            $.mobile.loading('show', {
                                text: 'נרשמת בהצלחה. כבר עוברים לדף הבא...',
                                textVisible: true,
                                theme: 'a',
                                textonly: false
                            });
                            setTimeout(f, 1000);
                        }
                    }
                    f();
                }
            }
        });
    }
}

function createUserJsonFromFacebook() {
    var images = new Object();
    images.name = new Array();
    images.data = new Array();

    images.name.push(userCoverPic);
    images.name.push(userProfilePic);

    var user = {
        'userFullName': userFullName,
        'userEmail': userEmail,
        'userPassword': userPassword,
        'facebookUser': 1,
        'userDeviceID': userDeviceID,
        'images': images
    };

    return user;
}

$(document).on('click', '[href="index.html#profilePage"]', function () {
    $('#profileEmail').val(userEmail);
    $('#profileFullName').val(userFullName);
    if (userCoverPic != '') {
        $('#profile_coverImg').attr('src', userCoverPic);
    }
    if (userProfilePic != '') {
        $('#profile_profileImg').css('background-image', 'url(' + userProfilePic + ')')
    }
});

$(document).on('click', '#loginForm form input[type="button"]', function () {
    var json = {
        'userEmail': $('#loginEmail').val(),
        'userPassword': $('#loginPassword').val()
    }
    $.ajax({
        type: "POST",
        url: api + "checkUser",
        data: "{userJson: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                //alert(result.d);
            }
            else {
                if (result.d == '0') {
                    $('#popupContent').html('<h2>שם משתמש וסיסמה לא נמצאו. אנא בצעו הרשמה</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
                    openPopup();
                }
                else if (result.d == '2') {
                    $('#popupContent').html('<h2>שם המשתמש והסיסמה לא תואמים</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
                    openPopup();
                }
                else {
                    $.ajax({
                        type: 'post',
                        url: api + 'getUserDetails',
                        data: "{userJson: '" + JSON.stringify(json) + "'}",
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                        },
                        success: function (result) {
                            var user = JSON.parse(result.d);
                            userFullName = user.UserFullName;
                            $('#userName').text(userFullName);
                        }
                    });

                    $.ajax({
                        type: 'post',
                        url: api + 'getUserImg',
                        data: "{userJson: '" + JSON.stringify(json) + "'}",
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                        },
                        success: function (result) {
                            if (result.d.indexOf('שגיאה') != -1) {
                                //alert(result.d);
                            }
                            else {
                                var userImg = JSON.parse(result.d);
                                userPermision = 1;
                                var n = 3;
                                var f = function () {
                                    if (n <= 0) {
                                        $.mobile.loading('hide');
                                        $.mobile.changePage('index.html#mainScreen');
                                        $('#sidebarProfileImg').css('background-image', 'url("' + userImgSrc + userImg[0].UserProfileImage + '")');
                                        $('#sidebarCoverImg').attr('src', userImgSrc + userImg[0].UserCoverImage);
                                        userEmail = $('#loginEmail').val();
                                        //userFullName = $('#loginEmail').val();
                                        userPassword = $('#loginPassword').val();
                                        //$('#userName').text(userFullName);
                                    }
                                    else {
                                        n--;
                                        $.mobile.loading('show', {
                                            text: 'התחברת בהצלחה. כבר עוברים לדף הבא...',
                                            textVisible: true,
                                            theme: 'a',
                                            textonly: false
                                        });
                                        setTimeout(f, 1000);
                                    }
                                }
                                f();
                            }
                        }
                    });
                }
            }
        }
    });

});

//#endregion

//#region Favorits

$(document).on('click', '.addToFav', function () {
    if (userPermision != 1) {
        $('#popupContent').html('<h2>על מנת להוסיף למועדפים, יש לבצע הרשמה</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
        openPopup();
    }
    else {
        addOrRemoveFavorite($(this));
    }
});

function addOrRemoveFavorite(elem) {
    if (elem.attr('data-fav') == 'date') {
        var json = { 'userEmail': userEmail, 'dateID': parseInt(elem.attr('data-date-id')) };
        $.ajax({
            type: "POST",
            url: api + "setUserFavDate",
            data: "{userJson: '" + JSON.stringify(json) + "'}",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
            success: function (result) {
                if (result.d.indexOf('שגיאה') != -1) {
                    //alert(result.d);
                }
                else {
                    if (result.d == '1') {
                        elem.attr('src', 'essential/images/General/favHover.png');
                        $('#popupContent').html('<h2>נוסף למועדפים בהצלחה</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
                        openPopup();
                    }
                    else {
                        elem.attr('src', 'essential/images/General/fav.png');
                        $('#popupContent').html('<h2>הוסר מהמועדפים בהצלחה</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
                        openPopup();
                    }
                }
            }
        });
    }
    else {
        var json = { 'userEmail': userEmail, 'presentID': parseInt(elem.attr('data-present-id')) };
        $.ajax({
            type: "POST",
            url: api + "setUserFavPresent",
            data: "{userJson: '" + JSON.stringify(json) + "'}",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
            success: function (result) {
                if (result.d.indexOf('שגיאה') != -1) {
                    //alert(result.d);
                }
                else {
                    if (result.d == '1') {
                        elem.attr('src', 'essential/images/General/favHover.png');
                        $('#popupContent').html('<h2>נוסף למועדפים בהצלחה</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
                        openPopup();
                    }
                    else {
                        elem.attr('src', 'essential/images/General/fav.png');
                        $('#popupContent').html('<h2>הוסר מהמועדפים בהצלחה</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
                        openPopup();
                    }
                }
            }
        });
    }
}

//clisk on fav icon
$(document).on('click', '[data-get-fav]', function () {
    if (userPermision == 1) {
        if ($(this).attr('data-get-fav') == 'dates') {
            getUserFavoritsDates();
        }
        else {
            getUserFavoritsPresents();
        }
    }
});

function getUserFavoritsDates() {
    var json = { 'userEmail': userEmail };
    $.ajax({
        type: "POST",
        url: api + "getUserFavoritsDates",
        data: "{userJson: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                //alert(result.d);
            }
            else {
                favDates = JSON.parse(result.d);
                createFavDatePage(favDates);
            }
        }
    });
}

function createFavDatePage(json) {
    var previewImg;
    distance = [];
    var dateLi = '';
    try {
        for (var i = 0; i < dates.length; i++) {
            if (dates[i].DateID == json[i].DateID) {
                if (dates[i].ShowVideo == 'Y') {
                    previewImg = 'http://img.youtube.com/vi/' + dates[i].DateVideo.Url + '/maxresdefault.jpg';
                }
                else {
                    previewImg = dateImgSrc + dates[i].DateID + '/' + dates[i].DateImages[0].Url;
                }
                var dateRatingHTML = createRating(dates[i].DateRating, 'blank')
                var currentLocation = new google.maps.LatLng(lat, lng);
                //alert('cLocation: ' + JSON.stringify(currentLocation));
                calculateDistances(currentLocation, dates[i]);
                dateLi += '<li class="dataItem">' +
                                '<div><img src="' + previewImg + '" /></div>' +
                                '<div>' +
                                    '<h3>' + thisDate.DateHeader + '</h3>' +
                                    '<article>' + thisDate.DateDescription.substring(0, 70) + '</article>' +
                                    '<section class="social">' +
                                        '<ul>' +
                                            '<li><img src="essential/images/General/favHover.png" class="addToFav" alt="הוספה למועדפים" data-fav="date" data-date-id="' + thisDate.DateID + '"/></li>' +
                                            '<li><img src="essential/images/General/sharegray.png" class="share" data-share="date" data-id="' + thisDate.DateID + '" alt="שיתוף" /></li>' +
                                            '<li><section class="rating">' + dateRatingHTML +
                                                '</section>' +
                                            '</li>' +
                                            '<li>' +
                                                '<p class="distance">מחשב מרחק<span class="one">.</span><span class="two">.</span><span class="three">.</span></p>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</section>' +
                                '</div>' +
                                '<div>' +
                                    '<a data-ajax="false" href="index.html#singleDate" class="goToDate" data-date-id="' + thisDate.DateID + '">' +
                                        '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                                '</div>' +
                                '</li>';
            }
        }
    } catch (e) {

    }

    if (dateLi == '') {
        dateLi = 'אין מקומות בילוי מועדפים';
    }

    $('#favList').html(dateLi);
}

function getUserFavoritsPresents() {
    var json = { 'userEmail': userEmail };
    $.ajax({
        type: "POST",
        url: api + "getUserFavoritsPresents",
        data: "{userJson: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                //alert(result.d);
            }
            else {
                favPresents = JSON.parse(result.d);
                createFavPresentPage(favPresents);
            }
        }
    });
}

function createFavPresentPage(json) {
    var presentLi = '';
    try {
        for (var i = 0; i < presents.length; i++) {
            if (presents[i].PresentID == json[i].PresentID) {
                presentLi = '<li class="dataItem">' +
                                '<div><img src="essential/images/Favroites/imgFav.png" /></div>' +
                                '<div>' +
                                    '<h3>' + presents[i].PresentHeader + '</h3>' +
                                    '<article>' + presents[i].PresentDescription.substring(0, 70) + '</article>' +
                                    '<section class="social">' +
                                        '<ul>' +
                                            '<li><img src="essential/images/General/favHover.png" class="addToFav" alt="הוספה למועדפים" /></li>' +
                                            '<li><img src="essential/images/General/sharegray.png" class="share" data-share="present" data-id="' + presents[i].PresentID + '" alt="שיתוף" /></li>' +
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
                                    '<a data-ajax="false" href="index.html#singlePresent" class="goToPresent" data-present-id="' + presents[i].PresentID + '">' +
                                        '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                                '</div>' +
                                '</li>';
            }
        }
    } catch (e) {

    }

    if (presentLi == '') {
        presentLi = 'אין מתנות מועדפות';
    }

    $('#favList').html(presentLi);
}

//#endregion

//#region Rating

//click on rating star
$(document).on('click', '.rating.clickable span', function () {
    ratingValue = $(this).attr('data-value');
    $('.rating.clickable span img').attr('src', 'essential/images/General/whiteStar.png')
    if ($(this).children().attr('src').indexOf('white') != -1) { //white star -> golden
        changeRatingImg(['white', 'golden'], $(this));
    }
    else {//golden star -> white
        changeRatingImg(['golden', 'white'], $(this));
    }
});

function changeRatingImg(color, elem) {
    var num = parseInt(elem.attr('data-value'));
    for (var i = 0; i < elem.parent().children().length; i++) {
        if (parseInt(elem.parent().children()[i].attributes[0].value) <= num) {
            var c = elem.parent().children()[i].children[0];
            src = c.src;
            c.src = src.replace(color[0], color[1]);
        }
    }
}

//click on rating button
$(document).on('click', '[data-action="rating"]', function () {
    if ($(this).attr('data-rating') == 'date') {
        updateDateRating(ratingValue);
    }
    else {
        updatePresentRating(ratingValue);
    }
});

//update date rating
function updateDateRating(value) {
    var json = {
        'userEmail': userEmail,
        'dateId': thisDate.DateID,
        'rating': ratingValue
    };

    $.ajax({
        type: "POST",
        url: api + "updateDateRating",
        data: "{ratingJson: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                closePopup();
            }
            else {
                $('#popupContent').html('<h2>תודה על הצבעתך</h2>');
                closePopup();
            }
        }
    });
}

//update present rating
function updatePresentRating(value) {
    var json = {
        'userEmail': userEmail,
        'presentId': thisPresent.PresentID,
        'rating': ratingValue
    };

    $.ajax({
        type: "POST",
        url: api + "updatePresentRating",
        data: "{ratingJson: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            if (result.d.indexOf('שגיאה') != -1) {
                closePopup();
            }
            else {
                $('#popupContent').html('<h2>תודה על הצבעתך</h2>');
                closePopup();
            }
        }
    });
}

function createRating(value, color) {
    var html = '';
    switch (value) {
        case 0: {
            html = '<span data-value="5">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="4">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="3">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="2">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="1">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>';
        } break;
        case 1: {
            html = '<span data-value="5">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="4">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="3">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="2">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="1">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>';
        } break;
        case 2: {
            html = '<span data-value="5">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="4">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="3">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="2">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>' +
                    '<span data-value="1">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>';
        } break;
        case 3: {
            html = '<span data-value="5">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="4">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="3">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>' +
                    '<span data-value="2">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>' +
                    '<span data-value="1">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>';
        } break;
        case 4: {
            html = '<span data-value="5">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="4">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>' +
                    '<span data-value="3">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>' +
                    '<span data-value="2">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>' +
                    '<span data-value="1">' +
                        '<img src="essential/images/General/goldenStar.png" />' +
                    '</span>';
        } break;
        case 5: {
            html = '<span data-value="5">' +
                     '<img src="essential/images/General/goldenStar.png" />' +
                 '</span>' +
                 '<span data-value="4">' +
                     '<img src="essential/images/General/goldenStar.png" />' +
                 '</span>' +
                 '<span data-value="3">' +
                     '<img src="essential/images/General/goldenStar.png" />' +
                 '</span>' +
                 '<span data-value="2">' +
                     '<img src="essential/images/General/goldenStar.png" />' +
                 '</span>' +
                 '<span data-value="1">' +
                     '<img src="essential/images/General/goldenStar.png" />' +
                 '</span>';
        } break;
        default: {
            html = '<span data-value="5">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="4">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="3">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="2">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>' +
                    '<span data-value="1">' +
                        '<img src="essential/images/General/' + color + 'Star.png" />' +
                    '</span>';
        } break;

    }

    return html;
}

//#endregion

//#region Add

function clearField(elem, defaultValue) {
    if (elem.val() == defaultValue) {
        elem.val('');
    }

}

function checkField(elem, defaultValue) {
    if (elem.val() == '') {
        elem.val(defaultValue);
    }
}

//#endregion

//#region Profile

$(document).on('click', '#update-cover-pic', function () {
    $.when(function () {
        navigator.camera.getPicture(showCoverProfile, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    }).then(function () {
        var images = new Object();
        images.name = ['profile', 'cover'];
        images.data = [userProfilePic, userCoverPic];

        userImageJson = {
            'userDeviceID': userDeviceID,
            'images': images
        }

        $.ajax({
            type: "POST",
            url: api + "updateUserImg",
            data: "{userJson: '" + JSON.stringify(userImageJson) + "'}",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
            success: function (result) {
                if (result.d.indexOf("שגיאה") != -1) {
                    alert(result.d);
                }
                else {
                    alert('התמונות נשמרו בהצלחה');
                }
            }
        });
    });
});

$(document).on('click', '#update-profile-pic', function () {
    $.when(function () {
        navigator.camera.getPicture(showProfileImg, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    }).then(function () {
        var images = new Object();
        images.name = ['profile', 'cover'];
        images.data = [userProfilePic, userCoverPic];

        userImageJson = {
            'userDeviceID': userDeviceID,
            'images': images
        }

        $.ajax({
            type: "POST",
            url: api + "updateUserImg",
            data: "{userJson: '" + JSON.stringify(userImageJson) + "'}",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
            success: function (result) {
                if (result.d.indexOf("שגיאה") != -1) {
                    alert(result.d);
                }
                else {
                    alert('התמונות נשמרו בהצלחה');
                }
            }
        });
    });
});

function showCoverProfile(imageURI) {
    $('#profile_coverImg').attr('src', imageURI);
    userCoverPic = imageURI;
}

function showProfileImg(imageURI) {
    $('#profile_profileImg').css('background-image', 'url(' + imageURI + ')');
    userProfilePic = imageURI;
}
//#endregion

//#region Navigation

//$(window).on("navigate", function (event, data) {
//    //console.log(data.state.hash);
//    backPage = '#' + $.mobile.activePage.attr('id');
//    //console.log($.mobile.activePage.attr('id'));
//});
function goBackPage(e) {
    //console.log($.mobile.activePage.find('.goBack').attr('data-prev-link'));
    e.preventDefault();
    //console.log(e);
    //console.log(data);
    $.mobile.changePage('index.html#' + $.mobile.activePage.find('.goBack').attr('data-prev-link'));
}

//#endregion
