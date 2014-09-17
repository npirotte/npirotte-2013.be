<aside id="edit-aside" class="well" ng-if="item.created_on">
	<strong>Crée le :</strong> {{item.created_on}} <br />
	<strong>Par : </strong><manager-user-infos userid="item.created_by" ></manager-user-infos>

	<div ng-if="item.modified_on">
		<strong>Modifié le : </strong> {{item.modified_on}} <br />
		<strong>Par : </strong><manager-user-infos userid="item.modified_by" ></manager-user-infos>
	</div>
</aside>