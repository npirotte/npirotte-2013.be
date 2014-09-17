<!DOCTYPE html>
 <html class="no-js" ng-app="admin">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?=$site_name?> - Admin</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- css compiler -->

        <?= print_css('admin'); ?>


        
    </head>

    <html>
    <body>
        <div id="loading"></div>
        <header id="mainHeader">
             <div class="pull-right">
                <a href="/index.php/admin#/manager/comptes/edit/<?=$user_id?>"><i class="icon-user circle-icon"></i></a>
                <a class="active" href="/session/logout"><i class="icon-off circle-icon"></i></a>                
            </div>
        </header>
        <nav id="mainNav">
            <a class="brand" href="/" target="_blank"><?=$site_name?> Mobile</a>
            <ul>
                <li><a href="#/"><i class="icon-home circle-icon"></i>Accueil</a></li>
                <li class="dropdown">
                    <a href="" id="manager" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-cog circle-icon"></i>Manager
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/manager/comptes">Comptes</a></li>  
                        <li><a href="#/manager/maintenance">Maintenance</a></li>       
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="" id="pages" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-sitemap circle-icon"></i>Pages
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/pages/list">Pages</a></li>                                      <li><a href="#/pages/edit/new">Ajouter</a></li> 
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="" id="portfolio" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-picture  circle-icon"></i>Portfolio
                    </a>
                        <ul class="dropdown-menu">
                            <li><a href="#/portfolio/list">Liste</a></li> 
                            <li><a href="#/portfolio/edit/new">Ajouter</a></li> 
                            <li><a href="#/portfolio/categories">Catégories</a></li>
                        </ul>
                </li>
                <li class="dropdown">
                    <a href="" id="news" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-bullhorn circle-icon"></i>News
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/news/list">Liste</a></li> 
                        <li><a href="#/news/edit/new">Ajouter</a></li>  
                    </ul>
                </li>  
                <li class="dropdown">
                    <a href="" id="messages" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-comment circle-icon"></i>Messages
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#/contacts/messages">Messages</a></li> 
                        <li><a href="#/contacts/contacts">Contacts</a></li> 
                        <li><a href="#/contacts/spams">Spams</a></li>        
                        <li><a href="#/contacts/config">Configuration</a></li>  
                    </ul>
                </li>   
            </ul>
        </nav>

                       
                        
        <div id="container">
            <div ng-view class="inner"></div>
        </div>
        

        <footer>

        </footer>
    
    </body>

        <!-- scripts en bas de page -->

        <script>
            var globalVars = [];
            globalVars.user_id = '<?=$user_id?>'
        </script> 

        <?= print_js('admin_foot'); ?>
        

</html>