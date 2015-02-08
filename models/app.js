
api = 'http://www.sroogim.co.il/SroogimCMS/app/api/Default.aspx/';
//api = '../SroogimCMS/app/api/Default.aspx/';
dateImgSrc = 'http://www.sroogim.co.il/SroogimCMS/content/dates/';
presentImgSrc = 'http://www.sroogim.co.il/SroogimCMS/content/presents/';
top5ImgSrc = 'http://www.sroogim.co.il/SroogimCMS/content/top5/'
//dateImgSrc = '../SroogimCMS/content/dates/';
//presentImgSrc = '../SroogimCMS/content/presents/';
//top5ImgSrc = '../SroogimCMS/content/top5/'
var dates, presents, categories, locations, news, lat, lng, thisDate, thisPresent;
var favDates, favPresents;
var subCategories = [], gpsAddress = [], distance = [];
var categoriesHTML = '';
var userEmail, userFullName, userPassword, userProfilePic, userCoverPic, userBirthDay, userGender, userDeviceID;
var userPermision = '';


document.addEventListener("deviceready", initApp, false);

//$(function () {
//    initApp();
//});

function initApp() {
    var count = 5;
    var loadComponents = function () {
        if (count <= 0) {
            initFacebook();
            try {
                userDeviceID = device.uuid;
            } catch (e) {
                userDeviceID = 'private';
            }

            $.mobile.loading('hide');
        }
        else {
            count--;

            $.mobile.loading('show', {
                text: 'טוען... ' + count,
                textVisible: true,
                theme: 'a',
                textonly: false
            });

            setTimeout(loadComponents, 1000);
        }
    }
    loadComponents();

    $('#menuSidebar').panel().enhanceWithin();
    $('#popup').enhanceWithin().popup();
    $('#newsContainer p').marquee();
    checkPhonegap();
    getAllDates();
    getAllPresents();
    getAllCategories();
    getAllLocations();
    getCurrentlatlong();
    getAllNews();
    getDateText();
    getPresentText();
    getTop5App();

    var devicePlatform = device.platform;
    if (devicePlatform.toLowerCase().indexOf('ios') != -1) {
        if (navigator.userAgent.match(/(iPad.*|iPhone.*|iPod.*);.*CPU.*OS 7_\d/i)) {
            StatusBar.hide();
        }
    }

}

//#region Init

//check phonegap components
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

//get main date text
function getDateText() {
    $.ajax({
        type: "POST",
        url: api + "getDateText",
        data: "",
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

                $('#dates p').html(result.d);
            }
        }
    });
}

//get main present text
function getPresentText() {
    $.ajax({
        type: "POST",
        url: api + "getPresentText",
        data: "",
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
                $('#presents p').html(result.d);
            }
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
                alert(result.d);
            }
            else {
                var imagesString = result.d.split(',');
                for (var i = 0; i < imagesString.length; i++) {
                    $('#top5').append('<img src="' + top5ImgSrc + imagesString[i] + '" />');
                }
                var c = 5 - imagesString.length;
                if (c > 0) {
                    for (var j = 0; j < c; j++) {
                        $('#top5').append('<img src="' + top5ImgSrc + imagesString[0] + '" />');
                    }
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
            }

        }
    }
}

//#endregion

//#region Facebook

//init facebook
function initFacebook() {
    var count = 7;
    FB.init({
        appId: "988309234528102",
        nativeInterface: CDV.FB,
        useCachedDialogs: false,
        oauth: true
    });
    getLoginStatus();
}

function facebookDismissed() {
    //do nothing
}

//check if user is already log in
function getLoginStatus() {
    FB.getLoginStatus(function (response) {
        if (response.status == 'connected') {
            loginToSroogim(response);
        } else {
            //$.mobile.changePage('index.html');
            facebookLogin();
        }
    });
}

