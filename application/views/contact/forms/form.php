

<?=form_open('', $form_config, $hidden);?>

        <input id='pot' type="text" name="honeypot">

        <?php $fieldsetNbr = 0; ?>

        <?php foreach($form_fields as $field) : ?>
            
            <?php if($field['type'] != 'title' && $field['type'] != 'help_text'): ?>
                <?php if ($field['display_name'] != '') : ?>
                    <?php if(preg_match($icon_regexp, $field['display_name'])): ?>
                    <div class="form-group">
                        <div class="controls">
                            <i class="<?= $field['display_name'] ?> prepend"></i>
                            <?= $field['field'] ?>
                        </div>
                    </div>
                    <?php else : ?>
                    <div class="form-group">
                        <label class="control-label" for="<?= $field['id'] ?>" ><?= $field['display_name'] ?></label>
                        <div class="controls">
                            <?= $field['field'] ?>
                        </div>
                    </div>
                    <?php endif; ?>
                <?php else : ?>
                <div class="form-group">
                    <div class="controls">
                        <?= $field['field'] ?>
                    </div>
                </div>
                <?php endif; ?>
            <?php elseif($field['type'] == 'help_text'): ?>
                <span class="help-block"><?= $field['display_name'] ?></span>
            <?php endif; ?>  

             <?php if($field['type'] == 'title'){ 
                if ($fieldsetNbr > 0) {
                    echo form_fieldset_close();
                };
                echo form_fieldset($field['display_name']);
                $fieldsetNbr++;
             };
            ;?>                  

        <?php endforeach;  ?>

        <?php if ($fieldsetNbr > 0) {
                    form_fieldset_close();
                } ?>

        <div class="error-summary"></div>
        <div class="control-group">
            <div class="controls">
                <button data-role="submit" type="submit" id="form-submit" class="btn btn-block btn-ripple">
                    <?= lang('submit') ?> <i class="icon-rocket enable"></i><i class="icon-remove disable"></i>
                </button>
            </div>
        </div>

    </form>

            <script>

                jQuery(document).ready(function($) {
                    //var contactFotmCtrl_<?= $form_id ?> = new contactFotmCtrl($('#form_<?= $form_id ?>'), '<?= site_url(array('contact', 'send', $form_id)) ?>');
                });

            </script>
