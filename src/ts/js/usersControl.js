"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
$(document).ready(function () {
    $(".usersOption1").on("click", function () {
        $("#showUsersDiv").addClass("d-none");
        $("#registerUsersDiv").removeClass("d-none");
        $(this).addClass("list-group-item-dark");
        $(".usersOption2").removeClass("list-group-item-dark");
    });
    $(".usersOption2").on("click", function () {
        $("#registerUsersDiv").addClass("d-none");
        $("#showUsersDiv").removeClass("d-none");
        $(this).addClass("list-group-item-dark");
        $(".usersOption1").removeClass("list-group-item-dark");
    });
    function registerUser(username, userFullName, userEmail, userPassword) {
        $.ajax({
            method: "POST",
            url: "./php/server/registerUser.php",
            data: JSON.stringify({
                username: username,
                userFullName: userFullName,
                userEmail: userEmail,
                userPassword: userPassword,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#resetRegisterButton").click();
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadUsers(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "registerUser.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "registerUser.php");
            },
        });
    }
    $(document).on("click", "#submitRegisterButton", function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const username = $("#username").val();
            const userFullName = $("#userFullName").val();
            const userEmail = $("#userEmail").val();
            const userPassword = $("#password2").val();
            registerUser(username, userFullName, userEmail, userPassword);
        });
    });
    function loadUsers(userPage, searchTerm) {
        $.ajax({
            url: "./php/server/loadUsers.php",
            method: "POST",
            data: JSON.stringify({
                userPage: userPage,
                searchTerm: searchTerm,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#UsersPagination").html(response.pagination);
                    $("#userTable tbody").html(response.tbody);
                    $("#totalUsers").html(response.totalUsers);
                }
                else {
                    let alert = `
          <tr>
              <td colspan='7'>
                  <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
                    ${response.text}
                  </div>
              </td>
          </tr>
          `;
                    $("#userTable tbody").html(alert);
                    reportError(response.exceptionMessage, "loadUsers.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "loadUsers.php");
            },
        })
            .then(function () {
            validateEditUserForm();
        });
    }
    loadUsers(1, "");
    $(document).on("click", ".userPageItem", function () {
        let userPage = parseInt($(this).attr("id"));
        let searchTerm = $("#searchUserInput").val();
        loadUsers(userPage, searchTerm);
    });
    $(document).on("input", "#searchUserInput", function () {
        let searchTerm = $(this).val();
        let userPage = 1;
        loadUsers(userPage, searchTerm);
    });
    function editUser(hiddenUserId, editUsername, editUserFullName, editUserEmail, editUserPassword) {
        $.ajax({
            url: "./php/server/editUser.php",
            method: "POST",
            data: JSON.stringify({
                hiddenUserId: hiddenUserId,
                editUsername: editUsername,
                editUserFullName: editUserFullName,
                editUserEmail: editUserEmail,
                editUserPassword: editUserPassword,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#editUserModal" + hiddenUserId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadUsers(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "editUser.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "editUser.php");
            },
        });
    }
    $(document).on("click", ".editUserButton", function (e) {
        e.preventDefault();
        const [hiddenUserId, editUsername, editUserFullName, editUserEmail, editUserPassword,] = [
            $(this).closest("tr").find(".hiddenUserId").val(),
            $(this).closest("tr").find(".editUsername").val(),
            $(this).closest("tr").find(".editUserFullName").val(),
            $(this).closest("tr").find(".editUserEmail").val(),
            $(this).closest("tr").find(".editUserPassword").val(),
        ];
        editUser(hiddenUserId, editUsername, editUserFullName, editUserEmail, editUserPassword);
    });
    function deactivateAccount(hiddenUserId) {
        $.ajax({
            url: "./php/server/deactivateAccount.php",
            method: "POST",
            data: JSON.stringify({
                hiddenUserId: hiddenUserId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#editUserModal" + hiddenUserId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadUsers(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "deactivateAccount.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "deactivateAccount.php");
            },
        });
    }
    $(document).on("click", ".deactivateAccountButton", function (e) {
        e.preventDefault();
        const [hiddenUserId] = [$(this).closest("tr").find(".hiddenUserId").val()];
        deactivateAccount(hiddenUserId);
    });
    function activateAccount(hiddenUserId) {
        $.ajax({
            url: "./php/server/activateAccount.php",
            method: "POST",
            data: JSON.stringify({
                hiddenUserId: hiddenUserId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#editUserModal" + hiddenUserId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadUsers(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "activateAccount.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "activateAccount.php");
            },
        });
    }
    $(document).on("click", ".activateAccountButton", function (e) {
        e.preventDefault();
        const [hiddenUserId] = [$(this).closest("tr").find(".hiddenUserId").val()];
        activateAccount(hiddenUserId);
    });
    function deleteUser(hiddenUserId) {
        $.ajax({
            url: "./php/server/deleteUser.php",
            method: "POST",
            data: JSON.stringify({
                hiddenUserId: hiddenUserId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#editUserModal" + hiddenUserId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadUsers(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "deleteUser.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "deleteUser.php");
            },
        });
    }
    $(document).on("click", ".deleteUserButton", function (e) {
        e.preventDefault();
        const [hiddenUserId] = [$(this).closest("tr").find(".hiddenUserId").val()];
        deleteUser(hiddenUserId);
    });
    const validateField = (expression, input, errorObject) => {
        const isValid = input.value.trim().length !== 0 && expression.test(input.value);
        input.classList.toggle("is-valid", isValid);
        input.classList.toggle("is-invalid", !isValid);
        errorObject[input.name] = !isValid;
        if (input.name == "password1" || input.name == "password2") {
            confirmPassword();
        }
        submitControler(errorObject);
    };
    const submitControler = (errorObject) => {
        switch (errorObject) {
            case registerErrors:
                submitRegisterButton.disabled =
                    Object.values(errorObject).filter((value) => value == true).length >
                        0;
                break;
            case editUsersErrors:
                const editUserButtons = document.querySelectorAll(".editUserButton");
                editUserButtons.forEach((button) => {
                    button.disabled =
                        Object.values(errorObject).filter((value) => value == true).length >
                            0;
                });
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
    const confirmPassword = () => {
        checkPassword();
        const password1 = document.querySelector("#password1");
        const confirmPassword = document.querySelector("#password2");
        const isMatch = confirmPassword.value == password1.value;
        const isValidPassword = usersRegExp.expUserPassword.test(password1.value) &&
            usersRegExp.expUserPassword.test(confirmPassword.value);
        confirmPassword.classList.toggle("is-valid", isMatch && isValidPassword);
        confirmPassword.classList.toggle("is-invalid", !isMatch || !isValidPassword);
        registerErrors.password1 = !isMatch || !isValidPassword;
        submitControler(registerErrors);
    };
    function checkPassword() {
        let password = document.querySelector("#password1")
            .value;
        let lowerCaseLetters = /[a-z]/g;
        let upperCaseLetters = /[A-Z]/g;
        let numbers = /[0-9]/g;
        let minLength = 8;
        if (password.match(lowerCaseLetters)) {
            $("#lowerCaseLetters").addClass("valid").removeClass("invalid");
        }
        else {
            $("#lowerCaseLetters").addClass("invalid").removeClass("valid");
        }
        if (password.match(upperCaseLetters)) {
            $("#upperCaseLetters").addClass("valid").removeClass("invalid");
        }
        else {
            $("#upperCaseLetters").addClass("invalid").removeClass("valid");
        }
        if (password.match(numbers)) {
            $("#numbers").addClass("valid").removeClass("invalid");
        }
        else {
            $("#numbers").addClass("invalid").removeClass("valid");
        }
        if (password.length >= minLength) {
            $("#minLength").addClass("valid").removeClass("invalid");
        }
        else {
            $("#minLength").addClass("invalid").removeClass("valid");
        }
    }
    const usersRegExp = {
        expUsername: /^[A-Za-z0-9._]{5,255}$/,
        expUserFullName: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜýÝ\s]{5,255}$/,
        expUserEmail: /^[a-zA-Z0-9.]{5,255}@educa.madrid.org$/,
        expUserPassword: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,25}$/,
    };
    const registerErrors = {
        username: true,
        userFullName: true,
        userEmail: true,
        password1: true,
    };
    const submitRegisterButton = document.querySelector("#submitRegisterButton");
    if (submitRegisterButton !== null) {
        submitRegisterButton.disabled = true;
    }
    const registerUsersFormInputs = document.querySelectorAll("#registerUsersForm .form-control");
    const registerExpressions = {
        username: usersRegExp.expUsername,
        userFullName: usersRegExp.expUserFullName,
        userEmail: usersRegExp.expUserEmail,
        password1: usersRegExp.expUserPassword,
        password2: usersRegExp.expUserPassword,
    };
    addFormListeners(registerUsersFormInputs, registerExpressions, registerErrors);
    const resetRegisterButton = document.querySelector("#resetRegisterButton");
    if (resetRegisterButton !== null) {
        resetRegisterButton.addEventListener("click", (_) => {
            submitRegisterButton.disabled = true;
            $(registerUsersFormInputs).removeClass("is-valid is-invalid");
            Object.keys(registerErrors).forEach((key) => (registerErrors[key] = true));
            $(registerUsersFormInputs).closest("form").trigger("reset");
            $("#checkList li").removeClass("valid invalid");
        });
    }
    const editUsersErrors = {
        editUsername: false,
        editUserFullName: false,
        editUserEmail: false,
        editUserPassword: false,
    };
    function validateEditUserForm() {
        const editUserButtons = document.querySelectorAll(".editUserButton");
        const editUserFormInputs = document.querySelectorAll(".editUserForm .form-control");
        const editUserExpressions = {
            editUsername: usersRegExp.expUsername,
            editUserFullName: usersRegExp.expUserFullName,
            editUserEmail: usersRegExp.expUserEmail,
            editUserPassword: usersRegExp.expUserPassword,
        };
        addFormListeners(editUserFormInputs, editUserExpressions, editUsersErrors);
        const closeModalButtons = document.querySelectorAll(".closeEUModalButton");
        if (closeModalButtons !== null) {
            closeModalButtons.forEach((button) => {
                button.addEventListener("click", (_) => {
                    $(editUserFormInputs).removeClass("is-valid is-invalid");
                    Object.keys(editUsersErrors).forEach((key) => (editUsersErrors[key] = false));
                    if (editUserButtons) {
                        editUserButtons.forEach((button) => {
                            button.disabled = false;
                        });
                    }
                    const editUserForm = document.querySelectorAll(".editUserForm");
                    editUserForm.forEach((form) => {
                        form.reset();
                    });
                });
            });
        }
    }
    const passwordInputs = document.querySelectorAll("input[type=password]");
    const generatePasswordIcon = document.querySelector("#generatePassword");
    generatePasswordIcon.addEventListener("click", function () {
        const password = generatePassword();
        passwordInputs.forEach((input) => {
            input.value = password;
        });
    });
    function generatePassword() {
        const expUserPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,25}$/;
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        const passwordLength = Math.floor(Math.random() * (25 - 8 + 1)) + 8;
        let password = "";
        let isValidPassword = false;
        while (!isValidPassword) {
            password = "";
            for (let i = 0; i < passwordLength; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters[randomIndex];
            }
            isValidPassword = expUserPassword.test(password);
        }
        return password;
    }
    const copyPasswordIcon = document.querySelector("#copyPassword");
    copyPasswordIcon.addEventListener("click", function () {
        const passwordInput = passwordInputs[1];
        if (document.queryCommandSupported("copy")) {
            const tempInput = document.createElement("input");
            tempInput.value = passwordInput.value;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            copyPasswordIcon.style.transform = "scale(1.2)";
            setTimeout(function () {
                copyPasswordIcon.style.transform = "scale(1)";
            }, 500);
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
