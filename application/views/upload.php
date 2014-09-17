<form id="fichier" action="/file_upload/image/portfolio_thumbs" enctype="multipart/form-data" method="POST">
    <input name="MAX_FILE_SIZE" type="hidden" value="1000000" />
    <h5>Fichier :</h5>
    <input id="file" name="userfile" type="file" />
    <div id="uploadOutput"></div>
</form>


<script src="http://malsup.github.com/jquery.form.js"></script>


<script type="text/javascript">
$(document).ready(function() {
    // Upload de fichier en ajax sur la base du plugin jquery.form
    $('#fichier').ajaxForm({
        dataType:  'json', // Très important pour traiter les données renvoyées par PHP en json
                // Pendant toute la phase d'envoi du fichier, on affiche un gif animé
        beforeSubmit: function(){
            $('#uploadOutput').html('chargement'); // L'animation de chargement
        },
                // Si l'appel à la fonction a fonctionnée
        success:function(data){
            // Si erreur est set à 1... on annule et on prévient
            if(data.erreur=='1'){
                $('#uploadOutput').html(data.message); // On affiche le message d'erreur dans la div
            }
            // Si tout c'est bien passé, on affiche l'image
            else{
                $('#uploadOutput').html('<img src="/assets/images/portfolio/thumbs/'+data.infos['upload_data']['file_name']+'" />');
                console.log(data.infos);
            }
        }
    });
 
   // A la selection d'une image, on submit automatiquement le formulaire
    $('#file').change(function() {
        $('#fichier').submit();
    });
})
</script>