<?php
// Incluir el archivo de la base de datos.
require_once("../db.php");
// Iniciar sesión.
session_start();
// Obtener el idioma almacenada en cookies.
$lang = isset($_COOKIE["lang"]) ? $_COOKIE["lang"] : "es";
$file_path = "../../languages/{$lang}.json";
// Comprobar si el archivo existe y si tiene un tamaño mayor que cero antes de leerlo.
if (file_exists($file_path) && filesize($file_path) > 0) {
    $json_str = file_get_contents($file_path);
} else {
    $json_str = file_get_contents("../../languages/es.json");
}
// Guardar los datos JSON en el almacenamiento de sesión del usuario.
$json_data = json_decode($json_str, true);
$_SESSION["lang"] = $json_data;
// Verificar que la solicitud sea de tipo POST.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Obtener los datos JSON de la solicitud POST.
        $jsonData = file_get_contents("php://input");
        $data = json_decode($jsonData);
        $devicePage = $data->devicePage;
        $searchTerm = $data->searchTerm;
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Configurar la paginación.
        $currentDevicePage = isset($devicePage) ? (int) $devicePage : 1; // Número de página actual.
        $devicesPerPage = 10; // Número de dispositivos por página.
        $currentDevicePageFirstResult = ($currentDevicePage - 1) * $devicesPerPage; // Índice del primer dispositivo en la página actual.
        // Construir la consulta SQL.
        $searchTerm = trim($searchTerm);
        $query = "SELECT * FROM devices 
        WHERE deviceIdentifier LIKE '%$searchTerm%'
        OR deviceName LIKE '%$searchTerm%'
        OR deviceDescription LIKE '%$searchTerm%'";
        // Ejecutar la consulta SQL para contar el número total de dispositivos.
        $pdo->query($query);
        $pdo->execute();
        $totalDevices = $pdo->rowCount(); // Número total de dispositivos que coinciden con el término de búsqueda.
        $numberOfDevicePages = ceil($totalDevices / $devicesPerPage); // Número total de páginas necesarias para mostrar todos los dispositivos.
        $visibleDevicePages = 5; // Número máximo de páginas que se mostrarán en la paginación.
        $deltaDevicePage = ceil($visibleDevicePages / 2); // Número de páginas que se mostrarán antes y después de la página actual.
        // Calcular las páginas que se mostrarán en la paginación.
        if ($numberOfDevicePages <= $visibleDevicePages) {
            // Si el número total de páginas es menor o igual al número máximo de páginas visibles,
            // se muestran todas las páginas.
            $startDevicePage = 1;
            $endDevicePage = $numberOfDevicePages;
        } elseif ($currentDevicePage - $deltaDevicePage <= 0) {
            // Si la página actual está cerca del principio de la paginación,
            // se muestra desde la primera página hasta el número máximo de páginas visibles.
            $startDevicePage = 1;
            $endDevicePage = $visibleDevicePages;
        } elseif ($currentDevicePage + $deltaDevicePage > $numberOfDevicePages) {
            // Si la página actual está cerca del final de la paginación,
            // se muestra desde (número total de páginas - número máximo de páginas visibles + 1) hasta el número total de páginas.
            $startDevicePage = $numberOfDevicePages - $visibleDevicePages + 1;
            $endDevicePage = $numberOfDevicePages;
        } else {
            // Si la página actual está en algún lugar intermedio de la paginación,
            // se muestra desde (página actual - número de páginas antes de la página actual + 1) hasta (página actual + número de páginas después de la página actual - 1).
            $startDevicePage = $currentDevicePage - $deltaDevicePage + 1;
            $endDevicePage = $currentDevicePage + $deltaDevicePage - 1;
        }
        // Construir y ejecutar la consulta SQL para seleccionar los dispositivos de la página actual.
        $query .= " LIMIT $currentDevicePageFirstResult , $devicesPerPage";
        $pdo->query($query);
        $pdo->execute();
        // Construir el HTML de la paginación.
        $pagination = "
            <div class='row d-flex justify-content-end'>
                <div class='col-auto'>
                    <nav aria-label='pagination' class='nav mt-1'>
                        <ul class='pagination'>
        ";
        if ($currentDevicePage >= 2) {
            $pagination .= "<li class='devicePageItem page-item' id='1'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='devicePageItem page-item' id='" . ($currentDevicePage - 1) . "'><span class='page-link'>&laquo;</span></li>";
        } else {
            $pagination .= "<li class='devicePageItem page-item disabled'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='devicePageItem page-item disabled'><span class='page-link'>&laquo;</span></li>";
        }
        for ($i = $startDevicePage; $i <= $endDevicePage; $i++) {
            if ($i == $currentDevicePage) {
                $pagination .= "<li class='devicePageItem page-item active' aria-current='page' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            } else {
                $pagination .= "<li class='devicePageItem page-item' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            }
        }
        if ($currentDevicePage < $numberOfDevicePages) {
            $pagination .= "<li class='devicePageItem page-item' id='" . ($currentDevicePage + 1) . "'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='devicePageItem page-item' id='" . $numberOfDevicePages . "'><span class='page-link'>&raquo;&raquo;</span></li>";
        } else {
            $pagination .= "<li class='devicePageItem page-item disabled'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='devicePageItem page-item disabled'><span class='page-link'>&raquo;&raquo;</span></li>";
        }
        $pagination .= "
                        </ul>
                    </nav>
                </div>
            </div>
        ";
        // Seleccionar todas las filas de la base de datos.
        $results = $pdo->resultSet();
        // Construir el una fila por cada registro que hay en la base de datos.
        $tbody = "";
        if ($pdo->rowCount() == 0) {
            $tbody .= "
            <tr>
                <td colspan='5'>
                    <div class='alert alert-dark text-center m-0' role='alert'>
                        " . $_SESSION["lang"]["Main.php"]["ThrowModal"]["NoDevices"] . "
                    </div>
                </td>
            </tr>
            ";
        } else {
            foreach ($results as $row) {
                $quantity = $row["deviceQuantity"];
                if ($quantity == 0) {
                    $quantity = $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["NotAvailable"];
                }
                $tbody .= "
                <tr>
                    <th scope='row'>" . $row["deviceIdentifier"] . "</th>
                    <td>" . $row["deviceName"] . "</td>
                    <td>" . $row["deviceDescription"] . "</td>
                    <td>" . $quantity . "</td>
                ";
                if ($_SESSION["userInfo"]["userId"] == 1) {
                    $tbody .= "
                    <td>
                        <button type='button' class='btn btn-light btn-sm' data-bs-toggle='modal'
                            data-bs-target='#editDeviceModal" . $row["deviceId"] . "'>
                            <img src='./assets/images/edit.svg' alt='editar' style='width: 1.25rem;'>
                        </button>
                        <div class='modal fade' id='editDeviceModal" . $row["deviceId"] . "' data-bs-backdrop='static'
                            data-bs-keyboard='false' tabindex='-1' aria-labelledby='editDeviceModalLabel' aria-hidden='true'>
                            <div class='modal-dialog modal-dialog-centered'>
                                <div class='modal-content'>
                                    <form action='' method='POST' class='editDeviceForm'>
                                        <div class='modal-header'>
                                            <h5 class='modal-title'><img src='./assets/images/edit.svg' alt='editar' style='width: 1.25rem;'>
                                                " . $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["EditModal"]["Edit"] . "
                                            </h5>
                                            <button type='button' class='closeEDModalButton btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                                        </div>
                                        <div class='modal-body text-start mt-0'>
                                            <label for='editDeviceIdentifier' class='col-form-label required'>
                                                " . $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["EditModal"]["EditDeviceIdentifier"] . ":
                                            </label>
                                            <input type='text' class='editDeviceIdentifier form-control' name='editDeviceIdentifier'
                                                value='" . $row["deviceIdentifier"] . "' maxlength='255'>
                                            <label for='editDeviceName' class='col-form-label required'>
                                                " . $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["EditModal"]["EditDeviceName"] . ":
                                            </label>
                                            <input type='text' class='editDeviceName form-control' name='editDeviceName'
                                                value='" . $row["deviceName"] . "' maxlength='255'>
                                            <label for='editDeviceDescription' class='col-form-label required'>
                                                " . $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["EditModal"]["EditDeviceDescription"] . ":
                                            </label>
                                            <input type='text' class='editDeviceDescription form-control' name='editDeviceDescription'
                                                value='" . $row["deviceDescription"] . "' maxlength='255'>
                                            <label for='editDeviceQuantity' class='col-form-label required'>
                                                " . $_SESSION["lang"]["Main.php"]["Devices"]["Table"]["EditModal"]["EditDeviceQuantity"] . ":
                                            </label>
                                            <input type='number' class='editDeviceQuantity form-control' name='editDeviceQuantity'
                                                value='" . $row["deviceQuantity"] . "' min='0'>
                                            <input type='hidden' class='hiddenDeviceId' value='{$row["deviceId"]}'>
                                        </div>
                                        <div class='modal-footer'>
                                            <button type='submit' class='editDeviceButton buttonStyle btn btn-success me-1'
                                                name='editDeviceButton'>
                                                " . $_SESSION["lang"]["Main.php"]["Buttons"]["Edit"] . "
                                            </button>
                                            <button type='submit' class='deleteDeviceButton buttonStyle btn btn-danger'
                                                name='deleteDeviceButton'>
                                                " . $_SESSION["lang"]["Main.php"]["Buttons"]["Delete"] . "
                                            </button>
                                            <button type='button' class='closeEDModalButton buttonStyle btn btn-dark' data-bs-dismiss='modal'>
                                                " . $_SESSION["lang"]["Main.php"]["Buttons"]["GoBack"] . "
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </td>
                        ";
                }
                $tbody .= "
                </tr>
                ";
            }
        }
        // Si todo ha ido bien, se devuelve una respuesta JSON que indica éxito y se muestran los dispositivos.
        $response = [
            "success" => true,
            "pagination" => $pagination,
            "tbody" => $tbody,
            "totalDevices" => $totalDevices,
        ];
        echo json_encode($response);
    } catch (Exception $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        $response = [
            "success" => false,
            "alertType" => "danger",
            "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["LoadDevicesError"],
            "exceptionMessage" => $e->getMessage(),
        ];
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos.
        $pdo->close();
    }
}