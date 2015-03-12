//#region Upload Images

function showImgPreview(type, elem) {

    localStorage.setItem('supplier', elem);

    if (type === 'cover') {
        navigator.camera.getPicture(showCover, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    }
    else if (type === 'supplier') {
        navigator.camera.getPicture(showSupplier, onFail, {
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
    $('#uploadCoverImg').attr('src', imageURI);
    $('#profile_coverImg').attr('src', imageURI);
    userCoverPic = imageURI;
    //alert('userCoverPic:\n' + userCoverPic);
}

function showProfile(imageURI) {
    $('#uploadProfileImg').css('background-image', 'url(' + imageURI + ')');
    $('#profile_profileImg').css('background-image', 'url(' + imageURI + ')');
    userProfilePic = imageURI;
    //alert('userProfilePic:\n' + userProfilePic);
}

function showSupplier(imageURI, elem) {
    //document.getElementById("result").innerHTML = localStorage.getItem("lastname");
    $(elem).attr('src', imageURI);
}

function onFail(message) {
    alert('Failed because: ' + message);
}

//#endregion