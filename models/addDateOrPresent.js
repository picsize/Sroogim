$(function () {
    $(document).on('click', '.uploadPresentSupplier', function () {
        showImgPreview('supplier', $(this));
    });

    $(document).on('click', '#addDateImage, #addPresentImage', function () {
        showImgPreview('add', $(this));
    });
});