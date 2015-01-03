angular.module('Peaks.Global.Directives').directive('iconsPicker', ['IconsRepository', function(iconsRepository){

  return {
    scope: {
      icon : '=ngModel'
    },
    template: '<script type="text/ng-template" id="customTemplate.html"><a><i class="fa {{match.label}}"></i>&nbsp;&nbsp;<span ng-bind-html="match.label | typeaheadHighlight:query" ></span></a></script><div class="input-group"><input class="form-control" type="text" ng-model="icon" typeahead="icon for icon in faIcons | filter:$viewValue | limitTo:8" typeahead-template-url="customTemplate.html" class="form-control" /><div class="input-group-addon"><i class="fa {{icon}}"></i></div></div>',
    link: function(scope, iElm, iAttr, controller)
    {
      scope.faIcons = [];

      iconsRepository.IconList(function(data)
      {
        scope.faIcons = data;
      });
    }

  }

}]);