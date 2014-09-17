

    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title">{{item.id ? 'Edition' : 'Ajout'}} d'une image</h4>
      </div>
      <div class="modal-body">
          <form name="asset_modal">
            <div error-sumary></div>
            <div image-upload config="uploader" item="item.src" ></div>
            <br />

            <tabset>
              <?php foreach($this->lang->languages as $lang): ?>
                <tab heading="<?=$lang?>">
                <br />
                  <div class="row">
                    <div class="col-md-6">

                      <div class="form-group">
                        <label class="control-label col-xs-2">Titre <?=$lang?></label>
                        <div class="col-xs-6">
                          <?php print_input($self, 'text', 'assets_images', 'title_'.$lang, 'item', 'asset_modal') ?>
                        </div>
                      </div>

                    </div>
                    <div class="col-md-6">
                      
                      <div class="form-group">
                        <label class="control-label col-xs-2">Texte alternatif <?=$lang?></label>
                        <div class="col-xs-6">
                          <?php print_input($self, 'text', 'assets_images', 'alt_'.$lang, 'item', 'asset_modal') ?>
                        </div>
                      </div>

                    </div>
                  </div>
              </tab>
              <?php endforeach; ?>
            </tabset>
          </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" ng-click="cancel()">Annuler</button>
        <button type="button" class="btn btn-primary" ng-click="ok()">Sauvegarder</button>
      </div>
    </div><!-- /.modal-content -->

