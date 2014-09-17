var assetsManager = angular.module('assetsManager', ['ui.bootstrap']);
assetsManager.controller('assetsCtrl', function($scope, $http)
{
	
	var currentPath = '',
        id;
	$scope.backPath = 'coucou';


	var getData = function(){
    //contenu
    	$scope.edited = null;

	    $http({
            url: '/admin_assets/assets_list/',
            method: "POST",
            data: currentPath,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
        	$scope.items = [];
        	id = 0;
        		angular.forEach(data.content_items, function(item){
        			var type;
        			if (item.lastIndexOf('.') < 0) {
        				type = 'folder';
        			}
        			else
        			{
        				type = 'file';
        			}

        			var selected = '',
        			 path = 'assets/' + currentPath + item;

        			$scope.items.push({'id' : id++, 'file_name' : item, 'file_type' : type, 'path' : path, 'selected' : selected});

        		});

            });
	 }

	 getData();

	 $scope.storePath = function(path)
	 {
	 	prompt('Veuillez copier l\'url suivante', path);
	 }


	 $scope.getBack = function()
	 {
	 	var backPath = '',
	 		temp = currentPath.split('/'),
	 		lenght = temp.length,
	 		i = 0;

	 	while ( i < lenght - 2 )
	 	{
	 		backPath += temp[i++] + '/';
	 	}

	 	currentPath = backPath;

	 	getData();
	 }

	 $scope.getFolder = function(folder, absolute)
	 {
	 	absolute ? currentPath = folder : currentPath += folder + '/'; 
	 	getData();
	 }

	 $scope.filesSelected = false;

	 $scope.selectItem = function(id)
	 {
	 	//$scope.items[id].selected == "selected" ? $scope.items[id].selected = '' : $scope.items[id].selected = 'selected';
        var i = 0;
        angular.forEach($scope.items, function(item)
        {
            if (item.id == id) {
                item.selected == "selected" ? $scope.items[i].selected = '' : $scope.items[i].selected = 'selected';
            };   

            i++;
        })
        
	 	var count = 0;
	 	angular.forEach($scope.items, function(item) {
		    if ( item.selected == 'selected' ) ++count;
		});

		count > 0 ? $scope.filesSelected = true : $scope.filesSelected = false;
	 }

   $scope.toggleView = function(item, e)
   {
      e.stopPropagation();

      if ($scope.edited == null) {
          $scope.edited = item;
      }
      else
      {
          $scope.edited = $scope.edited.id === item.id ? null : item;
      }

      $scope.editing = false;
   }

   $scope.toggleEdit = function()
   {
     $scope.editing = true;
     $scope.edited.new_file_name = $scope.edited.file_name;
   }

   // fonctions de sauvegarde de l'edit

   $scope.saveEdit = {
      nameSave : function() 
      {

        $scope.edited.new_path = 'assets/' + currentPath;

        $http({
            url: '/admin_assets/rename/',
            method: "POST",
            data: $scope.edited,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
          console.log(data);
          if (data.error == 0) {
            $scope.edited.file_name = data.new_file_name;
            $scope.edited.path = $scope.edited.new_path + data.new_file_name;
            $scope.edited.new_file_name = null;
            $scope.edited.new_path = null;
            $scope.editing = false;
          }
          else {
            alert(data.message);
          }
          
            });
      },
      nameCancel : function()
      {
        $scope.edited.new_file_name = null;
        $scope.edited.new_path = null;
        $scope.editing = false;
      }
   }

	 $scope.getDetail = function(item)
	 {
	 	if ($scope.details) {
	 		if ($scope.details.id != item.id) {
	 		$scope.details = item;
		 	}
		 	else
		 	{
		 		$scope.details = null;
		 	}
	 	}
	 	else
	 	{
	 		$scope.details = item;
	 	}
	 	
	 	console.log($scope.details);
	 }

	 $scope.addFolder = function()
	 {
	 	var name = prompt  ('Veuillez entrer un nom de dossier');

        if (name) {
            var path = 'assets/' + currentPath + name;

            $http({
                url: '/admin_assets/create_folder/',
                method: "POST",
                data: path,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                console.log(data);
                if(data.error == 0)
                {     
                     
                    $scope.items.push({'id' : id++, 'file_name' : name, 'file_type' : 'folder', 'path' : 'assets/' + currentPath + name, 'selected' : ''});         
                }
                else
                {
                    alert(data.message);
                }
            });

            $scope.filesSelected = false;
        };
	 	
	 }

	 $scope.deleteFiles = function()
	 {
	 	var count = 0;
	 	angular.forEach($scope.items, function(item) {
		    if ( item.selected == 'selected' ) ++count;
		});

	 	var plural;
		count == 1 ?  plural = '' : plural = 's'; 

		var message = 'Vous aller supprimer ' + count +' élément' + plural + '.';

	 	if (confirm(message)) {
		 	angular.forEach($scope.items, function(item) {
			    if ( item.selected == 'selected' ) deleteFile(item.file_name);
			});
		};

        $scope.filesSelected = false;
	 }

	 function deleteFile(file_name)
	 {
	 	var file = currentPath + file_name;

	 	$http({
            url: '/admin_assets/delete_file/',
            method: "POST",
            data: file,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
        	if(data.error == 0)
        	{
        		var temp = [],
		          i = 0;

		          angular.forEach($scope.items, function(item) {
		            if ( item.file_name != file_name ) temp.push(item);
		          });
		          $scope.items = temp;
        			
        	}
        	else
        	{
        		alert('Une erreur est survenue');
        	}
            });
	 }

     
     // drap n drop

    var drop = document.querySelector('#assets-list');


    drop.addEventListener("dragover",function(e){
      e = e || event;
      e.preventDefault();
    },false);

    drop.addEventListener("drop",function(e){
      e = e || event;
      e.preventDefault();
      $(drop).removeClass('drop-hover');
      $scope.uploadFiles(event.dataTransfer.files);

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



     // file upload


	 $scope.triggerUpload = function()
	 {
        $('#assets-fileUploader').click();
     }


	 $scope.uploadFiles = function(files) {
	 	var i = 0;
	 	angular.forEach(files, function(file)
	 		{
              var fd = new FormData(),
                thisId = id,
                index = 0;
              //Take the first selected file
              fd.append("file", files[i++]);
              fd.append("name", file.name);
              fd.append('id', 0);
              fd.append("folder",  'assets/' + currentPath);
              fd.append("minW", 0);
              fd.append("minH", 0);
              fd.append("crop", 0);

              var uploadUrl = '/file_upload/file/';

              var xhr = new XMLHttpRequest()
                xhr.upload.addEventListener("progress", uploadProgress, false)
                xhr.addEventListener("load", uploadComplete, false)
                xhr.addEventListener("error", uploadFailed, false)
                xhr.addEventListener("abort", uploadCanceled, false)
                xhr.open("POST", uploadUrl)
                xhr.send(fd);

                $scope.items.push({'id' : id++, 'file_name' : file.name, 'file_type' : 'file', 'path' : 'assets/' + currentPath + file.name, 'selected' : ''});

                // stoquage de la position dans l'array
                var stopper = true,
                    counter = 0;
                while (stopper)
                {
                    $scope.items[counter++].id == thisId ? stopper = false : index = counter;
                }

                function uploadProgress(evt) {
                //$('#progress-bar').fadeIn(200);
                  $scope.$apply(function(){
                        $scope.items[index].progressStatut = 'loading';
                        if (evt.lengthComputable) {
                            $scope.items[index].progress = Math.round(evt.loaded * 100 / evt.total);
                        } else {
                            $scope.items[index].progress = 'unable to compute'
                        }
                    })
                }

                var tempSrc;

                function uploadComplete(evt) {
                    /* This event is raised when the server send back a response */
                    //alert(evt.target.responseText);
                    console.log(evt.target.responseText);
                    response = JSON.parse(evt.target.responseText);
                    if (response.error == 0) {
                        $scope.$apply(function(){
                            $scope.items[index].progress = 100;
                            $scope.items[index].progressStatut = 'complete';
                            $scope.items[index].file_name = response.newName;
                            $scope.items[index].path = 'assets/' + currentPath + response.newName;
                        });
                       //getData();
                     
                    }
                    else
                    {
                        alert(response.message);
                        $scope.$apply(function()
                        {
                            $scope.items[index].progressStatut = 'error';
                        });
                      // $scope.uploader.completeCallBack(response.newName);
                      // $scope.alert = response.message;
                      // showFadeAlert();
                    }
                    $scope.alert = response.message;
                    showFadeAlert();
                    $('#progress-bar').delay(1000).fadeOut(2000);  
                }

                function uploadFailed(evt) {
                    alert("There was an error attempting to upload the file.");
                    $scope.items[index].progressStatut = 'error';
                }

                function uploadCanceled(evt) {
                    alert("The upload has been canceled by the user or the browser dropped the connection.")
                    $scope.items[index].progressStatut = 'error';
                }

             });

          }
});
