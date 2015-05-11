
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
var userEmail = 'harel6666@gmail.com', userFullName, userPassword = 0, userProfilePic, userCoverPic = 'private', userBirthDay, userGender, userDeviceID;
var userPermision = '', ratingValue = 0, applyGps = '1', dateLink = '', presentLink = '', dateRating, presentRating;
var facebookResponse;

document.addEventListener("deviceready", initApp, false);

$(document).on('pagebeforecreate', '#loadingScreen', function () {
    $('#menuSidebar').panel().enhanceWithin();
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

//fav dates
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
                //createFavDatePage(favDates);
            }
        }
    });
}

//fav presents
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
                //createFavPresentPage(favPresents);
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
                    try {
                        d = results[j].distance.text.replace('km', 'ק"מ') + ' ממקומך';
                    } catch (e) {
                        d = 'לא ניתן לחשב מרחק';
                    }
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
    currentDateId = json.DateID;
    var dateRatingHTML = createRating(parseInt(dateRating), 'white');

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

    if (json.DateHeader == '' || json.DateHeader == null) {
        $('#singleDate_dateHeader').hide();
    }
    else {
        if (json.DateHeader.indexOf('&apos') != -1) {
            $('#singleDate_dateHeader').text(json.DateHeader.replace('&apos', '\''));
        }
        else {
            $('#singleDate_dateHeader').text(json.DateHeader);
        }
    }

    if (json.DateLocation == '' || json.DateLocation == null) {
        $('#singleDate_dateLocation').hide();
    }
    else {
        $('#singleDate_dateLocation').text(json.DateLocation + ' - ' + json.CityName);
    }

    if (json.DateLink == '' || json.DateLink == null) {
        $('#singleDate_dateWebsite').hide();
    }
    else {
        $('#singleDate_dateWebsite').attr('href', json.DateLink);
    }

    if (json.DateDescription == '' || json.DateDescription == null) {
        $('#singleDate_dateDesc').hide();
    }
    else {
        if (json.DateDescription.indexOf('&apos') != -1) {
            $('#singleDate_dateDesc').text(json.DateDescription.replace('&apos', '\''));
        }
        else {
            $('#singleDate_dateDesc').text(json.DateDescription);
        }
    }

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
    }

    if (json.MoreInfoText == '' || json.MoreInfoText == undefined) {
        $('#singleDate_dateSteps').hide();
    }
    else {
        if (json.MoreInfoText.indexOf('&apos') != -1) {
            $('#singleDate_dateSteps').html(json.MoreInfoText.replace('&apos', '\''));
        }
        else {
            $('#singleDate_dateSteps').html(json.MoreInfoText);
        }
    }


    $('#gpsButton').attr('href', 'geo:' + gps);
    $('#singleDate .share').attr('data-share', 'date');
    $('#singleDate .share').attr('data-id', json.DateID);

    $('#singleDateAddToFav').attr('data-date-id', json.DateID);

    $('#singleDate .rating').html(dateRatingHTML);

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
$(document).on('click', '[href="index.html#datesPage"], .goToDatePage', function () {
    dateCategoriesHTML = '';
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].CategoryType == "Date" && categories[i].SubList[0].Value != 0) {
            dateCategoriesHTML += '<div data-role="collapsible"> <h4>' + categories[i].Text + '<img src="' + categoriesSrc + categories[i].CategoryImage + '" /> </h4><ul data-role="listview">';
            for (var j = 0; j < categories[i].SubList.length; j++) {
                dateCategoriesHTML += '<li><a data-ajax="false" href="index.html#datesList" data-category-id="' + categories[i].SubList[j].Value + '" class="goToDateList"><img style="float:right !important;" class="subCategory" src="' + subCategoriesSrc + categories[i].SubList[j].CategoryImage + '" /> ' + categories[i].SubList[j].Text + '</a></li>';
            }
            dateCategoriesHTML += '</ul></div>';
        }

        if ($(this).attr('data-from-present') == 'true') {
            $.mobile.changePage('index.html#datesPage');
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
    $('#datesPage [data-role="collapsible"]').collapsible('collapse');
    $('#datesList .goBack').attr('data-prev-link', 'datesPage');
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
                previewImg = dateImgSrc + dates[i].DateID + '/thumb/' + dates[i].DateImages[0].Url;
            }
            var dateRatingHTML = createRating(dates[i].DateRating, 'blank')
            var currentLocation = new google.maps.LatLng(lat, lng);
            //alert('cLocation: ' + JSON.stringify(currentLocation));
            calculateDistances(currentLocation, dates[i]);
            dateLi += '<li class="dataItem goToDate" data-date-id="' + dates[i].DateID + '" data-from-img="true">' +
                            '<div><img src="' + previewImg + '" class="goToDate" data-date-id="' + dates[i].DateID + '" data-from-img="true"/></div>' +
                            '<div>' +
                                '<h3 data-from-img="true" data-date-id="' + dates[i].DateID + '">' + thisDate.DateHeader.replace('&apos', '\'') + '</h3>' +
                                '<article data-from-img="true" data-date-id="' + dates[i].DateID + '">' + thisDate.DateDescription.substring(0, 70).replace('&apos', '\'') + '</article>' +
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
$(document).on('click', '.goToDate, .goToDate div:nth-child(2) h3, .goToDate div:nth-child(2) article', function () {
    elem = $(this);
    var dateID = parseInt($(this).attr('data-date-id'));
    currentDateId = parseInt($(this).attr('data-date-id'));
    var json = {
        email: userEmail,
        id: currentDateId
    }

    $.ajax({
        type: 'POST',
        url: api + 'getLastRating',
        data: "{json: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            dateRating = result.d;
            for (var i = 0; i < dates.length; i++) {
                if (dateID == dates[i].DateID) {
                    createDatePage(dates[i]);
                }
            }
            //console.log($(this));
            if (elem.attr('data-from-img') == 'true') {
                $.mobile.changePage('index.html#singleDate');
            }
        }
    });
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
    $('#datesList .goBack').attr('data-prev-link', 'location');
    var cityName = $(this).text();
    $('#datesList .wrapper .title h2').text($(this).text());
    var dateLi = '';
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].CityName == cityName) {
            if (dates[i].ShowVideo == 'Y') {
                previewImg = 'http://img.youtube.com/vi/' + dates[i].DateVideo.Url + '/maxresdefault.jpg';
            }
            else {
                previewImg = dateImgSrc + dates[i].DateID + '/thumb/' + dates[i].DateImages[0].Url;
            }
            var dateRatingHTML = createRating(dates[i].DateRating, 'blank')
            var currentLocation = new google.maps.LatLng(lat, lng);
            calculateDistances(currentLocation, dates[i]);
            dateLi += '<li class="dataItem goToDate" data-date-id="' + thisDate.DateID + '" data-from-img="true">' +
                            '<div><img src="' + previewImg + '" class="goToDate" data-date-id="' + thisDate.DateID + '" data-from-img="true"/></div>' +
                            '<div>' +
                                '<h3 data-from-img="true" data-date-id="' + dates[i].DateID + '">' + thisDate.DateHeader.replace('&apos', '\'') + '</h3>' +
                                '<article data-from-img="true" data-date-id="' + dates[i].DateID + '">' + thisDate.DateDescription.substring(0, 70).replace('&apos', '\'') + '</article>' +
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
            previewImg = dateImgSrc + dates[i].DateID + '/thumb/' + dates[i].DateImages[0].Url;
        }
        var dateRatingHTML = createRating(dates[i].DateRating, 'blank')
        var currentLocation = new google.maps.LatLng(lat, lng);
        //alert('cLocation: ' + JSON.stringify(currentLocation));
        calculateDistances(currentLocation, dates[i]);
        dateLi += '<li class="dataItem goToDate" data-date-id="' + thisDate.DateID + '">' +
                        '<div><img src="' + previewImg + '" class="goToDate" data-date-id="' + thisDate.DateID + '" data-from-img="true"/></div>' +
                        '<div>' +
                            '<h3 data-from-img="true" data-date-id="' + dates[i].DateID + '">' + thisDate.DateHeader.replace('&apos', '\'') + '</h3>' +
                            '<article data-from-img="true" data-date-id="' + dates[i].DateID + '">' + thisDate.DateDescription.substring(0, 70).replace('&apos', '\'') + '</article>' +
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
$(document).on('click', '#singleDate_dateWebsite', function (e) {
    e.preventDefault();
    if ($(this).attr('href') != '') {
        dateLink = $(this).attr('href');
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
                    if (dateLink.indexOf('http://') == -1) {
                        navigator.app.loadUrl('http://' + dateLink, { openExternal: true });
                    }
                    else {
                        navigator.app.loadUrl(dateLink, { openExternal: true });
                    }
                }
            }
        });


    }
    else {
        $('#popupContent').html('<h2>אופס... שדה זה לא קיים כרגע</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
        openPopup();
    }

});

$(document).on('click', '#singleDate_dateTel', function (e) {
    if ($(this).attr('href') == '' || $(this).attr('href') == 'tel:') {
        e.preventDefault();
        $('#popupContent').html('<h2>אופס... שדה זה לא קיים כרגע</h2>' + '<button class="ui-btn ui-shadow popup-button" data-theme="a" onclick="closePopup()">אישור</button>');
        openPopup();
    }
});

//#endregion

//#region Presents

