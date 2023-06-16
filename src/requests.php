<?php
// Incluir la base de datos.
include_once("./php/db.php");
// Iniciar sesión.
session_start();
// Verificar si la variable de sesión "auth" está definida y es verdadera.
if (isset($_SESSION["auth"])) {
    // Verificar si el ID del usuario que inició sesión (almacenado en la variable de sesión "userInfo") es igual a 1 (es decir, si el usuario es un administrador).
    if ($_SESSION["userInfo"]["userId"] != 1) {
        // Si el usuario no es un administrador, redirigirlo a la página principal (main.php).
        header("location: main.php");
        // Terminar la ejecución del script actual.
        exit();
    }
} else {
    // Si el usuario no ha iniciado sesión, redirigirlo a la página de inicio de sesión (index.php).
    header("location: index.php");
    // Terminar la ejecución del script actual.
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
<!DOCTYPE html>
<html lang="<?php echo $lang ?>">

<head>
    <!-- Metas -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=request-width, initial-scale=1, user-scalable=yes">
    <!-- favicon.icon -->
    <link rel="shortcut icon" href="./assets/images/write.svg" type="image/x-icon"><!-- Titulo -->
    <title>
        <?php echo $_SESSION["lang"]["Requests.php"]["Title"]; ?>
    </title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.css">
    <!-- Css -->
    <link rel="stylesheet" href="./scss/css/styles.css">
</head>

<body>
    <!-- Header -->
    <?php include_once("header.php"); ?>
    <!-- Contenedor -->
    <div class="container-xl bg-white p-3 rounded-4 shadow-lg">
        <h1 class="text-center text-capitalize" id="request">
            <img src="./assets/images/write.svg" alt="Request Icon" style="width: 2.5rem;">
            &nbsp;
            <?php echo $_SESSION["lang"]["Requests.php"]["H1"]["Requests"]; ?>
            &nbsp;
            <img src="./assets/images/write.svg" alt="Request Icon" style="width: 2.5rem;">
        </h1>
        <hr>
        <!-- Búsqueda de solicitudes -->
        <div class="row d-flex justify-content-end">
            <div class="col-auto">
                <form action="" method="" class="p-0" id="searchRequestForm">
                    <div class="input-group">
                        <input type="search" class="form-control" id="searchRequestInput" name="searchRequestInput"
                            placeholder="<?php echo $_SESSION["lang"]["Requests.php"]["Search"]; ?>" autocomplete="off">
                        <button type="submit" class="btn btn-primary" id="deleteSearchRequestButton"
                            name="deleteSearchRequestButton">
                            <img src="./assets/images/search.svg" alt="Search Icon" style="width: 25px;">
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <!-- Paginación de solicitudes -->
        <div id="requestsPagination"></div>
        <!-- Contenedor de solicitudes -->
        <div id="requestsContainer"></div>
    </div>
    <!-- Footer -->
    <?php include_once("footer.php"); ?>
    <!-- Jquery, Popper y Bootstrap Js -->
    <script src="./node_modules/jquery/dist/jquery.min.js"></script>
    <script src="./node_modules/popper.js/dist/umd/popper.min.js"></script>
    <script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- Js -->
    <script src="./ts/js/requests.js"></script>
    <script src="./ts/js/clock.js"></script>
    <script src="./ts/js/throwModal.js"></script>
    <script src="./ts/js/changeLang.js"></script>
    <script src="./ts/js/loader.js"></script>
    <script src="./ts/js/autoLogout.js"></script>
</body>

</html>