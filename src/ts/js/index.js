"use strict";
$(document).ready(function () {
    function login(username, userPassword) {
        $.ajax({
            url: "./php/server/login.php",
            method: "POST",
            data: JSON.stringify({
                username: username,
                userPassword: userPassword,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    window.location.href = "./main.php";
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    if (response.exceptionMessage !== null) {
                        reportError(response.exceptionMessage, "login.php");
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "login.php");
            },
        });
    }
    $(document).on("click", "#loginButton", function (e) {
        e.preventDefault();
        const username = $("#username").val();
        const userPassword = $("#userPassword").val();
        if (username !== "" || userPassword !== "") {
            login(username, userPassword);
        }
    });
    function reportError(errorType, fileName) {
        $.ajax({
            url: "./php/error_handler.php",
            method: "POST",
            data: JSON.stringify({
                errorType: errorType,
                fileName: fileName,
                currentTime: new Date().toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    console.log("Error reportado");
                }
                else {
                    console.log("Error no reportado\n" + `${response.message}`);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error no reportado\n" +
                    "jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown);
            },
        });
    }
});
