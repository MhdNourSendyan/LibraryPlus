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
        // Obtener el nombre de usuario y la contraseña desde los datos decodificados JSON.
        $username = $data->username;
        $userPassword = $data->userPassword;
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Realizar una consulta preparada con el nombre de usuario.
        $pdo->query("SELECT * FROM users WHERE username = ?");
        $pdo->bind(1, $username, PDO::PARAM_STR);
        // Obtener una única fila del resultado de la consulta.
        $row = $pdo->single();
        // Verificar si se encontró una fila y si la contraseña es válida usando la función password_verify().
        if ($row && password_verify($userPassword, $row["userPassword"])) {
            // Verificar si la cuenta del usuario está activada.
            if ($row["accountActivated"]) {
                // Si la autenticación es exitosa y la cuenta está activada, establece una variable de sesión "auth" a verdadero.
                $_SESSION["auth"] = true;
                // También se guarda información del usuario en una matriz de información del usuario.
                $_SESSION["userInfo"] = [
                    "userId" => "{$row["userId"]}",
                ];
                // Devolver JSON de éxito con un mensaje de éxito.
                echo json_encode(["success" => true]);
            } else {
                // Si la autenticación es exitosa pero la cuenta no está activada, devolver JSON de fracaso con un mensaje de error.
                $response = [
                    "success" => false,
                    "alertType" => "danger",
                    "confirmMessage" => $_SESSION["lang"]["Index.php"]["ThrowModal"]["Confirm"],
                    "text" => $_SESSION["lang"]["Index.php"]["ThrowModal"]["AccountNotActivated"],
                    "buttonText" => $_SESSION["lang"]["Index.php"]["Buttons"]["Close"],
                    "exceptionMessage" => null,
                ];
                echo json_encode($response);
            }
        } else {
            // Si la autenticación falla, se devuelve JSON de fracaso con un mensaje de error.
            $response = [
                "success" => false,
                "alertType" => "danger",
                "confirmMessage" => $_SESSION["lang"]["Index.php"]["ThrowModal"]["Confirm"],
                "text" => $_SESSION["lang"]["Index.php"]["ThrowModal"]["InvalidLogIn"],
                "buttonText" => $_SESSION["lang"]["Index.php"]["Buttons"]["Close"],
                "exceptionMessage" => null,
            ];
            echo json_encode($response);
        }
    } catch (Exception $e) {
        // Si hay una excepción, se devuelve JSON de fracaso con un mensaje genérico.
        $response = [
            "success" => false,
            "alertType" => "danger",
            "confirmMessage" => $_SESSION["lang"]["Index.php"]["ThrowModal"]["Confirm"],
            "text" => $_SESSION["lang"]["Index.php"]["ThrowModal"]["CatchError"],
            "buttonText" => $_SESSION["lang"]["Index.php"]["Buttons"]["Close"],
            "exceptionMessage" => $e->getMessage(),
        ];
        echo json_encode($response);
    } finally {
        // Cerrar la conexión a la base de datos.
        $pdo->close();
    }
}