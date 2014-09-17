<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Installation</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- css compiler -->

        <?= print_css('admin'); ?>
        
    </head>

    <html>
    <body id="install" ng-app="installer">

        <br />
        <header class="container text-center">
            <h1>Installation</h1>
        </header>

        <section class="container installation form-horizontal" ng-view>            
        </section>
    
    </body>

     <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js" charset="utf-8"></script>
    <script>window.jQuery || document.write('<script src="/<?= APPPATH?>front/framework/js/jquery-2.1.1.min.js"><\/script>')</script>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.20/angular.min.js" charset="utf-8"></script>
    <script src="/<?= APPPATH ?>front/framework/js/angular-1.2.3/angular-route.min.js" charset="utf-8"></script>
    <script src="/<?= APPPATH ?>front/admin/js/angular.install.js" charset="utf-8"></script>

</html>