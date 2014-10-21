/*
    Sroogim login and register js File
    V 1.0
    (C) 2014 Picsize - Be Exclusive
*/

$(function () {
    checkFacebookPhonegap();

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
        //alert('enter to facebookLogin event');
        loginFromFacebook();
    });

    //upload cover img
    $(document).on('click', '.uploadCoverImg', function () {
        $(this).next('.coverImgFile').click();
        //$('.coverImgFile').click();
    })

    //upload profile img
    $(document).on('click', '.uploadProfileImg', function () {
        $('.profileImgFile').click();
    })

    //display cover image
    $('.coverImgFile').change(function () {
        //showImgPreview(this, 'cover');
        showImgPreview('cover');
    });

    //display profile image
    $('.profileImgFile').change(function () {
        //showImgPreview(this, 'profile');
        showImgPreview('profile');
    });
});

//#region Facebook Login

function checkFacebookPhonegap() {
    if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
    if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
}

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






