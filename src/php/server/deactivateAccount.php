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
        $hiddenUserId = $data->hiddenUserId;
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Preparar la consulta SQL para actualizar el usuario en la tabla "users".
        $pdo->query("UPDATE users SET accountActivated = 0 WHERE userID = ?");
        $pdo->bind(1, $hiddenUserId, PDO::PARAM_INT);
        // Ejecutar la consulta preparada y verificar si se ejecutó correctamente.
        if ($pdo->execute()) {
            // Si la consulta se ejecutó correctamente, se devuelve una respuesta JSON que indica éxito y se muestra un mensaje de éxito.
            $response = [
                "success" => true,
                "alertType" => "success",
                "confirmMessage" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["AccountDeactivated"],
                "buttonText" => $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Close"],
            ];
            echo json_encode($response);
        }
    } catch (Exception $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        $response = [
            "success" => false,
            "alertType" => "danger",
            "confirmMessage" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["Confirm"],
            "text" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["AccountNotDeactivated"],
            "buttonText" => $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Close"],
            "exceptionMessage" => $e->getMessage(),
        ];
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos.
        $pdo->close();
    }
}