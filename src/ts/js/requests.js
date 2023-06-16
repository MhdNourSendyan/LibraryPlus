"use strict";
$(document).ready(function () {
    function loadRequests(requestPage, searchTerm) {
        $.ajax({
            url: "./php/server/loadRequests.php",
            method: "POST",
            data: JSON.stringify({
                requestPage: requestPage,
                searchTerm: searchTerm,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#requestsPagination").html(response.pagination);
                    $("#requestsContainer").html(response.cards);
                }
                else {
                    const alert = `
          <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
            ${response.text}
          </div>
          `;
                    $("#requestsContainer").html(alert);
                    reportError(response.exceptionMessage, "loadRequests.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "loadRequests.php");
            },
        });
    }
    loadRequests(1, "");
    $(document).on("click", ".page-item", function () {
        const requestPage = parseInt($(this).attr("id"));
        const searchTerm = $("#searchRequestInput").val();
        loadRequests(requestPage, searchTerm);
    });
    $(document).on("input", "#searchRequestInput", function () {
        const searchTerm = $(this).val();
        const requestPage = 1;
        loadRequests(requestPage, searchTerm);
    });
    function deleteRequests(hiddenRequestId) {
        $.ajax({
            url: "./php/server/deleteRequests.php",
            method: "POST",
            data: JSON.stringify({
                hiddenRequestId: hiddenRequestId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#deleteRequestModal" + hiddenRequestId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadRequests(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "deleteRequests.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "deleteRequests.php");
            },
        });
    }
    $(document).on("click", ".deleteRequestButton", function (e) {
        e.preventDefault();
        const hiddenRequestId = $(this)
            .closest(".requestForm")
            .find(".hiddenRequestId")
            .val();
        deleteRequests(hiddenRequestId);
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
