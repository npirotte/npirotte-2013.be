angular.module('Peaks.Pages').controller('TemplateEditCtrl', ['$scope', '$http', '$stateParams', 'TemplatesRepository', function($scope, $http, $stateParams, templatesRepository){
 init_page();
  $scope.section = "pages/templates";
  menuControl('pages');

  var id = $stateParams.id;
  $scope.mode =  id;

  function getItem()
  {
    templatesRepository.getTemplate(id, function(data)
    {
      $scope.item = data;
    })
  }

  templatesRepository.getTemplateFiles(function(data)
  {
    $scope.templateFiles = data;
  });

  $scope.aceConfig = {
    useWrapMode : true,
    showGutter: true,
    theme:'twilight',
    mode: 'html',
    onLoad: aceLoaded
  }

  function aceLoaded(_editor)
  {
    console.log(_editor);
    _editor.setReadOnly(true);
    ace.require("ace/ext/emmet");
    ace.require("ace/ext/language_tools");
    _editor.setOptions({
        enableBasicAutocompletion: true,
        enableEmmet: true,
        enableSnippets: true,
    });
  }

  $scope.save = function(returnToList)
  {
    $scope.alert = 'Sauvegarde';
    showAlert();

    templatesRepository.saveTemplate($scope.item, function(data)
    {

      if (returnToList && data.errors.length === 0) {
        window.location.hash = '/pages/templates';
      }
      else if (id == 'new' && data.errors.length === 0)
      {
        window.location.hash = '/pages/templates/edit/' + data.id;
      }
      else
      {
        $scope.alert = data.message;
        $scope.errors = data.errors;
      }

      showFadeAlert();
    });
  }

  $scope.delete = function()
  {
    templatesRepository.deleteTemplete(id, function(data)
      {
        window.location.hash = $scope.section;
      });
  }

  if (id != 'new') {
    getItem();
  };
}])