//create present page
function createPresentPage(json) {
    currentPresentId = json.PresentID;
    var presentRatingHTML = createRating(parseInt(presentRating), 'white');

    $('#singlePresent .rating').html(presentRatingHTML);

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


    if (json.PresentHeader == '' || json.PresentHeader == null) {
        $('#singlePresent_presentHeader').hide();
    }
    else {
        $('#singlePresent_presentHeader').text(json.PresentHeader);
    }

    if (json.PresentDescription == '' || json.PresentDescription == null) {
        $('#singlePresent_presentDesc').hide();
    }
    else {
        $('#singlePresent_presentDesc').text(json.PresentDescription);
    }

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

    $('#singlePresentAddToFav').attr('data-present-id', json.PresentID);

}

function createPresentsCategoriesPage(gender) {
    if (presents.length > 0) {
        presentCategoriesHTML = '<ul class="dataList">';
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].CategoryType == "Present" && categories[i].CategoryGender == gender) {
                presentCategoriesHTML += '<li class="dataItem presentCategory" data-from-img="true"><div><img src="' + presentCategoriesSrc + categories[i].CategoryImage + '" data-from-img="true" data-category-id="' + categories[i].Value + '"/></div>' +
                  '<div><h3 data-from-img="true" data-category-id="' + categories[i].Value + '">' + categories[i].Text + '</h3><article data-category-id="' + categories[i].Value + '" data-from-img="true">' + categories[i].CategoryDescription.substring(0, 70) + '</article></div>' +
                  '<div><a data-ajax="false" href="index.html#presentsList" class="goToPresentsList" data-category-id="' + categories[i].Value + '"><img src="essential/images/Favroites/arrow_gray.png" /></a></div>';
            }
        }
        presentCategoriesHTML += '</ul>';
    }
    else {
        presentCategoriesHTML = 'לא קיימות מתנות';
    }

    $('#presentsCategories .wrapper').html(presentCategoriesHTML);
    $.mobile.changePage('index.html#presentsCategories');
}

//create present list
$(document).on('click', '.goToPresentCategories', function () {
    createPresentsCategoriesPage('Women');
});

$(document).on('pagebeforecreate', '#presentsCategories', function () {
    //$('[href="index.html#presentsCategories"]').click();

});

