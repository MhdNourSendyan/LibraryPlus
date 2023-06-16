<?php
// Incluir el archivo de la base de datos.
require_once("../db.php");
// Importar las clases necesarias de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Requerir los archivos de PHPMailer
require_once("../../assets/libraries/PHPMailer/src/Exception.php");
require_once("../../assets/libraries/PHPMailer/src/PHPMailer.php");
require_once("../../assets/libraries/PHPMailer/src/SMTP.php");
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
        $username = ucwords($data->username);
        $userFullName = ucwords($data->userFullName);
        $userEmail = $data->userEmail;
        $userPassword = $data->userPassword;
        $hashedPassword = hashPassword($userPassword);
        // Crea una nueva conexión a la base de datos.
        $pdo = new DB();
        // Preparar la consulta SQL para editar el mensajes en la tabla "messages".
        $pdo->query("INSERT INTO users (username, userFullName, userEmail, userPassword) VALUES (?, ?, ?, ?)");
        $pdo->bind(1, $username, PDO::PARAM_STR);
        $pdo->bind(2, $userFullName, PDO::PARAM_STR);
        $pdo->bind(3, $userEmail, PDO::PARAM_STR);
        $pdo->bind(4, $hashedPassword, PDO::PARAM_STR);
        // Ejecutar la consulta preparada y verificar si se ejecutó correctamente.
        if ($pdo->execute()) {
            // Si la consulta se ejecutó correctamente, se devuelve una respuesta JSON que indica éxito y se muestra un mensaje de éxito.
            if (sendEmail($username, $userEmail, $userPassword)) {
                $response = array(
                    "success" => true,
                    "alertType" => "success",
                    "confirmMessage" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["Confirm"],
                    "text" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["UserCreatedAndEmailSent"],
                    "buttonText" => $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Close"],
                );
            } else {
                $response = array(
                    "success" => true,
                    "alertType" => "warning",
                    "confirmMessage" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["Confirm"],
                    "text" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["UserCreatedOnly"],
                    "buttonText" => $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Close"],
                );
            }
            echo json_encode($response);
        }
    } catch (PDOException $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        // Manejar cualquier excepción de PDO que ocurra durante el proceso.
        switch ($e->getCode()) {
            case "23000":
                // Error de violación de restricción única.
                if (strpos($e->getMessage(), "'username'") !== false) {
                    // El error se debe a un duplicado en el campo "username".
                    $text = $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["UsernameTaken"];
                } else if (strpos($e->getMessage(), "'userFullName'") !== false) {
                    // El error se debe a un duplicado en el campo "userEmail".
                    $text = $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["UserFullNameTaken"];
                } else if (strpos($e->getMessage(), "'userEmail'") !== false) {
                    // El error se debe a un duplicado en el campo "userEmail".
                    $text = $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["UserEmailTaken"];
                }
                break;
            default:
                $text = $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["UserNotCreated"];
                break;
        }
        $response = array(
            "success" => false,
            "alertType" => "danger",
            "confirmMessage" => $_SESSION["lang"]["UsersControl.php"]["ThrowModal"]["Confirm"],
            "text" => $text,
            "buttonText" => $_SESSION["lang"]["UsersControl.php"]["Buttons"]["Close"],
            "exceptionMessage" => $e->getMessage(),
        );
        echo json_encode($response);
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos.
        $pdo->close();
    }
}
function hashPassword($password)
{
    // Opciones para el hacheo. 
    $options = [
        "memory_cost" => 1 << 17,
        "time_cost" => 4,
        "threads" => 3,
    ];
    // Hashear la contraseña.
    $hashedPassword = password_hash($password, PASSWORD_ARGON2I, $options);
    // Devolver la contraseña hasheada.
    return $hashedPassword;
}
function sendEmail($username, $userEmail, $userPassword)
{
    try {
        // Crear una instancia; pasando `true` habilita las excepciones.
        $email = new PHPMailer(true);
        // CONFIGURACIÓN DEL SERVIDOR.
        $email->SMTPDebug = 0; // Habilitar la salida detallada de depuración.
        $email->isSMTP(); // Enviar utilizando SMTP.
        $email->Host = "smtp01.educa.madrid.org"; // Establecer el servidor SMTP para enviar los correos.
        $email->SMTPAuth = true; // Habilitar la autenticación SMTP.
        $email->Username = ""; // Nombre de usuario SMTP.
        $email->Password = ""; // Contraseña SMTP.
        $email->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Habilitar cifrado TLS implícito.
        $email->Port = 465; // Puerto TCP para la conexión; utiliza 587 si has establecido `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`.
        // DESTINATARIOS.
        $email->setFrom("noreplay@libraryplus.com", "Library Plus");
        // Agregar un destinatario.
        $email->addAddress($userEmail);
        // CONTENIDO.
        // Establecer el formato de correo electrónico a HTML.
        $email->isHTML(true);
        // Establecer el asunto del correo con codificación de caracteres
        $email->Subject = mb_convert_encoding("Registro exitoso", "ISO-8859-1", "UTF-8");
        // Establecer el cuerpo del correo
        $email->Body = "<span style='color: #164db3;'>" . mb_convert_encoding("Te hemos registrado exitosamente en nuestra plataforma Library Plus", "ISO-8859-1", "UTF-8") . "</span><br><br>";
        $email->Body .= "<span style='color: #164db3;'>" . mb_convert_encoding("Nombre de usuario:", "ISO-8859-1", "UTF-8") . "</span> " . mb_convert_encoding($username, "ISO-8859-1", "UTF-8") . "<br>";
        $email->Body .= "<span style='color: #164db3;'>" . mb_convert_encoding("Contraseña:", "ISO-8859-1", "UTF-8") . "</span> " . mb_convert_encoding($userPassword, "ISO-8859-1", "UTF-8") . "<br><br>";
        $email->Body .= "<span style='color: #164db3;'>" . mb_convert_encoding("Este correo ha sido generado automáticamente. Por favor, no responder.", "ISO-8859-1", "UTF-8") . "</span>";
        // Si el correo se envía correctamente
        if ($email->send()) {
            return true;
        } else {
            // Si hay un error al enviar el correo, mostrar un mensaje de error
            $error = $email->ErrorInfo;
            reportError($error);
            return false;
        }
    } catch (Exception $e) {
        // Si ocurre una excepción, mostrar un mensaje de error y obtener el mensaje de error detallado del objeto $email
        $error = $email->ErrorInfo;
        reportError($error . "Exception: " . $e);
        return false;
    }
}
function reportError(
    $error
) {
    setlocale(LC_TIME, "es_ES");
    $currentTime = date("d/m/Y - H:i");
    // Formatear el mensaje de error.
    $errorLog = "Tipo de error: " . $error . PHP_EOL;
    $errorLog .= "Archivo: generatePdf.php" . PHP_EOL;
    $errorLog .= "Fecha y hora: $currentTime" . PHP_EOL;
    $errorLog .= "____________________________________________________________________________________________________" . PHP_EOL;
    // Escribir el mensaje de error en el archivo de texto.
    file_put_contents("../log/log.txt", $errorLog, FILE_APPEND);
}