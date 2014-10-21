/*
    Sroogim upload images js File
    V 1.0
    (C) 2014 Picsize - Be Exclusive
*/
$(function () {

    //#region Register Form

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
        $('.uploadCoverImg').attr('src', imageURI)
    }

    function showProfile(imageURI) {
        $('.uploadProfileImg').css('background-image', 'url(' + imageURI + ')');
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }

    //#endregion

});