//go to presents list
$(document).on('click', '.goToPresentsList, .presentCategory div:nth-child(1) img, .presentCategory div:nth-child(2) h3, .presentCategory div:nth-child(2) article', function () {
    var categoryID = parseInt($(this).attr('data-category-id'));
    $('#presentsList .wrapper .title h2').text($(this).text());
    var presentLi = '';
    var previewImg;
    var favIcon;
    for (var i = 0; i < presents.length; i++) {
        favIcon = 'essential/images/General/fav.png';
        if (favPresents.length > 0) {
            if (presents[i].PresentID == favPresents[j].PresentID) {
                favIcon = 'essential/images/General/favHover.png';
            }
        }

        if (presents[i].ShowVideo == 'Y') {
            previewImg = 'http://img.youtube.com/vi/' + presents[i].PresentVideo.Url + '/maxresdefault.jpg';
        }
        else {
            if (presents[i].PresentImages.length > 0) {
                previewImg = presentImgSrc + presents[i].PresentID + '/thumb/' + presents[i].PresentImages[0].Url;
            }

            else {
                previewImg = '#';
            }
        }
        var presentRatingHTML = createRating(presents[i].PresentRating, 'blank')
        if (presents[i].PresentCategory == categoryID) {
            presentLi += '<li class="goToPresent dataItem" data-present-id="' + presents[i].PresentID + '" data-from-img="true">' +
                            '<div><img src="' + previewImg + '" class="goToPresent" data-present-id="' + presents[i].PresentID + '" data-from-img="true"/></div>' +
                            '<div>' +
                                '<h3 data-present-id="' + presents[i].PresentID + '" data-from-img="true">' + presents[i].PresentHeader + '</h3>' +
                                '<article data-present-id="' + presents[i].PresentID + '" data-from-img="true">' + presents[i].PresentDescription.substring(0, 70) + '</article>' +
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
                            '</li>';
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
    if ($(this).attr('data-from-img') == 'true') {
        $.mobile.changePage('index.html#presentsList');
    }
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
$(document).on('click', '.goToPresent, .goToPresent div:nth-child(2) h3, .goToPresent div:nth-child(2) article', function () {
    var presentID = parseInt($(this).attr('data-present-id'));
    currentPresentId = presentID;
    elem = $(this);
    var json = {
        email: userEmail,
        id: currentPresentId
    }

    $.ajax({
        type: 'POST',
        url: api + 'getLastRating',
        data: "{json: '" + JSON.stringify(json) + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function (result) {
            presentRating = result.d;
            for (var i = 0; i < presents.length; i++) {
                if (presentID == presents[i].PresentID) {
                    thisPresent = presents[i];
                    createPresentPage(thisPresent);

                    if (elem.attr('data-from-img') == 'true') {
                        $.mobile.changePage('index.html#singlePresent');
                    }
                }
            }
        }
    });



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
        'body': '<div style="direction:rtl; text-align:right;">' + presentHeader + '<br>' + presentDesc + '<br>' + presentTip + '<br><img src="' + presentImg + '"/><br>' + presentSellerImg + '</div>'
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

    presentLink = $(this).attr('data-seller');

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
                if (presentLink.indexOf('http://') == -1) {
                    navigator.app.loadUrl('http://' + presentLink, { openExternal: true });
                }
                else {
                    navigator.app.loadUrl(presentLink, { openExternal: true });
                }

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
                    images.name = ['profile.jpg', 'cover.jpg'];
                    if (userProfilePic == undefined) {
                        userProfilePic = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwAEAgMDAwIEAwMDBAQEBAUJBgUFBQULCAgGCQ0LDQ0NCwwMDhAUEQ4PEw8MDBIYEhMVFhcXFw4RGRsZFhoUFhcW/9sAQwEEBAQFBQUKBgYKFg8MDxYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYW/8AAEQgAgACAAwEiAAIRAQMRAf/EABsAAQEAAwEBAQAAAAAAAAAAAAAHAwQGBQII/8QAOBAAAgIBAgIHBAkDBQAAAAAAAAECAwQFEQYhBxITMUFRYXGBkaEUFSIyUrHB4fAjM7JCY4KS0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9FAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMWi7IyIUUVystsfVjGK3bYGMHf8NcC0VQV+rvtbGt+whLaEfa1zb9nL2nWYWBhYcVHGxKKUvwVqIEUBbczDxMqPVycWm5PwsrUvzOW4j4Fw8iDu0qX0a7v7KTbrl+q/L0AnYM2djX4eVPHya5V21vaUX4GEAAAAAAAAAAABTujzh+GmaeszIgvpl63e651RfdFevn8PA4jgbBjn8T41M1vXCXaT9VHnt73sveV0AAAAAA5/jnQa9Y06U6oJZlMW6peMl+B+j8PJ+8lkk4ycZJxaezT70XMlXSXgRwuKbXCO0MmKuSXm91L5pv3geAAAAAAAAAAAOr6IEnxPdulusSW3/eBSSUdHGXHE4ux+u9o39apv1a5fNIq4AAAAAAJ70yJfWmE9ufYy5/8ihEv6VMtZPFUqovdYtUa3t585P8Ay29wHNgAAAAAAAAAD6rnKFkZwk4yi04yXen5lc4R1erWdIryOsu2glG+K/0z/wDH3r9iQno8M6ln6bqUbMBSsnP7MqUnJWryaQFjBp6RkW5eFC+7EtxZy+9Vbt1l+3w9huAADX1LIni4c74Y1uRKK5VVpOUgNbiTU6NI0uzMuabitq4b85y8F/PDckGVdZk5NmRdLrWWzcpy823uz0eLdV1DVNSlLOhKlV7qGO00q17H4+bPKAAAAAAAAAAHRcAcOvWMx5GSmsOiS6/+5L8K/X9wPjhDhbL1qSvsbow0+djXOfpFfr3e0oui6Rp+lUKvCxlB7bSm1vKXtf8AEblVcKq1XXFRhBJRilskl4IyAAAAAAGhrOk6fqtHZZuNCzZfZl3Tj7Jd6J3xhwrlaO3kUt34e/8Ac2+1X6SX6/kVMx21wtrddkVKE01KMlumn4MCHg6PpA4c+qMpZWLFvDulsl39lL8L9PL+b84AAAAAAbGlYd2oajThULey6ait+5ebfolu/cWHSMKjTtOqwseO1dUeqn4t+Lfq3zOM6H9PU78nU5x3Vf8ARqfq+cvlt8Wd8AAAAAAAAAAAGrquHTn4FuHfFOu6PVfmvJr1T5ke1jCt07U78K/79M3Hfb7y8H71sy1nB9MGnJSxtUrjt1v6NrXxi/8AL5AcOAAAAArPR5irF4SxFts7Yu2T8+s918tj2zW0mpU6VjUpbKumEfhFI2QAAAAAAAAAAAHi8e4v0zhPMhtzrr7WL8nH7T+Sa957Rg1CCuwb6nzU6pR+KaAiQAA//9k=';
                    }

                    if (userCoverPic == 'private') {
                        userCoverPic = 'data:image/jpeg;base64,/9j/4QuoRXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAAAeAAAAcgEyAAIAAAAUAAAAkIdpAAQAAAABAAAApAAAANAACvzaAAAnEAAK/NoAACcQQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykAMjAxNTowNToxMSAxMDo1NDozNAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACgKADAAQAAAABAAABLAAAAAAAAAAGAQMAAwAAAAEABgAAARoABQAAAAEAAAEeARsABQAAAAEAAAEmASgAAwAAAAEAAgAAAgEABAAAAAEAAAEuAgIABAAAAAEAAApyAAAAAAAAAEgAAAABAAAASAAAAAH/2P/tAAxBZG9iZV9DTQAB/+4ADkFkb2JlAGSAAAAAAf/bAIQADAgICAkIDAkJDBELCgsRFQ8MDA8VGBMTFRMTGBEMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAENCwsNDg0QDg4QFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgASwCgAwEiAAIRAQMRAf/dAAQACv/EAT8AAAEFAQEBAQEBAAAAAAAAAAMAAQIEBQYHCAkKCwEAAQUBAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAABBAEDAgQCBQcGCAUDDDMBAAIRAwQhEjEFQVFhEyJxgTIGFJGhsUIjJBVSwWIzNHKC0UMHJZJT8OHxY3M1FqKygyZEk1RkRcKjdDYX0lXiZfKzhMPTdePzRieUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9jdHV2d3h5ent8fX5/cRAAICAQIEBAMEBQYHBwYFNQEAAhEDITESBEFRYXEiEwUygZEUobFCI8FS0fAzJGLhcoKSQ1MVY3M08SUGFqKygwcmNcLSRJNUoxdkRVU2dGXi8rOEw9N14/NGlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vYnN0dXZ3eHl6e3x//aAAwDAQACEQMRAD8A4yT4pSfFJJB6FUnxSk+KSSSlSfEpa+KSJRRdkXV49DDbda4MrrbqXOPDWpKXxsbJy72Y2Mx119p211s1c4xu0/shQeyyt7q7GuZYxxa9jgWua5p2vY9rvc17XLu/q79V2C/B+0YOV0nrOJay5mQ9zn4+R6Z9V1ct9Suqy2tlldlHqU+mz9NX9o/SULK+unR8yvqeT1BtTn4jBTTdlFwO61lddN10T6jmep6dF+Rs9L7Z+h/nUmCHMRlk4PD8fD+88x5klWM3p+bgX/Z82l1F+1tnpvjcGvG5hO0u2/1PzFqfVfp97+pYnUnVbsLDyqjc8kDVv6Z3pNPuv+zMH2vIbV/NY7PUXWfWD6u4+M67Kvwf2rn3VVhlt1xoxcdlTGYk3XW2Y9dtjnN9XZ6vrXfpPZj/AM5akzzxhkEN7H/OfOITQfEq3kYN+LaMe01myG6strsZ7tGk30vfU3+X7vYt/D+oeZkZWK05uJZh362ZOPZvDWg+mfTNja68l/rbMf8AQOs9K62v16/5vemSeSERcpUDs8rr4lNr4rbzvqp1PDxLM+30qcUF/otyLq673tbqP1bd/SfT/nMXf6+/9F6fqLFhJMZxkLibW18UpPiU6ZJKpPilJ8UkklKk+KUnxSSSU//Q4xJOkg9CpJJJJSkiAdCJCeEXFxbsvJpxKAHXZFjaqgdBuedjd38nX3JIJrV7X6m2Mx+n4vUcY4WJjYAtZ1nItDmXSLPUxW7qLa/tH2uq6uqn7RXdXVZT+jrts9OhaX7Q6D1DFz+uZdDiy1j8C3Oc62qo0n+fqx8eyy76G6v7P+r1X5ec/f8AZsfZkX1cT1XMpeWdLwHf5LwXEVRp69w9l/Ur9Xepbe7+Y3f0fF/R1bFcxen3ZX1Uysx+ZGP07Kb6WAYgvuFVdtx/P3Obd+g/4vI/0r0GrLAD65SMeOQA78M5fL/ee0wun/Vuq7A6VXjlmZWH53S7HWF52veyb3Obbjufa9tTbn0f9x6rGfyFSzOqY/Wq/wBrVXYuXT0/EvfmYN2MPtDXit7an0er9pczHfe6p1zqbdlXp/0q9n0MOyrIo6R0v6w19Qceob3YdVY2TVTS26mtlWm79HX/AD3qfT+1/wBu0P1fpFfVsW8F1bcMPyHOrMO2UVvufVP7mRs9C3/g7ErVHlxUpmZkY8W/7w4vdHq/eamP0vFxcSnJ6q+ytl7N2Lh0BoyLmRDcp77Zrw8Oyz+busZZdk+/7PV/hFbxfrRd02t9HScHGxKHvFu2w25L942xb6l1rGb/ANFX/N0V/wA2xLrtRd1B2Y4Foz6qcxoe7cWtura70d/t/R47w+mn/gWVod2T0w/V6rBbj7eqMynW2ZW0a1EPger9L6Lq6vQ/4L1UGcxEhEyBnxEafow/wf6qLL+s12af8odO6fmEAM3OpdXY1oJd6dd2Pcx9X0nITun9O6s2x/RWWY2cwGw9Jtf6vqMbJsPTMr2WX20sHqPw72eu+v1PQ9T00XrGfgZfTulY2Ni/Z7sCh1eVbDR6jjs9wc33PbvZZf8ApP8ATLHF1mO9mTQ7ZbQ4W1PGsPYfUreP7TUVCHpuIOM2dL9P1j/WQAgiRweElrfWnGoxvrDm147fTqc9lzWcbfXrry31iPzWPucsqEV0ZcURLuAftWSSSSXLJJ0ySn//0eNSTp4QehWhPCeEkkKhaP1czKcDr3T8y8gU1Xt9VzuGteDS6w/8V6nqLPhOAEkSAkCD1FNxnTLMfqR6Xn2NwX0PNeRdaDtY1o3+rtHus9Wsbsb/ALkepV++tN/1cz32Pu6XUepYJd+gycdzbCWxur+0VN2W0Xta79JXbRX6b1Vp6syyirF6pjDPqoZ6ePcHmnJqZ+ZVXlNFnrUV+706Mqq3Yjel9V3kOY7qNbo1Dq8a3/wVtuPu/wAxBbc7F6dNuOB8fT62w3oGTjnf1N9fS2OEzc5r73Dj9Bg0Osvsf/xnosWr0z9m2dXoGBRfXQ+u2rMrtcw7aXNNDs11o9tfsd6+Sx/6Ku39FRv9RZNQ+rVImtmfkPn6LjRjsP8AXfV9qu/zUa3qj7KTi0VV4WG4gux6ZO8gksOVkWF1+U5u7/CO9L/gkFHikCNdQY38kKP9T5+J0c6+jp/VIuxftTaKKaMN1jmx9mZX6Qy6G7baL7bvdZRa/wDRVfzf84sl3SsS6Tg9Sxdg4rzXnFuH8l/qNfj27f8ASU3IlfU7K6RjW115eI0ktx7wSGEmXOxrq3MvxXO/4Kz0/wDgkJ1vQHybMfOpJP0Kr6bGj+1kUMs/zklASiNLugLHqjLh/qy+X/ARnC6Zhv8AUzc9mU+shzMXppNjnOEuZ6mfaxmLjsbY1nqbPtFv+jQ7BR1jMt6xm47MDpjH/rrsfdttsk2fZsRtjvfn5TNlb21fo6v6Zd6am7M6LRJo6Y/JeCCx+feXtEfvYmGzGrt/65cs/qGfmZ72OyrNzaQW0UsAZVU0x7MfHr21Ut9v9d/+ERRUib1HTiNbf1Iw/wC7a+fmXZ+bkZ2Rpdk2OteBqBuOlbZ/Mrb+jYgQpkKMIsgAAodGMJoUkoSUwSUoTFJL/9LjwE6ScBB6BQCcBOAnASUtCkAnAUgEkKaEZhQgERqSrTtKIHIDSphyFJtIXKDimLlBxSpVsHlBcEVygQii0RCjCKQokJKRkJiEQhRISSwhMVIhMeElP//T5EBSATCP9ZUhH+soPQLgKQCQj/WVIR/rKSFAKQCQj/WVIR/rKSFgFIBOI8vxUhH+spIWCkkI8vxT6eX4oq1WUSp6eX4pjHl+KCtUZCiQi6f6yomPL8UlIyFEhEMf6yomP9ZSSjIUSEQx/rKiY/1lJKMhRI0KmY/1lRdEH/akl//Z/+0TmFBob3Rvc2hvcCAzLjAAOEJJTQQlAAAAAAAQAAAAAAAAAAAAAAAAAAAAADhCSU0EOgAAAAABIwAAABAAAAABAAAAAAALcHJpbnRPdXRwdXQAAAAFAAAAAFBzdFNib29sAQAAAABJbnRlZW51bQAAAABJbnRlAAAAAENscm0AAAAPcHJpbnRTaXh0ZWVuQml0Ym9vbAAAAAALcHJpbnRlck5hbWVURVhUAAAAIABIAFAAIABEAGUAcwBrAGoAZQB0ACAANAA2ADIAMAAgAHMAZQByAGkAZQBzACAAKABDAG8AcAB5ACAAMgApAAAAAAAPcHJpbnRQcm9vZlNldHVwT2JqYwAAAAwAUAByAG8AbwBmACAAUwBlAHQAdQBwAAAAAAAKcHJvb2ZTZXR1cAAAAAEAAAAAQmx0bmVudW0AAAAMYnVpbHRpblByb29mAAAACXByb29mQ01ZSwA4QklNBDsAAAAAAi0AAAAQAAAAAQAAAAAAEnByaW50T3V0cHV0T3B0aW9ucwAAABcAAAAAQ3B0bmJvb2wAAAAAAENsYnJib29sAAAAAABSZ3NNYm9vbAAAAAAAQ3JuQ2Jvb2wAAAAAAENudENib29sAAAAAABMYmxzYm9vbAAAAAAATmd0dmJvb2wAAAAAAEVtbERib29sAAAAAABJbnRyYm9vbAAAAAAAQmNrZ09iamMAAAABAAAAAAAAUkdCQwAAAAMAAAAAUmQgIGRvdWJAb+AAAAAAAAAAAABHcm4gZG91YkBv4AAAAAAAAAAAAEJsICBkb3ViQG/gAAAAAAAAAAAAQnJkVFVudEYjUmx0AAAAAAAAAAAAAAAAQmxkIFVudEYjUmx0AAAAAAAAAAAAAAAAUnNsdFVudEYjUHhsQFIAk4AAAAAAAAAKdmVjdG9yRGF0YWJvb2wBAAAAAFBnUHNlbnVtAAAAAFBnUHMAAAAAUGdQQwAAAABMZWZ0VW50RiNSbHQAAAAAAAAAAAAAAABUb3AgVW50RiNSbHQAAAAAAAAAAAAAAABTY2wgVW50RiNQcmNAWQAAAAAAAAAAABBjcm9wV2hlblByaW50aW5nYm9vbAAAAAAOY3JvcFJlY3RCb3R0b21sb25nAAAAAAAAAAxjcm9wUmVjdExlZnRsb25nAAAAAAAAAA1jcm9wUmVjdFJpZ2h0bG9uZwAAAAAAAAALY3JvcFJlY3RUb3Bsb25nAAAAAAA4QklNA+0AAAAAABAASAJOAAEAAgBIAk4AAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAAeOEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0ECAAAAAAAEAAAAAEAAAJAAAACQAAAAAA4QklNBB4AAAAAAAQAAAAAOEJJTQQaAAAAAAM/AAAABgAAAAAAAAAAAAABLAAAAoAAAAAFAGMAbwB2AGUAcgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAACgAAAASwAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAQAAAAAAAG51bGwAAAACAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABC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ZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNS0wMy0wMVQxMTo1MzozNCswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTUtMDUtMTFUMTA6NTQ6MzQrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTUtMDUtMTFUMTA6NTQ6MzQrMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyMzNBNDc1QjJGN0U0MTE5ODM5RTBDMjAxMEJDMjZEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQxMzNBNDc1QjJGN0U0MTE5ODM5RTBDMjAxMEJDMjZEIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDEzM0E0NzVCMkY3RTQxMTk4MzlFMEMyMDEwQkMyNkQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQxMzNBNDc1QjJGN0U0MTE5ODM5RTBDMjAxMEJDMjZEIiBzdEV2dDp3aGVuPSIyMDE1LTAzLTAxVDExOjUzOjM0KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MjMzQTQ3NUIyRjdFNDExOTgzOUUwQzIwMTBCQzI2RCIgc3RFdnQ6d2hlbj0iMjAxNS0wNS0xMVQxMDo1NDozNCswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJ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dVY3hIWjs8PT4/MpGpSktMTU5PSVpbXF1eX1KEdXZjh2hpamtsbW5vZnd4eXp7fH1+f3SFhoeIiYqLjI2Oj4OUlZaXmJmam5ydnp+So6SlpqeoqaqrrK2ur6/9oADAMBAAIRAxEAPwDWf/ieTP0yFef+quo/6+e0vXa3wov99L+wdcxkcn+cjXj/AKq5/wDr57917wov99L+wdZBk8kP+XhXf+dc/wD1897qeveDF/vpf2Drv+KZL/nY13/nXUf9fPfqn1614MP++l/YOvfxTJf87Gu/866j/r579U+vXvBh/wB9L+wde/imS/52Nd/511H/AF89+qfXr3gw/wC+l/YOvfxTJf8AOxrv/Ouo/wCvnv1T69e8GH/fS/sHXv4pkv8AnY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/8AOuo/6+e/VPr17wYf99L+wde/imS/52Nd/wCddR/189+qfXr3gw/76X9g69/FMl/zsa7/AM66j/r579U+vXvBh/30v7B17+KZL/nY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/866j/r579U+vXvBh/wB9L+wde/imS/52Nd/511H/AF89+qfXr3gw/wC+l/YOvfxTJf8AOxrv/Ouo/wCvnv1T69e8GH/fS/sHXv4pkv8AnY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/8AOuo/6+e/VPr17wYf99L+wde/imS/52Nd/wCddR/189+qfXr3gw/76X9g69/FMl/zsa7/AM66j/r579U+vXvBh/30v7B17+KZL/nY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/866j/r579U+vXvBh/wB9L+wde/imS/52Nd/511H/AF89+qfXr3gw/wC+l/YOvfxTJf8AOxrv/Ouo/wCvnv1T69e8GH/fS/sHXv4pkv8AnY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/8AOuo/6+e/VPr17wYf99L+wde/imS/52Nd/wCddR/189+qfXr3gw/76X9g69/FMl/zsa7/AM66j/r579U+vXvBh/30v7B17+KZL/nY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/866j/r579U+vXvBh/wB9L+wde/imS/52Nd/511H/AF89+qfXr3gw/wC+l/YOvfxTJf8AOxrv/Ouo/wCvnv1T69e8GH/fS/sHXv4pkv8AnY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/8AOuo/6+e/VPr17wYf99L+wde/imS/52Nd/wCddR/189+qfXr3gw/76X9g69/FMl/zsa7/AM66j/r579U+vXvBh/30v7B17+KZL/nY13/nXUf9fPfqn1694MP++l/YOvfxPJ/87Cu/866j/r579U+vW/Ai/wB8r+wdd/xLJ/8AOwrv/Ouo/wCvnv2eveBF/vpf2Dr38Syf/Oxrv/Ouo/6+e/Z639PD/vpf2Dr38Syf/Oxrv/Ouo/6+e/Z9evfTw/76X9g69/Esn/zsa7/zrqP+vnv2fXr308P++l/YOvfxLJ/87Gu/866j/r579nr308P++l/YOvfxLJ/87Gu/866j/r579nr3gRf76X9g66/ieT/52Fd/511H/Xz36p614EX++V/YOvfxPJf87Gu/866j/r579U+vWvBh/wB9L+wde/imS/52Nd/511H/AF89+qfXr3gw/wC+l/YOvfxTJf8AOxrv/Ouo/wCvnv1T69e8GH/fS/sHXv4pkv8AnY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/8AOuo/6+e/VPr17wYf99L+wde/imS/52Nd/wCddR/189+qfXr3gw/76X9g69/FMl/zsa7/AM66j/r579U+vXvBh/30v7B17+KZL/nY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/866j/r579U+vXvBh/wB9L+wde/imS/52Nd/511H/AF89+qfXr3gw/wC+l/YOvfxTJf8AOxrv/Ouo/wCvnv1T69e8GH/fS/sHXv4pkv8AnY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/8AOuo/6+e/VPr17wYf99L+wde/imS/52Nd/wCddR/189+qfXr3gw/76X9g69/FMl/zsa7/AM66j/r579U+vXvBh/30v7B17+KZL/nY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/866j/r579U+vXvBh/wB9L+wde/imS/52Nd/511H/AF89+qfXr3gw/wC+l/YOvfxTJf8AOxrv/Ouo/wCvnv1T69e8GH/fS/sHXv4pkv8AnY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/8AOuo/6+e/VPr17wYf99L+wde/imS/52Nd/wCddR/189+qfXr3gw/76X9g69/FMl/zsa7/AM66j/r579U+vXvBh/30v7B17+KZL/nY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/866j/r579U+vXvBh/wB9L+wde/imS/52Nd/511H/AF89+qfXr3gw/wC+l/YOvfxTJf8AOxrv/Ouo/wCvnv1T69e8GH/fS/sHXv4pkv8AnY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/8AOuo/6+e/VPr17wYf99L+wde/imS/52Nd/wCddR/189+qfXr3gw/76X9g69/FMl/zsa7/AM66j/r579U+vXvBh/30v7B17+KZL/nY13/nXUf9fPfqn1694MP++l/YOvfxTJf87Gu/866j/r579U+vXvBh/wB9L+wddfxPJf8AOwrv/Ouf/r579U+vW/Bi/wB9L+wdcDkcn+MjXn/qrn/6+e9de8KL/fS/sHXA5PKD65Cv/wDOuo/6+e/de8KL/fS/sHX/0NZgC3A9peu2PXfv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917rwBP09+61WnXek/wBP969+69Ude0n/AA97p1rUOuWn+vv1OtauvaR/j79Tr2o9dhB79TreeuQjB/F/9v73QeZ69+fXMRD+gH+39+x6dbqeufiX+n+8n37Pp1up9euQjUfQe/UPr16hPXLT/h79T59e0/LrvT/re/U+fXtPXtP+t79T59e09daffqfPr2n5dcTGD9R79Q+vXqEdcfEv9P8AeT79n069U+vXExD/AH1/fsenXqnrgYwPx/vfv1B5HrVeuBQf77/jfvVOtZ660j/H36nWtR69pH+Pv1OvauutJ/w9+p1vUOutJ/p/vXvXW6jrogj6+/deqD1737rfXvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691xf8ASf8AYf72Pfuvdf/R1mfaXrtj1737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+6916x/offutV67Ck/4e99aJHXej/H/eP+N+/U69q+XXLSP6f73791qp69Yf0Hv3Wqn1679+691737r3Xvfuvde9+6912B73TrdPXrIE/wBh79gdb+wdZAg/1/fsnrdK9c9Pv1B1YL1yC/4e9063p65hD79+fVqDrkI/99/vre/Y63T5dd+Me/fl16nXfjH++/5F73n069Q/Lr3jH++/5F79n069Q/Lrrxj3r8uvU+zrrx/77/fX9+x6dep8uuJQ+/Y9etUHXAr/AIe/da09cdPvVB1Ur1wKD+nv2R1WlOuBT/Y+/VB619o6xke/U61T064+9da697917r3v3Xuve/de66sP6D37r1T69e0j+n+9+/dbqeutP+Pv1Ovavl1xKkf4+/dbr11Y/wBD711uo9eve/db697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XuuL/pP+w/3se/de6//S1mfaXrtj1737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdesf6e/daqPXrlp/x97p1rV8uu9I/wAffqda1Hrl791rr3v3Xuve/de697917r3v3Xuve/de63P/AOWB/Ij+Ffyw/l9dfdxdrz9iVPavbdJnMsu7dubq/hcOyzRZfI4nHUGIwn2s+Mrkp0pBJUfdpK0sjEDQAPbqoCK9YSe6nv8Ac8co+4u47LtC2w2mzKL4bx6vFqqsxZqhhWtBppQevVAX8z3+Vx3D/LW7RocHueqO+OoN7S1svV3bFDRNSUecjpLSVW38/RhpUwu78VBIrT0+to5oyJYWZCQlGXSfl1kN7V+62y+521ST2qeBvMAHj25NSleDofxRseB4g9rZ41fWv711KoFeuarf/ivv2Bx6tw4cesoW3v2T9nW6V6yBfewPTq4XrIEJ9+x1YDrIIx73nrYB6EvqDqTfnevZuyOoOsMDUbl372FuHHbZ2zhqbhqrJZKZYkaaQgpTUdMmqWeVvTFCjOeB79T59Fu9btt3L21X+9btcCLbraJpJGPkqiuB5k8APMkDr6JXwE/kifD74kddY2k7B2HtDvnvLJYmB9+b535iaTPUNHWV9KFrsNs7b2QE9DhNvwOzRxytG1XUafI8gJ0K4FA8uuaPuL788685bnK+27hNt3L6OfBihYoSAcNK4oWc8SK6V4AeZ0cP5pPV3XnTn8wL5Sdb9V4bH7c2Dtjs3IU23tu4nV/DMFT1NDQV8+KoFeWZo6WjrKqRUQsdAGkcC3uh4nrP72k3Xct79uOUd03eZpdxmtAXdvicgkBjwyQAa9EE8Y/x966keh9OuXjH9D79Q9boeveMf0P+39+oevUPXXjH+Pv3WqHriY/8ffutU+XXExn378utU64FP8PfqDrWnrGUHv2etEHrGUPvWOqkdYivvxHr1Ur1wK3+vvWRw6oR1iZLe/YP29a+3rGRb37qpFOuveuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691x0j37rdT11o/wAffqdb1fLrqx/p711uo9euvfuvde9+631737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691xf8ASf8AYf72Pfuvdf/T1mfaXrtj1737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdd6T731Wo65aR/j79TrWo9dgAfT37rVa9d+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xut8P8A4Tc91ZLvH4C91fF+PdmW2lu/qjO7hxm1t0YWqgG4NvYPs3F1lbh87hlqIZooZ9u7iWoeLWjoZLXH19vIcEdYAfea2OLYfcLY+ajaJNZ3kaNJGwOh3gYBkalCQ6UrShp0ZrZ23If5sX8sbuv48d/JTZ75FdDbl7D6Z3HuN6WBszS93dQNUrs3sOiiQI1JPvKh+2kqFTSk6VU620tYe+JaHj0F725b2i90ti5k5eJj5b3CKG5RKnSbW4p4kJ9RGdQFcjSp49fO+zeCyW283mNvZqlkocvgcrkMLlaKYFZaPJYurmoa6llU2KyU9VAyMPwR7a+Q66SW88V1BBcwOGgkQMpHmrAEEfIg9N4HvwH7elAXrKqE+9/b1enWZUA97z1YCvWUIT799nVgOsojH+v791ah62tf+EvfxZxO7O3e4/ljuimglpun8PS7G2QaqIGOn3Nu6mqKrO5iOSQeNJMZt6lEIYepPuyePd1HE9Yf/e05tmstl2Pk60ch71zLLTzjjICL/tnNfnp6vQ/lkdr1/eG+f5inzZ3RV1w2znu66/rfYdNPXzSYrGdXfH3b02LhkoImmajp3r6uSoqJ5VjUyMQWJAFtg8T1j/7sbNHy/t/tlyFaIv1cdgJ5iB3NcXjhjqxU0FABXHXz8/kj2XV91fIDuftmtfyzdhdl7x3SjnT/AMBMpnKyegU6br+3QmNeOOPbZOeukvK20JsPLexbNGKLbWscf5qgB/nXpB7Q6733v+v/AIVsXZu6N5ZL6mg2tgcrn6tRa5Z6fF0tVIigc3IA96rXowvdy23bYvG3G+hgi9ZHVB+1iOl/vP4z/ITrrAS7q350n2ls/bUDwR1Gf3HsXceIw9O9VxTLUZCtx8NLTmckBdbLqYgDkge/fb0XWHNXLO53Is9u36znuzWiJMjMacaKCSafLoFPCf8Aff8AI/eqj16PsenXvCf8P9v73UevXsdYzF/h/vXvdet0+fWMx/7D37rVOuBjP+v791oj16xGMf0t791qnWJoyP8AH377eqkdYWT377OqkU6wslvp71/h6qR1jI9+I/b1Qr1iZP6e9cMHqvDrCRb36n7OqkeY64+9da697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de68Rf6+/de4dcdI9+p1vUeuJU+/dbqOuveut9e9+631737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691xf9J/2H+9j37r3X//1NZn2l67Y9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3XYUn/D3vqpPXIKPzz791qp65e/da697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6sd/lUw/DOt+ZXXuJ+dOOir+ls3DkcRA+Vrp6HaFBvOtjji21V75lpZaef+6/3BaOY61ijkdHl/bVvdlpUV4dRp7tNzsnJW5TchSld8jIY6QDIYh8YirUeJTIxUgEDNOt+uu/k2/ysd47YSOj+J/UpwuUxyT0Oe2u+RpJ5KGpQTwZDF53F5bWyyRMGjmjdgyEWJHt3Svp1z2j96vdiyuiX5vvPHRqFJKEVGCGRl/aCOqHPkj/AMJ0fjl3nszdXZv8s3v/ABOdyu3sjlsZVdZ57d2M3jtWfP4ionp8jteDelC5ye1c5BVQPEIckksastnZB6vdSgPwnqf+WfvJ8y7De2m1+6PLrxxSKrCdI2jkCMAQ5iPbIpBBqhB9AeHQS/8ACbNN/wDxv+fHyO+Lvb21s5sXfeX6zqIcptbPUr0VbQZzYmepqyXyRSWWeGfH17vBNGXimiIZGZWBOkwSOjn7zf7v5m9veWebNnu47jb0ugVkQ1BSVCPyoRQg5BwRXq8D4M4Oq6Z/m0fzPunFHgwHZWM6h+S2Apr/ALf3G7KesxGdlhUWQKa8ENwTdbE+7j4iOoJ59nXe/Z/2r3smtxavcWTn5RkMtfy60Xf5kO06XZnz1+Wu2qFEjpcf3nvySFI1ARVyGXmyZAC8X1Vhv/j7aPEinWfnthdvfe33J11Iau23xV/JQv8Ak6JakVuTz71X06HtfTqQsYP49+rTqwx1nWIfgXP+8e/VPVsn7Os6xD8gf7b36vVh1nWP/Yf73/tveut063x/5AFCmB/lL9vZ/Coi52v3T3nkZJI9Mcz1+K2pDTY3ySIpk1RpTJpvcgfT26nw9c8PvISG495tktrgn6dYbRflRpCW/wAJ6h/DbPt0j/wni7K7HHkp8pnOuO/d1yzhzBUy5je25s1hIpjMbOZFmq1sb30rYe/D+zJ6c55tRv8A95ratqwYY7qzjpxGmKNXpT7B1VR/Kz/krbP7J60f5pfPrMf6NPjTisVJurbm1MvlP7rS7x27Ro0z7u3fmZngn2/smQKDTJEVqsiLFSsbKZKKlRqbh1MXu/78Xu1bqOQ/beD6vmt38N5FXxBE5x4cSioeX+IntTzqQabnXxy6v+NXXvV+1Mh8a9idebR6zzW38fm9s5LZWBocVR5bAV9JHV0GVbIfbxZCtiq6NlkEtQ7OynUT7eAFMdYKc0bvzXue73kXNW43U+7RyskiyuWKuDQrStAQcUAx1r6/zwv5v/RmF6c7J+G/ReTwHbnZXYFBPtLsTcND9rm9k9dYZ5l/ilHHkFE1DmN5y+HxxJAXjoCTI7eQKvtqSRQNIOeslvu/eyHMNxvm1c88wwyWW1WzCSBDVJZ2p2mmCsWakmhfgBSp60gvAf8AfX/4p7Z1fProB+XXEw/7H/bf8U9+r9nXuuBg/wAP94t/vI9+r17rEYf999f+N+91611haL/D/bcH/be91691haP/AGP+9+99ap1gaIf0sf8AW9+r1rPRi/jN8QfkJ8w99x9efHzrTOb9zqqsuTq6OIUu3tvUjX/y3ce4asxYnD0pt6TNIGc8IrH3YVPDoK8186ctckbcdz5k3WO3t/wg5dz6Ig7mP2Cg8+kX8gfj1218X+1Ny9Md3bPr9k9gbVmhTJYitKSxTUtVGJ6DKYyugZ6XJYnJU7CSCoiZo5FP1BBA8a8D0q5d5k2bm3aLXfNgvVn22YHSw9RgqwOVZTgqcjoEniB+nHvVacejrhxHWBo7fU/7x/xv36v7OqnrC0Z96rT7OqHj8+o5Q/0P+297xxBx14ivXD3rqvXvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3XEqP8AW9+63U9cSpH+Pv3Wweuveut9e9+631737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691xf9J/2H+9j37r3X/9XWZ9peu2PXvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+6912AT791qo65af8fe6dV1dcvfutde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+6913Y/0Pv1R69e65aP8f94/4371q+XXuu9A/qfetR691cx/Ls/nYfKr4G1mB2bVZip7k+PdLUpFkOpt410tRNhsbK1qltg7in81btuphU646cmWgZlCtEASfdlkK/Z1CfuT7Gcpe4CXF6kIsuYyMXEYoGby8VBQOD5nD/Prbb6A6z+NPzSr9kfzBf5Zfai/HDtKr3Xh/wDT9s/DUCRbQ7Dx33cVTu/YHefUlHUxYmLd9RSM7Y7P0qJMXInV5lYlXQAaMpp1h9zDunNHI8d/7de6W0fvPaRC30kjH9SFqUjmtbgjV4YNNcTVH4SB1ZD2B8Mett7/ACv6W+ZFFU1u0u4OpMFurZ+SrsHS0K03Y+yd0Y40f9295F4hPVx4OpPnoZw3lhJKX0WAvTIPUZ7d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0olF00RamleLGuTT06qtZbe69SuRXrER7rw+zqnA9YSLe9f4OtkeY64+9dV697917r3v3Xuve/de64lQfdqnr3XEp/T/AHn/AJF73q9evdcSCPr72DXr3XXv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917rogH37rwNOuJU/j36nVtXr1x966t1737r3Xvfuvde9+691737r3XvfuvdcX/AEn/AGH+9j37r3X/19Zn2l67Y9e9+691737r3Xvfuvde9+691yC+906rq65gAfT37qteve/de697917r3v3Xuve/de697917r3v3Xuve/de697917rsKT78TTr3XMJ/U+66uvdcrAfge9VPXuu/euvde9+691737r3Xvfuvde9+691737r3Sm2ZtHO7/AN37Y2NtikFfuPeGfxG2cFRmRYlqstm6+DHY+BpXskSSVVQoLHhRz730mvby32+zur+6fTbQxs7n0VQWJ/YOtj2h/wCE6P8ANN6imxu6epeyuvKTclPHR1atsrtncOzstjqsos0lOteMfQRzGkm9DFXMb2uLqfbvhuBjrGiT7yvtNvKy2m77Xcm1JI/Vt0kVhwrSp48eFR1Z58W/kR/PY+F9Tjdr/LP4s74+W/UEdT9vVbj2lkdubk7U21jqQss9Ti8thK625o/AoaKDIweSULYToW93GsYIqOos5r5a9geeElu+UObbfZ96IqEkV0t3J4BlYdmeJQ0H8J62UOhe79qfInrDb/a+y8TvXA4PcH3caYXsPaOY2Nu/FVmPqZKOvoMztvOQQV1DU01VEyXs0b21IzKQTcGvWMHMOw3nLW7XOz300ElxHTuhkWWNgRUFXUkEEfmPMA9Tu1OpOpO0YNp5HtvZ+3d2UfVu6qLs3as25YfPRbW3XtyCpag3VAryJTpV4mCaVkeUMiXLWuARvqm0bzvO0teRbNeywvdwmCQJgyRuRWM+dGIFQMnrQH/nQfPrfP8AMG+RdVsnqaj3Pm/jj0xlMht/ryiwmJylZSby3HE5odw9hVUVJTyCq/iU8Bgx2pf2qFAR6pXuyx1HHDro97E+3G3+23LCX+9PDHzPfIHmLsoMacUhFTjSMv6uf6I6MN/wnq3F8lfj18v4dq5np/uWk6T70w9RtTd2Rqdgbqpdr4PcmPhlyW0d0ZGtrsfT46ghp545aSWo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Z1LXR1/5d3wpy3zr+Tu0ulYcjUYHaaQVW6exdyUsSSVWG2XhmhOR+wWUGE5bJzTR0lMH9KyzayCEIKmFTK4Xy8+o591PcCD245QveYGhEl6SI4EPB5Xrpr56VALN50FPPrZq+dv8gT4vv8Zdz534ubdzeyO4ur9q124sRJV7iyecpOxafBUb12Uwu44clNKiZbJUdO5paqnWMpUBUKFGIC9oV09oyOsQPbn7y/OH9brS35xuo7jYryYI1EVDAXOlXQqPhUkalatVqa1HWj5VU0kMkkciMkkbskiMLMjoxV1YHkMrCxHtOD10HDKwBBwemiaIf6kf7Yf7H/be7jrXTTNCOfxf/bA/8b93B60em6SL83/2Fv8Ajfu3VSOoEkbAnj375dNkdbP3/Cbb5/ZDqruqv+FPYeakfrbuqepyvWC187NTbZ7SpqdparFUQlJWCj3xjoWVo10qa2CNrapWvZD5dYl/ef8AbqPdtjj5522ADdLEBZ6DMkBOGPqYieP8JPoOil/z/fgdT/ET5eVfYuxcOMd058jjk9+begpKfxY3b29hUh99bXh0IIaeI19UtfTRA8Q1ekcJxVxpb5HoW/d39wG5x5NTbb+bVvW2aYnJPc8VP0pD5nA0MfVfn1Q2fr7b6n88euvfutdcSoP4t/rW9+691wKH8c/7x/xPv3XuuJBH1Hv3Xuuvfuvde9+691737r3XvfuvdcCv9P8Abe9U6sG64kEfX37q1Qeuveuvde9+691737r3XvfuvdeIB+vvfXusZQj6c/77/efdgevdcPe+vde9+691737r3Xvfuvde9+691wk/Q3+w/wB7Hv3Wxx6//9TWe9puu1vXvfuvde9+691737r3XIKT/wAb96qOvdZAoH091JJ69137117r3v3Xuve/de697917rsAn3vrVR1zCj8+/daJ9OuXvfVeve/de697917rwBP09+691y0N/gP8Aff4X9+691kCge/de65e/de697917r3v3Xuu7H+nv3Wqj165qhv72BnrYIyepSovHF/8Ab+9jz62MnPW4z/wnM/luU2Ioqz+Yb3xhosfRUVHkqboCi3DFFBSUuPghmTc3bdQKzSkEMEEclJjJ2ACqJ6hWFo29uovmesLvvMe57zPH7bcvTlnZlN4UNSSSPDtxTiSaM4/0q+o6rd/nbfzTMr84u4KnqLqvNVNN8Yepc3VUmAjpZpYYez920TPSV2/cqilRVYuFw8WHhcFY4Lz28kvp0xr9nUq+wvtHDyDsqb1u8APNl5GC9RmCM5EK+jHBkPme3gM0YRRjj/bn3Q46yGqenCJALW+p/wCJ9049XFT06wJ9P99/rf8AFfdCerdKXD4rIZfIUOKxVDV5LJ5Krp6DHY6gp5auurq2rlSClo6OlgSSapqamd1RERSzsQACT7aJ6alligjkmmkVIUUszEgAAZJJOAAMkno4fc3wN+XPxy2Tgexu6eiN87D2VuH7ZKLcGVoYZaGkqKwFqSjzLUNRVPgq2pUXSKsELsfSBq490dHUVZSB0C+Xvcfkfmrcbnatg5jtrncIq1RSQSBxK1A1geZWo/LosUER44P+2/3309pyehvj16dYoTxx/vX09tn06sKdWu/Er+T58u/l71ZV9w7FxW1trbLmSqXaFXvvLz4effNRRs0cxwNPBRVki44ToYhWTiOB5FIUsAT7djtZpl1LQL/h6hrnf365D5C3qPYNznnn3AU8UQoHEIPDWSR3UzoWppxp0QHszqnfnTG/t0dYdl7crtqb32dlJ8Rn8HkU0z0tXCQQ0brqiqaWoiZZIZoy0csTqykg39pJFZGKsKEdS3sm9bXzDtdlvWzXaz7bcIHR14EH+YIOCDkEEdJKKnPH0/33+w9tHo5FOnSGkvb6/wDG/wDYj3Xq1enKKiH+P+8f8U96r17qelEv9P8Ab/7z9LH/AHv3rr3W1h/Ip+Om1eoOmO1PnN2VBT0bVGNz+H2jka5FU4XY21YHrN25mlkmA0S5qug+2V1Pqjpyv9o+zrbYgkb3D/6gOPWCH3pObr7mDmXYfa7ZGLUeN5VX8c8ppEhp5Ip1UPm1fLof/wCYN1n1l/M5+AOJ+VPUFDKd5dc4nN7z2sZ6SJ9xS4TET1NPvXYOWFMzNHMsVKayNNTCOaFSBaQ3culS7tRMg7hkf5R0E/aTeN79kvdqfkPmKQfu68kSGWhPhh3AMM6V8s6CfME+nWmi9EPpYix/xuPxbm5/3j2Q9dG+oMtCP6H/AHj/AIoeffq9e6bZaQC/1/3j3vr1T01y0x5+n+8/8U92HVSR19Gn+WTQYDG/Af4tU+2dDYpuqsNUCRY0jaWuqZqufKSShB6pTkXlBY8m3PsTWtPp4qcKdchfeaW6l90ud2vP7f65x9gAAWny006q7/4Uk0GHn+K/T1bVRwHM0ncBjxEjhPuFgqduVwyaQsfX42jjjLgccC/49sbhTw09a9TJ90WScc67/GhP07WHd6VEg01/n1pUSxH+n+t9P9t7Kx/LroQadbH/APwmjy236H5Nd8YavEI3Dmun8dLt8yePzNT4vdFPLmVpyx1/5qphL6b8AX9mNke9weNOsR/vdW9zJyjy1cRV+ljv2D+lWjISv5g063LdzV1Bi9t7gyWVligxeOwmWrslPNbww0FJQVFRWSy348UdPGxa/Fh7MjwPWAtnHLNd2sMKkzPIoUDiWJAA/b18nnsWegr99b1r8XoOMrd27jq8cY10oaCpzFZNRlFH0T7d1sP6eywHJ67RbYkkW3bfHN/bLAgb7QoB/n0HU6fX/ff77+ntwHpd01SoDcf7b/iPbnWjXj03SRg/4X93XPVCT03yRm344976qSK9Kfr3fG4Or9/bK7I2tVzY/cmxN04LdmErKeQxzQZPAZKmyVIyupuAZqYA/wBVJHvwqDjot3Swtt22++2u7QNa3ELxuD5hlKn+R634P5yuw8D83/5P+O+QGEpKetzmzdqdefIvbVVTaJZKSkyOMoqfeuNglYgLCMVmp/KByWo1H1Hu7iqV653eye4XHIfvPLy5O5WCeaazcHzKsTEx/wBsop/puvnquhB4/H9f+Re2T5Hro0Wx1j0n+nvXWqjrr37rfXvfuvde9+691xKg/Uc+/de64FD+OffuvdcSCPqPfuvdde/de697917r3v3XuuJUH/X9662CeuOk+/dWqOuPvXW+ve/de697917r3v3XuuiAfr72DTr3WMqfxz7tUde64+99e697917r3v3XuuEn6G/2H+9j37rY49f/1dZ72m67W9e9+6912AT9PfuvdZAoH15PupPp17rl7117r3vXXuve/de697917rsAn3vrRNOuYUf7H37qpJ65e99a697917r3v3XuuwCfoPfuvdcwn9effuvdcwAPoB7917rv37r3XvfuvddgE+/deqOuQX+vvdOqlvTrkFH4F/8AeffutVPr1zCE/wCH+vf/AIp791rrMkY/PP5/p/xPvfkercB0dT+X78Ts181fll1F8f8AFrUw4nc+4I6/fGWpYmkOC2Dgh/E915RmUjxP/DYGghYm33E0Y/PuyitB0CfcPnCDkbk/euY5SDNFHSJSfjmf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PZjbu+SPRe3PsDkEynaeyYZqMRCfz08eeop6lXi51xinhYsP9SD7dgUtNEv9IdA/n/cF23knmu+8XQY9vnINaUPhsBn7SKdbBH/Cgyrq2278cNvxBVxYyu8sl4VWwFVBQ4yihIN7BY6eZgBb8+zXdj2wiuM9Yhfc6hjN5zteNmfw4Vr8izMf5gdFS/kLy1FB8rt7UcZdKfI9TZUVChiEc0mYxU0JdQbMUZja/wBL+0+1Gk7AH8PUgfe4iST2+2uUga03FKfmjg9FU/m7bMn2989O65JY41TcVRt7c1PodX1Q5PAUC6nAt43MtM9wef8Ab+2r9SLqT556Hn3ddwS+9pOVwpNYRJEftWRv8hGeqvKmiIv6T/tvaLqcKj16T9VSkX9J/wBt731ao9ek/UwHng/7Y+/fl16o9emOoi+vH++/437sppjpth0yzJ9f99z/AMb9ug9NMOmuVB/QG/8AX24DwPTXA9N00YN+ByP6D6+3Aem2HTPPCOfr/vH+v/T26p6p0x1MP1sf9a/++/1vbqnrXTHPGeeP969vL1cHHz6ZJ0PPB/2x/wBf26vl1ao6aJl5/wBuP9vyPbgPDrx6b3A/I9+PTb9Q5EFz+P8AW9+qaHpkjHW+V8Idy1vRn/CeLcO/aymRJIulu689jIq9vBDVR7iy2cw+OdWLRlknmqRosbsbAe3lPZU9c8efbWPf/vJW23I1Qb61RqZI0KrN+ymetB51P9D7ZFM9dBh1g9668euvfutdcSgP+H+tb/inv3XuuBQj6c+/de64Ff6j6/4e/dbr1wK/096p1sN69cbEe/dWr1737r3XvfuvdcSoP+H+tYe/de6xlSPx7917rj7917r3v3Xuve/de64lQfeutg064EEfj37q9R117117r3v3Xuve/de697317rGy/kf7b3YH1691hl/Q3+w/3se99bHHr//X1owoHP59pCa9dreuXuvXuve/de697917rv6+99e65Bf6+/dVJ9OufvfVeve/de697917rkFY/j/b8e/de6yBAPfuvdcvfuvde9+6913Yn8e/deqOuQUfn3unVdXp1zCn8A/77/X9+611kCf19+611zAA+nv3Xuve/de67sf6e/VHXqjrkF/r71XrVfTrsAAj3onrVTXqSn0/2Pvx4jq3n1vt/wAuqhzHRP8Awn83lvOgpocbm831R312BQ1U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f1FQdC+pJ9OgZ/nj/Nen+Y3zV3PHtLKvkOp+kIajq3YLxTeWgylVi66Vt3bnpAoVTHm86GSN+dVPTRkGx90c1J+XRp7C8iNyTyLam8h07xfkTzYyoYfpxn/Spk/0mPVMzKDfj+v++49tniOppzX8+orR/wBD/vv9596PE9ePHrHYj6g+9da669+6911Yf097r1up64lf9j73Xrdeuve+t9de/de64lAf8D/vvx7917rgVI/xH+++vv3XusZUH/D37rdT1wII966sDXrr37rfXvfuvdcCgP8AgffuvdYyCPr/ALf8e/de669+691737r3XRAP19+63w64Fbf4+9dWBr1x96631737r3WKf/NN/wAg/wDQw97HHrY49f/R1pfaLrtb173vr3XML/X37qpPp1z976r1737r3Xvfuvdc1S/1uPfuvdZffuvde9+6914An6e/der1zC/1976qT1kCk/j37qvWQKBz+ffuvdcvfuvdd+/de65Bf6+9V60T6dcvp711Xr3vXXuuQUn8f77/AFvfuvdZAgH+P+v7917rl7917rkAbjj3vrwIr1nQfS/uwGerAVNet0D/AIS59/4nM9d/If4p52WmetxWZou09uUE7Kf4jgdw0UW2t20wikYiZaasoqNmVR+mdif6+304EdYR/ew5cmt9y5a5vtwfDdDbuR+F0OuM18qgt+zrW5/mOfGbL/Ev5n96dPV9FPTYej3jktybJqZITFFk9jbrqZc5tuspTpVHiio6v7dtNwssDr9VPupFD1lR7Xc1Qc48jcvb3HIDM0ASUV+GWMBHB+dRX7CD0SuIHjj/AH3PvXUhVGenSnX6X/33PupHW9WMdbqn8kf+VdgPj/tHF/Ov5TxYPG7vr9vxbj6qwe5qmip8R1htSvpBULv/AHBU1zx0NLubK0EwNKXa2PpX1XEsl0siU7m6wM+8B7xXPM17L7dcnmR7FZdFw8YJa4kBp4KAZMakd1B3sKfCMmq/nWfCr5R/N/q3YOW+N++8FuzYWyoJd0VnTEElHTS78zM8c/2G8NvbrWZ6DLVVJh6hoKahleOJxIzxya3sazxu4Gk49Ogh7Ae4HJ/t7vO5Q817bJDuVwfDF0akQqKaonjpVQWFWcAkUoRQdaRm9utuwOrNx1+0Oydmbl2NufFzyU9dg90Yeuw2QgliZlceCthiMkdxw6akYcgk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LO54/wCMSVP5opJPAsOHWpHvTd+6ewNzZvee99xZnde7NxV82Tzu4s/kKnKZfK19QdU1TW11XJLPNIxNhc2VQFAAAHunE9ZmWVnZ7baW9ht9rHDZRKFREUKqgeQAwOkVMg44v/vfu4PT5PHpvlTkW4/33+v715dUPn1DcEX4/wBj+PejxHTfn1HPvR8+vNx64296p1WnXG3utOq0697917riVH4496p1sN69cCCPfurV6696631wKf04/wAP+N+/de6xWt9ffuvde97691xK/wBPe69bB9euPvfVuuvfuvdcGT8j/be/de6xEf1Hv3W606xkW966sDXrr37rfXvfuvdY2T8j/be/de6x+/de697917rBUf5l/wDkH/odffurL8Q6/9TWr9pOu1PXvfuvdZVW3P5/3r37r3XP37r3Xvfuvdcwv5P+29+6qT6dZApP+t/X3vqvWUKB/wAV9+69137917rkBf3qvWiadcwLe9dV49e96691zCX+vH+Hv3XusoFhb37r3XYBP09761XrmFA/x9+6qT1y976112B73TrYHXdve6dbp13731vrmF/5F79Tqur06yLH/rj/ABI5/wBb8e99ar1KRQP8f9697PketnHUmO9xYX/1v9t7r69XGR1PiUkgnj/fH3vyHTg4dHx+GP8AMM+UPwY3MmX6S37VR7aqaqOfcXWu4/Lmev8AckeoGYVmDllVaCtkjBC1dG8FShN9ZAt72CRw6AnPHtnyj7g2ngb/ALcDdAEJOlFmT0o4GR/Raqn062r+i/57XwM+YW0ourvmr1pies8jladabK0m+MLBv/qTIzyR6JZ6PMmhmyODV9dlNVTRtHf/ADptf3fWDg9Ygcw/d49xuSL07vyFur3cSGqmJjDcqPQrUK/+1Y1/h6eewv5Fn8uL5V4xt+fFftKTrwZeF66ln6y3Tiuxdis041wn+7+Qr56zFwgmxiiq4QoNgg491MatwPTO1/eH90uTZht3OOzi60GhFxG0E2OPeAAx+ZU/b1Wl2b/wmw+WG2JZperu0eqOzKLXIaenyFRldk5XxDUYhMmQpa7G+ZhYHTUaQfzb2y0D+RHUubP967ku7CjeNnvbSTzKhZVr500kNT/a9El3Z/Jo/mN7JMjVPxzzu4IY3KGfaOa27uJGtf1rFR5QVXjI/tGMD2w0MoHw9SNYe/XtXf0Cc1Rx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1q6yBCLWH1/P1/4rb3vrVT69ZQp/r/th/wAb97r1uvr1mFuOLj/efesfn177D1lAH9be/HqtT1kC/wCN/wDYf8b91r8uthusgUWvb/ef+N+9/n1vWB1yAt9B/vB97z1vWPUdcxf/AGn/AG3/ABr378uva165Xb/D/ff7D378uvah6deu3+H++/2Hv35de1D0648/7T/vv9h79+XXta9cDz+P9sD79n069rHqOuOkW+n+82/4n3r8+tFx1jK/0Nv99/r+9VHWtXXAgf1v/vv9j72D8utV6xH88W/3j3vHmc9W+09YSt/z/vH/ABv3uvp16oHDrEUJP0v/AI/8b49661U+vWMr/T3qnW9XWMoOSR/xH/I/fut1HWFouOP96/4j3rq1T1iZDexF/wDff7x79kdWqOsRT+n+2/4373q9et9Yiv8AhY/778e7YPXqnrGyf1F/8feurA16wlD+Offut9cPdSPTrfWNkB+lh/vv94914de6jshHB5/r7tXqwPWFk/p+fx731vrCV/p/tveqdWB9esLJ/Tj/AIn/AIp711brAy/7f37qwPWFkB/1/eurdR2Ui9/dgerA9YGW3I+n+9e99W6wsLcj3rqwPl1gZfyP9iP+J966t1hK35Hv3WwfXrCy3/1/979+Bp9nVuo5Fv8AW926uDXrAy25H0/3r37rfWJh+f8Ab+9dWB8usLLf/X/33HvXVusJF/e+vdYzx7t1frC6/wC2/wB6Pv3WxjqORbj3rq/TZlh/kFR/06/63R+606vEP1V/1eXX/9PXWHHtN12hGOuaj8/7b3sdVY+XUkCwt731XrIo/Pup6qT5dZUW/PPH0/x96611mAuffutE06zAXNh/yIe7dU6zgfQD/ff4+/de6kIv+8f7yfeiaY6px6zqL/776+69VJp1lVb/AOt731XqQBf/AFve+qk06zKt/wDAD/fW976r1nAv/vv9496Jp1omnUlUtb+tv99/sfdeqdZlW3+v731QmvUhVtz+ffutdZlX/b/77/efe+qk9ZlT6E/X+nvfVepCpf3UnqpPWdVt70BXrXXMAn6C/u4FOtdZVS3+J/1ve+vdZgv+x/w976qW6yhP68f4e9FvTqvWZUJ4APH+HuvHrxIHWdYwPr/xF/8Ab+/dVJr1mVPx9Pe+qk9cwn9AT/vX/Gve+qk16yhP6n/ff7z791rrIqW4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';
                    }
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
    debugger;
    var images = new Object();
    images.name = new Array();
    images.data = new Array();

    images.name.push('profile.jpg');
    images.data.push(userProfilePic)

    images.name.push('cover.jpg');
    images.data.push(userCoverPic)

    var user = {
        'userFullName': $('#userFullName').val(),
        'userEmail': $('#userEmail').val(),
        'userPassword': $('#userPassword').val(),
        'facebookUser': 0,
        'userDeviceID': userDeviceID,
        'images': images
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
    debugger;
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
            createFavDatePage(favDates);
        }
        else {
            createFavPresentPage(favPresents);
        }
    }
});



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
                dateLi += '<li class="dataItem goToDate" data-date-id="' + thisDate.DateID + '" data-from-img="true">' +
                            '<div><img src="' + previewImg + '" class="goToDate" data-date-id="' + thisDate.DateID + '" data-from-img="true"/></div>' +
                            '<div>' +
                                '<h3 data-from-img="true" data-date-id="' + dates[i].DateID + '">' + thisDate.DateHeader.replace('&apos', '\'') + '</h3>' +
                                '<article data-from-img="true" data-date-id="' + dates[i].DateID + '">' + thisDate.DateDescription.substring(0, 70).replace('&apos', '\'') + '</article>' +
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
    } catch (e) {

    }

    if (dateLi == '') {
        dateLi = 'אין מקומות בילוי מועדפים';
    }

    $('#favList').html(dateLi);
}

function createFavPresentPage(json) {
    var presentLi = '';
    var previewImg;
    var favIcon;
    for (var i = 0; i < presents.length; i++) {
        favIcon = 'essential/images/General/fav.png';
        if (favPresents.length > 0) {
            if (presents[i].PresentID == favPresents[i].PresentID) {
                favIcon = 'essential/images/General/favHover.png';
            }
        }

        if (presents[i].ShowVideo == 'Y') {
            previewImg = 'http://img.youtube.com/vi/' + presents[i].PresentVideo.Url + '/maxresdefault.jpg';
        }
        else {
            if (presents[i].PresentImages.length > 0) {
                previewImg = presentImgSrc + presents[i].PresentID + '/thumb/' + presents[i].PresentImages[0].Url;
            }

            else {
                previewImg = '#';
            }
        }
        var presentRatingHTML = createRating(presents[i].PresentRating, 'blank')
        try {
            for (var i = 0; i < presents.length; i++) {
                if (presents[i].PresentID == json[i].PresentID) {
                    presentLi += '<li class="goToPresent dataItem" data-present-id="' + presents[i].PresentID + '" data-from-img="true">' +
                                '<div><img src="' + previewImg + '" class="goToPresent" data-present-id="' + presents[i].PresentID + '" data-from-img="true"/></div>' +
                                '<div>' +
                                    '<h3 data-present-id="' + presents[i].PresentID + '" data-from-img="true">' + presents[i].PresentHeader + '</h3>' +
                                    '<article data-present-id="' + presents[i].PresentID + '" data-from-img="true">' + presents[i].PresentDescription.substring(0, 70) + '</article>' +
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

$(document).on('click', '.uploadPresentSupplier', function () {
    showImgPreview('supplier', $(this));
});

$(document).on('click', '#addDateImage, #addPresentImage', function () {
    showImgPreview('add', $(this));
});

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

document.addEventListener("backbutton", closeApp, false);

function closeApp() {
    var thisPageId = $.mobile.pageContainer.pagecontainer('getActivePage').attr('id');
    if (thisPageId == 'mainScreen') {
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        }
    }
}

//#endregion
