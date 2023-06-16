-- Borrar la base de datos si existe.
DROP DATABASE IF EXISTS library_plus;

-- Crear la base de datos.
CREATE DATABASE library_plus CHARACTER SET "UTF8" COLLATE "utf8_general_ci";

-- Establecer la zona horaria.
SET
    time_zone = "+02:00";

-- Usar la base de datos creada.
USE library_plus;

-- Crear la tabla de usuarios.
CREATE TABLE users (
    -- Identificador del usuario.
    userId INT NOT NULL AUTO_INCREMENT,
    -- Nombre de usuario (único).
    username VARCHAR(255) NOT NULL UNIQUE,
    -- Nombre completo del usuario (único).
    userFullName VARCHAR(255) NOT NULL UNIQUE,
    -- Correo electrónico del usuario (único).
    userEmail VARCHAR(255) NOT NULL UNIQUE,
    -- Contraseña del usuario.
    userPassword VARCHAR(255) NOT NULL,
    -- Indica si la cuenta está activada.
    accountActivated BOOLEAN NOT NULL DEFAULT 1,
    -- Definir la clave primaria.
    PRIMARY KEY(userId)
);

-- Inserta registros en la tabla de usuarios.
INSERT INTO
    users (
        userId,
        username,
        userFullName,
        userEmail,
        userPassword
    )
VALUES
    (
        1,
        "Admin.admin",
        "Admin Admin",
        "admin@educa.madrid.org",
        "$argon2i$v=19$m=131072,t=4,p=3$V0FOdUtENDdFc3hxV2gxOQ$d4RlHh7vADCDnMB3ytrHh7w/IBEnPxE3uHcG7RNNFDU" -- Admin.123 -> Contraseña cifrada con Argon2.
    );

INSERT INTO
    users (
        userId,
        username,
        userFullName,
        userEmail,
        userPassword
    )


-- Crear la tabla de libros.
CREATE TABLE books (
    -- Identificador del libro.
    bookId INT NOT NULL AUTO_INCREMENT,
    -- Identificador único del libro.
    bookIdentifier VARCHAR(255) NOT NULL UNIQUE,
    -- Nombre del libro.
    bookName VARCHAR(255) NOT NULL,
    -- Autor del libro.
    bookAuthor VARCHAR(255) NOT NULL,
    -- Editorial del libro.
    bookEditorial VARCHAR(255) NOT NULL,
    -- Cantidad de libros (por defecto 0 o mayor).
    bookQuantity INT NOT NULL CHECK (bookQuantity >= 0),
    -- Definir la clave primaria.
    PRIMARY KEY(bookId)
);

-- Crear la tabla de dispositivos.
CREATE TABLE devices (
    -- Identificador del dispositivo.
    deviceId INT NOT NULL AUTO_INCREMENT,
    -- Identificador único del dispositivo.
    deviceIdentifier VARCHAR(255) NOT NULL UNIQUE,
    -- Nombre del dispositivo.
    deviceName VARCHAR(255) NOT NULL,
    -- Descripción del dispositivo.
    deviceDescription VARCHAR(255) NOT NULL,
    -- Cantidad de dispositivos (por defecto 1 o mayor).
    deviceQuantity INT NOT NULL CHECK (deviceQuantity >= 0),
    -- Definir la clave primaria.
    PRIMARY KEY(deviceId)
);

-- Crear la tabla de mensajes.
CREATE TABLE messages (
    -- Identificador del mensaje.
    messageId INT NOT NULL AUTO_INCREMENT,
    -- Identificador del usuario que envió el mensaje.
    userId INT NOT NULL,
    -- Demanda del mensaje.
    messageDemand VARCHAR(255) NOT NULL,
    -- Texto del mensaje.
    messageText TEXT NOT NULL,
    -- Fecha y hora del mensaje.
    dateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- Clave foránea que referencia al usuario.
    FOREIGN KEY (userId) REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    -- Definir la clave primaria.
    PRIMARY KEY(messageId)
);

-- Crear la tabla de solicitudes.
CREATE TABLE requests (
    -- Identificador de la solicitud.
    requestId INT NOT NULL AUTO_INCREMENT,
    -- Identificador del usuario que realizó la solicitud.
    userId INT NOT NULL,
    -- Nombre completo del estudiante de la solicitud.
    requestStudentFullName VARCHAR(255) NOT NULL,
    -- Correo electrónico del estudiante de la solicitud.
    requestStudentEmail VARCHAR(255) NOT NULL,
    -- Libros solicitados.
    requestBooks VARCHAR(255),
    -- dispositivo solicitado.
    requestDevice VARCHAR(255),
    -- Texto de la solicitud.
    requestText TEXT NOT NULL,
    -- Fecha y hora de la solicitud.
    dateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- Clave foránea que referencia al usuario.
    FOREIGN KEY (userId) REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    -- Definir la clave primaria.
    PRIMARY KEY(requestId)
);