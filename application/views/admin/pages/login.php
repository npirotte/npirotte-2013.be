<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?=$site_name?> - Admin / login</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- css compiler -->

        <?= print_css('admin'); ?>
        
    </head>

    <html>
    <body id="logon" class="<?= count($client_users) === 0 ? 'user-selected' : '';?>">

<br />
<header>
    <h1><?=$site_name?></h1>
</header>

<div id="browser-users">
     <?php foreach($client_users as $client_user): ?>
        <div data-username="<?= $client_user['username']; ?>" class="user clearfix">
           <div class="user_thumb" style="background-image: url(<?= site_url('assets/image/users~'.$client_user['user_id'].'~thumbs/80x80/'.$client_user['src']); ?>)"></div>
           <span class="user_name"><?= $client_user['last_name']; ?> <?= $client_user['first_name']; ?></span>
           <i class="fa fa-angle-right"></i>
        </div>
     <?php endforeach; ?>
    <br />
     <a class="user <?= count($client_users) === 0 ? 'selected' : '';?>" id="new_user">Nouvel utilisateur <i class="fa fa-plus"></i></a>
</div>

<div id="container" class="container">
    <div id="alert" style="display: none"></div>
    <form id="logonForm" data-lang="fr"  class="ajax-form" action="/index.php/session/login" method="POST" accept-charset="utf-8">
        
        <div class="form-group clearfix hide-for-existing <?= count($client_users) === 0 ? '' : 'hide';?>">
            <span class="add-on"><i class="fa fa-user"></i></span>
            <input class="col-xs-12" type="text" id="inputName" name="name" placeholder="Identifiant" >
        </div>

        <div class="form-group clearfix">
                <span class="add-on"><i class="fa fa-lock"></i></span>
                <input class="col-xs-12" type="password" id="inputPwd" name="pwd" placeholder="Mot de passe">
        </div>

        <div class="form-group clearfix remember">
            <label class="checkbox">
              <input type="checkbox" name="remember" value="true"> Se souvenir de moi
            </label>
        </div>


        <button type="submit" class="btn btn-success btn-lg btn-block btn-ripple">Connection<i class="fa fa-ok-sign"></i></button>
    </form>
    
    <footer>
        <?php if(count($client_users) > 0): ?>
            <button id="back" class="btn btn-lnk"><i class="fa fa-angle-left"></i> Retour</button>
        <?php endif; ?>
    </footer>
    
</div>
    
    </body>

     <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js" charset="utf-8"></script>
        <script>window.jQuery || document.write('<script src="/<?= APPPATH?>front/framework/js/jquery-2.1.1.min.js"><\/script>')</script>

        <?= print_js('admin_logon_foot'); ?>


</html>