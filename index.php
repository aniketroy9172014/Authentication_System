<?php
require 'Config.php';

 if(!$conn){
  die("Connection faild". mysqli_connect_error());
 }

 if($_SERVER['REQUEST_METHOD']=="POST"){
  $email=$_POST['email'];
  $pass=$_POST['pass'];

  $sql= "SELECT * FROM `users` WHERE email='$email'";
  $result= mysqli_query($conn, $sql);
  $num=mysqli_num_rows($result);

  $validUser=0;
  if($num>0){
    while($row=mysqli_fetch_assoc($result)){
      if($row["password"]==$pass){
        $_SESSION["Login"]=true;
        $_SESSION["id"]= $row["id"];
        $validUser=true;
      }
    }
    if($validUser){
      header("Location: Welcome.php");
      exit;
    }else{
      echo '<script>alert("Invalid Password")</script>';
    }
  }else{
    echo '<script>alert("Invalid Email")</script>';
  }

 }
?>


<!DOCTYPE html>
<html>

<head>
  <title>CyberGate-Login</title>

  <link rel="stylesheet" href="style.css">

</head>

<body>

  <div class="wrapper">

    <form action="" method="POST">
      <h1>Login Page</h1>
      <div class="input-box">
        <input type="email" name="email" placeholder="Email" required>
      </div>

      <div class="input-box">
        <input type="password" name="pass" id="loginPass" placeholder="Password" required autocomplete="off" style="background: transparent; border: 2px solid rgba(255,255,255,0.381); outline: none; border-radius: 40px; font-size: 16px; color: #fff; padding: 20px 45px 20px 20px; position: relative; z-index: 1;" onmouseover="this.style.background='rgba(255,255,255,0.571)'" onmouseout="this.style.background='transparent'">
        <span class="show-password" onclick="togglePassword('loginPass', this)" style="user-select:none;">Show</span>

  <style>
    .show-password {
      position: absolute;
      right: 35px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      user-select: none;
      z-index: 2;
    }
    .input-box {
      position: relative;
    }
  </style>
  <script>
    function togglePassword(inputId, el) {
      const input = document.getElementById(inputId);
      if (input.type === "password") {
        input.type = "text";
        el.textContent = "Hide";
      } else {
        input.type = "password";
        el.textContent = "Show";
      }
    }
  </script>
      </div>

      <button class="btn" type="submit">Login</button>

      <div class="register-link">
        <p>Not Register? <a href="Signin.php">Signin here</a></p>
        <p>OR</p>
      </div>
      <a href="#" class="btn">
        <img src="google.png" alt="Google Logo"> Signup with Google
    </a>
    </form>

  </div>


</body>

</html>