
<div>
	<hr />
</div>

<div class="row">
	<div class="col-sm-5">
		<div class="well">
			
			<!-- Nested node template -->
		<script type="text/ng-template" id="nodes_renderer.html">
		  <div ui-tree-handle class="tree-node tree-node-content" ng-class="smallSize">
		    <a class="btn btn-default btn-xs angular-ui-tree-btn" ng-if="node.nodes && node.nodes.length > 0" data-nodrag ng-click="toggle(this)"><i class="fa" ng-class="{'fa-angle-right': collapsed, 'fa-angle-down': !collapsed}"></i></a>
		    <span class="pusher" ng-if="!node.nodes || node.nodes.length === 0"></span>
		    <a ng-click="getItem(node.id)" class="node-name" ng-class="currentId === node.id ? 'active' : ''">{{node.name}}</a>
		    <a class="pull-right" data-nodrag ng-click="deleteItem(node.id, true)"><i class="fa fa-times"></i></a>
		    <a class="pull-right" data-nodrag ng-click="newSubItem(node.id)" style="margin-right: 8px;"><i class="fa fa-plus"></i></a>
		  </div>
		  <ol ui-tree-nodes="" ng-model="node.nodes" ng-class="{hidden: collapsed}">
		    <li ng-repeat="node in node.nodes" ui-tree-node ng-include="'nodes_renderer.html'">
		    </li>
		  </ol>
		</script>
		<div ui-tree="treeOptions" id="tree-root" data-drag-delay="500">
		  <ol ui-tree-nodes="" ng-model="itemsTree">
		    <li ng-repeat="node in itemsTree" ui-tree-node ng-include="'nodes_renderer.html'"></li>
		  </ol>
		</div>
		</div>
	</div>
	<div class="col-sm-6 col-sm-offset-1">
	  <h3>{{ item.id ? 'Edition' : 'Création' }} d'un lien {{ item.id ? '#' + item.id : ''}}</h3> 

	  <form name="itemForm" class="form form-horizontal" ng-submit="save(true)">

	    <?php foreach($this->lang->languages as $lang): ?>
			<div class="form-group">
				<label class="control-label col-xs-3">Nom <?=$lang?></label>
				<div class="col-sm-6">
					<?php print_input($self, 'text', 'menus_items', 'name_'.$lang, 'item', 'itemForm') ?>
				</div>
			</div>
		<?php endforeach; ?>

	    <div class="form-group">
	        <label class="control-label col-xs-3">Classes Css</label>
	        <div class="col-xs-6">
	          <?php print_input($self, 'text', 'menus_items', 'cssclass', 'item', 'itemForm') ?>
	        </div>
	    </div>

	    <div class="form-group">
	        <label class="control-label col-xs-3">Point de menu parent</label>
	        <div class="col-xs-6">
	          <?php // print_input($self, 'text', 'menus_items', 'parent_id', 'item', 'itemForm') ?>
	          <select ui-select2 name="parent_id" ng-model='item.parent_id' ng-if="itemsList">
				<option ng-if="menuItem.id != item.id" ng-repeat="menuItem in itemsList" value="{{menuItem.id}}">{{menuItem.name}}</option>
			  </select>
	        </div>
	    </div>

	    <div class="form-group">
	        <label class="control-label col-xs-3">Position</label>
	        <div class="col-xs-6">
	          <?php print_input($self, 'text', 'menus_items', 'weight', 'item', 'itemForm') ?>
	        </div>
	    </div>

	    <div class="form-group">
	        <label class="control-label col-xs-3">Module</label>
	        <div class="col-xs-6">
	          <?php print_input($self, 'select', 'menus_items', 'module', 'item', 'itemForm') ?>
	        </div>
	    </div>

	    <div class="form-group" ng-show="item.module && item.module != 'toto' && item.module != 'url'">
	        <label class="control-label col-xs-3">Fonction</label>
	        <div class="col-xs-6">
	          	<select ui-select2 name="type" ng-model='item.function'>
					<option ng-repeat="urlFunction in urlOptions.UrlFunctions" value="{{urlFunction.value}}">{{urlFunction.name}}</option>
				</select>
	        </div>
	    </div>

	    <div class="form-group" ng-show="item.module && item.function || item.module === 'url'">

	        <?php foreach($this->lang->languages as $lang): ?>
		
					<label class="control-label col-xs-3">Cible <?=$lang?></label>
					<div class="col-sm-6">
						<select ui-select2 name="type" ng-model='item.element_<?=$lang?>' ng-if="item.module != 'url'">
							<option ng-repeat="urlElement in urlOptions.UrlElements" value="{{urlElement.id}}">{{urlElement.name}}{{urlElement.title}}</option>
						</select>

						<div ng-if="item.module === 'url'">
							<?php print_input($self, 'text', 'menus_items', 'element_'.$lang, 'item', 'itemForm') ?>
						</div>

					</div>

			<?php endforeach; ?>
			
	    </div>

	    <div class="form-group">
	    	<label class="control-label col-xs-3">Masquer</label>

	    	<div class="col-sm-6">
	    		<?php foreach($this->lang->languages as $lang): ?>
	    			<checkbox ng-model="item.is_hidden_<?= $lang ?>" label="<?= $lang ?>" value="1"></checkbox>
	    		<?php endforeach; ?>
	    	</div>
	  
	    </div>

	    <div class="form-group">
	        <label class="control-label col-xs-3">Ouvrir dans un nouvel onglet</label>
	        <div class="col-xs-6">
	        	<checkbox ng-model="item.target"></checkbox>
	        </div>
	    </div>
	
	  </form>
	  <button ng-disabled="itemForm.$invalid" ng-click="save()" class="btn btn-primary">{{ item.id ? 'Enregistrer' : 'Créer' }}</button>
		<button ng-disabled="itemForm.$invalid" ng-click="save(true)" class="btn btn-primary">Terminer</button>
		<button ng-click="deleteItem(item.id, true)" ng-show="item.id" class="btn btn-danger">Supprimer</button>
		<button ng-click="resetItem()" ng-show="item.id || itemForm.$dirty" class="btn btn-default">Annuler</button>
	</div>
</div>