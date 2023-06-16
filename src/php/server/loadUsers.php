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
        $userPage = $data->userPage;
        $searchTerm = $data->searchTerm;
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Configurar la paginación.
        $currentUserPage = isset($userPage) ? (int) $userPage : 1; // Número de página actual.
        $usersPerPage = 5; // Número de usuarios por página.
        $currentUserPageFirstResult = ($currentUserPage - 1) * $usersPerPage; // Índice del primer usuario en la página actual.
        // Construir la consulta SQL.
        $searchTerm = trim($searchTerm);
        $query = "SELECT * FROM users 
        WHERE username LIKE '%$searchTerm%'
        OR userFullName LIKE '%$searchTerm%'
        OR userEmail LIKE '%$searchTerm%'";
        // Ejecutar la consulta SQL para contar el número total de usuarios.
        $pdo->query($query);
        $pdo->execute();
        $totalUsers = $pdo->rowCount(); // Número total de usuarios que coinciden con el término de búsqueda.
        $numberOfUserPages = ceil($totalUsers / $usersPerPage); // Número total de páginas necesarias para mostrar todos los usuarios.
        $visibleUserPages = 5; // Número máximo de páginas que se mostrarán en la paginación.
        $deltaUserPage = ceil($visibleUserPages / 2); // Número de páginas que se mostrarán antes y después de la página actual.
        // Calcular las páginas que se mostrarán en la paginación.
        if ($numberOfUserPages <= $visibleUserPages) {
            // Si el número total de páginas es menor o igual al número máximo de páginas visibles,
            // se muestran todas las páginas.
            $startUserPage = 1;
            $endUserPage = $numberOfUserPages;
        } elseif ($currentUserPage - $deltaUserPage <= 0) {
            // Si la página actual está cerca del principio de la paginación,
            // se muestra desde la primera página hasta el número máximo de páginas visibles.
            $startUserPage = 1;
            $endUserPage = $visibleUserPages;
        } elseif ($currentUserPage + $deltaUserPage > $numberOfUserPages) {
            // Si la página actual está cerca del final de la paginación,
            // se muestra desde (número total de páginas - número máximo de páginas visibles + 1) hasta el número total de páginas.
            $startUserPage = $numberOfUserPages - $visibleUserPages + 1;
            $endUserPage = $numberOfUserPages;
        } else {
            // Si la página actual está en algún lugar intermedio de la paginación,
            // se muestra desde (página actual - número de páginas antes de la página actual + 1) hasta (página actual + número de páginas después de la página actual - 1).
            $startUserPage = $currentUserPage - $deltaUserPage + 1;
            $endUserPage = $currentUserPage + $deltaUserPage - 1;
        }
        // Construir y ejecutar la consulta SQL para seleccionar los usuarios de la página actual.
        $query .= " LIMIT $currentUserPageFirstResult ,  $usersPerPage";
        $pdo->query($query);
        $pdo->execute();
        // Construir el HTML de la paginación.
        $pagination = "
            <div class='row d-flex justify-content-end'>
                <div class='col-auto'>
                    <nav aria-label='pagination' class='nav mt-1'>
                        <ul class='pagination'>
        ";
        if ($currentUserPage >= 2) {
            $pagination .= "<li class='userPageItem page-item' id='1'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='userPageItem page-item' id='" . ($currentUserPage - 1) . "'><span class='page-link'>&laquo;</span></li>";
        } else {
            $pagination .= "<li class='userPageItem page-item disabled'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='userPageItem page-item disabled'><span class='page-link'>&laquo;</span></li>";
        }
        for ($i = $startUserPage; $i <= $endUserPage; $i++) {
            if ($i == $currentUserPage) {
                $pagination .= "<li class='userPageItem page-item active' aria-current='page' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            } else {
                $pagination .= "<li class='userPageItem page-item' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            }
        }
        if ($currentUserPage < $numberOfUserPages) {
            $pagination .= "<li class='userPageItem page-item' id='" . ($currentUserPage + 1) . "'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='userPageItem page-item' id='" . $numberOfUserPages . "'><span class='page-link'>&raquo;&raquo;</span></li>";
        } else {
            $pagination .= "<li class='userPageItem page-item disabled'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='userPageItem page-item disabled'><span class='page-link'>&raquo;&raquo;</span></li>";
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
                        <td colspan='6'>
                            <div class='alert alert-dark text-center m-0' role='alert'>
                                " . $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["NoUsers"] . "
                            </div>
                        </td>
                    </tr>
                    ";
        } else {
            foreach ($results as $row) {
                if ($row["userId"] == 1) {
                    // Si el userId es igual a 1.
                    // No mostramos el botón para activar/desactivar la cuenta.
                    $accountActivateDeactivateButton = "";
                    // Definimos el estado de la cuenta como "Activada".
                    $accountActivatedDeactivated = $_SESSION["lang"]["UsersControl.php"]["Table"]["States"]["Activated"];
                    // No mostramos el botón de eliminar.
                    $deleteButton = "";
                } else {
                    // Si el userId no es igual a 1.
                    // Determinamos el texto y la clase del botón de activar/desactivar.
                    $buttonText = ($row["accountActivated"]) ? $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Deactivate"] : $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Activate"];
                    $buttonClass = ($row["accountActivated"]) ? "deactivateAccountButton buttonStyle btn btn-danger me-1" : "activateAccountButton buttonStyle btn btn-success me-1";
                    // Creamos el botón de activar/desactivar la cuenta con el texto y la clase determinada.
                    $accountActivateDeactivateButton = "<button type='submit' class='{$buttonClass}' name='activateDeactivateAccountButton'>{$buttonText}</button>";
                    // Definimos el estado de la cuenta basado en si está activada o desactivada.
                    $accountActivatedDeactivated = $_SESSION["lang"]["UsersControl.php"]["Table"]["States"][($row["accountActivated"]) ? "Activated" : "Deactivated"];
                    // Creamos el botón de eliminar usuario.
                    $deleteButton = "<button type='button' class='deleteUserButton buttonStyle btn btn-danger' name='deleteUserButton'>" . $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Delete"] . "</button>";
                }
                $tbody .= "
                        <tr>
                            <th scope='row'>" . $row['userId'] . "</th>
                            <td>" . $row["username"] . "</td>
                            <td>" . $row["userFullName"] . "</td>
                            <td>" . $row["userEmail"] . "</td>
                            <td>" . $accountActivatedDeactivated . "</td>
                            <td>
                                <button type='button' class='editUserModalButton btn btn-light btn-sm' data-bs-toggle='modal'
                                    data-bs-target='#editUserModal" . $row["userId"] . "'>
                                    <img src='./assets/images/edit.svg' alt='Edit Icon' style='width: 1.25rem;'>
                                </button>
                                <div class='editUserModal modal fade' id='editUserModal" . $row["userId"] . "' data-bs-backdrop='static'
                                    data-bs-keyboard='false' tabindex='-1' aria-labelledby='editUserModalLabel' aria-hidden='true'>
                                    <div class='modal-dialog modal-dialog-centered'>
                                        <div class='modal-content'>
                                            <form action='' method='POST' class='editUserForm'>
                                                <div class='modal-header'>
                                                    <h5 class='modal-title'><img src='./assets/images/edit.svg' alt='Edit Icon'
                                                            style='width: 1.25rem;'>
                                                        " . $_SESSION["lang"]["UsersControl.php"]["Table"]["EditModal"]["Edit"] . "
                                                    </h5>
                                                    <button type='button' class='closeEUModalButton btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                                                </div>
                                                <div class='modal-body text-start mt-0'>
                                                    <label for='editUsername' class='col-form-label required'>
                                                        " . $_SESSION["lang"]["UsersControl.php"]["Table"]["EditModal"]["EditUsername"] . ":
                                                    </label>
                                                    <input type='text' class='editUsername form-control' name='editUsername'
                                                        value='" . $row["username"] . "' maxlength='255' required>
                                                        <label for='editUserFullName' class='col-form-label required'>
                                                        " . $_SESSION["lang"]["UsersControl.php"]["Table"]["EditModal"]["EditUserFullName"] . ":
                                                    </label>
                                                    <input type='text' class='editUserFullName form-control' name='editUserFullName'
                                                        value='" . $row["userFullName"] . "' maxlength='255' required>
                                                    <label for='editUserEmail' class='col-form-label required'>
                                                        " . $_SESSION["lang"]["UsersControl.php"]["Table"]["EditModal"]["EditUserEmail"] . ":
                                                    </label>
                                                    <input type='text' class='editUserEmail form-control' name='editUserEmail'
                                                        value='" . $row["userEmail"] . "' required>
                                                    <label for='editUserPassword' class='col-form-label required'>
                                                        " . $_SESSION["lang"]["UsersControl.php"]["Table"]["EditModal"]["NewPassword"] . ":
                                                    </label>
                                                    <input type='text' class='editUserPassword form-control' name='editUserPassword' maxlength='255' required>
                                                    <input type='hidden' class='hiddenUserId' name='hiddenUserId' value='{$row["userId"]}'>
                                                </div>
                                                <div class='modal-footer'>
                                                    <button type='submit' class='editUserButton buttonStyle btn btn-primary me-1'
                                                        name='editUserButton'>
                                                        " . $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Edit"] . "
                                                    </button>
                                                    {$accountActivateDeactivateButton}
                                                    {$deleteButton}
                                                    <button type='button' class='closeEUModalButton buttonStyle btn btn-dark' data-bs-dismiss='modal'>
                                                        " . $_SESSION["lang"]["UsersControl.php"]["Buttons"]["GoBack"] . "
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        ";
            }
        }
        // Si todo ha ido bien, se devuelve una respuesta JSON que indica éxito y se muestran los usuarios.
        $response = [
            "success" => true,
            "pagination" => $pagination,
            "tbody" => $tbody,
            "totalUsers" => $totalUsers,
        ];
        echo json_encode($response);
    } catch (Exception $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        $response = [
            "success" => false,
            "alertType" => "danger",
            "text" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["LoadUsersError"],
            "exceptionMessage" => $e->getMessage(),
        ];
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos.
        $pdo->close();
    }
}