//login to sroogim via facebook
function loginToSroogim(response) {

    //get user birthday 
    try {
        userBirthDay = response.birthday;
    } catch (e) {
        userBirthday = '';
    }

    //get user email
    try {
        userEmail = response.email;
        if (userEmail == undefined) {
            userEmail = 'private';
        }
    } catch (e) {
        userEmail = 'private';
    }

    //get user gender
    try {
        userGender = response.gender;
        if (userGender == undefined) {
            userGender = 'private';
        }
    } catch (e) {
        userGender = 'private';
    }

    //get user full name
    try {
        userFullName = response.first_name + ' ' + response.last_name;
        if (userFullName == '') {
            userFullName = 'private';
        }
    } catch (e) {
        userFullName = 'private';
    }

    //get user profile image
    try {
        userProfilePic = 'http://graph.facebook.com/' + response.id + '/picture?width=171&height=171';
        if (userProfilePic == '') {
            userProfilePic = 'private';
        }
        $('#sidebarProfileImg').css('background-image', 'url("' + userProfilePic + '")');
    } catch (e) {
        userProfilePic = 'private';
    }

    //get user cover image
    try {
        FB.api('/me?fields=cover', function (uCover) {
            if (uCover && !uCover.error) {
                userCoverPic = uCover.cover.source;
                $('#sidebarCoverImg').attr('src', userCoverPic)
            }
        });
    } catch (e) {
        userCoverPic = 'private';
    }
    userPassword = 0;

    //var cfu = chekcFacebookUser();
    //if (cfu == 0) {
    //    registerUserFromFacebook();
    //    $('#userName').text(response.first_name + ' ' + response.last_name);
    //    $.mobile.changePage('index.html#mainScreen');
    //}
    //else if (cfu == 2) {
    //    $('#popupContent').html('<h2>נרשמת כבר בעבר. שכחת סיסמה? אם כן, אנא צור עימנו קשר</h2>');
    //    popupOpen();
    //}

}

function chekcFacebookUser() {
    var json = createUserJsonFromFacebook();
    if (json != '') {
        $.ajax({
            type: "POST",
            url: api + "chekcFacebookUser",
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
                    return result.d;
                }
            }
        });
    }

}

//trigger to facebookLogin()
function loginFromFacebook() {
    facebookLogin();
}

//logout fron facebook
function logoutFromFacebook() {
    try {
        FB.logout(function (response) {
            $.mobile.changePage('index.html');
        });
    } catch (e) {
        $.mobile.changePage('index.html');
    }
}

//login to facebook
function facebookLogin() {
    FB.login(function (response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
                //console.log('Good to see you, ' + response.name + '.');
                if (response && !response.error) {
                    //alert('res: ' + JSON.stringify(response));
                    loginToSroogim(response);
                }
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { scope: 'email, user_birthday, user_location' });
}

//if user alredy log in
FB.Event.subscribe('auth.login', function (response) {
    FB.api('/me', function (a_response) {
        if (a_response && !a_response.error) {
            loginToSroogim(a_response);
        }
        else { facebookLogin(); }
    });
});

$(document).on('click', '#facebookLogin', function () {
    loginFromFacebook();
    userPermision = 'access';
});

$(document).on('click', '.addComment', function () {
    $('#popupContent').html($('#comments-holder').html());
    $('.fb-comments').css('display', 'block !important');
    openPopup();
});

/*<div class="fb-comments" data-numposts="5" data-colorscheme="light"></div>*/

//#endregion

//#region Dates

//create date page
function createDatePage(json) {
    if (json.ShowVideo == 'Y') {
        $('#dateImages').html('<iframe width="100%" height="159" src="' + json.DateVideo.Url + '?rel=0&autoplay=0&controls=0" frameborder="0" allowfullscreen></iframe>');
    }
    else {
        $('#dateImages').html('');
        for (var i = 0; i < json.DateImages.length; i++) {
            $('#dateImages').append('<img src="' + dateImgSrc + json.DateID + '/' + json.DateImages[i].Url + '" />');
        }
        if ($('#dateImages img').length < 4) {
            $('#dateImages').append('<img src="' + dateImgSrc + json.DateID + '/' + json.DateImages[0].Url + '" />');
        }
    }

    var gps = '';
    for (var i = 0; i < gpsAddress.length; i++) {
        if (json.DateID == gpsAddress[i].dateID) {
            gps = gpsAddress[i].lat + ',' + gpsAddress[i].lng;
        }
    }
    //alert('gps: ' + gps);
    $('#singleDate_dateHeader').text(json.DateHeader);
    $('#singleDate_dateLocation').text(json.DateLocation + ' - ' + json.CityName);
    $('#singleDate_dateWebsite').attr('href', json.DateLink);
    $('#gpsButton').attr('href', 'geo:' + gps);
    //$('#gpsButton').attr('date-gps', 'waze://q=' + json.DateGps);
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
    categoriesHTML = '';
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].CategoryType == "Date") {
            categoriesHTML += '<div data-role="collapsible"> <h4>' + categories[i].Text + '<img src="essential/images/Dates/Category/outside.jpg" /> </h4><ul data-role="listview">';
            for (var j = 0; j < categories[i].SubList.length; j++) {
                categoriesHTML += '<li><a data-ajax="false" href="index.html#datesList" data-category-id="' + categories[i].SubList[j].Value + '" class="goToDateList ui-btn ui-shadow ui-btn-icon-right ui-icon-tree">' + categories[i].SubList[j].Text + '</a></li>';
            }
            categoriesHTML += '</ul></div>';
        }

    };
    //alert(html);
});

