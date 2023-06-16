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
<!doctype html>
<html lang="<?php echo $lang ?>">

<head>
    <!-- Metas -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <!-- favicon.icon  -->
    <link rel="shortcut icon" href="./assets/images/userAdd.svg" type="image/x-icon">
    <!-- Titulo -->
    <title>
        <?php echo $_SESSION["lang"]["UsersControl.php"]["Title"]; ?>
    </title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.css">
    <!--Css-->
    <link rel="stylesheet" href="./scss/css/styles.css">
</head>

<body>
    <!-- Header -->
    <?php include_once("header.php"); ?>
    <!-- Contenedor -->
    <div class="container-xl bg-white p-5 rounded-4 shadow-lg">
        <h1 class="text-capitalize text-center">
            <img src="./assets/images/userAdd.svg" alt="User Add Icon" style="width: 2.5rem;">
            &nbsp;
            <?php echo $_SESSION["lang"]["UsersControl.php"]["H1"]["UsersControl"]; ?>
            &nbsp;
            <img src="./assets/images/userAdd.svg" alt="User Add Icon" style="width: 2.5rem;">
        </h1>
        <ul class="usersOption list-group list-group-horizontal d-flex justify-content-center" id="usersOption">
            <li class="usersOption1 list-group-item list-group-item-dark">
                <?php echo $_SESSION["lang"]["UsersControl.php"]["Ul"]["RegisterNewUser"]; ?>
            </li>
            <li class="usersOption2 list-group-item">
                <?php echo $_SESSION["lang"]["UsersControl.php"]["Ul"]["ShowUsers"]; ?>
            </li>
        </ul>
        <hr>
        <div id="registerUsersDiv">
            <!-- Formulario -->
            <form action="" method="" id="registerUsersForm">
                <!-- User -->
                <div class="row">
                    <!-- Username -->
                    <div class="col-12 col-md-6">
                        <div class="form-input mb-2" id="user-group">
                            <label for="username" class="col-form-label required">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Username"]; ?>:
                            </label>
                            <input type="text" class="form-control" id="username" name="username"
                                placeholder="<?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Username"]; ?>"
                                maxlength="255" autocomplete="off" required>
                            <div class="invalid-feedback">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["InvalidFeedback"]["Username"]; ?>.
                            </div>
                        </div>
                    </div>
                    <!-- UserFullName -->
                    <div class="col-12 col-md-6">
                        <div class="form-input mb-2">
                            <label for="userFullName" class="col-form-label required">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["UserFullName"]; ?>:
                            </label>
                            <input type="text" class="form-control" id="userFullName" name="userFullName"
                                placeholder="<?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["UserFullName"]; ?>"
                                maxlength="255" autocomplete="off" required>
                            <div class="invalid-feedback">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["InvalidFeedback"]["UserFullName"]; ?>.
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Email -->
                <div class="form-input mb-2">
                    <label for="userEmail" class="col-form-label required">
                        <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Email"]; ?>:
                    </label>
                    <input type="email" class="form-control" id="userEmail" name="userEmail"
                        placeholder="<?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Email"]; ?>"
                        maxlength="255" value="@educa.madrid.org" autocomplete="off" required>
                    <div class="invalid-feedback">
                        <?php echo $_SESSION["lang"]["UsersControl.php"]["InvalidFeedback"]["Email"]; ?>.
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <!-- Password -->
                        <label for="password1" class="col-form-label required">
                            <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Password"]; ?>:
                        </label>
                        <div class="form-input mb-2">
                            <input type="password" class="form-control" id="password1" name="password1"
                                placeholder="<?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Password"]; ?>"
                                maxlength="25" autocomplete="off" required>
                            <div class="invalid-feedback"></div>
                        </div>
                        <ul class="list-unstyled d-flex flex-wrap" id="checkList">
                            <li id="lowerCaseLetters" class="flex-grow-1">
                                -
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Ul"]["LowerCaseLetters"]; ?>
                            </li>
                            <li id="upperCaseLetters" class="flex-grow-1">
                                -
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Ul"]["UpperCaseLetters"]; ?>
                            </li>
                            <li id="numbers" class="flex-grow-1">
                                -
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Ul"]["Numbers"]; ?>
                            </li>
                            <li id="minLength" class="flex-grow-1">
                                -
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["Ul"]["MinLength"]; ?>
                            </li>
                        </ul>
                    </div>
                    <!-- Password2 -->
                    <div class="col-12 col-md-6">
                        <label for="password2" class="col-form-label required">
                            <?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["ConfirmPassword"]; ?>:
                        </label>
                        <div class="form-input input-group mb-2">
                            <input type="password" class="form-control" id="password2" name="password2"
                                placeholder="<?php echo $_SESSION["lang"]["UsersControl.php"]["Form"]["ConfirmPassword"]; ?>"
                                maxlength="25" autocomplete="off" required>
                            <span class="input-group-text">
                                <img src="./assets/images/copy.svg" alt="copy password Icon" id="copyPassword"
                                    style="height: 1.5rem; cursor: pointer;">
                            </span>
                            <span class="input-group-text">
                                <img src="./assets/images/generate.svg" alt="Generate password Icon"
                                    id="generatePassword" style="height: 1.5rem; cursor: pointer;">
                            </span>
                            <span class="input-group-text">
                                <img src="./assets/images/closeEye.svg" alt="Eye Icon" class="showPassword"
                                    style="height: 1.5rem; cursor: pointer;">
                            </span>
                            <div class="invalid-feedback">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["InvalidFeedback"]["ConfirmPassword"]; ?>.
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Botones -->
                <div class="text-center">
                    <button type="submit" class="buttonStyle btn btn-primary mt-1" id="submitRegisterButton"
                        name="submitRegisterButton" disabled>
                        <?php echo $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Create"]; ?>
                    </button>
                    <button type="reset" class="buttonStyle btn btn-dark mt-1" id="resetRegisterButton"
                        name="resetRegisterButton">
                        <?php echo $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Reset"]; ?>
                    </button>
                    <br>
                    <button type="button" class="buttonStyle btn btn-dark mt-1" onclick="location.href='main.php';">
                        <?php echo $_SESSION["lang"]["UsersControl.php"]["Buttons"]["GoBack"]; ?>
                    </button>
                </div>
            </form>
        </div>
        <div id="showUsersDiv" class="d-none">
            <!-- Búsqueda de usuarios -->
            <div class="row d-flex justify-content-end mb-1">
                <div class="col-auto">
                    <form action="" method="" id="searchUserForm">
                        <div class="input-group">
                            <input type="search" class="form-control" id="searchUserInput" name="searchUserInput"
                                placeholder="<?php echo $_SESSION["lang"]["UsersControl.php"]["Search"]; ?>">
                            <button type="button" class="btn btn-primary" id="searchUserButton" name="searchUserButton">
                                <img src="./assets/images/search.svg" alt="Search Icon" style="width: 25px;">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Paginación de usuarios -->
            <div id="UsersPagination"></div>
            <!-- Tabla de usuarios -->
            <div class="table-responsive" id="userTable">
                <table class="table table-striped table-hover text-center">
                    <thead class="border-dark">
                        <tr>
                            <th scope="col" class="col-1">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Table"]["Number"]; ?>
                            </th>
                            <th scope="col" class="col-3">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Table"]["Username"]; ?>
                            </th>
                            <th scope="col" class="col-3">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Table"]["UserFullName"]; ?>
                            </th>
                            <th scope="col" class="col-3">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Table"]["Email"]; ?>
                            </th>
                            <th scope="col" class="col-1">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Table"]["State"]; ?>
                            </th>
                            <th scope="col" class="col-1">
                                <?php echo $_SESSION["lang"]["UsersControl.php"]["Table"]["Edit"]; ?>
                            </th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" id="totalUsers"></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div id="loadUsersError"></div>
        </div>
    </div>
    <!-- Footer -->
    <?php include_once("footer.php"); ?>
    <!-- Jquery, Popper y Bootstrap Js -->
    <script src="./node_modules/jquery/dist/jquery.min.js"></script>
    <script src="./node_modules/popper.js/dist/umd/popper.min.js"></script>
    <script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- Js -->
    <script src="./ts/js/usersControl.js"></script>
    <script src="./ts/js/showPassword.js"></script>
    <script src="./ts/js/clock.js"></script>
    <script src="./ts/js/throwModal.js"></script>
    <script src="./ts/js/changeLang.js"></script>
    <script src="./ts/js/loader.js"></script>
    <script src="./ts/js/autoLogout.js"></script>
</body>

</html>