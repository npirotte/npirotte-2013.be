<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="<?=$header_viewmodel->lang?>"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <base href="<?=site_url()?>">
        <title><?=$header_viewmodel->meta_title?></title>
        <meta name="description" content="<?=$header_viewmodel->meta_description?>">
        <meta name="keywords" content="<?=$header_viewmodel->keywords_to_string()?>">
        <meta name="viewport" content="width=device-width">
        <link rel="shortcut icon" type="images/x-icon" href="./favicon.ico" />

        <!-- css compiler -->
        <?= print_css('default'); ?>
        
        <!-- scripts en début de page -->

        <?= print_js('default_head'); ?>
        <script>
            var panelIsSwitched = false;

            var baseVars = {
                lang : "<?=$header_viewmodel->lang?>",
                applicationPath : "<?=site_url()?>"
            }
        </script>
        
    </head>

    <body class="<?=$header_viewmodel->body_class?>">