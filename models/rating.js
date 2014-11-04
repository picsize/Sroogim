$(function () {
    $(document).on('click', '.rating span', function() {
        alert($(this).attr('data-value'));
    });

});