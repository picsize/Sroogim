$(function () {

    //rating
    $(document).on('click', '.rating.clickable span', function () {
        //alert($(this).attr('data-value'));
        //updateRating(parseInt($(this).attr('data-value')));
    });

    //favorite
    $(document).on('click', '.addToFav', function () {
        if (userPermision == '') {
            $('#popupContent').html('<h2>על מנת להוסיף למועדפים, יש לבצע הרשמה</h2>');
            openPopup();
        }
        else {
            if ($(this).attr('src').indexOf('favHover') != -1) {
                $(this).attr('src', 'essential/images/General/fav.png');
                $('#popupContent').html('<h2>הוסר מהמועדפים בהצלחה</h2>');
                openPopup();
                //removeFavorite();     
            }
            else {
                $(this).attr('src', 'essential/images/General/favHover.png');
                $('#popupContent').html('<h2>נוסף למועדפים בהצלחה</h2>');
                openPopup();
                function closeFavPopup() {
                    $('#popup').popup('close');
                }
                //AddFavorite();
            }
        }
    });
});