<!DOCTYPE html>
 <html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?=$site_name?> - Admin</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- css compiler -->

        <?= print_css('admin', $custom_ui); ?>

    </head>

    <html>
    <body class="<?=$bodyClass?>">
        <div id="loading"></div>
        <header id="mainHeader">
            <div class="pull-left">
                <button id="toggle-menu"><i class="fa fa-reorder circle-icon"></i></button>
            </div>
             <div class="pull-right" >
                <span id="notifications" class="dropdown" ng-controller="notificationsCtrl" ng-cloak>
                    <a href="" class="dropdown-toggle" data-toggle="dropdown">
                        <span class="badge" ng-class="notificationsNbr > 0 ? 'badge-danger' : 'badge-default'">{{notificationsNbr}}</span>
                    </a>
                    <ul class="dropdown-menu">
                        <li ng-repeat="item in items"><a id="notification-{{item.id}}" href="#/{{item.url}}" class="{{item.is_unread === 1 ? 'unread' : 'read'}}" ng-bind-html=item.text></a></li>
                    </ul>
                </span>
                <button id="assetTogle"><i data-toggle="tooltip" data-placement="bottom" title="Gestion de assets" class="fa fa-folder circle-icon"></i></button>
                <button href="#quick-action-modal" role="button" data-toggle="modal" ><i data-toggle="tooltip" data-placement="bottom" title="Actions rapides" class="circle-icon fa fa-bolt"></i></button>
                <a href="#/manager/comptes/edit/<?=$user_id?>"><i class="fa fa-user circle-icon" data-toggle="tooltip" data-placement="bottom" title="Mon compte"></i></a>
                <a class="active" href="/session/logout"><i class="fa fa-power-off circle-icon"></i></a>            
            </div>
        </header>
        <nav id="mainNav">
            <a class="brand" href="/" target="_blank"><img src="<?= APPPATH ?>/front/admin/img/peaks-white.svg" alt="Peaks" width="76px"><!-- <?=$site_name?> --></a>
            <ul>
                <li><a href="#/" class="btn-ripple"><i class="fa fa-home circle-icon"></i>Accueil</a></li>
                <li class="dropdown">
                    <a href="" id="manager" class="dropdown-toggle btn-ripple" data-toggle="dropdown">
                        <i class="fa fa-users circle-icon"></i>Manager
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/manager/comptes">Comptes</a></li>  
                        <li><a href="#/manager/groupes">Groupes</a></li>  
                        <!-- <li><a href="#/manager/logs">Logs serveur</a></li> -->
                        <!-- <li><a href="#/manager/maintenance">Maintenance</a></li>  -->      
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="" id="configuration" class="dropdown-toggle btn-ripple" data-toggle="dropdown">
                        <i class="fa fa-cog circle-icon"></i>Configuration
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/configuration/stylesheets">Styles Css</a></li>  
                        <!-- <li><a href="#/manager/logs">Logs serveur</a></li> -->
                        <!-- <li><a href="#/manager/maintenance">Maintenance</a></li>  -->      
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="" id="pages" class="dropdown-toggle btn-ripple" data-toggle="dropdown">
                        <i class="fa fa-sitemap circle-icon"></i>Pages
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/pages/pages">Pages</a></li>
                        <li><a href="#pages/templates">Templates</a></li>
                        <li><a href="#pages/menus">Menus</a></li>
                        <li><a href="#/pages/pages/edit/new">Ajouter</a></li> 
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="" id="banners" class="dropdown-toggle btn-ripple" data-toggle="dropdown">
                        <i class="fa fa-picture-o  circle-icon"></i>Bannieres
                    </a>
                        <ul class="dropdown-menu">
                            <li><a href="#/banner-zones/list">Liste</a></li> 
                            <li><a href="#/banner-zones/edit/new">Ajouter</a></li> 
                        </ul>
                </li>
                <li class="dropdown">
                    <a href="" id="portfolio" class="dropdown-toggle btn-ripple" data-toggle="dropdown">
                        <i class="fa fa-picture-o  circle-icon"></i>Portfolio
                    </a>
                        <ul class="dropdown-menu">
                            <li><a href="#/portfolio/portfolios">Liste</a></li> 
                            <li><a href="#/portfolio/categories">Catégories</a></li>
                            <li><a href="#/portfolio/portfolios/edit/new">Ajouter</a></li> 
                        </ul>
                </li>
               <li class="dropdown">
                    <a href="" id="news" class="dropdown-toggle btn-ripple" data-toggle="dropdown">
                        <i class="fa fa-bullhorn circle-icon"></i>News
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/news/categories">Catégories</a></li> 
                        <li><a href="#/news/list">News</a></li> 
                        <li><a href="#/news/edit/new">Ajouter</a></li>  
                    </ul>
                </li> 
                <li class="dropdown">
                    <a href="" id="messages" class="dropdown-toggle btn-ripple" data-toggle="dropdown">
                        <i class="fa fa-comment circle-icon"></i>Contact
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/contacts/messages">Messages</a></li> 
                        <li><a href="#/contacts/spams">Spams</a></li>        
                        <li><a href="#/contacts/forms/list">Formulaires</a></li>
                        <li><a href="#/contacts/config">Informations</a></li>
                    </ul>
                </li>
                <!-- <li class="dropdown">
                    <a id="carte" href="" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="fa fa-coffee circle-icon"></i>Menu
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/carte/list">Catégories</a></li>
                    </ul>
                </li>  -->
            </ul>
        </nav>

                       
                        
        <div id="container">
            <div ng-view ng-cloak class="inner"></div>
        </div>

        <div id="quick-action-modal" class="modal fade">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h3 class="modal-heading">Ajouter :</h3>
                    </div>
                
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <a href="#/carte/edit/new" class="btn btn-default">Carte</a>
                                <a href="#/pages/edit/new" class="btn btn-default">Page</a>
                                <a href="#/portfolio/edit/new" class="btn btn-default">Portfolio</a>
                                <a href="#/manager/comptes/edit/new" class="btn btn-default">Utilisateur</a>
                            </div>
                        </div>
                    </div>
                    <div class="modal-header">
                        <h3>Actions :</h3>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                
                                <div class="btn-toolbar">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-danger" onClick="flushCache(false)">Supprimer le cache</button>
                                        <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown">
                                            <span class="caret"></span>
                                            <span class="sr-only">Toggle Dropdown</span>
                                        </button>
                                        <ul class="dropdown-menu" role="menu">
                                          <li><a href="javascript:void(0)" onClick="flushCache('pages')">Supprimer le cache Pages</a></li>
                                          <li><a href="javascript:void(0)" onClick="flushCache('db')">Supprimer le cache DB</a></li>
                                          <li><a href="javascript:void(0)" onClick="flushCache('assets')">Supprimer le cache Assets</a></li>
                                          <li class="divider"></li>
                                          <li><a href="javascript:void(0)" onClick="flushCache('theme')">Supprimer le cache Theme</a></li>
                                          <li><a href="javascript:void(0)" onClick="flushCache('admin')">Supprimer le cache Admin</a></li>
                                        </ul>
                                    </div>

                                    <div class="btn-group">
                                        <button class="btn btn-warning" onclick="cleanDisk(false)">Nettoyer le serveur</button>
                                        <button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown">
                                            <span class="caret"></span>
                                            <span class="sr-only">Toggle Dropdown</span>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a href="javascript:void(0)" onclick="cleanDisk('logs')">Supprimer les logs</a></li>
                                            <li><a href="javascript:void(0)" onclick="cleanDisk('temps')">Suppriler les fichiers temporaires</a></li>
                                        </ul>

                                    </div>
                                </div>
        
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>

        <div id="assets-manager" class="draggable resizable">
            <button id="closeAssets"><i class="fa fa-times   circle-icon"></i></button>
            <div ng-controller="assetsCtrl">
                <div class="tools">
                    <button ng-click="getBack()"><i class="fa fa-reply"></i>Retour</button>
                    <button ng-click="deleteFiles()" ng-if="filesSelected"><i class="fa fa-trash-o"></i></button>
                    <button ng-click="addFolder()" tooltip="Ajouter un dossier"><i class="fa fa-folder"></i></button>
                    <button ng-click="triggerUpload()" tooltip="Télécharger des fichiers"><i class="fa fa-upload"></i></button>
                </div>
                <div id="assets-list">
                    <ul>
                        <li ng-repeat="item in items | orderBy:'file_type':true" class="{{item.selected}}" >
                            <a 
                                ng-if="item.file_type == 'folder'"
                                ng-click="selectItem(item.id)"
                                ng-dblclick="getFolder(item.file_name, false)">
                                <i class="fa fa-folder-close"></i>
                                    {{item.file_name}}
                                <div class="actions">
                                    <button ng-click="toggleView(item, $event)">
                                        <i ng-class="item.id === edited.id ? 'fa fa-eye-slash' : 'fa fa-eye'" ></i>
                                    </button>
                                </div>
                            </a>
                            <span ng-if="item.file_type != 'folder'" ng-click="selectItem(item.id); getDetail(item)">
                                <div ng-if="item.progress" ng-class="item.progressStatut" class="progress" style='width: {{item.progress}}%;'></div>
                                <i class="fa fa-file"></i>
                                {{item.file_name}} 
                                <div class="actions">
                                    <button ng-click="toggleView(item, $event)">
                                        <i ng-class="item.id === edited.id ? 'fa fa-eye-slash' : 'fa fa-eye'" ></i>
                                    </button>
                                </div>
                            </span>
                            <div class="asset-details clearfix" ng-if="item.id === edited.id">
                                <div class="figure">
                                    <i ng-if="edited.file_type == 'folder'" class="fa fa-folder-open"></i>
                                    <img ng-if="edited.file_type == 'file'" src="<?= APPPATH ?>{{edited.path}}" alt="">
                                </div>
                                <div ng-if="!editing">
                                    <h3>
                                        {{item.file_name}} 
                                        <button ng-click="toggleEdit()">
                                            <i class="fa fa-pencil"></i>
                                        </button>
                                    </h3>
                                </div>
                                <div class="editing" ng-if="editing">
                                    <div class="input-group" style="max-width: 400px">
                                        <input type="text" ng-model="item.new_file_name" class="form-control" />
                                        <div class="input-group-btn">
                                            <button class="btn btn-default" ng-click="saveEdit.nameSave()"><i class="fa fa-check"></i></button>
                                            <button class="btn btn-default" ng-click="saveEdit.nameCancel()"><i class="fa fa-times"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>    
                </div>
                

                <input type="file" name="file" class="hide" id="assets-fileUploader" multiple="multiple" onchange="angular.element(this).scope().uploadFiles(this.files)"/>
                
            </div>
        </div>        

        <footer>

        </footer>
    
    </body>

        <!-- scripts en bas de page -->

        <script>
            var globalVars = {
                user_id : '<?=$user_id?>',
                base_url : '<?= base_url(); ?>',
                app_url : '<?= APPPATH ?>',
                siteLanguages : <?= $siteLanguages ?>,
                defaultLanguage : '<?= $this->lang->lang() ?>'
            };
        </script> 

        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js" charset="utf-8"></script>
        <script>window.jQuery || document.write('<script src="/<?= APPPATH?>front/framework/js/jquery-2.1.1.min.js"><\/script>')</script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.20/angular.min.js" charset="utf-8"></script>
        <script>window.angular || document.write('<script src="/<?= APPPATH?>front/framework/js/angular.min.js"><\/script>')</script>

        <script type="text/javascript" src="/<?= APPPATH?>front/framework/js/jquery-ui-1.10.4.custom.min.js" charset="utf-8"></script>

        <script type="text/javascript" src="/<?= APPPATH ?>front/framework/js/tinymce/tinymce.min.js" charset="utf-8"></script>

        <script type="text/javascript" src="/<?= APPPATH ?>front/framework/js/emmet.js" type="text/javascript" charset="utf-8"></script>
        <script type="text/javascript" src="/<?= APPPATH ?>front/framework/js/ace/ace.js" type="text/javascript" charset="utf-8"></script>
        <script type="text/javascript" src="/<?= APPPATH ?>front/framework/js/ace/ext-language_tools.js" type="text/javascript" charset="utf-8"></script>
        <script type="text/javascript" src="/<?= APPPATH ?>front/framework/js/ace/ext-emmet.js" type="text/javascript" charset="utf-8"></script>

        <?= print_js('admin_foot'); ?>

        <script>
            angular.bootstrap(document.getElementById("container"),['admin']);
            angular.bootstrap(document.getElementById("notifications"), ['notifications']);
            angular.bootstrap(document.getElementById("assets-manager"), ['assetsManager']);
        </script>
        

</html>