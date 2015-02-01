$(function () {

    //rating
    $(document).on('click', '.rating.clickable span', function() {
        //alert($(this).attr('data-value'));
        //updateRating(parseInt($(this).attr('data-value')));
    });

    //favorite
    $(document).on('click', '.addToFav', function () {
        if ($(this).attr('src').indexOf('favHover') != -1) {
            $(this).attr('src', 'essential/images/General/fav.png');
            $('#popupContent').html('<h2>הוסר מהמועדפים בהצלחה</h2>');
            openPopup();
            //var favPopup = setInterval(function () { closePopup() }, 2000);

            
            //removeFavorite();
        }
        else {
            $(this).attr('src', 'essential/images/General/favHover.png');
            $('#popupContent').html('<h2>נוסף למועדפים בהצלחה</h2>');
            openPopup();
            function closeFavPopup() {
                $('#popup').popup('close');
            }
            //var favPopup = setInterval(function () { closePopup() }, 2000);
            //AddFavorite();
        }
            
    });
});