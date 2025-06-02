<?php
require 'Config.php';
 if(session_status()==PHP_SESSION_NONE){
  session_start();
 }

 if(!empty($_SESSION["id"])){
    $id= $_SESSION['id'];
    $sql= "SELECT * FROM `users` WHERE `id`='$id'";
    $result= mysqli_query($conn, $sql);
    $num=mysqli_num_rows($result);

    if($result && $num>0){
      $row=mysqli_fetch_assoc($result);
    }else{
      $row=null;
      echo "<script>
      alert('please login again');
      window.location.href='index.php';
      </script>";
      exit;

    }

 }else{
  $row=null;
  echo "<script>
  alert('Server problem, please login again');
  window.location.href = 'index.php';
  </script>";
  exit;

 }

?>


<!DOCTYPE html>
<html>
<head>

  <title>CyberGate-Welcome</title>
  <link rel="stylesheet" href="style.css">

</head>
<body>

<div class="wrapper">
  <h1>Welcome <br><?php echo $row["name"];?></h1>

  <button class="btn" onclick="window.location.href='Logout.php'">Logout</button>

</div>

</body>
</html>