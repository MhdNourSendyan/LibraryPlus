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
    <!-- Metas-->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <!-- favicon.icon -->
    <link rel="shortcut icon" href="./assets/images/logo.svg" type="image/x-icon">
    <!-- Titulo -->
    <title>
        <?php echo $_SESSION["lang"]["Main.php"]["Title"]; ?>
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
        <!-- Div de libros -->
        <h1 class="text-center" id="books">
            <img src="./assets/images/book.svg" alt="Book Icon" style="width: 2.5rem;">
            &nbsp;
            <?php echo $_SESSION["lang"]["Main.php"]["H1"]["Books"]; ?>
            &nbsp;
            <img src="./assets/images/book.svg" alt="Book Icon" style="width: 2.5rem;">
        </h1>
        <div id="booksDiv">
            <hr>
            <?php
            // Añadir libro 
            if ($_SESSION["userInfo"]["userId"] == 1) {
                echo "
                <div class='mb-1'>
                    <button class='buttonStyle btn btn-dark mb-1' id='addBookCollapseButton' type='button'
                        data-bs-toggle='collapse' data-bs-target='#addBookCollapse' aria-expanded='false'
                        aria-controls='addBookCollapse'>
                        " . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["AddNewBook"] . "
                    </button>
                    <div class='collapse' id='addBookCollapse'>
                        <div class='card card-body'>
                            <form action='' method='' id='newBookForm'>
                                <div class='row mb-1'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newBookIdentifier' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookIdentifier"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='text' class='form-control' id='newBookIdentifier' name='newBookIdentifier'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookIdentifier"] . "'
                                            maxlength='255' autocomplete='off' required>
                                    </div>
                                </div>    
                                <div class='row mb-1'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newBookName' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookName"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='text' class='form-control' id='newBookName' name='newBookName'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookName"] . "'
                                            maxlength='255' autocomplete='off' required>
                                    </div>
                                </div>
                                <div class='row mb-1'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newBookAuthor' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookAuthor"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='text' class='form-control' id='newBookAuthor' name='newBookAuthor'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookAuthor"] . "'
                                            maxlength='255' autocomplete='off' required>
                                    </div>
                                </div>
                                <div class='row mb-1'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newBookEditorial' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookEditorial"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='text' class='form-control' id='newBookEditorial' name='newBookEditorial'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookEditorial"] . "'
                                            maxlength='255' autocomplete='off' required>
                                    </div>
                                </div>
                                <div class='row mb-3'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newBookQuantity' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookQuantity"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='number' class='form-control' id='newBookQuantity' name='newBookQuantity'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["NewBookQuantity"] . "'
                                            min='0' autocomplete='off' required>
                                    </div>
                                </div>
                                <button type='submit' class='buttonStyle btn btn-primary me-1' id='addBookButton'
                                    name='addBookButton'>
                                    " . $_SESSION["lang"]["Main.php"]["Buttons"]["Add"] . "
                                </button>
                                <button type='reset' class='buttonStyle btn btn-dark' id='resetBookButton'
                                    name='resetBookButton'>
                                    " . $_SESSION["lang"]["Main.php"]["Buttons"]["Reset"] . "
                                </button>
                            </form>
                            <form action='' method='' class='mt-3' id='newBooksFile' enctype='multipart/form-data'>
                                <label for='newBookQuantity' class='col-form-label required'>
                                    " . $_SESSION["lang"]["Main.php"]["Books"]["AddBook"]["AddBooks"] . ":
                                </label>
                                <div class='input-group'>
                                    <input type='file' class='form-control' id='newBooksCSVFile' aria-label='Upload' accept='.csv' required>
                                    <button type='submit' class='btn btn-primary' id='addBooksCSVFileButton'>
                                        " . $_SESSION["lang"]["Main.php"]["Buttons"]["Add"] . "
                                    </button>
                                    <button type='reset' class='btn btn-dark' id='resetBooksCSVFileButton' name='resetBooksCSVFileButton'>
                                        " . $_SESSION["lang"]["Main.php"]["Buttons"]["Reset"] . "
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                ";
            }
            ?>
            <!-- Búsqueda de libros -->
            <div class="row d-flex justify-content-end mb-1">
                <div class="col-auto">
                    <form action="" method="" id="searchBookForm">
                        <div class="input-group">
                            <input type="search" class="form-control" id="searchBookInput" name="searchBookInput"
                                placeholder="<?php echo $_SESSION["lang"]["Main.php"]["Books"]["Search"]; ?>"
                                autocomplete="off">
                            <button type="button" class="btn btn-primary" id="searchBookButton" name="searchBookButton">
                                <img src="./assets/images/search.svg" alt="Search Icon" style="width: 25px;">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Paginación de libros -->
            <div id="booksPagination"></div>
            <!-- Tabla de libros -->
            <div class="table-responsive" id="booksTable">
                <table class="table table-striped table-hover text-center">
                    <thead class="border-dark">
                        <tr>
                            <th scope="col" class="col-1">
                                <?php echo $_SESSION["lang"]["Main.php"]["Books"]["Table"]["Identifier"] ?>
                            </th>
                            <th scope="col" class="col-4">
                                <?php echo $_SESSION["lang"]["Main.php"]["Books"]["Table"]["Book"]; ?>
                            </th>
                            <th scope="col" class="col-2">
                                <?php echo $_SESSION["lang"]["Main.php"]["Books"]["Table"]["Author"]; ?>
                            </th>
                            <th scope="col" class="col-2">
                                <?php echo $_SESSION["lang"]["Main.php"]["Books"]["Table"]["Editorial"]; ?>
                            </th>
                            <th scope="col" class="col-2">
                                <?php echo $_SESSION["lang"]["Main.php"]["Books"]["Table"]["Quantity"]; ?>
                            </th>
                            <?php
                            if ($_SESSION["userInfo"]["userId"] == 1) {
                                echo "<th scope='col' class='col-1'>" . $_SESSION["lang"]["Main.php"]["Books"]["Table"]["Edit"] . "</th>";
                            }
                            ?>
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" id="totalBooks"></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <br>
        <hr>
        <br>
        <!-- Div de dispositivos -->
        <h1 class="text-center" id="devices">
            <img src="./assets/images/device.svg" alt="Device Icon" style="width: 2.5rem;">
            &nbsp;
            <?php echo $_SESSION["lang"]["Main.php"]["H1"]["Devices"] ?>
            &nbsp;
            <img src="./assets/images/device.svg" alt="Device Icon" style="width: 2.5rem;">
        </h1>
        <div id="devicesDiv">
            <hr>
            <?php
            // Añadir dispositivo.
            if ($_SESSION["userInfo"]["userId"] == 1) {
                echo "
                <div class='mb-1'>
                    <button class='buttonStyle btn btn-dark mb-1' id='addDeviceCollapseButton' type='button'
                        data-bs-toggle='collapse' data-bs-target='#deviceAdd' aria-expanded='false'
                        aria-controls='deviceAdd'>
                        " . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["AddNewDevice"] . "
                    </button>
                    <div class='collapse' id='deviceAdd'>
                        <div class='card card-body'>
                            <form action='' method='' id='newDeviceForm'>
                                <div class='row mb-1'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newDeviceIdentifier' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["NewDeviceIdentifier"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='text' class='form-control' id='newDeviceIdentifier' name='newDeviceIdentifier'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["NewDeviceIdentifier"] . "'
                                            maxlength='255' autocomplete='off' required>
                                    </div>
                                </div>
                                <div class='row mb-1'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newDeviceName' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["NewDeviceName"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='text' class='form-control' id='newDeviceName' name='newDeviceName'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["NewDeviceName"] . "'
                                            maxlength='255' autocomplete='off' required>
                                    </div>
                                </div>
                                <div class='row mb-1'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newDeviceDescription' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["NewDeviceDescription"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='text' class='form-control' id='newDeviceDescription' name='newDeviceDescription'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["NewDeviceDescription"] . "'
                                            maxlength='255' autocomplete='off' required>
                                    </div>
                                </div>
                                <div class='row mb-4'>
                                    <div class='col-xl-3 col-12'>
                                        <label for='newDeviceQuantity' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["NewDeviceQuantity"] . ":
                                        </label>
                                    </div>
                                    <div class='form-input col-xl-9 col-12'>
                                        <input type='number' class='form-control' id='newDeviceQuantity' name='newDeviceQuantity'
                                            placeholder='" . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["NewDeviceQuantity"] . "'
                                            min='0' autocomplete='off' required>
                                    </div>
                                </div>
                                <button type='submit' class='buttonStyle btn btn-primary me-1' id='addDeviceButton'
                                    name='addDeviceButton'>
                                    " . $_SESSION["lang"]["Main.php"]["Buttons"]["Add"] . "
                                </button>
                                <button type='reset' class='buttonStyle btn btn-dark' id='resetDeviceButton'
                                    name='resetDeviceButton'>
                                    " . $_SESSION["lang"]["Main.php"]["Buttons"]["Reset"] . "
                                </button>
                            </form>
                            <form action='' method='' class='mt-3' id='newDevicesFile' enctype='multipart/form-data'>
                                <label for='newDeviceQuantity' class='col-form-label required'>
                                    " . $_SESSION["lang"]["Main.php"]["Devices"]["AddDevice"]["AddDevices"] . ":
                                </label>    
                                <div class='input-group'>
                                    <input type='file' class='form-control' id='newDevicesCSVFile' aria-label='Upload' accept='.csv' required>
                                    <button type='submit' class='btn btn-primary' id='addDevicesCSVFileButton'>
                                        " . $_SESSION["lang"]["Main.php"]["Buttons"]["Add"] . "
                                    </button>
                                    <button type='reset' class='btn btn-dark' id='resetDevicesCSVFileButton' name='resetDevicesCSVFileButton'>
                                        " . $_SESSION["lang"]["Main.php"]["Buttons"]["Reset"] . "
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                ";
            }
            ?>
            <!-- Búsqueda de dispositivos -->
            <div class="row d-flex justify-content-end">
                <div class="col-auto">
                    <form action="" method="" id="searchDeviceForm">
                        <div class="input-group">
                            <input type="search" class="form-control" id="searchDeviceInput" name="searchDeviceInput"
                                placeholder="<?php echo $_SESSION["lang"]["Main.php"]["Devices"]["Search"]; ?>"
                                autocomplete="off">
                            <button type="button" class="btn btn-primary" id="searchDeviceButton"
                                name="searchDeviceButton">
                                <img src="./assets/images/search.svg" alt="Search Icon" style="width: 25px;">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Paginación de dispositivos -->
            <div id="devicesPagination"></div>
            <!-- Tabla de dispositivos -->
            <div class="table-responsive" id="devicesTable">
                <table class="table table-striped table-hover text-center">
                    <thead class="border-dark">
                        <tr>
                            <th scope="col" class="col-1">
                                <?php echo $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["Identifier"] ?>
                            </th>
                            <th scope="col" class="col-4">
                                <?php echo $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["Device"]; ?>
                            </th>
                            <th scope="col" class="col-4">
                                <?php echo $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["Description"]; ?>
                            </th>
                            <th scope="col" class="col-2">
                                <?php echo $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["Quantity"]; ?>
                            </th>
                            <?php
                            if ($_SESSION["userInfo"]["userId"] == 1) {
                                echo "<th scope='col' class='col-1'>" . $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["Edit"] . "</th>";
                            }
                            ?>
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" id="totalDevices"></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
    <!-- Footer -->
    <?php include_once("footer.php"); ?>
    <!-- Jquery, Popper y Bootstrap Js -->
    <script src="./node_modules/jquery/dist/jquery.min.js"></script>
    <script src="./node_modules/popper.js/dist/umd/popper.min.js"></script>
    <script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- Js -->
    <script src="./ts/js/main.js"></script>
    <script src="./ts/js/clock.js"></script>
    <script src="./ts/js/throwModal.js"></script>
    <script src="./ts/js/changeLang.js"></script>
    <script src="./ts/js/loader.js"></script>
    <script src="./ts/js/autoLogout.js"></script>
</body>

</html>