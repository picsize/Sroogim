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
                        text: 'טוען...' + count,
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

    //
    $(document).on('touch', '#facebookLogin', function () {
        alert('enter to facebookLogin event');
        loginFromFacebook();
    });
});

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

//login to chuz via facebook
function loginToSroogim(response) {
    navigator.notification.alert('התחברת בהצלחה.', facebookDismissed, 'Sroogim', 'אישור');
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
                    loginToChuz(response);
                }
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, //{ scope: 'email, user_birthday, user_location' });
    { scope: 'user_location' });
}

