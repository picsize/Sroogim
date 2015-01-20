
api = 'http://www.sroogim.co.il/SroogimCMS/app/api/Default.aspx/';
//api = '../SroogimCMS/app/api/Default.aspx/';
var date, present, categories, geocoder, distance;
var subCategories = [], gpsAddress = [];
//var bounds = new google.maps.LatLngBounds();

document.addEventListener("deviceready", initApp, true);

//$(function () {
//    initApp();
//});

function initApp() {
    $('#menuSidebar').panel().enhanceWithin();
    $('#newsContainer p').marquee();

    checkPhonegap();
    getAllDates();
    getAllPresents();
    getAllCategories();
    initGps();
    initLogin();
}

function initLogin() {
    alert('login register');
    var count = 7;
    var devicePlatform = device.platform;
    if (devicePlatform.toLowerCase().indexOf('ios') != -1) {
        if (navigator.userAgent.match(/(iPad.*|iPhone.*|iPod.*);.*CPU.*OS 7_\d/i)) {
            StatusBar.hide();
        }
    }

    if (!window.jQuery) {
        deviceOffline();
    }
    else {
        var check = function () {
            if (count <= 0) {
                $.mobile.loading('hide');
                loadFacebook();
            }
            else {
                count--;

                $.mobile.loading('show', {
                    text: count,
                    textVisible: true,
                    theme: 'a',
                    textonly: false
                });

                setTimeout(check, 1000); // check again in a second
            }
        };
        check();
    }
}

//#region Facebook Login

function facebookDismissed() {
    //do nothing
}

//load facebook plugin
function loadFacebook() {
    alert('load facebook');
    try {
        FB.init({
            appId: "988309234528102",
            nativeInterface: CDV.FB,
            useCachedDialogs: false,
            oauth: true
        });
        getLoginStatus();
    } catch (e) {
        navigator.notification.alert('לא ניתן להתחבר לפייסבוק. אנא נסו שוב.', facebookDismissed, 'Sroogim', 'אישור');
    }
}

//check if user is already log in
function getLoginStatus() {
    FB.getLoginStatus(function (response) {
        if (response.status == 'connected') {
            loginToSroogim(response);
        } else {
            $.mobile.changePage('index.html');
        }
    });
}

//login to sroogim via facebook
function loginToSroogim(response) {
    //navigator.notification.alert('התחברת בהצלחה.', facebookDismissed, 'Sroogim', 'אישור');
    //alert('hello ' + response.first_name + ' ' + response.last_name);
    $.mobile.changePage('index.html#mainScreen');
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
                    loginToSroogim(response);
                }
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, //{ scope: 'email, user_birthday, user_location' });
    { scope: 'user_location' });
}

//if user alredy log in
FB.Event.subscribe('auth.login', function (response) {
    FB.api('/me', function (a_response) {
        if (a_response && !a_response.error) {
            loginToSroogim(a_response);
        }
    });
});

//#endregion

//check phonegap components
function checkPhonegap() {
    if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
    if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
}

function initGps() {
    geocoder = new google.maps.Geocoder();
}

//get my current location
function getcurrentlatlong() {

    if (navigator.geolocation) {
        console.log("navigator.geolocation is supported");
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
    }
    else {
        console.log("navigator.geolocation not supported");
    }
}

//success to get my location
function onSuccess(position) {
    //console.log("onSuccess called");
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    //myLocation = new google.maps.LatLng(lat, lng);
    localStorage.setItem('lat', lat);
    localStorage.setItem('lng', lng);
    //console.log("latitude is: " + lat + " longitude is: " + lng);
}

//error while getting my location
function onError(error) {
    //console.log("Getting the error" + error.code + "\nerror mesg :" + error.message);
}

//convert date location to lat & lng
function codeAddress(address, dateID) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var dGps = {
                'dateID': dateID,
                'lat': results[0].geometry.location.k,
                'lng': results[0].geometry.location.D
            };
            alert('dGps: ' + JSON.stringify(dGps));
            gpsAddress.push(dGps);
        } else {
            return address
        }
    });
}

//calculate the distance between my curret location to date location
function calculateDistances(myLocation, dateLocation) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
          origins: [myLocation],
          destinations: [dateLocation],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
      }, setDistance);
}

