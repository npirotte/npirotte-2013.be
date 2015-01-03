
admin.directive('gridWizard', function($modal){
  // Runs during compile
  var instanceId = 0;

  return {
    // name: '',
    // priority: 1,
    // terminal: true,
    scope: { fieldValue : '=content'}, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude) {

      // init
      if (typeof $scope.fieldValue != 'object') {
        $scope.fieldValue = new Array();
      };

      // config

      $scope.uniqueId = instanceId++;

      //$scope.tinymceOptions = tinymceConfig;

      $scope.aceLoaded = function(_editor)
      {
         aceeditorConfig(_editor);
      };

      $scope.sortableOptions = {
        selector : '.row-items',
        axis: 'y',
        placeholder: "beingDragged",
        tolerance: 'pointer',
      };

      $scope.sortableOptionsCols = {
       selector : '.col-items',
        axis: 'x',
        tolerance: 'pointer'
      };

      $scope.uploader = {
        w : 0,
        h : 0,
        item_id : 0,
        folder : 'assets/images/pages/',
        assetPath : 'pages',
        crop : 0,
        uniqueName : false
      }
      // helpers

      $scope.safeImg = function(content, type)
      {
        if (type == 'img') {
          return content; 
        };
      }

      // grid logic

      $scope.addRow = function (layout)
      {
        var colNumber = layout.length, 
            width = 12/colNumber;
            
        var content = new Array();

        angular.forEach(layout, function(item){
          var itemContent;
          item == 'text' ? itemContent = '<h1>Ici votre Second contenu</h1>' : itemContent = '';
          content.push({type : item, width : width, content : itemContent, cssClass : ''});
        });


        $scope.fieldValue.push({cols : content}); 
      }

      $scope.addCol = function (index, type)
      {
        var colNumber = $scope.fieldValue[index].cols.length + 1;

        if (colNumber > 12) {
          alert('Vous ne pouvez ajouter plus de 12 colonnes !');
          return  false;
        };

        if (colNumber == 5) { colNumber = 6 };

        if (colNumber > 6 ) { colNumber = 12 };

        var width = 12/colNumber;

        $scope.fieldValue[index].cols.push({type : type, width : width, content : '', cssClass : ''});

        var i = 0;
        angular.forEach($scope.fieldValue[index].cols, function(){
          $scope.fieldValue[index].cols[i].width = width;
          i++;
        });
      }

      $scope.removeCol = function(parent, index)
      {
        var temp = [],
            i = 0;

        angular.forEach($scope.fieldValue[parent].cols, function(item) 
              {
                if ( i != index ) temp.push(item);
                i++;
              });

        $scope.fieldValue[parent].cols = temp;

        //recalcul
        var colNumber = $scope.fieldValue[parent].cols.length;

        if (colNumber == 5) { colNumber = 6 };

        if (colNumber > 6 ) { colNumber = 12 };
        
        var width = 12/colNumber;
            i = 0;

        angular.forEach($scope.fieldValue[parent].cols, function(){
          $scope.fieldValue[parent].cols[i].width = width;
          i++;
        });
      }

      $scope.removeRow = function(index)
      {
        var temp = [],
            i = 0;

        angular.forEach($scope.fieldValue, function(item) 
              {
                if ( i != index ) temp.push(item);
                i++;
              });
        
        $scope.fieldValue = temp;

      }

      var editPane = new Array();

      $scope.editContent = function(parent, index)
        {
          var editedItem;

          editedItem = angular.copy($scope.fieldValue[parent].cols[index]);

          var modalInstance = $modal.open({
            templateUrl: '/admin/view_loader/'+templateDir+'/pages/widgets/grid_editor_modal',
            windowClass : 'modal-full',
            controller: GridEditorModalCtrl,
            size: 'lg',
            resolve: {
              item: function () {
                return editedItem;
              },
              uploader : function()
              {
                return $scope.uploader;
              }
            }
          });

          modalInstance.result.then(function (editedItem) {
            //$scope.selected = selectedItem;
            $scope.fieldValue[parent].cols[index] = editedItem;
          });
        }

    /*  $scope.editContent = function(parent, index)
      {
        //$scope.edit = $scope.fieldValue[parent].cols[index];
       // $scope.edit = new Array();
        //$scope.edit = clone($scope.fieldValue[parent].cols[index]);
        $scope.edit = angular.copy($scope.fieldValue[parent].cols[index]);
        editPane.parent = parent;
        editPane.index = index;
        //$scope.editPane = 'open';
        $('#grid-content-edition-modal-'+$scope.uniqueId).modal().on('hidden.bs.modal', function (e) {
          $scope.$apply(function() {
            $scope.edit = false;
          });
        });
      }*/

      $scope.endEdit = function(){ 

        $('#grid-content-edition-modal-'+$scope.uniqueId).modal('hide');
        $scope.fieldValue[editPane.parent].cols[editPane.index] = angular.copy($scope.edit);
        $scope.edit = false;

      };


      $scope.moveCol = function(sens, index, parent)
      {

          var temp = $scope.fieldValue[parent].cols[index],
              nbr = $scope.fieldValue[parent].cols.length;


          function goUp()
          {
            if (index > 0) {
              $scope.fieldValue[parent].cols[index] = $scope.fieldValue[parent].cols[index-1];
              $scope.fieldValue[parent].cols[index-1] = temp;
            } 
          }

          function goDown()
          {
            if (index < nbr -1) {
              $scope.fieldValue[parent].cols[index] = $scope.fieldValue[parent].cols[index+1];
              $scope.fieldValue[parent].cols[index+1] = temp;
            }
          }
        sens == 'up' ? goUp() : goDown(); 
      }

      $scope.redimCol = function(direction, sens, index, parent)
      {
        console.log(parent);

        var factor, aside;

        sens == 'plus' ? factor = 1 : factor = -1;
        direction == 'left' ? aside = index - 1 : aside = index + 1;

        if ($scope.fieldValue[parent].cols[aside].width <= 1) {return false};

        $scope.fieldValue[parent].cols[index].width = $scope.fieldValue[parent].cols[index].width + factor;
        $scope.fieldValue[parent].cols[aside].width = $scope.fieldValue[parent].cols[aside].width - factor;
      }

       $scope.moveRow = function(sens, index)
      {

          var temp = $scope.fieldValue[index],
              nbr = $scope.fieldValue.length;

              console.log(nbr);

          function goUp()
          {
            if (index > 0) {
              $scope.fieldValue[index] = $scope.fieldValue[index-1];
              $scope.fieldValue[index-1] = temp;
            } 
          }

          function goDown()
          {
            if (index < nbr -1) {
              $scope.fieldValue[index] = $scope.fieldValue[index+1];
              $scope.fieldValue[index+1] = temp;
            }
          }
        sens == 'up' ? goUp() : goDown(); 
      }

      // img upload

      $scope.uploadObject = [];

      $scope.triggerUpload = function(index, parent)
      {
          $scope.uploadObject.parent = parent;
          $scope.uploadObject.index = index;

          console.log(parent);

          $('#fileUploader').click();
      }

      $scope.uploaderClass = function (content)
      {
        var cssClass;
        content == '' ? cssClass = 'empty' : cssClass = 'full';
        return cssClass; 
      }

       $scope.uploadFile = function(files) {
          var fd = new FormData();

          fd.append("file", files[0]);
          fd.append("name", files[0].name);
          fd.append('id', 0);
          fd.append("folder",  'assets/images/pages/');
          fd.append("minW", 0);
          fd.append("minH", 0);
          fd.append("crop", 0);

          var uploadUrl = '/file_upload/image/';

          var xhr = new XMLHttpRequest()
            xhr.upload.addEventListener("progress", uploadProgress, false)
            xhr.addEventListener("load", uploadComplete, false)
            xhr.addEventListener("error", uploadFailed, false)
            xhr.addEventListener("abort", uploadCanceled, false)
            xhr.open("POST", uploadUrl)
            xhr.send(fd)

      }

      function uploadProgress(evt) {
        $('#progress-bar').fadeIn(200);
          $scope.$apply(function(){
                if (evt.lengthComputable) {
                    $scope.progress = Math.round(evt.loaded * 100 / evt.total)
                } else {
                    $scope.progress = 'unable to compute'
                }
            })
        }

        function uploadComplete(evt) {
            /* This event is raised when the server send back a response */
            response = JSON.parse(evt.target.responseText);
            console.log(response);
            console.log($scope.fieldValue[$scope.uploadObject.parent].cols[$scope.uploadObject.index].content);
            if (response.error === 0) {
              $scope.$apply(function () {
                $scope.fieldValue[$scope.uploadObject.parent].cols[$scope.uploadObject.index].content = '/assets/images/pages/' + response.newName;
              });
            }
            else
            {
              $('#upload-output').empty().prepend('<p class="label label-important">'+response.message+'</p>') 
            }

            $('#progress-bar').delay(1000).fadeOut(2000);
            
        }

        function uploadFailed(evt) {
            alert("There was an error attempting to upload the file.")
            //$('#progress-bar').fadeOut(800);
        }

        function uploadCanceled(evt) {
            alert("The upload has been canceled by the user or the browser dropped the connection.")
            //$('#progress-bar').fadeOut(800);
        }

      // img upload end

    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    //template: '<a href="#manager/comptes/edit/{{userId}}" >{{user.first_name}} {{user.last_name}}</a>',
    templateUrl: '/admin/view_loader/desktop/pages/widgets/grid_editor',
    //replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    //link: function($scope, iElm, iAttrs, controller) {}
  };
});


function GridEditorModalCtrl($scope, $modalInstance, item, uploader)
{
  $scope.item = item;
  $scope.uploader = uploader; 

  $scope.ok = function () {
    console.log($scope.item);
    $modalInstance.close($scope.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.tinymceOptions = tinymceConfig;

  $scope.aceLoaded = function(_editor)
  {
     aceeditorConfig(_editor);
  };
}