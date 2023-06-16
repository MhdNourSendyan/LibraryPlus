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
        $requestPage = $data->requestPage;
        $searchTerm = $data->searchTerm;
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Configurar la paginación.
        $currentRequestPage = isset($requestPage) ? (int) $requestPage : 1; // Número de página actual.
        $requestsPerPage = 5; // Número de solicitudes por página.
        $requestPageFirstResult = ($currentRequestPage - 1) * $requestsPerPage; // Índice del primer solicitud en la página actual.
        // Construir la consulta SQL.
        $searchTerm = trim($searchTerm);
        $query = "SELECT * FROM requests r 
        JOIN users u 
        ON r.userId = u.userId 
        WHERE requestStudentFullName LIKE '%$searchTerm%' 
        OR requestStudentEmail LIKE '%$searchTerm%' 
        OR requestBooks LIKE '%$searchTerm%' 
        OR requestDevice LIKE '%$searchTerm%' 
        OR requestText LIKE '%$searchTerm%' 
        OR u.username LIKE '%$searchTerm%' 
        OR u.userFullName LIKE '%$searchTerm%' 
        OR u.userEmail LIKE '%$searchTerm%'";
        // Ejecutar la consulta SQL para contar el número total de solicitudes.
        $pdo->query($query);
        $pdo->execute();
        $totalRequests = $pdo->rowCount(); // Número total de solicitudes que coinciden con el término de búsqueda.
        $numberOfRequestPage = ceil($totalRequests / $requestsPerPage); // Número total de páginas necesarias para mostrar todos las solicitudes.
        $visibleRequestPages = 5; // Número máximo de páginas que se mostrarán en la paginación.
        $deltaRequest = ceil($visibleRequestPages / 2); // Número de páginas que se mostrarán antes y después de la página actual.
        // Calcular las páginas que se mostrarán en la paginación.
        if ($numberOfRequestPage <= $visibleRequestPages) {
            // Si el número total de páginas es menor o igual al número máximo de páginas visibles,
            // se muestran todas las páginas.
            $startRequestPage = 1;
            $endRequestPage = $numberOfRequestPage;
        } elseif ($currentRequestPage - $deltaRequest <= 0) {
            // Si la página actual está cerca del principio de la paginación,
            // se muestra desde la primera página hasta el número máximo de páginas visibles.
            $startRequestPage = 1;
            $endRequestPage = $visibleRequestPages;
        } elseif ($currentRequestPage + $deltaRequest > $numberOfRequestPage) {
            // Si la página actual está cerca del final de la paginación,
            // se muestra desde (número total de páginas - número máximo de páginas visibles + 1) hasta el número total de páginas.
            $startRequestPage = $numberOfRequestPage - $visibleRequestPages + 1;
            $endRequestPage = $numberOfRequestPage;
        } else {
            // Si la página actual está en algún lugar intermedio de la paginación,
            // se muestra desde (página actual - número de páginas antes de la página actual + 1) hasta (página actual + número de páginas después de la página actual - 1).
            $startRequestPage = $currentRequestPage - $deltaRequest + 1;
            $endRequestPage = $currentRequestPage + $deltaRequest - 1;
        }
        // Construir y ejecutar la consulta SQL para seleccionar las solicitudes de la página actual.
        $query .= " LIMIT $requestPageFirstResult ,  $requestsPerPage";
        $pdo->query($query);
        $pdo->execute();
        // Construir el HTML de la paginación.
        $pagination = "
        <div class='row d-flex justify-content-end'>
            <div class='col-auto'>
                <nav aria-label='pagination' class='nav mt-1'>
                    <ul class='pagination'>
        ";
        if ($currentRequestPage >= 2) {
            $pagination .= "<li class='page-item' id='1'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='page-item' id='" . ($currentRequestPage - 1) . "'><span class='page-link'>&laquo;</span></li>";
        } else {
            $pagination .= "<li class='page-item disabled'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='page-item disabled'><span class='page-link'>&laquo;</span></li>";
        }
        for ($i = $startRequestPage; $i <= $endRequestPage; $i++) {
            if ($i == $currentRequestPage) {
                $pagination .= "<li class='page-item active' aria-current='requestPage' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            } else {
                $pagination .= "<li class='page-item' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            }
        }
        if ($currentRequestPage < $numberOfRequestPage) {
            $pagination .= "<li class='page-item' id='" . ($currentRequestPage + 1) . "'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='page-item' id='" . $numberOfRequestPage . "'><span class='page-link'>&raquo;&raquo;</span></li>";
        } else {
            $pagination .= "<li class='page-item disabled'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='page-item disabled'><span class='page-link'>&raquo;&raquo;</span></li>";
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
        $cards = "";
        if ($pdo->rowCount() == 0) {
            $cards .= "
            <div class='alert alert-dark text-center m-0' role='alert'>
                " . $_SESSION["lang"]["Requests.php"]["ThrowModal"]["NoRequests"] . "
            </div>
            ";
        } else {
            foreach ($results as $row) {
                $pdo->query("SELECT * FROM users WHERE userId = ?");
                $pdo->bind(1, $row["userId"], PDO::PARAM_INT);
                $pdo->execute();
                $cards .= "
                <form action='./php/generatePdf.php' method='POST' class='requestForm' target='_blank'>
                    <div class='card mb-3'>
                        <div class='card-header d-flex justify-content-between'>
                        <p>
                            " . $_SESSION["lang"]["Requests.php"]["Card"]["Number"] . " " . $row['requestId'] . "
                        </p>
                        <input type='hidden' class='hiddenRequestId' name='hiddenRequestId' value='{$row['requestId']}'>
                        <p>
                            " . date("d/m/Y", strtotime($row['dateTime'])) . " - " . date("H:i", strtotime($row['dateTime'])) . "
                        </p>
                        </div>
                        <div class='card-body'>
                            <div class='row'>
                                <div class='col-12 col-md-6'>
                                    <p>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Requests.php"]["Card"]["Username"] . ":
                                        </b>
                                        " . $pdo->single()['username'] . "
                                    </p>
                                </div>
                                <div class='col-12 col-md-6'>
                                    <p>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Requests.php"]["Card"]["UserFullName"] . ":
                                        </b>
                                        " . $pdo->single()['userFullName'] . "
                                    </p>
                                </div>
                            </div>
                            <p>
                                <b class='text-primary'>
                                    " . $_SESSION["lang"]["Requests.php"]["Card"]["UserEmail"] . ":
                                </b>
                                " . $pdo->single()['userEmail'] . "
                            </p>
                            <div class='row'>
                                <div class='col-12 col-md-6'>
                                    <p>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Requests.php"]["Card"]["StudentFullName"] . ":
                                        </b>
                                        " . $row['requestStudentFullName'] . "
                                    </p>
                                </div>
                                <div class='col-12 col-md-6'>
                                    <p>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Requests.php"]["Card"]["StudentEmail"] . ":
                                        </b>
                                        " . $row['requestStudentEmail'] . "
                                    </p>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-12 col-md-6'>
                                    <p>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Requests.php"]["Card"]["BooksRequests"] . ":
                                        </b>
                                        " . $row['requestBooks'] . "
                                    </p>
                                </div>
                                <div class='col-12 col-md-6'>
                                    <p>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Requests.php"]["Card"]["DeviceRequest"] . ":
                                        </b>
                                        " . $row['requestDevice'] . "
                                    </p>
                                </div>
                            </div>
                            <p class='card-text'>
                                <b class='text-primary'>
                                    " . $_SESSION["lang"]["Requests.php"]["Card"]["Message"] . ":
                                </b>
                                " . nl2br($row['requestText']) . "
                            </p>
                        </div>
                        <div class='card-footer text-end'>
                            <button type='submit' class='generatePdfButton btn btn-light btn-sm' name='generatePdfButton'>
                                <img src='./assets/images/pdf.svg' alt='Generate a PDF' style='width: 1.25rem;'>
                            </button>
                            <button type='button' class='btn btn-light btn-sm' data-bs-toggle='modal'
                                data-bs-target='#deleteRequestModal" . $row['requestId'] . "'>
                                <img src='./assets/images/delete.svg' alt='eliminar' style='width: 1.25rem;'>
                            </button>
                            <div class='modal fade' id='deleteRequestModal" . $row['requestId'] . "' tabindex='-1' aria-labelledby='deleteRequestModalLabel' aria-hidden='true'>
                                <div class='modal-dialog modal-dialog-centered'>
                                    <div class='modal-content'>
                                        <div class='modal-header'>
                                            <h5 class='modal-title'>
                                                " . $_SESSION["lang"]["Requests.php"]["ThrowModal"]["Confirm"] . "
                                            </h5>
                                            <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                                        </div>
                                        <div class='modal-body text-start'>
                                            " . $_SESSION["lang"]["Requests.php"]["ThrowModal"]["ConfirmDelete"] . "
                                        </div>
                                        <div class='modal-footer'>
                                            <button type='button' class='deleteRequestButton buttonStyle btn btn-danger'>
                                                " . $_SESSION["lang"]["Requests.php"]["Buttons"]["Delete"] . "
                                            </button>
                                            <button type='button' class='buttonStyle btn btn-dark' data-bs-dismiss='modal'>
                                                " . $_SESSION["lang"]["Requests.php"]["Buttons"]["GoBack"] . "
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                ";
            }
        }
        // Si todo ha ido bien, se devuelve una respuesta JSON que indica éxito y se muestran las solicitudes.
        $response = [
            "success" => true,
            "pagination" => $pagination,
            "cards" => $cards,
            "totalRequests" => $totalRequests,
        ];
        echo json_encode($response);
    } catch (Exception $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        $response = [
            "success" => false,
            "alertType" => "danger",
            "text" => $_SESSION["lang"]["Requests.php"]["ThrowModal"]["LoadRequestsError"],
            "exceptionMessage" => $e->getMessage(),
        ];
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos
        $pdo->close();
    }
}