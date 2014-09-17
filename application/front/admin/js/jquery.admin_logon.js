function errorEffect () {
        $('#container').unblock()/*.effect("shake")*/;
    }

(function($) {
    "use strict";

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

    function logonCtrl()
    {
        var $userList = $('#browser-users'),
            $users = $userList.find('.user');

        console.log($users);

        $users.click(function(event)
        {
            $('#inputName').val('');
            $('#inputPwd').val('');
            
            var $self = $(this),
                userName = $self.attr('data-username');

            if (userName) 
            {
                $('#inputName').val(userName);
                $('.hide-for-existing').addClass('hide');
                setTimeout(function(){
                    $('#inputPwd').focus();
                }, 1);
            }
            else
            {
                $('.hide-for-existing').removeClass('hide');
                setTimeout(function(){
                    $('#inputName').focus();
                }, 1);
            }
             

            $('body').addClass('user-selected');
            $self.addClass('selected'); 
            
        });

        $('#back').click(function(event)
        {
            event.preventDefault();

            $('body').removeClass('user-selected');
            $users.removeClass('selected');
        });
    }

    logonCtrl();

    // ajax contactform ////////////////////////////////////////////////

    $('.ajax-form').submit(function () {
        // je récupère les valeurs
            var name = $('#inputName').val(),
                mail = $('#inputEmail').val(),
                $alertContainer = $('#alert'),
                $container = $('#container'),
                errorTmpl = '<div class="alert alert-danger"><span>{{message}}</span></div>';

            $container.removeClass('error');

            if(mail == '' || name == '') {
                $alertContainer.html('<div class="alert alert-danger">Tous les champs doivent êtres remplis.</div>');
                $container.addClass('error');
                $alertContainer.fadeIn();
            } else {
                $container.block({ message: '<div class="spinner"></div>', css: { backgroundColor: 'transparent', border: 0, opacity: 0.6}, overlayCSS: { backgroundColor: '#fff' } });
                // appel Ajax
                $.ajax({
                    url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                    type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                    data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                    success: function(data) { // je récupère la réponse du fichier PHP
                        data = jQuery.parseJSON(data);
                        console.log(data);
                        if (data.error === 1) {
                            var alert = errorTmpl.replace('{{message}}', data.message);

                            $('#container')
                                .addClass('error')
                                .unblock();

                            $alertContainer
                                .hide(0)
                                .html(alert)
                                .fadeIn(1000);
                        }
                        else
                        {
                            $alertContainer.hide(0);
                            window.location.reload();
                        }
                    }
                });
            }

            return false;
    });

})(jQuery);