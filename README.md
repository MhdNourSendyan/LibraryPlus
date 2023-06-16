# Library Plus

Es un Trabajo de Fin de Grado y consiste en una aplicación web diseñada para simplificar el proceso de préstamo de libros y dispositivos en centros educativos.

### Pasos para usar la aplicación web:
1. Clona el repositorio utilizando el comando: `git clone <URL>`
2. Completa los siguientes campos en los archivos correspondientes para configurar el envío de correos electrónicos:
    - \src\php\generatePdf.php
        ```php
        $email->Username = ""; // Nombre de usuario del Educa Madrid (sin @educa.madrid.org).
        $email->Password = ""; // Contraseña de usuario del Educa Madrid.
        $email->addAddress(""); // Correo del destinatario.
        ```
    - \src\php\server\registerUser.php
        ```php
        $email->Username = ""; // Nombre de usuario del Educa Madrid (sin @educa.madrid.org).
        $email->Password = ""; // Contraseña de usuario del Educa Madrid.
        ```
    - \src\php\server\editUser.php
        ```php
        $email->Username = ""; // Nombre de usuario del Educa Madrid (sin @educa.madrid.org).
        $email->Password = ""; // Contraseña de usuario del Educa Madrid.
        ```
3. Despliega la base de datos ejecutando el archivo \src\database\database.sql en tu servidor de bases de datos.
4. Inicia sesión como administrador utilizando las siguientes credenciales:
    - Usuario: Admin.admin
    - Contraseña: Admin.123
