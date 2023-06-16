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
        $hiddenRequestId = $data->hiddenRequestId;
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Preparar la consulta SQL para editar el mensajes en la tabla "requests".
        $pdo->query("DELETE FROM requests WHERE requestId = ?");
        // Ejecutar la consulta preparada y verificar si se ejecutó correctamente.
        $pdo->bind(1, $hiddenRequestId, PDO::PARAM_INT);
        // Si la consulta se ejecutó correctamente, se devuelve una respuesta JSON que indica éxito y se muestra un mensaje de éxito.
        if ($pdo->execute()) {
            $response = [
                "success" => true,
                "alertType" => "success",
                "confirmMessage" => $_SESSION["lang"]["Requests.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["Requests.php"]["ThrowModal"]["RequestDeleted"],
                "buttonText" => $_SESSION["lang"]["Requests.php"]["Buttons"]["Close"],
            ];
            echo json_encode($response);
        }
    } catch (Exception $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        $response = [
            "success" => false,
            "alertType" => "danger",
            "confirmMessage" => $_SESSION["lang"]["Requests.php"]["ThrowModal"]["Confirm"],
            "text" => $_SESSION["lang"]["Requests.php"]["ThrowModal"]["RequestNotDeleted"],
            "buttonText" => $_SESSION["lang"]["Requests.php"]["Buttons"]["Close"],
            "exceptionMessage" => $e->getMessage(),
        ];
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos.
        $pdo->close();
    }
}