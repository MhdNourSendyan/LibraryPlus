"use strict";
$(document).ready(function () {
    function loadBooks(bookPage, searchTerm) {
        $.ajax({
            url: "./php/server/loadBooks.php",
            method: "POST",
            data: JSON.stringify({
                bookPage: bookPage,
                searchTerm: searchTerm,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#booksPagination").html(response.pagination);
                    $("#booksTable tbody").html(response.tbody);
                    $("#totalBooks").html(response.totalBooks);
                }
                else {
                    let alert = `
          <tr>
              <td colspan='5'>
                  <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
                    ${response.text}
                  </div>
              </td>
          </tr>
          `;
                    $("#booksTable tbody").html(alert);
                    reportError(response.exceptionMessage, "loadBooks.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "loadBooks.php");
            },
        })
            .then(function () {
            validateEditBooksForm();
        });
    }
    loadBooks(1, "");
    $(document).on("click", ".bookPageItem", function () {
        const bookPage = parseInt($(this).attr("id"));
        const searchTerm = $("#searchBookInput").val();
        loadBooks(bookPage, searchTerm);
    });
    $(document).on("input", "#searchBookInput", function () {
        const searchTerm = $(this).val();
        const bookPage = 1;
        loadBooks(bookPage, searchTerm);
    });
    function addNewBook(newBookIdentifier, newBookName, newBookAuthor, newBookEditorial, newBookQuantity) {
        $.ajax({
            url: "./php/server/addNewBook.php",
            method: "POST",
            data: JSON.stringify({
                newBookIdentifier: newBookIdentifier,
                newBookName: newBookName,
                newBookAuthor: newBookAuthor,
                newBookEditorial: newBookEditorial,
                newBookQuantity: newBookQuantity,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#resetBookButton").click();
                    $("#resetBooksCSVFileButton").click();
                    $("#addBookCollapseButton").click();
                    loadBooks(1, "");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "addNewBook.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "mainAjax.php");
            },
        });
    }
    $(document).on("click", "#addBookButton", function (e) {
        e.preventDefault();
        const newBookIdentifier = $(this)
            .closest("#newBookForm")
            .find("#newBookIdentifier")
            .val();
        const newBookName = $(this)
            .closest("#newBookForm")
            .find("#newBookName")
            .val();
        const newBookAuthor = $(this)
            .closest("#newBookForm")
            .find("#newBookAuthor")
            .val();
        const newBookEditorial = $(this)
            .closest("#newBookForm")
            .find("#newBookEditorial")
            .val();
        const newBookQuantity = $(this)
            .closest("#newBookForm")
            .find("#newBookQuantity")
            .val();
        addNewBook(newBookIdentifier, newBookName, newBookAuthor, newBookEditorial, newBookQuantity);
    });
    function addNewBooksFromCsvFile(file) {
        const formData = new FormData();
        formData.append("file", file);
        $.ajax({
            url: "./php/server/addNewBooksFromCsvFile.php",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#resetBooksCSVFileButton").click();
                    $("#resetBookButton").click();
                    $("#addBookCollapseButton").click();
                    loadBooks(1, "");
                    throwModal(response.alertType, response.confirmMessage, response.text, response.buttonText);
                }
                else {
                    throwModal(response.alertType, response.confirmMessage, response.text, response.buttonText);
                    reportError(response.exceptionMessage, "addNewBooksFromCsvFile.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "addNewBooksFromCsvFile.php");
            },
        });
    }
    $(document).on("click", "#addBooksCSVFileButton", function (e) {
        var _a;
        e.preventDefault();
        const fileInput = document.getElementById("newBooksCSVFile");
        const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            addNewBooksFromCsvFile(file);
        }
    });
    function editBook(editBookIdentifier, editBookName, editBookAuthor, editBookEditorial, editBookQuantity, hiddenBookId) {
        $.ajax({
            url: "./php/server/editBook.php",
            method: "POST",
            data: JSON.stringify({
                editBookIdentifier: editBookIdentifier,
                editBookName: editBookName,
                editBookAuthor: editBookAuthor,
                editBookEditorial: editBookEditorial,
                editBookQuantity: editBookQuantity,
                hiddenBookId: hiddenBookId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#editBookModal" + hiddenBookId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadBooks(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "editBook.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "editBook.php");
            },
        });
    }
    $(document).on("click", ".editBookButton", function (e) {
        e.preventDefault();
        const editBookIdentifier = $(this)
            .closest("tr")
            .find(".editBookIdentifier")
            .val();
        const editBookName = $(this).closest("tr").find(".editBookName").val();
        const editBookAuthor = $(this).closest("tr").find(".editBookAuthor").val();
        const editBookEditorial = $(this)
            .closest("tr")
            .find(".editBookEditorial")
            .val();
        const editBookQuantity = $(this)
            .closest("tr")
            .find(".editBookQuantity")
            .val();
        const hiddenBookId = $(this).closest("tr").find(".hiddenBookId").val();
        editBook(editBookIdentifier, editBookName, editBookAuthor, editBookEditorial, editBookQuantity, hiddenBookId);
    });
    function deleteBook(hiddenBookId) {
        $.ajax({
            url: "./php/server/deleteBook.php",
            method: "POST",
            data: JSON.stringify({
                hiddenBookId: hiddenBookId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#editBookModal" + hiddenBookId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadBooks(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "deleteBook.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "deleteBook.php");
            },
        });
    }
    $(document).on("click", ".deleteBookButton", function (e) {
        e.preventDefault();
        const hiddenBookId = $(this).closest("tr").find(".hiddenBookId").val();
        deleteBook(hiddenBookId);
    });
    function loadDevices(devicePage, searchTerm) {
        $.ajax({
            url: "./php/server/loadDevices.php",
            method: "POST",
            data: JSON.stringify({
                devicePage: devicePage,
                searchTerm: searchTerm,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#devicesPagination").html(response.pagination);
                    $("#devicesTable tbody").html(response.tbody);
                    $("#totalDevices").html(response.totalDevices);
                }
                else {
                    const alert = `
          <tr>
                <td colspan='5'>
                    <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
                      ${response.text}
                    </div>
                </td>
            </tr>
          >`;
                    $("#devicesTable tbody").html(alert);
                    reportError(response.exceptionMessage, "loadDevices.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "loadDevices.php");
            },
        })
            .then(function () {
            validateEditDevicesForm();
        });
    }
    loadDevices(1, "");
    $(document).on("click", ".devicePageItem", function () {
        const devicePage = parseInt($(this).attr("id"));
        const searchTerm = $("#searchDeviceInput").val();
        loadDevices(devicePage, searchTerm);
    });
    $(document).on("input", "#searchDeviceInput", function () {
        const searchTerm = $(this).val();
        const devicePage = 1;
        loadDevices(devicePage, searchTerm);
    });
    function addNewDevice(newDeviceIdentifier, newDeviceName, newDeviceDescription, newDeviceQuantity) {
        $.ajax({
            url: "./php/server/addNewDevice.php",
            method: "POST",
            data: JSON.stringify({
                newDeviceIdentifier: newDeviceIdentifier,
                newDeviceName: newDeviceName,
                newDeviceDescription: newDeviceDescription,
                newDeviceQuantity: newDeviceQuantity,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#resetDeviceButton").click();
                    $("#resetDevicesCSVFileButton").click();
                    $("#addDeviceCollapseButton").click();
                    loadDevices(1, "");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "addNewDevice.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "addNewDevice.php");
            },
        });
    }
    $(document).on("click", "#addDeviceButton", function (e) {
        e.preventDefault();
        const newDeviceIdentifier = $(this)
            .closest("#newDeviceForm")
            .find("#newDeviceIdentifier")
            .val();
        const newDeviceName = $(this)
            .closest("#newDeviceForm")
            .find("#newDeviceName")
            .val();
        const newDeviceDescription = $(this)
            .closest("#newDeviceForm")
            .find("#newDeviceDescription")
            .val();
        const newDeviceQuantity = $(this)
            .closest("#newDeviceForm")
            .find("#newDeviceQuantity")
            .val();
        addNewDevice(newDeviceIdentifier, newDeviceName, newDeviceDescription, newDeviceQuantity);
    });
    function addNewDevicesFromCsvFile(file) {
        const formData = new FormData();
        formData.append("file", file);
        $.ajax({
            url: "./php/server/addNewDevicesFromCsvFile.php",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#resetDevicesCSVFileButton").click();
                    $("#resetDeviceButton").click();
                    $("#addDeviceCollapseButton").click();
                    loadDevices(1, "");
                    throwModal(response.alertType, response.confirmMessage, response.text, response.buttonText);
                }
                else {
                    throwModal(response.alertType, response.confirmMessage, response.text, response.buttonText);
                    reportError(response.exceptionMessage, "addNewDevicesFromCsvFile.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "addNewDevicesFromCsvFile.php");
            },
        });
    }
    $(document).on("click", "#addDevicesCSVFileButton", function (e) {
        var _a;
        e.preventDefault();
        const fileInput = document.getElementById("newDevicesCSVFile");
        const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            addNewDevicesFromCsvFile(file);
        }
    });
    function editDevice(editDeviceIdentifier, editDeviceName, editDeviceDescription, editDeviceQuantity, hiddenDeviceId) {
        $.ajax({
            url: "./php/server/editDevice.php",
            method: "POST",
            data: JSON.stringify({
                editDeviceIdentifier: editDeviceIdentifier,
                editDeviceName: editDeviceName,
                editDeviceDescription: editDeviceDescription,
                editDeviceQuantity: editDeviceQuantity,
                hiddenDeviceId: hiddenDeviceId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#editDeviceModal" + hiddenDeviceId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadDevices(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "editDevice.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "editDevice.php");
            },
        });
    }
    $(document).on("click", ".editDeviceButton", function (e) {
        e.preventDefault();
        const editDeviceIdentifier = $(this)
            .closest("tr")
            .find(".editDeviceIdentifier")
            .val();
        const editDeviceName = $(this).closest("tr").find(".editDeviceName").val();
        const editDeviceDescription = $(this)
            .closest("tr")
            .find(".editDeviceDescription")
            .val();
        const editDeviceQuantity = $(this)
            .closest("tr")
            .find(".editDeviceQuantity")
            .val();
        const hiddenDeviceId = $(this).closest("tr").find(".hiddenDeviceId").val();
        editDevice(editDeviceIdentifier, editDeviceName, editDeviceDescription, editDeviceQuantity, hiddenDeviceId);
    });
    function deleteDevice(hiddenDeviceId) {
        $.ajax({
            url: "./php/server/deleteDevice.php",
            method: "POST",
            data: JSON.stringify({
                hiddenDeviceId: hiddenDeviceId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#editDeviceModal" + hiddenDeviceId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadDevices(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "deleteDevice.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "deleteDevice.php");
            },
        });
    }
    $(document).on("click", ".deleteDeviceButton", function (e) {
        e.preventDefault();
        const hiddenDeviceId = $(this).closest("tr").find(".hiddenDeviceId").val();
        deleteDevice(hiddenDeviceId);
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
            case booksErrors:
                addBookButton.disabled =
                    Object.values(errorObject).filter((value) => value == true).length >
                        0;
                break;
            case editBooksErrors:
                const editBooksButtons = document.querySelectorAll(".editBookButton");
                editBooksButtons.forEach((button) => {
                    button.disabled =
                        Object.values(errorObject).filter((value) => value == true).length >
                            0;
                });
                break;
            case deviceErrors:
                addDeviceButton.disabled =
                    Object.values(errorObject).filter((value) => value == true).length >
                        0;
                break;
            case editDevicesErrors:
                const editDevicesButtons = document.querySelectorAll(".editDeviceButton");
                editDevicesButtons.forEach((button) => {
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
    const booksRegExp = {
        bookIdentifier: /^[A-Z]+-\d+$/,
        bookName: /.+/,
        bookAuthor: /.+/,
        bookEditorial: /.+/,
        bookQuantity: /^[0-9]+$|^0$/,
    };
    const booksErrors = {
        newBookIdentifier: true,
        newBookName: true,
        newBookAuthor: true,
        newBookEditorial: true,
        newBookQuantity: true,
    };
    const addBookButton = document.querySelector("#addBookButton");
    if (addBookButton !== null) {
        addBookButton.disabled = true;
    }
    const newBookFormInputs = document.querySelectorAll("#newBookForm .form-control");
    const booksExpressions = {
        newBookIdentifier: booksRegExp.bookIdentifier,
        newBookName: booksRegExp.bookName,
        newBookAuthor: booksRegExp.bookAuthor,
        newBookEditorial: booksRegExp.bookEditorial,
        newBookQuantity: booksRegExp.bookQuantity,
    };
    addFormListeners(newBookFormInputs, booksExpressions, booksErrors);
    const resetBookButton = document.querySelector("#resetBookButton");
    if (resetBookButton !== null) {
        resetBookButton.addEventListener("click", (_) => {
            addBookButton.disabled = true;
            $(newBookFormInputs).removeClass("is-valid is-invalid");
            Object.keys(booksErrors).forEach((key) => (booksErrors[key] = true));
            $(newBookFormInputs).closest("form").trigger("reset");
        });
    }
    const editBooksErrors = {};
    function validateEditBooksForm() {
        const editBookIdentifierInputs = document.querySelectorAll(".editBookIdentifier");
        editBookIdentifierInputs.forEach((input) => {
            convertToUpperCase(input);
        });
        const editBooksButtons = document.querySelectorAll(".editBookButton");
        const editBooksFormInputs = document.querySelectorAll(".editBookForm .form-control");
        const editBooksExpressions = {
            editBookIdentifier: booksRegExp.bookIdentifier,
            editBookName: booksRegExp.bookName,
            editBookAuthor: booksRegExp.bookAuthor,
            editBookEditorial: booksRegExp.bookEditorial,
            editBookQuantity: booksRegExp.bookQuantity,
        };
        addFormListeners(editBooksFormInputs, editBooksExpressions, editBooksErrors);
        const closeModalButtons = document.querySelectorAll(".closeEBModalButton");
        if (closeModalButtons !== null) {
            closeModalButtons.forEach((button) => {
                button.addEventListener("click", (_) => {
                    $(editBooksFormInputs).removeClass("is-valid is-invalid");
                    Object.keys(editBooksErrors).forEach((key) => (editBooksErrors[key] = false));
                    if (editBooksButtons) {
                        editBooksButtons.forEach((button) => {
                            button.disabled = false;
                        });
                    }
                    const editBooksForm = document.querySelectorAll(".editBookForm");
                    editBooksForm.forEach((form) => {
                        form.reset();
                    });
                });
            });
        }
    }
    const devicesRegExp = {
        deviceIdentifier: /^[A-Z]+-\d+$/,
        deviceName: /.+/,
        deviceDescription: /.+/,
        deviceQuantity: /^[0-9]+$|^0$/,
    };
    const deviceErrors = {
        newDeviceIdentifier: true,
        newDeviceName: true,
        newDeviceDescription: true,
        newDeviceQuantity: true,
    };
    const addDeviceButton = document.querySelector("#addDeviceButton");
    if (addDeviceButton !== null) {
        addDeviceButton.disabled = true;
    }
    const newDeviceFormInputs = document.querySelectorAll("#newDeviceForm .form-control");
    const deviceExpressions = {
        newDeviceIdentifier: devicesRegExp.deviceIdentifier,
        newDeviceName: devicesRegExp.deviceName,
        newDeviceDescription: devicesRegExp.deviceDescription,
        newDeviceQuantity: devicesRegExp.deviceQuantity,
    };
    addFormListeners(newDeviceFormInputs, deviceExpressions, deviceErrors);
    const resetDeviceButton = document.querySelector("#resetDeviceButton");
    if (resetDeviceButton !== null) {
        resetDeviceButton.addEventListener("click", (_) => {
            addDeviceButton.disabled = true;
            $(newDeviceFormInputs).removeClass("is-valid is-invalid");
            Object.keys(deviceErrors).forEach((key) => (deviceErrors[key] = true));
            $(newDeviceFormInputs).closest("form").trigger("reset");
        });
    }
    const editDevicesErrors = {};
    function validateEditDevicesForm() {
        const editDeviceIdentifierInputs = document.querySelectorAll(".editDeviceIdentifier");
        editDeviceIdentifierInputs.forEach((input) => {
            convertToUpperCase(input);
        });
        const editDevicesButtons = document.querySelectorAll(".editDeviceButton");
        const editDevicesFormInputs = document.querySelectorAll(".editDeviceForm .form-control");
        const editDevicesExpressions = {
            editDeviceIdentifier: devicesRegExp.deviceIdentifier,
            editDeviceName: devicesRegExp.deviceName,
            editDeviceDescription: devicesRegExp.deviceDescription,
            editDeviceQuantity: devicesRegExp.deviceQuantity,
        };
        addFormListeners(editDevicesFormInputs, editDevicesExpressions, editDevicesErrors);
        const closeModalButtons = document.querySelectorAll(".closeEDModalButton");
        if (closeModalButtons !== null) {
            closeModalButtons.forEach((button) => {
                button.addEventListener("click", (_) => {
                    $(editDevicesFormInputs).removeClass("is-valid is-invalid");
                    Object.keys(editDevicesErrors).forEach((key) => (editDevicesErrors[key] = false));
                    if (editDevicesButtons) {
                        editDevicesButtons.forEach((button) => {
                            button.disabled = false;
                        });
                    }
                    const editDeviceForm = document.querySelectorAll(".editDeviceForm");
                    editDeviceForm.forEach((form) => {
                        form.reset();
                    });
                });
            });
        }
    }
    function convertToUpperCase(input) {
        if (input) {
            input.addEventListener("keyup", () => {
                const currentValue = input.value;
                const upperCaseValue = currentValue.toUpperCase();
                input.value = upperCaseValue;
            });
        }
    }
    const newBookIdentifierInput = document.querySelector("#newBookIdentifier");
    convertToUpperCase(newBookIdentifierInput);
    const newDeviceIdentifierInput = document.querySelector("#newDeviceIdentifier");
    convertToUpperCase(newDeviceIdentifierInput);
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
