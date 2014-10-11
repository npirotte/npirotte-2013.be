<div ng-show="assets.length == 0" class="alert alert-warning">Aucun élément. <a href="#/{{assetsList.editPath}}{{item.id}}/new">Ajouter</a></div>
<table ng-show="assets.length > 0" class="table table-striped table-hover">
	<tbody ui:sortable="sortableOptions" ng:model="assets">

		<tr ng-repeat="asset in assets | filter:query | orderBy:orderProp:reverse" ng-dblclick="getView(asset.id)">
			<td><a href="#/{{assetsList.editPath}}{{asset.id}}">#{{asset.id}}</a></td>
			<td><img id="preview_img" src="/assets/image/{{assetsList.assetPath}}/80x80/{{asset.src}}" alt=""></td>
		</tr>

	</tbody>
</table>
<a href="#/{{assetsList.editPath}}{{item.id}}/new" class="btn btn-primary">Ajouter</a>