$(document).on('pagebeforecreate', '#datesPage', function () { $('#datesPage .wrapper').html(categoriesHTML); });

//create dates list
$(document).on('click', '.goToDateList', function () {
    var categoryID = parseInt($(this).attr('data-category-id'));
    //alert(categoryID); alert('GPSADDRESS: ' + JSON.stringify(gpsAddress));
    $('#datesList .wrapper .title h2').text($(this).text());
    var dateLi = '';
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].DateCategory == categoryID) {
            var currentLocation = new google.maps.LatLng(localStorage.getItem('lat'), localStorage.getItem('lng'));
            //alert('cLocation: ' + JSON.stringify(currentLocation));
            calculateDistances(currentLocation, dates[i]);
            dateLi += '<li class="dataItem">' +
                            '<div><img src="essential/images/Favroites/imgFav.png" /></div>' +
                            '<div>' +
                                '<h3>' + thisDate.DateHeader + '</h3>' +
                                '<article>' + thisDate.DateDescription.substring(0, 70) + '</article>' +
                                '<section class="social">' +
                                    '<ul>' +
                                        '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" /></li>' +
                                        '<li><img src="essential/images/General/sharegray.png" class="share" data-share="date" data-id="' + thisDate.DateID + '" alt="שיתוף" /></li>' +
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
    }

    $('.dataList').html(dateLi);
});

