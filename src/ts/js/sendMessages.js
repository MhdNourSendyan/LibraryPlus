"use strict";
$(document).ready(function () {
    function sendMessages(userId, messageDemand, messageText) {
        $.ajax({
            method: "POST",
            url: "./php/server/sendMessages.php",
            data: JSON.stringify({
                userId: userId,
                messageDemand: messageDemand,
                messageText: messageText,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#resetSendMessagesButton").click();
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "sendMessages.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "sendMessages.php");
            },
        });
    }
    $(document).on("click", "#submitSendMessagesButton", function (e) {
        e.preventDefault();
        const userId = $("#hiddenUserId").val();
        const messageText = $("#messageText").val();
        let messageDemand = $("#messageDemand").val();
        switch (messageDemand) {
            case "1":
                messageDemand = "Cambiar el nombre de usuario";
                break;
            case "2":
                messageDemand = "Cambiar el correo";
                break;
            case "3":
                messageDemand = "Cambiar la contraseña";
                break;
            case "4":
                messageDemand = "Otro";
                break;
        }
        sendMessages(userId, messageDemand, messageText);
    });
    const messagesRegExp = {
        expMessageDemand: /[1-4]/,
        expMessageText: /.+/,
    };
    const validateField = (expression, input, errorObject) => {
        const isValid = input.value.trim().length !== 0 && expression.test(input.value);
        input.classList.toggle("is-valid", isValid);
        input.classList.toggle("is-invalid", !isValid);
        errorObject[input.name] = !isValid;
        submitControler(errorObject);
    };
    const submitControler = (errorObject) => {
        switch (errorObject) {
            case sendMessagesErrors:
                submitSendMessagesButton.disabled =
                    Object.values(errorObject).filter((value) => value == true).length >
                        0;
                break;
            default:
                throw new Error("Error object not found");
        }
    };
    const addFormListeners = (formInputs, expressions, errorObject) => {
        formInputs.forEach((input) => {
            const expression = expressions[input.name];
            input.addEventListener("input", (e) => validateField(expression, input, errorObject));
            input.addEventListener("blur", (e) => validateField(expression, input, errorObject));
        });
    };
    const sendMessagesErrors = {
        messageDemand: true,
        messageText: true,
    };
    const submitSendMessagesButton = document.querySelector("#submitSendMessagesButton");
    if (submitSendMessagesButton !== null) {
        submitSendMessagesButton.disabled = true;
    }
    const sendMessagesFormInputs = document.querySelectorAll("#sendMessagesForm .form-control");
    const sendMessagesExpressions = {
        messageDemand: messagesRegExp.expMessageDemand,
        messageText: messagesRegExp.expMessageText,
    };
    addFormListeners(sendMessagesFormInputs, sendMessagesExpressions, sendMessagesErrors);
    const resetSendMessagesButton = document.querySelector("#resetSendMessagesButton");
    if (resetSendMessagesButton !== null) {
        resetSendMessagesButton.addEventListener("click", (_) => {
            submitSendMessagesButton.disabled = true;
            $(sendMessagesFormInputs).removeClass("is-valid is-invalid");
            Object.keys(sendMessagesErrors).forEach((key) => (sendMessagesErrors[key] = true));
            $(sendMessagesFormInputs).closest("form").trigger("reset");
        });
    }
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
