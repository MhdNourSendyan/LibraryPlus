<?php
// Incluir la base de datos.
include_once("./php/db.php");
// Iniciar sesión.
session_start();
// Verificar si la variable de sesión "auth" no está definida y no es verdadera.
if (!isset($_SESSION["auth"])) {
    // Redirigir al usuario a la página de inicio de sesión (index.php).
    header("Location: index.php");
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
<!doctype html>
<html lang="<?php echo $lang ?>">

<head></head>
<!-- Metas -->
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
<!-- favicon.icon  -->
<link rel="shortcut icon" href="./assets/images/write.svg" type="image/x-icon">
<!-- Titulo -->
<title>
    <?php echo $_SESSION["lang"]["sendRequests.php"]["Title"]; ?>
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
        <h1 class="text-center text-capitalize">
            <img src="./assets/images/write.svg" alt="Request Icon" style="width: 2.5rem;">
            &nbsp;
            <?php echo $_SESSION["lang"]["sendRequests.php"]["H1"]["Solicit"]; ?>
            &nbsp;
            <img src="./assets/images/write.svg" alt="Request Icon" style="width: 2.5rem;">
        </h1>
        <hr>
        <!-- Formulario -->
        <form action="" method="" class="px-4" id="requestForm">
            <input type="hidden" id="hiddenUserId" name="hiddenUserId"
                value="<?php echo $_SESSION["userInfo"]["userId"]; ?>">
            <!-- Datos del professor -->
            <fieldset class="mb-2">
                <legend class="border-bottom border-dark">
                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["TeacherData"]; ?>:
                </legend>
                <div class="row my-2">
                    <!-- Nombre de usuario -->
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="requestUsername" class="col-form-label text-primary">
                                <b>
                                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["Username"]; ?>:
                                </b>
                            </label>
                            <input type="text" class="form-control" id="requestUsername" name="requestUsername" value="<?php
                            // Crear una nueva conexión a la base de datos.
                            $pdo = new DB();
                            // Realizar una consulta preparada con el nombre de usuario.
                            $pdo->query("SELECT username FROM users WHERE userId = ?");
                            $pdo->bind(1, $_SESSION["userInfo"]["userId"], PDO::PARAM_INT);
                            $pdo->execute();
                            echo $pdo->single()["username"];
                            $pdo->close();
                            ?>" disabled>
                        </div>
                    </div>
                    <!-- Nombre completo -->
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="requestUserFullName" class="col-form-label text-primary">
                                <b>
                                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["UserFullName"]; ?>:
                                </b>
                            </label>
                            <input type="text" class="form-control" id="requestUserFullName" name="requestUserFullName"
                                value="<?php
                                // Crear una nueva conexión a la base de datos.
                                $pdo = new DB();
                                // Realizar una consulta preparada con el nombre de usuario.
                                $pdo->query("SELECT userFullName FROM users WHERE userId = ?");
                                $pdo->bind(1, $_SESSION["userInfo"]["userId"], PDO::PARAM_INT);
                                $pdo->execute();
                                echo $pdo->single()["userFullName"];
                                $pdo->close();
                                ?>" disabled>
                        </div>
                    </div>
                </div>
                <!-- Correo de usuario -->
                <div class="row my-2">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="requestUserEmail" class="col-form-label text-primary">
                                <b>
                                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["Email"]; ?>:
                                </b>
                            </label>
                            <input type="email" class="form-control" id="requestUserEmail" name="requestUserEmail"
                                value="<?php
                                // Crear una nueva conexión a la base de datos.
                                $pdo = new DB();
                                // Realizar una consulta preparada con el nombre de usuario.
                                $pdo->query("SELECT userEmail FROM users WHERE userId = ?");
                                $pdo->bind(1, $_SESSION["userInfo"]["userId"], PDO::PARAM_INT);
                                $pdo->execute();
                                echo $pdo->single()["userEmail"];
                                $pdo->close();
                                ?>" disabled>
                        </div>
                    </div>
                </div>
            </fieldset>
            <!-- Datos del alumno -->
            <fieldset class="mb-2">
                <legend class="border-bottom border-dark">
                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["StudentData"]; ?>:
                </legend>
                <div class="row my-2">
                    <!-- Nombre completo del alumno -->
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="requestStudentFullName" class="col-form-label text-primary required">
                                <b>
                                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["StudentFullName"]; ?>:
                                </b>
                            </label>
                            <input type="text" class="form-control" id="requestStudentFullName"
                                name="requestStudentFullName"
                                placeholder="<?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["StudentFullName"]; ?>"
                                maxlength="255" autocomplete="off" required>
                            <div class="invalid-feedback">
                                <?php echo $_SESSION["lang"]["sendRequests.php"]["InvalidFeedback"]["UserFullName"]; ?>
                            </div>
                        </div>
                    </div>
                    <!-- Correo del alumno -->
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="requestStudentEmail" class="col-form-label text-primary required">
                                <b>
                                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["StudentEmail"]; ?>:
                                </b>
                            </label>
                            <input type="email" class="form-control" id="requestStudentEmail" name="requestStudentEmail"
                                placeholder="<?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["StudentEmail"]; ?>"
                                value="<?php echo "@educa.madrid.org"; ?>" maxlength="255" autocomplete="off" required>
                            <div class="invalid-feedback">
                                <?php echo $_SESSION["lang"]["sendRequests.php"]["InvalidFeedback"]["Email"]; ?>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Libros y dispositivos -->
                <div class="row my-2">
                    <!-- Libros -->
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="requestBooks" class="col-form-label text-primary">
                                <b>
                                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["BooksRequests"]; ?>:
                                </b>
                            </label>
                            <input type="text" class="form-control" id="requestBooks" name="requestBooks"
                                placeholder="<?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["BooksRequestsExample"]; ?>"
                                maxlength="255" autocomplete="off">
                            <div class="invalid-feedback">
                                <?php echo $_SESSION["lang"]["sendRequests.php"]["InvalidFeedback"]["Format"]; ?>
                            </div>
                        </div>
                    </div>
                    <!-- Dispositivos -->
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="requestDevice" class="col-form-label text-primary">
                                <b>
                                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["DeviceRequest"]; ?>:
                                </b>
                            </label>
                            <input type="text" class="form-control" id="requestDevice" name="requestDevice"
                                placeholder="<?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["DeviceRequestsExample"]; ?>"
                                maxlength="255" autocomplete="off">
                            <div class="invalid-feedback">
                                <?php echo $_SESSION["lang"]["sendRequests.php"]["InvalidFeedback"]["Format"]; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <!-- Mensaje -->
            <div class="row my-2">
                <div class="col-12">
                    <label for="requestText" class="col-form-label text-primary required">
                        <b>
                            <?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["TextArea"]; ?>:
                        </b>
                    </label>
                </div>
                <div class="col-sm">
                    <textarea class="form-control" id="requestText" name="requestText"
                        placeholder="<?php echo $_SESSION["lang"]["sendRequests.php"]["Form"]["TextArea"]; ?>" rows="5"
                        autocomplete="off" required></textarea>
                    <div class="invalid-feedback">
                        <?php echo $_SESSION["lang"]["sendRequests.php"]["InvalidFeedback"]["TextArea"]; ?>
                    </div>
                </div>
            </div>
            <!-- Botones -->
            <div class="text-center my-2">
                <button type="submit" class="buttonStyle btn btn-primary" id="submitRequestsButton"
                    name="submitRequestsButton" disabled>
                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Buttons"]["Send"]; ?>
                </button>
                <button type="reset" class="buttonStyle btn btn-dark" id="resetRequestsButton"
                    name="resetRequestsButton">
                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Buttons"]["Reset"]; ?>
                </button>
                <br>
                <button type="button" class="buttonStyle btn btn-dark mt-1" onclick="location.href='index.php';">
                    <?php echo $_SESSION["lang"]["sendRequests.php"]["Buttons"]["GoBack"]; ?>
                </button>
            </div>
        </form>
    </div>
    <!-- Footer -->
    <?php include_once("footer.php"); ?>
    <!-- Jquery, Popper y Bootstrap Js -->
    <script src="./node_modules/jquery/dist/jquery.min.js"></script>
    <script src="./node_modules/popper.js/dist/umd/popper.min.js"></script>
    <script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- Js -->
    <script src="./ts/js/sendRequests.js"></script>
    <script src="./ts/js/clock.js"></script>
    <script src="./ts/js/throwModal.js"></script>
    <script src="./ts/js/acceptCookies.js"></script>
    <script src="./ts/js/changeLang.js"></script>
    <script src="./ts/js/loader.js"></script>
    <script src="./ts/js/autoLogout.js"></script>
</body>

</html>