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
        $messagePage = $data->messagePage;
        $searchTerm = $data->searchTerm;
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Configurar la paginación.
        $currentMessagePage = isset($messagePage) ? (int) $messagePage : 1; // Número de página actual.
        $messagesPerPage = 5; // Número de mensajes por página.
        $messagePageFirstResult = ($currentMessagePage - 1) * $messagesPerPage; // Índice del primer mensaje en la página actual.
        // Construir la consulta SQL.
        $searchTerm = trim($searchTerm);
        $query = "SELECT * FROM messages m 
        JOIN users u 
        ON m.userId = u.userId 
        WHERE messageDemand LIKE '%$searchTerm%' 
        OR messageText LIKE '%$searchTerm%' 
        OR u.username LIKE '%$searchTerm%' 
        OR u.userFullName LIKE '%$searchTerm%' 
        OR u.userEmail LIKE '%$searchTerm%'";
        // Ejecutar la consulta SQL para contar el número total de mensajes.
        $pdo->query($query);
        $pdo->execute();
        $totalMessages = $pdo->rowCount(); // Número total de mensajes que coinciden con el término de búsqueda.
        $numberOfMessagePage = ceil($totalMessages / $messagesPerPage); // Número total de páginas necesarias para mostrar todos los mensajes.
        $visibleMessagePages = 5; // Número máximo de páginas que se mostrarán en la paginación.
        $deltaMessage = ceil($visibleMessagePages / 2); // Número de páginas que se mostrarán antes y después de la página actual.
        // Calcular las páginas que se mostrarán en la paginación.
        if ($numberOfMessagePage <= $visibleMessagePages) {
            // Si el número total de páginas es menor o igual al número máximo de páginas visibles,
            // se muestran todas las páginas.
            $startMessagePage = 1;
            $endMessagePage = $numberOfMessagePage;
        } elseif ($currentMessagePage - $deltaMessage <= 0) {
            // Si la página actual está cerca del principio de la paginación,
            // se muestra desde la primera página hasta el número máximo de páginas visibles.
            $startMessagePage = 1;
            $endMessagePage = $visibleMessagePages;
        } elseif ($currentMessagePage + $deltaMessage > $numberOfMessagePage) {
            // Si la página actual está cerca del final de la paginación,
            // se muestra desde (número total de páginas - número máximo de páginas visibles + 1) hasta el número total de páginas.
            $startMessagePage = $numberOfMessagePage - $visibleMessagePages + 1;
            $endMessagePage = $numberOfMessagePage;
        } else {
            // Si la página actual está en algún lugar intermedio de la paginación,
            // se muestra desde (página actual - número de páginas antes de la página actual + 1) hasta (página actual + número de páginas después de la página actual - 1).
            $startMessagePage = $currentMessagePage - $deltaMessage + 1;
            $endMessagePage = $currentMessagePage + $deltaMessage - 1;
        }
        // Construir y ejecutar la consulta SQL para seleccionar los mensajes de la página actual.
        $query .= " LIMIT $messagePageFirstResult ,  $messagesPerPage";
        $pdo->query($query);
        $pdo->execute();
        // Construir el HTML de la paginación.
        $pagination = "
            <div class='row d-flex justify-content-end'>
                <div class='col-auto'>
                    <nav aria-label='pagination' class='nav mt-1'>
                        <ul class='pagination'>
        ";
        if ($currentMessagePage >= 2) {
            $pagination .= "<li class='messagePageItem page-item' id='1'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='messagePageItem page-item' id='" . ($currentMessagePage - 1) . "'><span class='page-link'>&laquo;</span></li>";
        } else {
            $pagination .= "<li class='messagePageItem page-item disabled'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='messagePageItem page-item disabled'><span class='page-link'>&laquo;</span></li>";
        }
        for ($i = $startMessagePage; $i <= $endMessagePage; $i++) {
            if ($i == $currentMessagePage) {
                $pagination .= "<li class='messagePageItem page-item active' aria-current='messagePage' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            } else {
                $pagination .= "<li class='messagePageItem page-item' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            }
        }
        if ($currentMessagePage < $numberOfMessagePage) {
            $pagination .= "<li class='messagePageItem page-item' id='" . ($currentMessagePage + 1) . "'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='messagePageItem page-item' id='" . $numberOfMessagePage . "'><span class='page-link'>&raquo;&raquo;</span></li>";
        } else {
            $pagination .= "<li class='messagePageItem page-item disabled'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='messagePageItem page-item disabled'><span class='page-link'>&raquo;&raquo;</span></li>";
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
                        " . $_SESSION["lang"]["Messages.php"]["ThrowModal"]["NoMessages"] . "
                    </div>
                    ";
        } else {
            foreach ($results as $row) {
                $pdo->query("SELECT * FROM users WHERE userId = ?");
                $pdo->bind(1, $row["userId"], PDO::PARAM_INT);
                $pdo->execute();
                $cards .= "
                        <form action='' method='POST' class='messageForm'>
                            <div class='card mb-3'>
                                <div class='card-header d-flex justify-content-between'>
                                    <p>
                                        " . $_SESSION["lang"]["Messages.php"]["Card"]["Number"] . " " . $row['messageId'] . "
                                    </p>
                                    <p>
                                        " . date("d/m/Y", strtotime($row['dateTime'])) . " - " . date("H:i", strtotime($row['dateTime'])) . "
                                    </p>
                                </div>
                                <div class='card-body'>
                                    <div class='row'>
                                        <div class='col-12 col-md-6'>
                                            <p>
                                                <b class='text-primary'>
                                                    " . $_SESSION["lang"]["Messages.php"]["Card"]["Username"] . ": 
                                                </b>
                                                " . $pdo->single()['username'] . "
                                            </p>
                                        </div>
                                        <div class='col-12 col-md-6'>
                                            <p>
                                                <b class='text-primary'>
                                                    " . $_SESSION["lang"]["Messages.php"]["Card"]["UserFullName"] . ":
                                                </b>
                                                " . $pdo->single()['userFullName'] . "
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Messages.php"]["Card"]["UserEmail"] . ":
                                        </b>
                                        " . $pdo->single()['userEmail'] . "
                                    </p>
                                    <p>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Messages.php"]["Card"]["Request"] . ":
                                        </b>
                                        " . $row["messageDemand"] . "
                                    </p>
                                    <p class='card-text'>
                                        <b class='text-primary'>
                                            " . $_SESSION["lang"]["Messages.php"]["Card"]["Message"] . ":
                                        </b>
                                        " . nl2br($row['messageText']) . "
                                    </p>
                                    <input type='hidden' class='hiddenMessageId' value='{$row['messageId']}'>
                                </div>
                                <div class='card-footer text-end'>
                                    <button type='button' class='btn btn-light btn-sm' data-bs-toggle='modal'
                                        data-bs-target='#deleteMessageModal" . $row['messageId'] . "'>
                                        <img src='./assets/images/delete.svg' alt='eliminar' style='width: 1.25rem;'>
                                    </button>
                                    <div class='modal fade' id='deleteMessageModal" . $row['messageId'] . "' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='deleteMessageModalLabel' aria-hidden='true'>
                                        <div class='modal-dialog modal-dialog-centered'>
                                            <div class='modal-content'>
                                                <div class='modal-header'>
                                                    <h5 class='modal-title'>
                                                        " . $_SESSION["lang"]["Messages.php"]["ThrowModal"]["Confirm"] . "
                                                    </h5>
                                                    <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                                                </div>
                                                <div class='modal-body text-start'>
                                                    " . $_SESSION["lang"]["Messages.php"]["ThrowModal"]["ConfirmDelete"] . "
                                                </div>
                                                <div class='modal-footer'>
                                                    <button type='button' class='deleteMessageButton buttonStyle btn btn-danger'>
                                                        " . $_SESSION["lang"]["Messages.php"]["Buttons"]["Delete"] . "
                                                    </button>
                                                    <button type='button' class='buttonStyle btn btn-dark' data-bs-dismiss='modal'>
                                                        " . $_SESSION["lang"]["Messages.php"]["Buttons"]["GoBack"] . "
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
        // Si todo ha ido bien, se devuelve una respuesta JSON que indica éxito y se muestran los mensajes.
        $response = [
            "success" => true,
            "pagination" => $pagination,
            "cards" => $cards,
            "totalMessages" => $totalMessages,
        ];
        echo json_encode($response);
    } catch (Exception $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        $response = [
            "success" => false,
            "alertType" => "danger",
            "text" => $_SESSION["lang"]["Messages.php"]["ThrowModal"]["LoadMessagesError"],
            "exceptionMessage" => $e->getMessage(),
        ];
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos
        $pdo->close();
    }
}