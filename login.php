<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "users";
$conn = mysqli_connect($servername, $username, $password, $database);
if (!$conn) {
    die("Błąd połączenia z bazą danych: " . mysqli_connect_error());
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    $username = mysqli_real_escape_string($conn, $username);
    $password = mysqli_real_escape_string($conn, $password);
    $query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) == 1) {
        header("Location: gra.html");
        echo "wszystko git";
        exit();
    } else {
        echo "Nieprawidłowy login lub hasło";
    }
}
mysqli_close($conn);