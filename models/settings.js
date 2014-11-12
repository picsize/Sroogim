$(function () {
    checkPhonegap();

    $('#menuSidebar').panel().enhanceWithin();
    $('#newsContainer p').marquee();
});

function checkPhonegap() {
    if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
    if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
}


//$(document).on('pagebeforecreate', '#datesPage', function () {
//    $('#datesPage .wrapper').append('<div data-role="collapsible"> <h4>דייטים באוויר הצח2 <img src="essential/images/Dates/Category/outside.jpg" /> </h4> <ul data-role="listview"> <li><a href="index.html#singleDate" data-dateId="1" class="goToDate ui-btn ui-shadow ui-btn-icon-right ui-icon-tree">טיילות</a></li> <li><a href="index.html#singleDate" data-dateId="1" class="goToDate ui-btn ui-shadow ui-btn-icon-right ui-icon-ship">מעיינות</a></li> <li><a href="index.html#singleDate" data-dateId="1" class="goToDate ui-btn ui-shadow ui-btn-icon-right ui-icon-old">מקומות עתיקים</a></li> </ul> </div>');
//})



