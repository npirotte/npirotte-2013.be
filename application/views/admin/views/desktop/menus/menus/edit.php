<div id="viewTools">
  <?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>

<div>
  <h1>Menu : #{{item.id}} {{item.name}}</h1>
  <hr>
  <div error-sumary></div>
  <div class="row">
    <div class="col-md-9">
  
      <form name="editForm" class="form form-horizontal">
      
        <div class="row">
          <div class="col-sm-6">
              <div class="form-group">
                <label class="control-label col-xs-3" for"inputDbTitle">Nom du menu</label>
                <div class="col-xs-6">
                  <?php print_input($self, 'text', 'menus_menus', 'name', 'item', 'editForm') ?>
                </div>
              </div>
            </div>

            <div class="col-sm-6">
              <div class="form-group">
                <label class="control-label col-xs-3" for"inputDbTitle">Classes Css</label>
                <div class="col-xs-6">
                  <?php print_input($self, 'text', 'menus_menus', 'cssclass', 'item', 'editForm') ?>
                </div>
              </div>
            </div>
        </div>
          
      </form>

      <div menus-items-panel menu-id="item.id" ng-if="item.id"></div>
    </div>

    <div class="col-md-2 col-md-offset-1">
      <aside id="edit-aside" class="well" ng-if="item.created_on">
        <strong>Crée le :</strong> {{item.created_on}} <br />
        <strong>Par : </strong><manager-user-infos userid="item.created_by" ></manager-user-infos>

        <div ng-if="item.modified_by">
          <strong>Modifié le : </strong> {{item.modified_on}} <br />
          <strong>Par : </strong><manager-user-infos userid="item.modified_by" ></manager-user-infos>
        </div>
      </aside>
    </div>

  </div>

</div>