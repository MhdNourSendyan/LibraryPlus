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
        $bookPage = $data->bookPage;
        $searchTerm = $data->searchTerm;
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Configurar la paginación.
        $currentBookPage = isset($bookPage) ? (int) $bookPage : 1; // Número de página actual.
        $booksPerPage = 10; // Número de libros por página.
        $currentBookPageFirstResult = ($currentBookPage - 1) * $booksPerPage; // Índice del primer libro en la página actual.
        // Construir la consulta SQL.
        $searchTerm = trim($searchTerm);
        $query = "SELECT * FROM books 
        WHERE bookIdentifier LIKE '%$searchTerm%'
        OR bookName LIKE '%$searchTerm%' 
        OR bookAuthor LIKE '%$searchTerm%' 
        OR bookEditorial LIKE '%$searchTerm%'";
        // Ejecutar la consulta SQL para contar el número total de libros.
        $pdo->query($query);
        $pdo->execute();
        $totalBooks = $pdo->rowCount(); // Número total de libros que coinciden con el término de búsqueda.
        $numberOfBookPages = ceil($totalBooks / $booksPerPage); // Número total de páginas necesarias para mostrar todos los libros.
        $visibleBookPages = 5; // Número máximo de páginas que se mostrarán en la paginación.
        $deltaBookPage = ceil($visibleBookPages / 2); // Número de páginas que se mostrarán antes y después de la página actual.
        // Calcular las páginas que se mostrarán en la paginación.
        if ($numberOfBookPages <= $visibleBookPages) {
            // Si el número total de páginas es menor o igual al número máximo de páginas visibles,
            // se muestran todas las páginas.
            $startBookPage = 1;
            $endBookPage = $numberOfBookPages;
        } elseif ($currentBookPage - $deltaBookPage <= 0) {
            // Si la página actual está cerca del principio de la paginación,
            // se muestra desde la primera página hasta el número máximo de páginas visibles.
            $startBookPage = 1;
            $endBookPage = $visibleBookPages;
        } elseif ($currentBookPage + $deltaBookPage > $numberOfBookPages) {
            // Si la página actual está cerca del final de la paginación,
            // se muestra desde (número total de páginas - número máximo de páginas visibles + 1) hasta el número total de páginas.
            $startBookPage = $numberOfBookPages - $visibleBookPages + 1;
            $endBookPage = $numberOfBookPages;
        } else {
            // Si la página actual está en algún lugar intermedio de la paginación,
            // se muestra desde (página actual - número de páginas antes de la página actual + 1) hasta (página actual + número de páginas después de la página actual - 1).
            $startBookPage = $currentBookPage - $deltaBookPage + 1;
            $endBookPage = $currentBookPage + $deltaBookPage - 1;
        }
        // Construir y ejecutar la consulta SQL para seleccionar los libros de la página actual.
        $query .= " LIMIT $currentBookPageFirstResult ,  $booksPerPage";
        $pdo->query($query);
        $pdo->execute();
        // Construir el HTML de la paginación.
        $pagination = "
        <div class='row d-flex justify-content-end'>
            <div class='col-auto'>
                <nav aria-label='pagination' class='nav mt-1'>
                    <ul class='pagination'>
        ";
        if ($currentBookPage >= 2) {
            $pagination .= "<li class='bookPageItem page-item' id='1'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='bookPageItem page-item' id='" . ($currentBookPage - 1) . "'><span class='page-link'>&laquo;</span></li>";
        } else {
            $pagination .= "<li class='bookPageItem page-item disabled'><span class='page-link'>&laquo;&laquo;</span></li>";
            $pagination .= "<li class='bookPageItem page-item disabled'><span class='page-link'>&laquo;</span></li>";
        }
        for ($i = $startBookPage; $i <= $endBookPage; $i++) {
            if ($i == $currentBookPage) {
                $pagination .= "<li class='bookPageItem page-item active' aria-current='page' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            } else {
                $pagination .= "<li class='bookPageItem page-item' id='" . $i . "'><span class='page-link'>" . $i . "</span></li>";
            }
        }
        if ($currentBookPage < $numberOfBookPages) {
            $pagination .= "<li class='bookPageItem page-item' id='" . ($currentBookPage + 1) . "'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='bookPageItem page-item' id='" . $numberOfBookPages . "'><span class='page-link'>&raquo;&raquo;</span></li>";
        } else {
            $pagination .= "<li class='bookPageItem page-item disabled'><span class='page-link'>&raquo;</span></li>";
            $pagination .= "<li class='bookPageItem page-item disabled'><span class='page-link'>&raquo;&raquo;</span></li>";
        }
        $pagination .= "
                    </ul>
                </nav>
            </div>
        </div>
        ";
        // Seleccionar todas las filas de la base de datos.
        $results = $pdo->resultSet();
        $tbody = "";
        if ($pdo->rowCount() == 0) {
            $tbody .= "
            <tr>
                <td colspan='6'>
                    <div class='alert alert-dark text-center m-0' role='alert'>
                        " . $_SESSION["lang"]["Main.php"]["ThrowModal"]["NoBooks"] . "
                    </div>
                </td>
            </tr>
            ";
        } else {
            // Construir el una fila por cada registro que hay en la base de datos.
            foreach ($results as $row) {
                $quantity = $row["bookQuantity"];
                if ($quantity == 0) {
                    $quantity = $_SESSION["lang"]["Main.php"]["Books"]["Table"]["NotAvailable"];
                }
                $tbody .= "
                <tr>
                    <th scope='row'>" . $row['bookIdentifier'] . "</th>
                    <td>" . $row["bookName"] . "</td>
                    <td>" . $row["bookAuthor"] . "</td>
                    <td>" . $row["bookEditorial"] . "</td>
                    <td>" . $quantity . "</td>
                ";
                if ($_SESSION["userInfo"]["userId"] == 1) {
                    $tbody .= "
                    <td>
                        <button type='button' class='btn btn-light btn-sm' data-bs-toggle='modal'
                            data-bs-target='#editBookModal" . $row["bookId"] . "'>
                            <img src='./assets/images/edit.svg' alt='Edit Icon' style='width: 1.25rem;'>
                        </button>
                        <div class='modal fade' id='editBookModal" . $row["bookId"] . "' data-bs-backdrop='static' data-bs-keyboard='false'
                            tabindex='-1' aria-labelledby='editBookModalLabel' aria-hidden='true'>
                            <div class='modal-dialog modal-dialog-centered'>
                                <div class='modal-content'>
                                    <form action='' method='POST' class='editBookForm'>
                                        <div class='modal-header'>
                                            <h5 class='modal-title'>
                                                <img src='./assets/images/edit.svg' alt='Edit Icon' style='width: 1.25rem;'>
                                                " . $_SESSION["lang"]["Main.php"]["Books"]["Table"]["EditModal"]["Edit"] . "
                                            </h5>
                                            <button type='button' class='closeEBModalButton btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                                        </div>
                                        <div class='modal-body text-start mt-0'>
                                            <label for='editBookIdentifier' class='col-form-label required'>
                                                " . $_SESSION["lang"]["Main.php"]["Books"]["Table"]["EditModal"]["EditBookIdentifier"] . ":
                                            </label>
                                            <input type='text' class='editBookIdentifier form-control' name='editBookIdentifier'
                                                value='" . $row["bookIdentifier"] . "' maxlength='255'>
                                            <label for='editBookName' class='col-form-label required'>
                                                " . $_SESSION["lang"]["Main.php"]["Books"]["Table"]["EditModal"]["EditBookName"] . ":
                                            </label>
                                            <input type='text' class='editBookName form-control' name='editBookName'
                                                value='" . $row["bookName"] . "' maxlength='255'>
                                            <label for='editBookAuthor' class='col-form-label required'>
                                                " . $_SESSION["lang"]["Main.php"]["Books"]["Table"]["EditModal"]["EditBookAuthor"] . ":
                                            </label>
                                            <input type='text' class='editBookAuthor form-control' name='editBookAuthor'
                                                value='" . $row["bookAuthor"] . "'>
                                            <label for='editBookEditorial' class='col-form-label required'>
                                                " . $_SESSION["lang"]["Main.php"]["Books"]["Table"]["EditModal"]["EditBookEditorial"] . ":
                                            </label>
                                            <input type='text' class='editBookEditorial form-control' name='editBookEditorial'
                                                value='" . $row["bookEditorial"] . "' maxlength='255'>
                                            <input type='hidden' class='hiddenBookId' name='hiddenBookId' value='{$row["bookId"]}'>
                                            <label for='editBookQuantity' class='col-form-label required'>
                                            " . $_SESSION["lang"]["Main.php"]["Books"]["Table"]["EditModal"]["EditBookQuantity"] . ":
                                            </label>
                                            <input type='number' class='editBookQuantity form-control' name='editBookQuantity'
                                                value='" . $row["bookQuantity"] . "' min='0'>
                                            <input type='hidden' class='hiddenBookId' name='hiddenBookId' value='{$row["bookId"]}'>
                                        </div>
                                        <div class='modal-footer'>
                                            <button type='submit' class='editBookButton buttonStyle btn btn-success me-1'
                                                name='editBookButton'>
                                                " . $_SESSION["lang"]["Main.php"]["Buttons"]["Edit"] . "
                                            </button>
                                            <button type='submit' class='deleteBookButton buttonStyle btn btn-danger'
                                                name='deleteBookButton'>
                                                " . $_SESSION["lang"]["Main.php"]["Buttons"]["Delete"] . "
                                            </button>
                                            <button type='button' class='closeEBModalButton buttonStyle btn btn-dark' data-bs-dismiss='modal'>
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
        // Si todo ha ido bien, se devuelve una respuesta JSON que indica éxito y se muestran los libros.
        $response = [
            "success" => true,
            "pagination" => $pagination,
            "tbody" => $tbody,
            "totalBooks" => $totalBooks,
        ];
        echo json_encode($response);
    } catch (Exception $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        $response = [
            "success" => false,
            "alertType" => "danger",
            "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["LoadBooksError"],
            "exceptionMessage" => $e->getMessage(),
        ];
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos.
        $pdo->close();
    }
}