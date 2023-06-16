"use strict";
$(document).ready(function () {
    function sendRequests(userId, requestStudentFullName, requestStudentEmail, requestBooks, requestDevice, requestText) {
        $.ajax({
            method: "POST",
            url: "./php/server/sendRequests.php",
            data: JSON.stringify({
                userId: userId,
                requestStudentFullName: requestStudentFullName,
                requestStudentEmail: requestStudentEmail,
                requestBooks: requestBooks,
                requestDevice: requestDevice,
                requestText: requestText,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#resetRequestsButton").click();
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "sendRequests.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "sendRequests.php");
            },
        });
    }
    $(document).on("click", "#submitRequestsButton", function (e) {
        e.preventDefault();
        const userId = $("#hiddenUserId").val();
        const requestStudentFullName = $("#requestStudentFullName").val();
        const requestStudentEmail = $("#requestStudentEmail").val();
        const requestBooks = $("#requestBooks").val();
        const requestDevice = $("#requestDevice").val();
        const requestText = $("#requestText").val();
        if (requestBooks === "" && requestDevice === "") {
        }
        else {
            sendRequests(userId, requestStudentFullName, requestStudentEmail, requestBooks, requestDevice, requestText);
        }
    });
    const validateField = (expression, input, errorObject) => {
        const isValid = input.value.trim().length !== 0 && expression.test(input.value);
        input.classList.toggle("is-valid", isValid);
        input.classList.toggle("is-invalid", !isValid);
        errorObject[input.name] = !isValid;
        submitControler(errorObject);
    };
    const submitControler = (errorObject) => {
        switch (errorObject) {
            case sendRequestsErrors:
                submitRequestsButton.disabled =
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
            input.addEventListener("input", (e) => {
                validateField(expression, input, errorObject);
            });
            input.addEventListener("blur", (e) => {
                validateField(expression, input, errorObject);
            });
        });
    };
    const requestsRegExp = {
        expRequestStudentFullName: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜýÝ\s]{5,255}$/,
        expRequestStudentEmail: /^[a-zA-Z0-9.]{5,255}@educa.madrid.org$/,
        expRequestBooks: /^[A-Z]+-\d+(,\s[A-Z]+-\d+)?$/,
        expRequestDevice: /^[A-Z]+-\d+$/,
        expRequestsText: /.+/,
    };
    const sendRequestsErrors = {
        requestStudentFullName: true,
        requestStudentEmail: true,
        requestText: true,
    };
    const submitRequestsButton = document.querySelector("#submitRequestsButton");
    if (submitRequestsButton !== null) {
        submitRequestsButton.disabled = true;
    }
    const sendRequestsFormInputs = document.querySelectorAll("#requestForm .form-control");
    const sendRequestsExpressions = {
        requestStudentFullName: requestsRegExp.expRequestStudentFullName,
        requestStudentEmail: requestsRegExp.expRequestStudentEmail,
        requestBooks: requestsRegExp.expRequestBooks,
        requestDevice: requestsRegExp.expRequestDevice,
        requestText: requestsRegExp.expRequestsText,
    };
    addFormListeners(sendRequestsFormInputs, sendRequestsExpressions, sendRequestsErrors);
    const resetRequestsButton = document.querySelector("#resetRequestsButton");
    if (resetRequestsButton !== null) {
        resetRequestsButton.addEventListener("click", (_) => {
            submitRequestsButton.disabled = true;
            $(sendRequestsFormInputs).removeClass("is-valid is-invalid");
            $(sendRequestsFormInputs).closest("form").trigger("reset");
            if (sendRequestsErrors.hasOwnProperty("requestBooks")) {
                delete sendRequestsErrors.requestBooks;
            }
            if (sendRequestsErrors.hasOwnProperty("requestDevice")) {
                delete sendRequestsErrors.requestDevice;
            }
        });
    }
    function convertToUpperCase(input) {
        input.addEventListener("keyup", () => {
            const currentValue = input.value;
            const upperCaseValue = currentValue.toUpperCase();
            input.value = upperCaseValue;
        });
    }
    const requestBooksInput = document.querySelector("#requestBooks");
    const requestDeviceInput = document.querySelector("#requestDevice");
    convertToUpperCase(requestBooksInput);
    convertToUpperCase(requestDeviceInput);
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
