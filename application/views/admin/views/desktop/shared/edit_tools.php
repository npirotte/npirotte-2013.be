<button data-role="submit" class="btn btn-primary btn-ripple" ng-click="save(true)" ng-disabled="editForm.$invalid">Terminer<i class="fa fa-check-circle"></i></button>
<button data-role="submit" class="btn btn-primary btn-ripple" ng-click="save()" ng-disabled="editForm.$invalid">Sauver<i class="fa fa-save"></i></button>
<a data-role="cancel" class="btn btn-default btn-ripple" href="#/{{backUrl ? backUrl : section}}">Retour<i class="fa fa-reply"></i></a>
<button data-role="delete" ng-if="mode != 'new'" class="btn btn-danger btn-ripple" ng-click="delete()">Supprimer<i class="fa fa-trash-o"></i></button>
<span id="mainAlert">{{alert}}</span>
