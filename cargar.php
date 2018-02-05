<?php
$imagen_path="img/texturas/".$_FILES['data']['name'];
if(move_uploaded_file( $_FILES['data']['tmp_name'],$imagen_path)){
  echo $imagen_path;
}else{
  echo "Hubo un error";
}
?>