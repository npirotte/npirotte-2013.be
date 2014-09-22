var FormCtrl;

;(function()
{
	FormCtrl = function($form, url)
	{
		var _this = this;
		this.$form = $form;
		this.$alert = $form.find('.error-summary');
		this.url = url;

		this.$form.submit(function()
	    {
	        _this.Submit();
	        return false;
	    });

	}

	FormCtrl.prototype.CleanErrors = function()
	{
		this.$form.find('.formfield-alert').remove();
	}

	FormCtrl.prototype.Success = function(message)
	{
		this.CleanErrors();

        this.$alert
            .removeClass()
            .addClass('alert alert-success')
            .text(message)
            .fadeIn();

        this.CleanForm();
	}

	FormCtrl.prototype.Error = function(message, error_list)
	{
		var _this = this;

		this.CleanErrors();

        this.$alert
            .removeClass()
            .addClass('alert alert-danger')
            .html(message)
            .fadeIn();

        // gestion des erreurs
        error_list.forEach(function(value)
        {
            var field = value.field_name,
                error = '<div class="formfield-alert label label-danger">' + value.message + '</div>';

            _this.$form.find('[name="' + field + '"]').after(error);
        });
	}

	FormCtrl.prototype.Submit = function()
	{
		var _this = this;

		$.ajax({
            url: _this.url, // le nom du fichier indiqué dans le formulaire
            type: 'POST', // la méthode indiquée dans le formulaire (get ou post)
            data: _this.$form.serialize(), // je sérialise les données (voir plus loin), ici les $_POST,
            dataType: 'json',
            success: function(data) { // je récupère la réponse du fichier PHP
                console.log(data);
                if (data.error == 1) {
                    _this.Error(data.message, data.error_list);
                }
                else
                {
                    _this.Success(data.message);
                }
            }
        });
	}

    FormCtrl.prototype.CleanForm = function()
    {
        var _this = this,
            $inputs = this.$form.find(':input');

        $inputs.each(function()
        {
            var type = this.type,
                tag = this.tagName.toLowerCase();

            if (tag == 'form') return $(':input', this).clearForm();
            if (type == 'text' || type == 'password' || tag == 'textarea') this.value = '';
            else if (type == 'checkbox' || type == 'radio') this.checked = false;
            else if (tag == 'select') this.selectedIndex = -1;
        });
    }

})();