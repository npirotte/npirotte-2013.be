<?php 
/**
 * 
 */
 class File_upload extends CI_Controller
 {

  public function __construct()
  {
    parent::__construct();
    $this->load->helper('directory');
    $this->load->helper('file');
  }
 	

public function image()
 {

    $originalName = $_FILES['file']['name'];
    $fileType = $_FILES['file']['type'];
    $uploadFolder = $_POST['folder'];
    $fileContent = $_FILES['file']['tmp_name'];
    $dataUrl = 'data:' . $fileType . ';base64,' . base64_encode($fileContent);

    $minW = $_POST['minW'];
    $minH = $_POST['minH'];
    $crop = $_POST['crop'];

    $fileName = $_POST['name'];

    // on enleve l'extention si elle existe
    $trouve_moi = ".";
    // cherche la postion du '.'  
    $position = strpos($fileName, $trouve_moi);
    
    // enleve l'extention, tout ce qui se trouve apres le '.' 
    if ($position) {
      $fileName = substr($fileName, 0, $position);
    }

    $fileName = url_title($fileName, 'dash', TRUE);
    $fileNameCopy = $fileName;

    $error = 0;
    $message = '';

    list($width, $height) = getimagesize($fileContent);

    if(isset($_FILES['file']))
    { 

      $extension = strrchr($originalName, '.');
      $extensions = array('.png', '.gif', '.jpg', '.jpeg');
      $fileName = $fileName.$extension;
      $dossier = check_dir(APPPATH.'assets/temp/');



      if(!in_array($extension, $extensions)) //Si l'extension n'est pas dans le tableau
      {
        $error = 1;
        $message = 'Vous devez uploader un fichier de type png, gif, jpg ou jpeg';
      };

      if ($width < $minW || $height < $minH) // si l'image est trop petite
      {
        $error = 1;
        $message = "L'image doit être au minimum de ".$minW."x".$minH." px";
      }
      else if ($crop == 0)
      {
        $dossier = check_dir(APPPATH.$uploadFolder);
      }

      if ($width == $minW && $height == $minH)  // si l'image est aux parfaites dimentions
      {
        $dossier = check_dir(APPPATH.$uploadFolder);
        $crop = 0;
      }

      // si le fichier existe on inxrémente

      $i = 2;
      while (file_exists(APPPATH.$uploadFolder.$fileName)) {
        $fileName = $fileNameCopy.'-'.$i++.$extension;
      }

      if ($error === 0) //Si pas d'erreurs on upload
      { 
        if (move_uploaded_file($fileContent, $dossier.$fileName)) 
        {
          $message = 'Image uploadée avec succès !';
        }
        else 
        {
          $error = 1;
          $message = 'Une erreur est survenue';
        }
      }
    };

    $json = array(
        'error' => $error,
        'newName' => $fileName,
        'message' => $message,
        'crop' => $crop
    );

    $this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
    $this->output->set_output(json_encode($json));
}

public function file()
{
   $originalName = $_FILES['file']['name'];
    $fileType = $_FILES['file']['type'];
    $uploadFolder = $_POST['folder'];
    $fileContent = $_FILES['file']['tmp_name'];
    $dataUrl = 'data:' . $fileType . ';base64,' . base64_encode($fileContent);

    $fileName = $_POST['name'];
    // on enleve l'extention si elle existe
    $trouve_moi = ".";
    // cherche la postion du '.'  
    $position = strpos($fileName, $trouve_moi);
    
    // enleve l'extention, tout ce qui se trouve apres le '.' 
    $fileName = substr($fileName, 0, $position);

    $fileName = url_title($fileName, 'dash', TRUE);

    $error = 0;
    $message = '';

    if(isset($_FILES['file']))
    { 

      $extension = strrchr($originalName, '.');
      $extensions = array('.php', '.htaccess');
      //$fileName = $fileName//.$extension;
      $dossier = check_dir(APPPATH.'assets/temp/');



      if(in_array($extension, $extensions)) //Si l'extension est dans le tableau
      {
        $error = 1;
        $message = 'Vous ne pouvez uploader un fichier de type php';
      };

      $dossier = $uploadFolder;
      $dossier = check_dir(APPPATH.$uploadFolder);

      $originalName = $fileName;
      $i = 1;

      // on incrémente le nom s'il existe
      while(read_file($dossier.$fileName.$extension))
      {
        $fileName = $originalName.'-'.$i++;
      };

      $fileName = $fileName.$extension;

      if ($error === 0) //Si pas d'erreurs on upload
      { 
        if (move_uploaded_file($fileContent, $dossier.$fileName)) 
        {
          $message = 'Image uploadée avec succès !';
        }
        else 
        {
          $error = 1;
          $message = 'Une erreur est survenue';
        }
      }
    };

    $json = array(
        'error' => $error,
        'newName' => $fileName,
        'message' => $message,
    );

    $this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
    $this->output->set_output(json_encode($json));
}


public function crop_image()
{

              //$item = $_POST;
              $item = json_decode(file_get_contents('php://input'));
              $item = get_object_vars($item);

              // on vérifier que le dossier existe

              $dossier = check_dir(APPPATH.$item['folder']);


              $config['image_library'] = 'gd2'; 
              $config['source_image'] = APPPATH.$item['src']; 
              $config['new_image'] =  APPPATH.$item['newSrc'];  
              $config['maintain_ratio'] = FALSE; 
              $config['x_axis'] = $item['x'];
              $config['y_axis'] = $item['y'];
              $config['width'] = $item['w']; 
              $config['height'] = $item['h']; 
              $confif['quality'] = 100;
              $this->load->library('image_lib', $config);
              $this->image_lib->crop(); 
              $this->image_lib->clear();

              $config['width'] = $item['maxW']; 
              $config['height'] = $item['maxH']; 
              $config['x_axis'] = 0;
              $config['y_axis'] = 0;
              $confif['quality'] = 80;
              $config['maintain_ratio'] = TRUE; 
              $config['source_image'] = APPPATH.$item['newSrc']; 
              $config['new_image'] = APPPATH.$item['newSrc']; 
              $this->image_lib->initialize($config); 
              $this->image_lib->resize(); 

              $this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
              $this->output->set_output(json_encode($item));
}


 } 

 ?>