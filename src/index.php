<?php
// Iniciar sesión.
session_start();
// Verificar si la variable de sesión "auth" está definida.
if (isset($_SESSION["auth"])) {
    // Redirigir al usuario a la página "main.php".
    header("Location: main.php");
    // Salir del script.
    exit();
}
// Obtener el idioma almacenada en cookies.
$lang = isset($_COOKIE["lang"]) ? $_COOKIE["lang"] : "es";
$file_path = "./languages/{$lang}.json";
// Comprobar si el archivo existe y si tiene un tamaño mayor que cero antes de leerlo.
if (file_exists($file_path) && filesize($file_path) > 0) {
    $json_str = file_get_contents($file_path);
} else {
    $json_str = file_get_contents("./languages/es.json");
}
// Guardar los datos JSON en el almacenamiento de sesión del usuario.
$json_data = json_decode($json_str, true);
$_SESSION["lang"] = $json_data;
?>
<!doctype html>
<html lang="<?php echo $lang ?>">

<head>
    <!-- Metas -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <!-- favicon.icon -->
    <link rel="shortcut icon" href="./assets/images/logo.svg" type="image/x-icon">
    <!-- Titulo -->
    <title>LIBRARY PLUS</title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.css">
    <!-- Css -->
    <link rel="stylesheet" href="./scss/css/styles.css">
</head>

<body>
    <!-- Contenedor -->
    <div class="d-flex justify-content-center align-items-center min-vh-100" id="container">
        <div class="bg-white p-5 rounded-4 shadow-lg" style="width: 25rem">
            <header class="d-flex flex-column align-items-center justify-content-center">
                <img src="./assets/images/logo.svg" alt="Logo" class="w-25 mb-3">
                <h1 class="text-center text-uppercase" id="logo">LIBRARY<br>PLUS</h1>
            </header>
            <h3 class="text-center">
                <?php echo $_SESSION["lang"]["Index.php"]["Login"]; ?>
            </h3>
            <!-- Formulario -->
            <form action="" method="" id="loginForm">
                <!-- Nombre de usuario -->
                <div class="input-group mt-3">
                    <div class="input-group-text">
                        <img src="./assets/images/user.svg" alt="User Name Icon" style="width: 1.5rem">
                    </div>
                    <input type="text" class="form-control" id="username" name="username"
                        placeholder="<?php echo $_SESSION["lang"]["Index.php"]["Username"]; ?>" autocomplete="off"
                        required>
                </div>
                <!-- Contraseña -->
                <div class="input-group mt-1">
                    <div class="input-group-text">
                        <img src="./assets/images/password.svg" alt="Password Icon" style="width: 1.5rem">
                    </div>
                    <input type="password" class="form-control" id="userPassword" name="userPassword"
                        placeholder="<?php echo $_SESSION["lang"]["Index.php"]["Password"]; ?>" autocomplete="off"
                        required>
                    <span class="input-group-text">
                        <img src="./assets/images/closeEye.svg" alt="Show Password Icon" class="showPassword"
                            style="width: 1.5rem; cursor: pointer;">
                    </span>
                </div>
                <!-- Botones del formulario -->
                <div class="col-12 mt-3">
                    <button type="submit" class="loginButton buttonStyle btn btn-primary mt-1 w-100" id="loginButton"
                        name="buttonLogInButton">
                        <?php echo $_SESSION["lang"]["Index.php"]["Buttons"]["Login"]; ?>
                    </button>
                    <button type="reset" class="resetLogInButton buttonStyle btn btn-dark mt-1 w-100"
                        id="resetLogInButton" name="resetLogInButton">
                        <?php echo $_SESSION["lang"]["Index.php"]["Buttons"]["Reset"]; ?>
                    </button>
                </div>
            </form>
            <hr>
            <!-- Botones de idiomas -->
            <div class="row d-flex justify-content-center">
                <div id="langButtons" class="col-auto">
                    <div class="hstack mt-1">
                        <button class="langButton btn p-1" id="es">
                            <img src="./assets/images/es.svg" alt="Es Icon" class="langIcon" width="25">
                        </button>
                        <button class="langButton btn p-1" id="en">
                            <img src="./assets/images/uk.svg" alt="Uk Icon" class="langIcon" width="25">
                        </button>
                        <button class="langButton btn p-1" id="fr">
                            <img src="./assets/images/fr.svg" alt="Fr Icon" class="langIcon" width="25">
                        </button>
                        <button class="langButton btn p-1" id="it">
                            <img src="./assets/images/it.svg" alt="It Icon" class="langIcon" width="25">
                        </button>
                        <button class="langButton btn p-1" id="ar">
                            <img src="./assets/images/sy.svg" alt="Sy Icon" class="langIcon" width="25">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Jquery, Popper y Bootstrap Js -->
    <script src="./node_modules/jquery/dist/jquery.min.js"></script>
    <script src="./node_modules/popper.js/dist/umd/popper.min.js"></script>
    <script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- Js -->
    <script src="./ts/js/index.js"></script>
    <script src="./ts/js/showPassword.js"></script>
    <script src="./ts/js/throwModal.js"></script>
    <script src="./ts/js/acceptCookies.js"></script>
    <script src="./ts/js/changeLang.js"></script>
    <script src="./ts/js/loader.js"></script>
</body>

</html>