//set the distance in the app
function setDistance(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
        console.log('Error was: ' + status);
    } else {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        //console.log('d: ' + destinations);

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                distance = results[j].distance.text.replace('km', 'ק"מ');
                //console.log('text: ' + results[j].distance.text);
                //localStorage.setItem('distance', results[j].distance.text.replace('km', 'ק"מ'));
                //console.log('c: ' + localStorage.getItem('distance'));
            }
        }
    }
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
            alert('DATES: ' + JSON.stringify(date));
            for (var i = 0; i < date.length; i++) {
                codeAddress(date[i].DateGps, date[i].DateID);
            }
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
            alert('PRESENTS: ' + JSON.stringify(present));
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
            alert('CATEGORIES: ' + JSON.stringify(categories));
        }
    });
}

//create date page
function createDatePage(json) {
    var gps = '';
    for (var i = 0; i < gpsAddress.length; i++) {
        if (json.DateID == gpsAddress[i].dateID) {
            gps = gpsAddress[i].lat + ',' + gpsAddress[i].lng;
        }
    }
    alert('gps: ' + gps);
    $('#singleDate_dateHeader').text(json.DateHeader);
    $('#singleDate_dateLocation').text(json.DateLocation + ' - ' + json.CityName);
    $('#singleDate_dateWebsite').attr('href', json.DateLink);
    $('#gpsButton').attr('date-gps', 'geo:' + gps);
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
}

//create present page
function createPresentPage(json) {
    $('#singlePresent_presentHeader').text(json.PresentHeader);
    $('#singlePresent_presentDesc').text(json.PresentDescription);
    if (json.PresentTip != '') {
        $('#singlePeresent_presentTip').text(json.PresentTip);
    }
    else {
        $('#singlePeresent_presentTip').parent().parent().hide();
    }
}

//create date categories
$(document).on('click', '[href="index.html#datesPage"]', function () {
    var html = '';
    for (var i = 0; i < categories.length; i++) {
        html += '<div data-role="collapsible"> <h4>' + categories[i].Text + '<img src="essential/images/Dates/Category/outside.jpg" /> </h4><ul data-role="listview">';
        for (var j = 0; j < categories[i].SubList.length; j++) {
            html += '<li><a data-ajax="false" href="index.html#datesList" data-category-id="' + categories[i].SubList[j].Value + '" class="goToDateList ui-btn ui-shadow ui-btn-icon-right ui-icon-tree">' + categories[i].SubList[j].Text + '</a></li>';
        }
        html += '</ul></div>';
    };
    alert(html);
    $('#datesPage .wrapper').html(html);
});

//create dates list
$(document).on('click', '.goToDateList', function () {
    getcurrentlatlong();
    var categoryID = parseInt($(this).attr('data-category-id'));
    alert(categoryID); alert('GPSADDRESS: ' + JSON.stringify(gpsAddress));
    $('#datesList .wrapper .title h2').text($(this).text());
    var dateLi = '';
    for (var i = 0; i < date.length; i++) {
        if (date[i].DateCategory == categoryID) {
            var currentLocation = new google.maps.LatLng(localStorage.getItem('lat'), localStorage.getItem('lng'));
            calculateDistances(currentLocation, date[i].DateGps);
            dateLi += '<li class="dataItem">' +
                            '<div><img src="essential/images/Favroites/imgFav.png" /></div>' +
                            '<div>' +
                                '<h3>' + date[i].DateHeader + '</h3>' +
                                '<article>' + date[i].DateDescription.substring(0, 70) + '</article>' +
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
                                            '<p>' + distance + ' ממקומך' + '</p>' +
                                        '</li>' +
                                    '</ul>' +
                                '</section>' +
                            '</div>' +
                            '<div>' +
                                '<a data-ajax="false" href="index.html#singleDate" class="goToDate" data-date-id="' + date[i].DateID + '">' +
                                    '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                            '</div>' +
                            '</li>';
        }
    }
    if (dateLi == '') {
        dateLi = 'אין מקומות בילוי בקטגוריה זו';
    }
    alert('DISTANCE: ' + distance)
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

//apply location view
$(document).on('click', '.findGps, .selectLocation', function () {
    if ($(this).hasClass('findGps')) {
        $(this).addClass('active');
        $('.selectLocation').removeClass('active');
    } else {
        $(this).addClass('active');
        $('.findGps').removeClass('active');
    }
});



