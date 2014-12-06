admin.directive('assetsList', function()
{
    // Runs during compile
  return {
    //require: 'ngModel',
    //template: 'test upload',
    // name: '',
    // priority: 1,
    // terminal: true,
    // scope: {
    //     w : '=w',
    //     h : '=h',
    // }, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude, $http) {



        $scope.getView = function(id)
        {
          window.location.hash = '/'+$scope.assetsList.editPath+id;
          block();
        }

        $scope.sortableOptions = {
          stop: function(e, ui) { 
            var i = 0;
            angular.forEach($scope.assets, function( item )
            {
                if (i != item.weight )
                {
                  $scope.assets[i].weight = i;
                  updateItem($scope.assets[i]);
                }
                i++;
            })
          },
          axis: 'y',
          placeholder: "beingDragged",
          tolerance: 'pointer',
        };

        function updateItem(object)
        {
            $http(
            {
              url: $scope.assetsList.controllerPath,
              method: 'POST',
              data: object,
              headers: {'Content-Type': 'application/json'}
            });
        }
    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    templateUrl: '/admin/view_loader/'+templateDir+'/assets/widgets/assets_list',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {
      
    // }
  };
});

admin.directive('assetsListModal', function()
{
    // Runs during compile
  var widgetUniqueId = 0;

  return {
    //require: 'ngModel',
    //template: 'test upload',
    // name: '',
    // priority: 1,
    // terminal: true,
    // scope: {
    //     w : '=w',
    //     h : '=h',
    // }, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude, $http, $modal, assetsRepository, _) {

        assetsRepository.AssetsByParent($scope.item.id, $scope.assetsList.parentIdentity, function(data)
        {
          $scope.assets = data;
        });

        $scope.getView = function(id)
        {
          window.location.hash = '/'+$scope.assetsList.editPath+id;
          block();
        }

        $scope.openModal = function(id)
        {
          var editedItem;

          if (id) {
            editedItem = angular.copy(_.findWhere($scope.assets, {id: id}));
          }
          else
          {
            editedItem = {
              parent_id : $scope.item.id,
              parent_identity : $scope.assetsList.parentIdentity
            }
          }

          var modalInstance = $modal.open({
            templateUrl: '/admin/view_loader/'+templateDir+'/assets/widgets/asset_modal',
            windowClass : 'modal-full',
            controller: AssetModalCrl,
            size: 'lg',
            resolve: {
              item: function () {
                return editedItem;
              },
              uploadConfig: function()
              {
                return {
                  folder : $scope.assetsList.folder,
                  assetPath : $scope.assetsList.assetPath,
                }
              }
            }
          });

          modalInstance.result.then(function (editedItem) {
            //$scope.selected = selectedItem;
            var exist = false, i = 0;
            angular.forEach($scope.assets, function(asset)
            {
              if (asset.id === editedItem.id) {
                $scope.assets[i] = editedItem;
                exist = true;
              };

              i++;

            });
           if (!exist) {
              $scope.assets.push(editedItem);
            };
          });
        }

        $scope.sortableOptions = {
          stop: function(e, ui) { 
            var i = 0;
            
            angular.forEach($scope.assets, function( item )
            {
                $scope.assets[i].weight = i+1;

                if (item.id === ui.item.scope().asset.id) {
                    assetsRepository.EditAsset($scope.assets[i], function(data){});
                };

                i++;
            });
            console.log($scope.assets);
          },
          axis: 'y',
          placeholder: "beingDragged",
          tolerance: 'pointer',
        };

        function updateItem(object)
        {
            $http(
            {
              url: '/admin_assets/asset_edit',
              method: 'POST',
              data: object,
              headers: {'Content-Type': 'application/json'}
            });
        }
    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    templateUrl: '/admin/view_loader/'+templateDir+'/assets/widgets/assets_list_modal',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {
      
    // }
  };
});

// modal controller

function AssetModalCrl($scope, $modalInstance, item, uploadConfig, assetsRepository)
{

  $scope.item = item;

  $scope.uploader = {
    w : 0,
    h : 0,
    item_id : 0,
    folder : uploadConfig.folder,
    assetPath : uploadConfig.assetPath,
    crop : 0,
    uniqueName : true
  }

  $scope.ok = function () {
    console.log($scope.item);
    assetsRepository.EditAsset($scope.item, function(data)
    {
      if (data.error > 0) {
        $scope.errors = data.errors;
      }
      else
      {
        $scope.item.id = data.id;
        $modalInstance.close($scope.item);
      }
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}

admin.directive('imageUpload', function($timeout){
  // Runs during compile
  var widgetUniqueId = 0;
  return {
    //require: 'ngModel',
    //template: 'test upload',
    // name: '',
    // priority: 1,
    // terminal: true,
    scope: {
        config : '=config',
        model : '=item'
    }, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude, $http) {
         // img upload

         $scope.uploaderId = widgetUniqueId++;

          $scope.triggerUpload = function()
          {
            //$timeout(function()
            //{
              $('#fileUploader-' + $scope.uploaderId).click();
            //});
          }

          $scope.uploaderClass = function (content)
          {
            var cssClass;
            (!content ||content == '') ? cssClass = 'empty' : cssClass = 'full';
            return cssClass; 
          }

          $scope.reset = function()
          {
            $scope.model = '';
          }

          // drap n drop

        setTimeout(function()
        {
          var drop = document.getElementById('fileDropper-' + $scope.uploaderId);

          drop.addEventListener("dragover",function(e){
            e = e || event;
            e.preventDefault();
          },false);

          drop.addEventListener("drop",function(e){
            e = e || event;
            e.preventDefault();
            $(drop).removeClass('drop-hover');
            uploadFiles(event.dataTransfer.files);

          },false);

          window.addEventListener("dragover",function(e){
            e = e || event;
            e.preventDefault();
            $(drop).addClass('drop-hover');
          },false);
          window.addEventListener("dragleave",function(e){
            e = e || event;
            e.preventDefault();
            $(drop).removeClass('drop-hover');
          },false);
          window.addEventListener("drop",function(e){
            e = e || event;
            e.preventDefault();
            $(drop).removeClass('drop-hover');
          },false);

        }, 20);


      function uploadFiles(files) {
         var fd = new FormData(),
              fileName = $scope.config.uniqueName ? setGUID() : files[0].name;
              //Take the first selected file
              fd.append("file", files[0]);
              fd.append("name", fileName );
              fd.append('id', $scope.item_id);
              fd.append("folder",  $scope.config.folder);
              fd.append("minW", $scope.config.w);
              fd.append("minH", $scope.config.h);
              fd.append("crop", $scope.config.crop);

              var uploadUrl = '/file_upload/image/';

              var xhr = new XMLHttpRequest()
                xhr.upload.addEventListener("progress", uploadProgress, false)
                xhr.addEventListener("load", uploadComplete, false)
                xhr.addEventListener("error", uploadFailed, false)
                xhr.addEventListener("abort", uploadCanceled, false)
                xhr.open("POST", uploadUrl)
                xhr.send(fd);

              $('#progress-bar').show();
              $scope.alert = 'Chargement : 0%';
              showAlert();


          }

          function uploadProgress(evt) {
            //$('#progress-bar').fadeIn(200);
              $scope.$apply(function(){
                    if (evt.lengthComputable) {
                      $scope.alert = 'Chargement : ' + Math.round(evt.loaded * 100 / evt.total) + '%';
                    } else {
                        $scope.alerts = 'Chargement'
                    }
                })
            }

            var tempSrc;

            function uploadComplete(evt) {
                /* This event is raised when the server send back a response */
                //alert(evt.target.responseText);
                response = JSON.parse(evt.target.responseText);

                console.log(response);

                if (response.error == 0) {

                    if (response.crop == 1) {
                      tempSrc = response.newName;
                        $('#crop-container').html('<img id="thumb" src="/' + globalVars.app_url + 'assets/temp/'+response.newName+'" alt="" />')
                        $('#crop-popup').modal();
                        $('#crop-container').find('img').Jcrop(
                          {
                            onSelect: setCoords,
                            onChange: setCoords,
                            aspectRatio : $scope.config.w / $scope.config.h,
                            minSize : [$scope.config.w, $scope.config.h],
                            setSelect : [0, 0, $scope.config.w, $scope.config.h]
                          });
                        $scope.crop_data = {
                          w : $scope.config.w,
                          h : $scope.config.h,
                          x : 0,
                          y : 0,
                          maxW : $scope.config.w,
                          maxH : $scope.config.h,
                          src : '/assets/temp/'+response.newName,
                          newSrc : $scope.config.folder + '/'+response.newName,
                          folder : $scope.config.folder
                        };
                      }
                      else
                      {
                        $scope.$apply(function(){
                          $scope.model = response.newName;
                        });
                      }
                    
                 
                }
                else
                {
                  alert(response.message);
                };


                $scope.$apply(function()
                {
                  $scope.alert = response.message;
                });
                
                console.log($scope.alert);
                showFadeAlert();
                //$('#progress-bar').delay(1000).fadeOut(2000);
                
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

            // img crop

            function setCoords(c)
            {
              $scope.crop_data = {
                w : c.w,
                h : c.h,
                x : c.x,
                y : c.y,
                maxW : $scope.config.w,
                maxH : $scope.config.h,
                src : '/assets/temp/'+tempSrc,
                newSrc : $scope.config.folder + '/' +tempSrc,
                folder : $scope.config.folder
              };
            }

            $scope.crop = function ()
            {
              $http({
                    url: '/index.php/file_upload/crop_image',
                    method: "POST",
                    data: $scope.crop_data,
                    headers: {'Content-Type': 'application/json'}
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    hideModal();
                    $('#crop-popup').modal('hide')
                          //$scope.item.src = tempSrc;
                            $scope.model = response.newName;
                          showFadeAlert();               
                    }).error(function (data, status, headers, config) {
                        $scope.alert = 'Une erreure est survenue.';
                        showFadeAlert();
                });  
            }


          $scope.uploadFile = function(files) {
             uploadFiles(files);
          }

    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    templateUrl: '/admin/view_loader/'+templateDir+'/assets/images/image_upload',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {
      
    // }
  };
});
