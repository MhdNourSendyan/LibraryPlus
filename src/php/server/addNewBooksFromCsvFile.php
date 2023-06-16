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
        $file = $_FILES["file"]["tmp_name"];
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Empezar la transacción.
        $pdo->beginTransaction();
        // Manejador.
        $handle = fopen($file, "r");
        // Manejar el caso en el que no se pueda abrir el archivo CSV.
        if ($handle === false) {
            // Cancelar la transacción.
            $pdo->cancelTransaction();
            $response = [
                "success" => false,
                "alertType" => "danger",
                "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["FileNotOpened"],
                "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
            ];
            echo json_encode($response);
            exit; // Salir del script después de enviar la respuesta.
        }
        // Leer el csv.
        $firstRow = true;
        while (($data = fgetcsv($handle, 1000, ",")) !== false) {
            // Ignorar la primera fila.
            if ($firstRow) {
                $firstRow = false;
                continue;
            }
            // En el caso que no hay 5 columnas.
            if (count($data) != 5) {
                // Cancelar la transacción.
                $pdo->cancelTransaction();
                fclose($handle); // Cerrar el archivo antes de salir.
                $response = [
                    "success" => false,
                    "alertType" => "danger",
                    "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                    "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["FileBadFormatted"],
                    "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
                ];
                echo json_encode($response);
                exit; // Salir del script después de enviar la respuesta.
            }
            // Asignar los datos a variables.
            $bookIdentifier = trim($data[0]);
            $bookName = trim($data[1]);
            $bookAuthor = trim($data[2]);
            $bookEditorial = trim($data[3]);
            $bookQuantity = trim($data[4]);
            // En el caso que la cantidad del libro sea negativa.
            if ($bookQuantity < 0) {
                // Cancelar la transacción.
                $pdo->cancelTransaction();
                fclose($handle); // Cerrar el archivo antes de salir.
                $response = [
                    "success" => false,
                    "alertType" => "danger",
                    "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                    "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["BookQuantityCantBeNegative"],
                    "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
                ];
                echo json_encode($response);
                exit; // Salir del script después de enviar la respuesta.
            }
            // Insertar los datos del libro en la base de datos.
            $pdo->query("INSERT INTO books (bookIdentifier, bookName, bookAuthor, bookEditorial, bookQuantity) VALUES (?, ?, ?, ?, ?)");
            $pdo->bind(1, $bookIdentifier, PDO::PARAM_STR);
            $pdo->bind(2, $bookName, PDO::PARAM_STR);
            $pdo->bind(3, $bookAuthor, PDO::PARAM_STR);
            $pdo->bind(4, $bookEditorial, PDO::PARAM_STR);
            $pdo->bind(5, $bookQuantity, PDO::PARAM_INT);
            // En el caso de que ocurra un error al insertar el libro.
            if (!$pdo->execute()) {
                // Cancelar la transacción.
                $pdo->cancelTransaction();
                fclose($handle); // Cerrar el archivo antes de salir.
                $response = [
                    "success" => false,
                    "alertType" => "danger",
                    "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                    "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["BooksNotAdded"],
                    "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
                ];
                echo json_encode($response);
                exit; // Salir del script después de enviar la respuesta.
            }
        }
        // Cerrar el archivo.
        fclose($handle);
        // Terminar la transacción.
        $pdo->endTransaction();
        $response = [
            "success" => true,
            "alertType" => "success",
            "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
            "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["BooksAdded"],
            "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
        ];
        echo json_encode($response);
    } catch (PDOException $e) {
        // Cancelar la transacción.
        $pdo->cancelTransaction();
        // Verificar si el error es una violación de la restricción de duplicidad en el campo 'bookIdentifier'.
        if ($e->getCode() == 23000 && strpos($e->getMessage(), "bookIdentifier") !== false) {
            // Obtener el ID duplicado de la cadena del mensaje de error.
            preg_match("/Duplicate entry '(.+)' for key 'bookIdentifier'/", $e->getMessage(), $matches);
            $duplicatedId = isset($matches[1]) ? $matches[1] : "";
            // El error es por duplicidad en el campo "bookIdentifier".
            $response = [
                "success" => false,
                "alertType" => "danger",
                "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["DuplicateBookIdentifier"] . " (" . $duplicatedId . ")",
                "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
                "exceptionMessage" => $e->getMessage(),
            ];
        } else {
            // Otro tipo de error ocurrió.
            $response = [
                "success" => false,
                "alertType" => "danger",
                "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["BooksNotAdded"],
                "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
                "exceptionMessage" => $e->getMessage(),
            ];
        }
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos.
        $pdo->close();
    }
}