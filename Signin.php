<?php
 require 'Config.php';
 
 if(!$conn){
  die("Connection faild". mysqli_connect_error());
 }

 if($_SERVER['REQUEST_METHOD']=="POST"){
  $name=trim($_POST['name']);
  $email=trim($_POST['email']);
  $pass=$_POST['pass'];

  // Server-side validation
  $errors = [];
  if (!preg_match('/^[A-Za-z][A-Za-z\s]{1,}$/', $name)) {
    $errors[] = "Please enter a valid name (at least 2 letters, only alphabets and spaces, must start with a letter).";
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format.";
  }
  if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\\\|,.<>\/?]).{8,}$/", $pass)) {
    $errors[] = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  // Check if email already exists
  $checkEmailSql = "SELECT id FROM users WHERE email='" . mysqli_real_escape_string($conn, $email) . "' LIMIT 1";
  $checkEmailResult = mysqli_query($conn, $checkEmailSql);
  if ($checkEmailResult && mysqli_num_rows($checkEmailResult) > 0) {
    $errors[] = "Email already exists. Please use another email.";
  }

  if (empty($errors)) {
    $sql= "INSERT INTO `users`(`name`, `email`, `password`) VALUES ('" . mysqli_real_escape_string($conn, $name) . "','" . mysqli_real_escape_string($conn, $email) . "','" . mysqli_real_escape_string($conn, $pass) . "')";
    $result= mysqli_query($conn, $sql);

    if($result){
    header("Location: index.php");
      exit;
    } else {
      echo '<script>alert("Registration failed. Please try again.")</script>';
    }
  } else {
    foreach($errors as $err) {
      echo '<script>alert("' . addslashes($err) . '")</script>';
    }
  }
 }
?>


<!DOCTYPE html>
<html>

<head>
  <title>CyberGate-Signin</title>

  <link rel="stylesheet" href="style.css">
  <script>
  // Client-side validation for Signin form
  function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  }

  function validateForm() {
      const form = document.forms["signinForm"];
      let name = form["name"].value.trim();
      const email = form["email"].value.trim();
      const pass = form["pass"].value;
      let nameRegex = /^[A-Za-z][A-Za-z\s]{1,}$/;
      let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!nameRegex.test(name)) {
          alert("Please enter a valid name (at least 2 letters, only alphabets and spaces, must start with a letter).");
          return false;
      }
      // Convert name to title case before submission
      name = toTitleCase(name);
      form["name"].value = name;
      if (!passRegex.test(pass)) {
          alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
          return false;
      }
      return true;
  }
  </script>
</head>

<body>

  <div class="wrapper">
    <form name="signinForm" action="" method="POST" onsubmit="return validateForm();">
      <h1>Signin Page</h1>

      <div class="input-box">
        <input type="text" name="name" placeholder="Name" required>
      </div>


      <div class="input-box">
        <input type="email" name="email" placeholder="Email" required>
      </div>

      <div class="input-box">
        <input type="password" name="pass" id="signinPass" placeholder="Password" required autocomplete="off" style="background: transparent; border: 2px solid rgba(255,255,255,0.381); outline: none; border-radius: 40px; font-size: 16px; color: #fff; padding: 20px 45px 20px 20px; position: relative; z-index: 1;" onmouseover="this.style.background='rgba(255,255,255,0.571)'" onmouseout="this.style.background='transparent'">
        <span class="show-password" onclick="togglePassword('signinPass', this)" style="user-select:none;">Show</span>

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

      <button class="btn" type="submit">Signup</button>


      <div class="register-link">
        <p>alrady Register? <a href="index.php">Login here</a></p>
        <p>OR</p>
      </div>
      <a href="<?= $url ?>" class="btn">
        <img src="google.png" alt="Google Logo"> Signup with Google
    </a>
    </form>
  </div>


</body>

</html>