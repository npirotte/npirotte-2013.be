<div id="viewTools">
  <?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>

<section class="asided-right">

  <h1 class="page-title">Menu : #{{item.id}} {{item.name}}</h1>

  <div error-sumary></div>
  <div class="row">
    <div class="col-md-12">
  
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

  </div>

</section>

<div class="big-aside right">
  <?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>
</div>