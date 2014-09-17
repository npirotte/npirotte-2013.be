/* code by n.pirotte */

;function contactFotmCtrl($form, url)
{

    var $alert = $form.find('.error-summary');

    $form.submit(function()
    {
        formSubmit();
        return false;
    });

    function cleanErrors()
    {
        $form.find('.formfield-alert').remove();
    }

    function formErrors(message, error_list)
    {
        cleanErrors();

        $alert
            .removeClass()
            .addClass('alert alert-danger')
            .html(message)
            .fadeIn();

        // gestion des erreurs
        error_list.forEach(function(value)
        {
            var field = value.field_name,
                error = '<div class="formfield-alert label label-danger">' + value.message + '</div>';

            $('[name="' + field + '"').after(error);
        });
    }

    function formSuccess(message)
    {
        cleanErrors();

        $alert
            .removeClass()
            .addClass('alert alert-success')
            .text(message)
            .fadeIn();

        $form.clearForm();
    }

    function formSubmit()
    {
         $.ajax({
            url: url, // le nom du fichier indiqué dans le formulaire
            type: 'POST', // la méthode indiquée dans le formulaire (get ou post)
            data: $form.serialize(), // je sérialise les données (voir plus loin), ici les $_POST,
            dataType: 'json',
            success: function(data) { // je récupère la réponse du fichier PHP
                console.log(data);
                if (data.error == 1) {
                    formErrors(data.message, data.error_list);
                }
                else
                {
                    formSuccess(data.message);
                }
            }
        });
    }
}

// clear form function ///////////////////////////////////////////

$.fn.clearForm = function() {
    return this.each(function() {
        var type = this.type,
            tag = this.tagName.toLowerCase();
        if (tag == 'form') return $(':input', this).clearForm();
        if (type == 'text' || type == 'password' || tag == 'textarea') this.value = '';
        else if (type == 'checkbox' || type == 'radio') this.checked = false;
        else if (tag == 'select') this.selectedIndex = -1;
    });
};

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


// ajaxify

(function($)
{

    var currentUrl,
        $body = $('body');

    function ajaxify()
    {
        $(document).on(
            'click',
            'a',
            function(e)
            {
                var $self = $(this),
                    url = $self.attr('href');

                if (url 
                    && !$self.hasClass('no-ajax')
                    && $self.attr('target') != "_blank"
                    && $self.attr('target') != "blank"
                    //&& uri.match(/http/)
                    && !url.match(/mailto:/)
                     /* plus exeptions */) {
                    e.preventDefault();
                    window.getPage($('#container'), url);
                };
            }
        )
    }

    window.getPage = function($target, url)
    {
       $.ajax({
        url: url,
        cache: true,
        dataType: 'html',
        beforeSend : function()
        {
            var stateObj = { foo: 1000 + Math.random()*1001 };
            try
            {
                history.pushState(stateObj, "ajax page loaded...", url);
            }
            catch(e)
            {
                console.log(e);
                window.location.href = url;
            }

            $body.addClass('loading');
            $target
                .removeClass('loaded')
                .addClass('go-out');
        },
        success: function(data)
        {
            currentUrl = window.location.pathname;
            
            $target.html(data);

            $('html, body').animate({ scrollTop: 0}, 0);

            $target
                .removeClass('go-out')
                .addClass('loaded');

            $('#main-menu').manageActiveLinks();

            //var stateObj = { foo: 1000 + Math.random()*1001 };
            //history.pushState(stateObj, "ajax page loaded...", url);

            //window.onpopstate = getPage(history.location || document.location)
        },
        complete : function(data)
        {
            $body.removeClass('loading');
        },
        error: function(data)
        {
            //alert('Erreur lors du chargement de la page');
        }
       });
    }

    window.onpopstate = function(e) { 
        if (currentUrl && currentUrl != window.location.pathname) {
            getPage($('#container'), window.location.href);
        };
    }

    $(document).ready(function(){
        ajaxify();
    })

})(jQuery);

