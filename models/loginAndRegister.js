/*
    Sroogim login and register js File
    V 1.0
    (C) 2014 Picsize - Be Exclusive
*/

$(function () {

    //set device ready event
    document.addEventListener("deviceready", function () {
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
                    // run when condition is met
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
            }
            check();
        }

    }, false);

    //click on facebook login button
    $(document).on('click', '#facebookLogin', function () {
        loginFromFacebook();
    });

    //upload cover img
    $(document).on('click', '#uploadCoverImg', function () {
        showImgPreview('cover');
    })

    //upload profile img
    $(document).on('click', '#uploadProfileImg', function () {
        showImgPreview('profile');
    })

});

//#region Facebook Login

function facebookDismissed() {
    //do nothing
}

//load facebook plugin
function loadFacebook() {
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

//#region Register Form -> Upload Images

function showImgPreview(type) {
    if (type === 'cover') {
        navigator.camera.getPicture(showCover, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    }
    else {
        navigator.camera.getPicture(showProfile, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    }
}

function showCover(imageURI) {
    $('#uploadCoverImg').attr('src', imageURI)
}

function showProfile(imageURI) {
    $('#uploadProfileImg').css('background-image', 'url(' + imageURI + ')');
}

function onFail(message) {
    alert('Failed because: ' + message);
}

//#endregion







