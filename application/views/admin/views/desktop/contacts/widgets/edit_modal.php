<div class="modal-content">
                  
  <div class="modal-header">
      <h2 class="modal-title">Edition d'un champ</h2>
  </div>

  <div class="modal-body">
    <div error-sumary></div>
    <form name="itemEdit">
      <h4>Configuration</h4>
       <div class="row" >
        <div class="col-sm-6">
          <label>Nom</label>
          <?php print_input($self, 'text', 'contact_forms_fields', 'name', 'item', 'itemEdit') ?>
        </div>
        <div class="col-sm-6">
          <label>Type de champ</label>
          <?php print_input($self, 'select', 'contact_forms_fields', 'field_type', 'item', 'itemEdit') ?>
        </div>
       </div>

       <br />
       <div class="row" >
        <div class="col-sm-6">
          <label>Label</label>
          <?php print_input($self, 'text', 'contact_forms_fields', 'display_name', 'item', 'itemEdit') ?>
        </div>
        <div class="col-sm-6">
          <label>Placeholder</label>
          <?php print_input($self, 'text', 'contact_forms_fields', 'placeholder', 'item', 'itemEdit') ?>
        </div>

       </div>
        
        <br />
        <h4>Validation</h4>
       <div class="row">

        <div class="col-sm-6">
          <br />
          <label><checkbox ng-model="item.is_mandatory" value="1" ng-true-value="1"></checkbox> Champ requis</label>
          
        </div>
        <div class="col-sm-6">
          <label>Validation</label>
          <?php print_input($self, 'select', 'contact_forms_fields', 'validation', 'item', 'itemEdit') ?>

          <div ng-show="item.validation == 'regexp'">
            <br />
            <label>Expression régulière</label>
            <?php print_input($self, 'text', 'contact_forms_fields', 'validation_regexp', 'item', 'itemEdit') ?>
          </div>
        </div>
       </div>

       <div ng-if="item.field_type == 'checkbox_list' || item.field_type == 'radio_list' || item.field_type == 'select' " class="row">
        <div class="col-sm-12">
          <h3>Valeurs</h3>
          <table class="table table-striped" ng-show="item.field_values && item.field_values.length > 0">
            <thead>
              <tr>
                <th>Valeur</th>
                <th>Label</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr ng-repeat="fieldValue in item.field_values">
                <td><input type="text" ng-model="fieldValue.field_value"></td>
                <td><input type="text" ng-model="fieldValue.field_display_value"></td>
                <td>
                  <button ng-click="fieldvalues.remove($index)">
                      <i class="fa fa-trash-o circle-icon"></i>
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button ng-click="fieldvalues.add()" class="btn btn-primary">Ajouter</button>
        </div>
       </div> 
     </form>


  </div>

   <div class="modal-footer">
      <button type="button" class="btn btn-default" ng-click="cancel()">Annuler</button>
      <button type="button" class="btn btn-danger" ng-click="deleteField()">Supprimer</button>
      <button type="button" class="btn btn-success" ng-click="save()">Sauvegarder</button>
    </div>

</div>

