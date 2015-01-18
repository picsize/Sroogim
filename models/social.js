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
            //removeFavorite();
        }
        else {
            $(this).attr('src', 'essential/images/General/favHover.png');
            //AddFavorite();
        }
            
    });
});