<div ng-if="assets.length == 0" class="alert alert-warning">Aucun élément. <a href="" ng-click="openModal()">Ajouter</a></div>
<div ng-if="assets.length > 0">
	<table class="table table-bordered table-striped table-hover">
		<tbody ui:sortable="sortableOptions" ng:model="assets">

			<tr ng-repeat="asset in assets | filter:query | orderBy:orderProp:reverse" ng-dblclick="openModal(asset.id)">
				<td><a href="#/{{assetsList.editPath}}{{asset.id}}">#{{asset.id}}</a></td>
				<td><img id="preview_img" src="/assets/image/{{assetsList.assetPath}}/80x80/{{asset.src}}" alt=""></td>
				<td>{{asset.title_<?= $this->lang->lang()?> ? asset.title_<?= $this->lang->lang()?> : asset.src}}</td>
			</tr>

		</tbody>
	</table>
	<a ng-click="openModal()" class="btn btn-primary">Ajouter</a>
</div>
