
api = 'http://www.sroogim.co.il/SroogimCMS/app/api/Default.aspx/';
//api = '../SroogimCMS/app/api/Default.aspx/';
var dates, presents, categories, locations, lat, lng, thisDate;
var subCategories = [], gpsAddress = [], distance = [];
var userEmail = 'zlihi6@gmail.com';

document.addEventListener("deviceready", initApp, false);

//$(function () {
//    initApp();
//});

function initApp() {
    $('#menuSidebar').panel().enhanceWithin(),
    $('#newsContainer p').marquee(),
    checkPhonegap(),
    getAllDates(),
    getAllPresents(),
    getAllCategories(),
    //getAllLocations()
    initFacebook();
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
        }
    }).done(function (result) {
        dates = JSON.parse(result.d);
        //alert('DATES: ' + JSON.stringify(dates));
        for (var i = 0; i < dates.length; i++) {
           // alert('i=' + i);
            codeAddress(dates[i].DateGps, dates[i].DateID);
        }
        //alert('done: ' + JSON.stringify(gpsAddress));
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

//#endregion

//#region GPS & Location

//get my current location
function getcurrentlatlong() {

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
            alert('dGps: ' + JSON.stringify(dGps));
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
    var devicePlatform = device.platform;
    if (devicePlatform.toLowerCase().indexOf('ios') != -1) {
        if (navigator.userAgent.match(/(iPad.*|iPhone.*|iPod.*);.*CPU.*OS 7_\d/i)) {
            StatusBar.hide();
        }
    }

    if (!window.jQuery) {
        //deviceOffline();
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

function facebookDismissed() {
    //do nothing
}

//load facebook plugin
function loadFacebook() {
    //alert('load facebook');
    try {
        FB.init({
            appId: "988309234528102",
            nativeInterface: CDV.FB,
            useCachedDialogs: false,
            oauth: true
        });
        getLoginStatus();
    } catch (e) {
        navigator.notification.alert('לא ניתן להתחבר לפייסבוק. אנא נסו שוב.', facebookDismissed, 'SROOGIM', 'אישור');
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
    alert('hello ' + response.first_name + ' ' + response.last_name + '. url = ' + response.picture.data.url);
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
            //FB.api('/me/picture', {
            //    'redirect': false,
            //    'height': '200',
            //    'type': 'normal',
            //    'width': '200'
            //}, function (response) {
            //    if (response && !response.error) {
            //        alert('f url: ' + response.url);
            //    }
            //    else { alert('no image'); }
            //});
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { scope: 'user_location' }); //{ scope: 'email, user_birthday, user_location' });
}

//if user alredy log in
FB.Event.subscribe('auth.login', function (response) {
    FB.api('/me', function (a_response) {
        if (a_response && !a_response.error) {
            loginToSroogim(a_response);
        }
    });
    //FB.api('/me/picture', {
    //    'redirect': false,
    //    'height': '200',
    //    'type': 'normal',
    //    'width': '200'
    //}, function (response) {
    //    if (response && !response.error) {
    //        alert('f url: ' + response.url);
    //    }
    //    else { alert('no image'); }
    //});
});

$(document).on('click', '#facebookLogin', function () {
    loginFromFacebook();
});

//#endregion

//#region Dates

//create date page
function createDatePage(json) {
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
    //$('#gpsButton').attr('date-gps', 'geo:' + gps);
    $('#gpsButton').attr('href', 'waze://q=' + json.DateGps);
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
    //alert(html);
    $('#datesPage .wrapper').html(html);
});

//create dates list
$(document).on('click', '.goToDateList', function () {
    getcurrentlatlong();
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
        dateLi = 'אין מקומות בילוי בקטגוריה זו';
    }

    $('.dataList').html(dateLi);
});

//set distance to places
$(document).on('pageshow', '#datesList', function () {
    var num = 5;
    var clacGPS = function () {
        if (num <= 0) {
            $.mobile.loading('hide');
            $('.distance').each(function () {
                var j = 0;
                $(this).text(distance[j]);
                j++;
            });
            //$('.findGps').addClass('active');
        }
        else {
            num--;
            setTimeout(clacGPS, 1000);
        }
    };
    clacGPS();

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
                    from_email: userEmail,
                    to: [{
                        email: 'zlihi6@gmail.com',
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

//#endregion

//#region Presents

//create present list
$(document).on('pagebeforecreate', '#presentsList', function () {
    var presentLi = '';
    for (var i = 0; i < presents.length; i++) {
        presentLi += '<li class="dataItem">' +
                        '<div><img src="essential/images/Presents/Category/neckles.jpg" /></div>' +
                        '<div>' +
                            '<h3>' + presents[i].PresentHeader + '</h3>' +
                            '<article>' + presents[i].PresentDescription.substring(0, 70) + '</article>' +
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
                            '<a data-ajax="false" href="index.html#singlePresent" class="goToPresent" data-present-id="' + presents[i].PresentID + '">' +
                                '<img src="essential/images/Favroites/arrow_gray.png" /></a>' +
                        '</div>' +
                        '</li>';
    }
    $('.dataList').html(presentLi);
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
                    from_email: userEmail,
                    to: [{
                        email: 'zlihi6@gmail.com',
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
    $('#singlePresent_presentHeader').text(json.PresentHeader);
    $('#singlePresent_presentDesc').text(json.PresentDescription);
    if (json.PresentTip != '') {
        $('#singlePeresent_presentTip').text(json.PresentTip);
    }
    else {
        $('#singlePeresent_presentTip').parent().parent().hide();
    }
}


//#endregion

