<?php
// Incluir tcpdf.
require_once("../assets/libraries/TCPDF/tcpdf.php");
// Incluir la base de datos.
require_once("./db.php");
// Importar las clases necesarias de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Requerir los archivos de PHPMailer
require_once("../assets/libraries/PHPMailer/src/Exception.php");
require_once("../assets/libraries/PHPMailer/src/PHPMailer.php");
require_once("../assets/libraries/PHPMailer/src/SMTP.php");
// Iniciar sesión.
session_start();
// Obtener el idioma almacenada en cookies.
$lang = isset($_COOKIE["lang"]) ? $_COOKIE["lang"] : "es";
$file_path = "../languages/{$lang}.json";
// Comprobar si el archivo existe y si tiene un tamaño mayor que cero antes de leerlo.
if (file_exists($file_path) && filesize($file_path) > 0) {
    $json_str = file_get_contents($file_path);
} else {
    $json_str = file_get_contents("../languages/es.json");
}
// Guardar los datos JSON en el almacenamiento de sesión del usuario.
$json_data = json_decode($json_str, true);
$_SESSION["lang"] = $json_data;
if (isset($_POST["generatePdfButton"])) {
    try {
        // Obtener el valor de requestId del formulario.
        $requestId = $_POST["hiddenRequestId"];
        // Crear una nueva conexión a la base de datos.
        $pdo = new DB();
        // Ejecutar la consulta SQL para sacar los datos de la solicitud.
        $pdo->query("SELECT * FROM requests WHERE requestId = ?");
        $pdo->bind(1, $requestId, PDO::PARAM_INT);
        $pdo->execute();
        $row = $pdo->single();
        // Guardar los datos de la base de datos.
        $requestStudentFullName = $row["requestStudentFullName"];
        $requestStudentEmail = $row["requestStudentEmail"];
        $requestBooks = $row["requestBooks"];
        $requestDevice = $row["requestDevice"];
        $requestText = $row["requestText"];
        $dateTime = date("d/m/Y", strtotime($row["dateTime"])) . " - " . date("H:i", strtotime($row["dateTime"]));
        $currentTime = date("d/m/Y - H:i");
        $userId = $row["userId"];
        // Ejecutar la consulta SQL sacar los datos del usuario.
        $pdo->query("SELECT * FROM users WHERE userId = ?");
        $pdo->bind(1, $userId, PDO::PARAM_INT);
        $pdo->execute();
        $row = $pdo->single();
        $username = $row["username"];
        $userFullName = $row["userFullName"];
        $userEmail = $row["userEmail"];
        class MYPDF extends TCPDF
        {
            // Header.
            public function Header()
            {
                // Imagen.
                $this->Image("../assets/images/logo.jpg", 15, 5, 25, 25, "jpg", "");
                $this->SetFont("dejavusans", "", null, "", "default", false);
                $html = <<<EOF
                <style type="text/css">
                    h1 {
                        color: #164db3;
                        border-bottom: 2px solid #164db3;
                    }
                </style>
                <h1>Library Plus</h1>
                EOF;
                $this->ln(15);
                $this->writeHTML($html, true, false, true, false, "C");
            }
            // Footer.
            public function Footer()
            {
                // Información + Numero de pagina
                $this->SetFont("dejavusans", "", 9, true, "UTF-8");
                $html = <<<EOF
                <p>{$_SESSION["lang"]["GeneratePdf.php"]["Footer"]["Page"]} {$this->PageNo()}</p>
                EOF;
                $this->writeHTML($html, true, false, true, false, "C");
            }
        }
        // Opciones de tcpdf_________________________________________________________________________________________________________
        // Instanciar.
        $pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, "UTF-8", false);
        // Establecer fuentes para encabezado y pie de página.
        $pdf->setHeaderFont(array(PDF_FONT_NAME_MAIN, "", PDF_FONT_SIZE_MAIN));
        $pdf->setFooterFont(array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
        // Establecer fuente monoespaciada por defecto.
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        // Establecer márgenes.
        $pdf->SetMargins(PDF_MARGIN_LEFT, 32, PDF_MARGIN_RIGHT);
        $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
        // Establecer saltos de página automáticos.
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
        // Establecer factor de escala de imagen.
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
        // Establecer modo de subconjunto de fuente por defecto.
        $pdf->setFontSubsetting(true);
        // Establecer fuente.
        $pdf->SetFont("dejavusans", "", 9, true, "UTF-8");
        // Agregar una página.
        $pdf->AddPage();
        // Establecer información del documento.
        $pdf->SetCreator("Library Plus");
        // Main_________________________________________________________________________________________________________
// Justificante de presentación.
        $html = "<h2>" . $_SESSION["lang"]["GeneratePdf.php"]["Main"]["Document"] . "</h2>";
        $pdf->writeHTML($html, true, false, true, false, "C");
        $pdf->Ln(5);
        // Datos de la solicitud.
        if ($lang == "ar") {
            $html = <<<EOF
            <style type="text/css">
            p {
                color: #164db3;
                text-align: right;
            }
            span {
                color: #000;
            }
            </style>
            <!-- Id de la solicitud. -->
            <p><span>{$requestId}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["RequestNumber"]}: </p>
            <!-- Nombre de usuario. -->
            <p><span>{$username}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["Username"]}: </p>
            <!-- Nombre completo del usuario. -->
            <p><span>{$userFullName}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["UserFullName"]}: </p>
            <!-- Correo electrónico del usuario. -->
            <p><span>{$userEmail}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["UserEmail"]}: </p>
            <!-- Nombre completo del alumno. -->
            <p><span>{$requestStudentFullName}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["StudentFullName"]}: </p>
            <!-- Correo electrónico del alumno. -->
            <p><span>{$requestStudentEmail}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["StudentEmail"]}: </p>
            <!-- Identificadores de los libros solicitados. -->
            <p><span>{$requestBooks}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BooksRequests"]}: </p>
            <!-- Identificadores de los dispositivos solicitados. -->
            <p><span>{$requestDevice}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DeviceRequest"]}: </p>
            <!-- Mensaje. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["Message"]}: </p>
            <span>{$requestText}</span>
            EOF;
        } else {
            $html = <<<EOF
            <style type="text/css">
            p {
                color: #164db3;
            }
            span {
                color: #000;
            }
            </style>
            <!-- Id de la solicitud. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["RequestNumber"]}: <span>{$requestId}</span></p>
            <!-- Nombre de usuario. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["Username"]}: <span>{$username}</span></p>
            <!-- Nombre completo del usuario. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["UserFullName"]}: <span>{$userFullName}</span></p>
            <!-- Correo electrónico del usuario. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["UserEmail"]}: <span>{$userEmail}</span></p>
            <!-- Nombre completo del alumno. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["StudentFullName"]}: <span>{$requestStudentFullName}</span></p>
            <!-- Correo electrónico del alumno. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["StudentEmail"]}: <span>{$requestStudentEmail}</span></p>
            <!-- Identificadores de los libros solicitados. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BooksRequests"]}: <span>{$requestBooks}</span>
            <!-- Identificadores de los dispositivos solicitados. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DeviceRequest"]}: <span>{$requestDevice}</span>
            </p>
            <!-- Mensaje. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["Message"]}: <span>{$requestText}</span></p>
            EOF;
        }
        $pdf->writeHTML($html, true, false, true, false, "");
        $pdf->Ln(5);
        // Libros prestados.
        if (!empty($requestBooks)) {
            $pdf->SetTextColor(22, 77, 179);
            if ($lang == "ar") {
                $html = <<<EOF
                <style type="text/css">
                p {
                    color: #164db3;
                    text-align: right;
                }
                span {
                    color: #000;
                }
                </style>
                <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BookRequests"]}:</p>
                EOF;
            } else {
                $html = <<<EOF
                <style type="text/css">
                p {
                    color: #164db3;
                }
                span {
                    color: #000;
                }
                </style>
                <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BookRequests"]}:</p>
                EOF;
            }
            $pdf->writeHTML($html, true, false, true, false, "");
            $pdf->Ln(3);
            // Encabezado de tabla.
            $html = <<<EOF
            <style type="text/css">
            table {
                width: 100%;
                text-align: center;
            }
            table th {
                color: #164db3;
                height: 25px;
                border: 1px solid black;
                padding: 10px;
            }
            table td {
                height: 50px;
                border: 1px solid black;
            }
            </style>
            <table>
                <tr>
                    <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BookRequestsTable"]["Identifier"]}</th>
                    <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BookRequestsTable"]["Book"]}</th>
                    <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BookRequestsTable"]["Author"]}</th>
                    <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BookRequestsTable"]["Editorial"]}</th>
                    <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BookRequestsTable"]["Quantity"]}</th>
                </tr>
            EOF;
            // Agregar filas de libros.    
            $pdf->SetTextColor(0, 0, 0);
            $requestBooks = convertStringToArray($requestBooks);
            foreach ($requestBooks as $id) {
                $pdo->query("SELECT * FROM books WHERE bookIdentifier = ?");
                $pdo->bind(1, $id, PDO::PARAM_STR);
                $pdo->execute();
                $row = $pdo->single();
                $rowCount = $pdo->rowCount();
                if ($rowCount > 0) {
                    $row = $pdo->single();
                    $html .= <<<EOF
                    <tr>
                        <td>{$row["bookIdentifier"]}</td>
                        <td>{$row["bookName"]}</td>
                        <td>{$row["bookAuthor"]}</td>
                        <td>{$row["bookEditorial"]}</td>
                    EOF;
                    if ($row["bookQuantity"] == 0) {
                        $html .= <<<EOF
                        <td>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["BookRequestsTable"]["NotAvailable"]}</td>
                        EOF;
                    } else {
                        $html .= <<<EOF
                        <td>{$row["bookQuantity"]}</td>
                        EOF;
                    }
                    $html .= <<<EOF
                    </tr>
                    EOF;
                }
            }
            $html .= <<<EOF
            </table>
            EOF;
            $pdf->writeHTML($html, true, false, true, false, "");
            $pdf->Ln(5);
        }
        // Dispositivos prestados.
        if (!empty($requestDevice)) {
            $pdf->SetTextColor(22, 77, 179);
            if ($lang == "ar") {
                $html = <<<EOF
                <style type="text/css">
                    p {
                        color: #164db3;
                        text-align: right;
                    }
                    span {
                        color: #000;
                    }
                </style>
                <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DevicesRequests"]}:</p>
                EOF;
            } else {
                $html = <<<EOF
                <style type="text/css">
                    p {
                        color: #164db3;
                    }
                    span {
                        color: #000;
                    }
                </style>
                <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DevicesRequests"]}:</p>
                EOF;
            }
            $pdf->writeHTML($html, true, false, true, false, "");
            $pdf->Ln(3);
            // Encabezado de tabla.
            $html = <<<EOF
            <style type="text/css">
                table {
                    width: 100%;
                    text-align: center;
                }
                table th {
                    color: #164db3;
                    height: 25px;
                    border: 1px solid black;
                }
                table td {
                    height: 50px;
                    border: 1px solid black;
                }
            </style>
            <table>
                <tr>
                    <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DevicesRequestsTable"]["Identifier"]}</th>
                    <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DevicesRequestsTable"]["Device"]}</th>
                    <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DevicesRequestsTable"]["Quantity"]}</th>
                </tr>
            EOF;
            // Agregar filas de dispositivos.
            $pdf->SetTextColor(0, 0, 0);
            $requestDevice = convertStringToArray($requestDevice);
            foreach ($requestDevice as $id) {
                $pdo->query("SELECT * FROM devices WHERE deviceIdentifier = ?");
                $pdo->bind(1, $id, PDO::PARAM_STR);
                $pdo->execute();
                $row = $pdo->single();
                $rowCount = $pdo->rowCount();
                if ($rowCount > 0) {
                    $row = $pdo->single();
                    $html .= <<<EOF
                    <tr>
                    <td>{$row["deviceIdentifier"]}</td>
                    <td>{$row["deviceName"]}</td>
                    EOF;
                    if ($row["deviceQuantity"] == 0) {
                        $html .= <<<EOF
                        <td>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DevicesRequestsTable"]["NotAvailable"]}</td>
                        EOF;
                    } else {
                        $html .= <<<EOF
                        <td>{$row["deviceQuantity"]}</td>
                        EOF;
                    }
                    $html .= <<<EOF
                    </tr>
                    EOF;
                }
            }
            $html .= <<<EOF
        </table>
        EOF;
            $pdf->writeHTML($html, true, false, true, false, "");
            $pdf->Ln(5);
        }
        // Fecha y firma.
        if ($lang == "ar") {
            $html = <<<EOF
            <style type="text/css">
                p {
                    color: #164db3;
                    text-align: right;
                }
                span {
                    color: #000;
                }
            </style>
            <!-- Fecha y hora de la solicitud. -->
            <p><span>{$dateTime}</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DateAndTimeRequest"]}: </p>
            <!-- Fecha y hora actual. -->
            <p><span>$currentTime</span>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["PickUpDate"]}: </p>
            <!-- Fecha y hora actual de devolución. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["ReturnDate"]}: </p>
            EOF;
        } else {
            $html = <<<EOF
            <style type="text/css">
                p {
                color: #164db3;
                }
                span {
                color: #000;
                }
            </style>
            <!-- Fecha y hora de la solicitud. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["DateAndTimeRequest"]}: <span>{$dateTime}</span></p>
            <!-- Fecha y hora actual. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["PickUpDate"]}: <span>$currentTime</span></p>
            <!-- Fecha y hora actual de devolución. -->
            <p>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["ReturnDate"]}: <span></span></p>
            EOF;
        }
        $pdf->writeHTML($html, true, false, true, false, "");
        $pdf->Ln(5);
        $html = <<<EOF
        <style type="text/css">
        table {
            width: 100%;
            text-align: center;
        }
        table th {
            color: #164db3;
            height: 25px;
            border: 1px solid black;
            padding: 10px;
        }
        table td {
            height: 100px;
            border: 1px solid black;
        }
        </style>
        <table>
            <tr>
                <!-- Firma del administrador. -->
                <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["AdminSignature"]}</th>
                <!-- Firma del profesor. -->
                <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["TeacherSignature"]}</th>
                <!-- Firma del alumno. -->
                <th>{$_SESSION["lang"]["GeneratePdf.php"]["Main"]["StudentSignature"]}</th>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
        EOF;
        $pdf->writeHTML($html, true, false, true, false, "");
        // ---------------------------------------------------------
        // Close and output PDF document.
        $pdfName = str_replace(" ", "", $requestStudentFullName) . "-" . $requestId . "_" . strtoupper($lang) . ".pdf";
        $pdfPath = __DIR__ . "/pdf/" . $pdfName;
        // Generar el PDF y guardarlo en la ubicación especificada
        $pdf->Output($pdfPath, "F");
        sendEmail($pdfPath);
    } catch (PDOException $e) {
        // Si se produce una excepción mientras se ejecuta la consulta, se captura y se muestra un mensaje de error.
        reportError($e);
        echo $_SESSION["lang"]["GeneratePdf.php"]["errors"]["PdfNotGenerated"];
    } finally {
        // En cualquier caso, cerramos la conexión a la base de datos.
        $pdo->close();
    }
}
//___________________________________________________ENVIAR_CORREO___________________________________________________//
function sendEmail($pdfPath)
{
    global $requestStudentFullName, $requestId, $lang;
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
        $email->addAddress("");
        // ATTACHMENTS.
        $email->addAttachment($pdfPath);
        // CONTENIDO.
        // Establecer el formato de correo electrónico a HTML.
        $email->isHTML(true);
        // Establecer el asunto del correo con codificación de caracteres
        $email->Subject = mb_convert_encoding("Justificante de préstamo-Pdf", "ISO-8859-1", "UTF-8");
        // Establecer el cuerpo del correo
        $email->Body = "<span style='color: #164db3;'>" . mb_convert_encoding("Este correo ha sido generado automáticamente. Por favor, no responder.", "ISO-8859-1", "UTF-8") . "</span>";
        // Si el correo se envía correctamente
        if ($email->send()) {
            // Establecer las cabeceras para mostrar el PDF en el navegador
            header("Content-type: application/pdf");
            $fileName = str_replace(" ", "", $requestStudentFullName) . "-" . $requestId . "_" . strtoupper($lang);
            header("Content-Disposition: inline; filename={$fileName}");
            // Leer el archivo PDF y enviarlo al navegador
            readfile($pdfPath);
        } else {
            // Si hay un error al enviar el correo, mostrar un mensaje de error
            $error = $email->ErrorInfo;
            reportError($error);
            echo $_SESSION["lang"]["GeneratePdf.php"]["errors"]["EmailNotSend"];
        }
    } catch (Exception $e) {
        // Si ocurre una excepción, mostrar un mensaje de error y obtener el mensaje de error detallado del objeto $email
        $error = $email->ErrorInfo;
        reportError($error . "Exception: " . $e);
        echo $_SESSION["lang"]["GeneratePdf.php"]["errors"]["EmailNotSend"];
    }
}
//___________________________________________________Funciones___________________________________________________//
function convertStringToArray($string)
{
    // Separar los elementos de la cadena utilizando la coma como delimitador
    $elements = explode(",", $string);
    // Crear un array vacío para almacenar el resultado
    $result = array();
    // Recorrer cada elemento
    foreach ($elements as $element) {
        // Agregar el elemento al resultado como un array con un solo elemento
        $result[] = trim($element);
    }
    // Devolver el resultado
    return $result;
}
function reportError(
    $error
) {
    try {
        setlocale(LC_TIME, "es_ES");
        $currentTime = date("d/m/Y - H:i");
        // Formatear el mensaje de error.
        $errorLog = "Tipo de error: " . $error . PHP_EOL;
        $errorLog .= "Archivo: generatePdf.php" . PHP_EOL;
        $errorLog .= "Fecha y hora: $currentTime" . PHP_EOL;
        $errorLog .= "____________________________________________________________________________________________________" . PHP_EOL;
        // Escribir el mensaje de error en el archivo de texto.
        file_put_contents("./log/log.txt", $errorLog, FILE_APPEND);
        return "Error reportado";
    } catch (Exception $e) {
        return "Error no reportado\nError: " . $e->getMessage();
    }
}