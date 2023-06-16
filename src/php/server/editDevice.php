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
        $editDeviceIdentifier = $data->editDeviceIdentifier;
        $editDeviceName = $data->editDeviceName;
        $editDeviceDescription = $data->editDeviceDescription;
        $editDeviceQuantity = $data->editDeviceQuantity;
        $hiddenDeviceId = $data->hiddenDeviceId;
        // Crea una nueva conexión a la base de datos.
        $pdo = new DB();
        // Preparar la consulta SQL para editar el dispositivo en la tabla "devices".
        $pdo->query("UPDATE devices SET deviceIdentifier = ?, deviceName = ?, deviceDescription = ?, deviceQuantity = ? WHERE deviceId = ?");
        $pdo->bind(1, $editDeviceIdentifier, PDO::PARAM_STR);
        $pdo->bind(2, $editDeviceName, PDO::PARAM_STR);
        $pdo->bind(3, $editDeviceDescription, PDO::PARAM_STR);
        $pdo->bind(4, $editDeviceQuantity, PDO::PARAM_INT);
        $pdo->bind(5, $hiddenDeviceId, PDO::PARAM_INT);
        // Ejecutar la consulta preparada y verificar si se ejecutó correctamente.
        if ($pdo->execute()) {
            // Si la consulta se ejecutó correctamente, se devuelve una respuesta JSON que indica éxito y se muestra un mensaje de éxito.
            $response = [
                "success" => true,
                "alertType" => "success",
                "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["DeviceEdited"],
                "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
            ];
            echo json_encode($response);
        }
    } catch (Exception $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        // Verificar si el error es una violación de la restricción de duplicidad en el campo 'deviceIdentifier'.
        if ($e->getCode() == 23000 && strpos($e->getMessage(), "deviceIdentifier") !== false) {
            // Obtener el ID duplicado de la cadena del mensaje de error.
            preg_match("/Duplicate entry '(.+)' for key 'deviceIdentifier'/", $e->getMessage(), $matches);
            $duplicatedId = isset($matches[1]) ? $matches[1] : "";
            // El error es por duplicidad en el campo "deviceIdentifier".
            $response = [
                "success" => false,
                "alertType" => "danger",
                "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["DeviceNotEditedDuplicateIdentifier"] . " (" . $duplicatedId . ")",
                "buttonText" => $_SESSION["lang"]["Main.php"]["Buttons"]["Close"],
                "exceptionMessage" => $e->getMessage(),
            ];
        } else {
            // Otro tipo de error ocurrió.
            $response = [
                "success" => false,
                "alertType" => "danger",
                "confirmMessage" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["Main.php"]["ThrowModal"]["DeviceNotEdited"],
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