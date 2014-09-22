
// kill the modals //
function closeModal()
 {
    $('.modal').fadeOut();
}


// active classes managements

(function()
{
    $.fn.manageActiveLinks = function()
    {
        var currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/#*/, '');
        $(this).each(function()
        {
            var $_this = $(this);

            // reset des links
            $_this.find('.active').removeClass('active');

            // application des liens
            $_this.find('a[href="'+currentUrl+'"]')
                .addClass('active')
                .parent()
                .addClass('active');

        });

        return $(this);
    }
})();
