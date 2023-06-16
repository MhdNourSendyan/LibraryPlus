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

<head>
    <!-- Metas -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <!-- favicon.icon  -->
    <link rel="shortcut icon" href="./assets/images/contact.svg" type="image/x-icon">
    <!-- Titulo -->
    <title>
        <?php echo $_SESSION["lang"]["sendMessages.php"]["Title"]; ?>
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
            <img src="./assets/images/contact.svg" alt="Contact Icon" style="width: 2.5rem;">
            &nbsp;
            <?php echo $_SESSION["lang"]["sendMessages.php"]["H1"]["ContactTheAdministrator"]; ?>
            &nbsp;
            <img src="./assets/images/contact.svg" alt="Contact Icon" style="width: 2.5rem;">
        </h1>
        <hr>
        <!-- Formulario -->
        <form action="" method="" class="px-4" id="sendMessagesForm">
            <input type="hidden" id="hiddenUserId" name="hiddenUserId"
                value="<?php echo $_SESSION["userInfo"]["userId"]; ?>">
            <div class="row my-2">
                <!-- Nombre de usuario -->
                <div class="col-12 col-md-6">
                    <div class="form-group">
                        <label for="messageUsername" class="col-form-label text-primary">
                            <b>
                                <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["Username"]; ?>:
                            </b>
                        </label>
                        <input type="text" class="form-control" id="messageUsername" name="messageUsername" value="<?php
                        // Crear una nueva conexión a la base de datos.
                        $pdo = new DB();
                        // Realizar una consulta preparada con el nombre de usuario.
                        $pdo->query("SELECT username FROM users WHERE userId = ?");
                        $pdo->bind(1, $_SESSION["userInfo"]["userId"], PDO::PARAM_INT);
                        $pdo->execute();
                        echo $pdo->single()["username"];
                        ?>" disabled>
                    </div>
                </div>
                <!-- Nombre completo -->
                <div class="col-12 col-md-6">
                    <div class="form-group">
                        <label for="messageUserFullName" class="col-form-label text-primary">
                            <b>
                                <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["UserFullName"]; ?>:
                            </b>
                        </label>
                        <input type="text" class="form-control" id="messageUserFullName" name="messageUserFullName"
                            value="<?php
                            // Crear una nueva conexión a la base de datos.
                            $pdo = new DB();
                            // Realizar una consulta preparada con el nombre de usuario.
                            $pdo->query("SELECT userFullName FROM users WHERE userId = ?");
                            $pdo->bind(1, $_SESSION["userInfo"]["userId"], PDO::PARAM_INT);
                            $pdo->execute();
                            echo $pdo->single()["userFullName"];
                            ?>" disabled>
                    </div>
                </div>
            </div>
            <!-- Correo -->
            <div class="row my-2">
                <div class="col-12">
                    <div class="form-group">
                        <label for="messageUserEmail" class="col-form-label text-primary">
                            <b>
                                <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["Email"]; ?>:
                            </b>
                        </label>
                        <input type="email" class="form-control" id="messageUserEmail" name="messageUserEmail" value="<?php
                        // Crear una nueva conexión a la base de datos.
                        $pdo = new DB();
                        // Realizar una consulta preparada con el nombre de usuario.
                        $pdo->query("SELECT userEmail FROM users WHERE userId = ?");
                        $pdo->bind(1, $_SESSION["userInfo"]["userId"], PDO::PARAM_INT);
                        $pdo->execute();
                        echo $pdo->single()["userEmail"];
                        ?>" disabled>
                    </div>
                </div>
            </div>
            <!-- Solicitud -->
            <div class="row my-2">
                <div class="col-12">
                    <label for="messageDemand" class="col-form-label text-primary required">
                        <b>
                            <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["Select"]["Select"]; ?>:
                        </b>
                    </label>
                </div>
                <div class="col-sm">
                    <select class="form-control form-select" id="messageDemand" name="messageDemand"
                        aria-label="Default" required>
                        <option value="0">
                            <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["Select"]["0"]; ?>
                        </option>
                        <option value="1">
                            <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["Select"]["1"]; ?>
                        </option>
                        <option value="2">
                            <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["Select"]["2"]; ?>
                        </option>
                        <option value="3">
                            <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["Select"]["3"]; ?>
                        </option>
                        <option value="4">
                            <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["Select"]["4"]; ?>
                        </option>
                    </select>
                    <div class="invalid-feedback">
                        <?php echo $_SESSION["lang"]["sendMessages.php"]["InvalidFeedback"]["Select"]; ?>
                    </div>
                </div>
            </div>
            <!-- Mensaje -->
            <div class="row my-2">
                <div class="col-12">
                    <label for="messageText" class="col-form-label text-primary required">
                        <b>
                            <?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["TextArea"]; ?>:
                        </b>
                    </label>
                </div>
                <div class="col-sm">
                    <textarea class="form-control" id="messageText" name="messageText"
                        placeholder="<?php echo $_SESSION["lang"]["sendMessages.php"]["Form"]["TextArea"]; ?>" rows="5"
                        autocomplete="off" required></textarea>
                    <div class="invalid-feedback">
                        <?php echo $_SESSION["lang"]["sendMessages.php"]["InvalidFeedback"]["TextArea"]; ?>
                    </div>
                </div>
            </div>
            <!-- Botones -->
            <div class="text-center my-2">
                <button type="submit" class="buttonStyle btn btn-primary" id="submitSendMessagesButton"
                    name="submitSendMessagesButton" disabled>
                    <?php echo $_SESSION["lang"]["sendMessages.php"]["Buttons"]["Send"]; ?>
                </button>
                <button type="reset" class="buttonStyle btn btn-dark" id="resetSendMessagesButton"
                    name="resetSendMessagesButton">
                    <?php echo $_SESSION["lang"]["sendMessages.php"]["Buttons"]["Reset"]; ?>
                </button>
                <br>
                <button type="button" class="buttonStyle btn btn-dark mt-1" onclick="location.href='main.php';">
                    <?php echo $_SESSION["lang"]["sendMessages.php"]["Buttons"]["GoBack"]; ?>
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
    <script src="./ts/js/sendMessages.js"></script>
    <script src="./ts/js/clock.js"></script>
    <script src="./ts/js/throwModal.js"></script>
    <script src="./ts/js/changeLang.js"></script>
    <script src="./ts/js/loader.js"></script>
    <script src="./ts/js/autoLogout.js"></script>
</body>

</html>