//set distance to places
$(document).on('pageshow', '#datesList', function () {
    var num = 7;
    var calcGPS = function () {
        if (num <= 0) {
            //alert($('.distance').length);
            //for (var i = 0; i < $('.distance').length; i++) {
            //    $('.distance')[i].innerHTML = distance[i]
            //}
            //$.mobile.loading('hide');
            disCount = 0;
            $('.distance').each(function () {
                $(this).text(distance[disCount]);
                disCount++;
            });
            $('.findGps').addClass('active');
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
    for (var i = 0; i < dates.length; i++) {
        if (dateID == dates[i].DateID) {
            createDatePage(dates[i]);
        }
    }
});

//apply location view
$(document).on('click', '.findGps, .selectLocation', function () {
    if ($(this).hasClass('findGps')) {
        $('.findGps').addClass('active');
        $('.selectLocation').removeClass('active');
        //$('.goToDateList').click();
        $.mobile.changePage('index.html#datesPage');
    } else {
        $('.selectLocation').addClass('active');
        $('.findGps').removeClass('active');
        $.mobile.changePage('index.html#location');
    }
});

//show dates in city
$(document).on('click', '.city', function () {
    getcurrentlatlong();
    var cityName = $(this).text();
    $('#datesList .wrapper .title h2').text($(this).text());
    var dateLi = '';
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].CityName == cityName) {
            var currentLocation = new google.maps.LatLng(localStorage.getItem('lat'), localStorage.getItem('lng'));
            //alert('cLocation: ' + JSON.stringify(currentLocation));
            calculateDistances(currentLocation, dates[i]);
            dateLi += '<li class="dataItem">' +
                            '<div><img src="essential/images/Favroites/imgFav.png" /></div>' +
                            '<div>' +
                                '<h3>' + thisDate.DateHeader + '</h3>' +
                                '<article>' + thisDate.DateDescription.substring(0, 70) + '</article>' +
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
    email = {
        'userEmail': userEmail,
        'subject': 'הוספת דייט',
        'body': '<div style="direction:rtl; text-align:right;">' + dateHeader + '<br>' + dateWebsite + '<br>' + dateLocation + '<br>' + dateTel + '<br>' + dateDesc + '<br>' + dateTip + '<br>' + dateSteps + '</div>'
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

//go to presents
$(document).on('click', '#goToPresent', function () {
    $.mobile.changePage('index.html#presentsCategories');
});

//date-gps
//$(document).on('click', '#gpsButton', function () {
//    window.location.replace($(this).attr('data-gps'));
//});

//open rating popup
$(document).on('click', '#singleDate .rating', function () {
    $('#popupContent').html('<h2>פופאפ</h2>');
    $('#popup').popup('open');
});

//#endregion

//#region Presents

//create present list
$(document).on('click', '[href="index.html#presentsCategories"]', function () {
    createPresentsCategoriesPage('Women');
});

$(document).on('pagebeforecreate', '#presentsCategories', function () {
    $('#presentsCategories .wrapper').html(categoriesHTML);
});

//go to presents list
$(document).on('click', '.goToPresentsList', function () {
    var categoryID = parseInt($(this).attr('data-category-id'));
    $('#presentsList .wrapper .title h2').text($(this).text());
    var presentLi = '';
    for (var i = 0; i < presents.length; i++) {
        if (presents[i].PresentCategory == categoryID) {
            presentLi = '<li class="dataItem">' +
                            '<div><img src="essential/images/Favroites/imgFav.png" /></div>' +
                            '<div>' +
                                '<h3>' + presents[i].PresentHeader + '</h3>' +
                                '<article>' + presents[i].PresentDescription.substring(0, 70) + '</article>' +
                                '<section class="social">' +
                                    '<ul>' +
                                        '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" /></li>' +
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
    if (presentLi == '') {
        presentLi = 'אין מתנות בקטגוריה זו';
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

    $('#presentsCategories .wrapper').html(categoriesHTML);
    $.mobile.changePage('#presentsCategories');
});

//show present page
$(document).on('click', '.goToPresent', function () {
    var presentID = parseInt($(this).attr('data-present-id'));
    for (var i = 0; i < presents.length; i++) {
        if (presentID == presents[i].PresentID) {
            createPresentPage(presents[i]);
        }
    }
});

//send present offer
$(document).on('click', '#presentSend', function () {
    presentHeader = 'כותרת המתנה: ' + $('#presentHeader').val();
    presentDesc = 'תיאור המתנה: ' + $('#presentDesc').val();
    presentTip = 'טיפ: ' + $('#presentTip').val();;
    email = {
        'userEmail': userEmail,
        'subject': 'הוספת מתנה',
        'body': '<div style="direction:rtl; text-align:right;">' + presentHeader + '<br>' + presentDesc + '<br>' + presentTip + '</div>'
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

//create present page
function createPresentPage(json) {
    if (json.ShowVideo == 'Y') {
        $('#presentImages').html('<iframe width="100%" height="159" src="' + json.PresentVideo.Url + '?rel=0&autoplay=0&controls=0" frameborder="0" allowfullscreen></iframe>');
    }
    else {
        $('#presentImages').html('');
        for (var i = 0; i < json.DateImages.length; i++) {
            $('#presentImages').append('<img src="' + presentImgSrc + json.PresentID + '/' + json.PresentImages[i].Url + '" />');
        }
        if ($('#presentImages img').length < 4) {
            $('#presentImages').append('<img src="' + presentImgSrc + json.PresentID + '/' + json.PresentImages[0].Url + '" />');
        }
    }

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
        sellerLi += '<div><img src="' + presentImgSrc + json.PresentID + '/seller/' + json.PresentSeller[i].Url + '" /></div>';
    }
    $('#presentsSeller').html(sellerLi);
}

function createPresentsCategoriesPage(gender) {
    categoriesHTML = '<ul class="dataList">';
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].CategoryType == "Present" && categories[i].CategoryGender == gender) {
            categoriesHTML += '<li class="dataItem presentCategory"><div><img src="essential/images/Presents/Category/neckles.jpg" /></div>' +
              '<div><h3>' + categories[i].Text + '</h3><article>' + categories[i].CategoryDescription.substring(0, 70) + '</article></div>' +
              '<div><a data-ajax="false" href="index.html#presentsList" class="goToPresentsList" data-category-id="' + categories[i].Value + '"><img src="essential/images/Favroites/arrow_gray.png" /></a></div>';
        }
    }
    categoriesHTML += '</ul>';
}

//#endregion

//#region Popup

function openPopup() {
    $('#popup').popup('open', { transition: 'slidedown' });
}

function closePopup() {
    $('#popup').popup('close', { transition: 'slideup' });
}

//#endregion

//#region Share

$(document).on('click', '.share', function () {
    var share = '';
    if ($(this).attr('data-share') == 'date') {
        share = getDateForShare(parseInt($(this).attr('data-id')));
    }
    else {
        share = getPresentForShare(parseInt($(this).attr('data-id')));
    }
    //alert('share: ' + share);
    window.plugins.socialsharing.share(share + 'נשלח מאפליקציית SROOGIM');
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
        newsLi += '<a data-ajax="false" href="index.html#newsPage" class="ui-link">' + json[i].Header + '</a>';
    }

    $('#news #newsContainer div div').html(newsLi);
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
                            '<article>' +
                                '<header>' +
                                    '<h3>' + json[i].Header + '</h3>' +
                                '</header>' +
                                '<p>' + json[i].Description + '</p>' +
                           '</article>' +
                       '</div>' +
                    '</div>'
    }

    $('#newsPage .wrapper').html(newsDiv);
}

//#endregion

//#region Permission

function showPermission() {
    if (userPermision == '') {
        event.preventDefault();
        $('#popupContent').html('<h2>לצפייה באפשרות זו, יש לבצע הרשמה</h2>');
        openPopup();
    }
}

$(document).on('click', '#panelLinks a, .ideas [href="index.html#addDate"], .ideas [href="index.html#addPresent"], .ideas [href="index.html#favorites"]', function () {
    showPermission();
});


//#endregion

//#region Register

//register to sroogim
$(document).on('click', '#register-button', function () {
    var json = createUserJson();
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
                    userPermision = 'access';
                    var n = 3;
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

    if ($('#uploadCoverImg').attr('src') != '') {
        images.data.push($('#uploadCoverImg').attr('src'));
        if ($('#uploadCoverImg').next().val() == '') {
            var array = $('#uploadCoverImg').attr('src').split('/');
            var last = array[array.length - 1];
            images.name.push(last);
        }
        else {
            images.name.push($('#uploadCoverImg').next()[0].files[0].name);
        }
    }

    if ($('#uploadProfileImg').css('background-image') != '') {
        images.data.push($('#uploadProfileImg').css('background-image'));
        if ($('#uploadProfileImg').next().val() == '') {
            var array = $('#uploadProfileImg').css('background-image').split('/');
            var last = array[array.length - 1];
            images.name.push(last);
        }
        else {
            images.name.push($('#uploadProfileImg').next()[0].files[0].name);
        }
    }

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
    userProfilePic = images.name[1];
    userCoverPic = images.name[0];

    return user;
}

function registerUserFromFacebook() {
    var json = createUserJsonFromFacebook();
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
                    userPermision = 'access';
                    var n = 3;
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

//#endregion

//#region Favorits

//clisk on fav icon
$(document).on('click', '[data-fav]', function () {
    if ($(this).attr('data-fav') == 'dates') {
        getUserFavoritsDates();
    }
    else {
        getUserFavoritsPresents();
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
                alert(result.d);
            }
            else {
                favDates = JSON.parse(result.d);
                createFavDatePage(favDates);
            }
        }
    });
}

function createFavDatePage(json) {
    var dateLi = '';
    try {
        for (var i = 0; i < dates.length; i++) {
            if (dates[i].DateID == json[i].DateID) {
                dateLi += '<li class="dataItem">' +
                                '<div>' +
                                    '<h3>' + thisDate.DateHeader + '</h3>' +
                                    '<article>' + thisDate.DateDescription.substring(0, 70) + '</article>' +
                                    '<section class="social">' +
                                        '<ul>' +
                                            '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" /></li>' +
                                            '<li><img src="essential/images/General/sharegray.png" class="share" data-share="date" data-id="' + thisDate.DateID + '" alt="שיתוף" /></li>' +
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
                alert(result.d);
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
                                            '<li><img src="essential/images/General/fav.png" class="addToFav" alt="הוספה למועדפים" /></li>' +
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