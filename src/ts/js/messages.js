"use strict";
$(document).ready(function () {
    function loadMessages(messagePage, searchTerm) {
        $.ajax({
            url: "./php/server/loadMessages.php",
            method: "POST",
            data: JSON.stringify({
                messagePage: messagePage,
                searchTerm: searchTerm,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#messagesPagination").html(response.pagination);
                    $("#messagesContainer").html(response.cards);
                }
                else {
                    const alert = `
          <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
            ${response.text}
          </div>
          `;
                    $("#messagesContainer").html(alert);
                    reportError(response.exceptionMessage, "loadMessages.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "loadMessages.php");
            },
        });
    }
    loadMessages(1, "");
    $(document).on("click", ".messagePageItem", function () {
        const messagePage = parseInt($(this).attr("id"));
        const searchTerm = $("#searchMessageInput").val();
        loadMessages(messagePage, searchTerm);
    });
    $(document).on("input", "#searchMessageInput", function () {
        const searchTerm = $(this).val();
        const messagePage = 1;
        loadMessages(messagePage, searchTerm);
    });
    function deleteMessage(hiddenMessageId) {
        $.ajax({
            url: "./php/server/deleteMessage.php",
            method: "POST",
            data: JSON.stringify({
                hiddenMessageId: hiddenMessageId,
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#deleteMessageModal" + hiddenMessageId).modal("hide");
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    $(document).on("click", ".closeModalButton", function () {
                        loadMessages(1, "");
                    });
                }
                else {
                    throwModal(`${response.alertType}`, `${response.confirmMessage}`, `${response.text}`, `${response.buttonText}`);
                    reportError(response.exceptionMessage, "deleteMessage.php");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reportError("jqXHR: " +
                    jqXHR.responseText +
                    ", textStatus: " +
                    textStatus +
                    ", errorThrown: " +
                    errorThrown, "deleteMessage.php");
            },
        });
    }
    $(document).on("click", ".deleteMessageButton", function (e) {
        e.preventDefault();
        const hiddenMessageId = $(this)
            .closest(".messageForm")
            .find(".hiddenMessageId")
            .val();
        deleteMessage(hiddenMessageId);
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
