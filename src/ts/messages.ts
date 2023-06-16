// La función se ejecuta cuando el documento está listo.
$(document).ready(function () {
  //___________________________________________________AJAX___________________________________________________//
  // Definimos una función para hacer la petición AJAX para cargar los mensajes de la base de datos con la paginación.
  function loadMessages(messagePage: number, searchTerm: string) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/loadMessages.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        messagePage: messagePage,
        searchTerm: searchTerm,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#messagesPagination").html(response.pagination);
          $("#messagesContainer").html(response.cards);
        } else {
          const alert = `
          <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
            ${response.text}
          </div>
          `;
          $("#messagesContainer").html(alert);
          reportError(response.exceptionMessage, "loadMessages.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "loadMessages.php"
        );
      },
    });
  }
  // Primera carga de mensajes al inicio de la página.
  loadMessages(1, "");
  // Manejador de evento para el elemento de Paginación de mensajes.
  $(document).on("click", ".messagePageItem", function () {
    // Obtención del número de página del atributo ID del elemento HTML seleccionado.
    const messagePage = parseInt($(this).attr("id") as string);
    // Obtención del término de búsqueda actual en el campo de búsqueda correspondiente.
    const searchTerm = $("#searchMessageInput").val() as string;
    // Llamar a la función de "loadMessages" con los valores obtenidos.
    loadMessages(messagePage, searchTerm);
  });
  // Manejador de evento para cuando se escribe sobre el campo de búsqueda de mensajes.
  $(document).on("input", "#searchMessageInput", function () {
    // Obtener el término de búsqueda actual.
    const searchTerm = $(this).val() as string;
    // Reiniciar el número de página a mostrar.
    const messagePage = 1;
    // Llamar a la función de "loadMessages" con los valore obtenidos.
    loadMessages(messagePage, searchTerm);
  });
  // Definimos una función para hacer la petición AJAX para eliminar mensajes.
  function deleteMessage(hiddenMessageId: number) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/deleteMessage.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        hiddenMessageId: hiddenMessageId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#deleteMessageModal" + hiddenMessageId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadMessages(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "deleteMessage.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "deleteMessage.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de eliminar mensajes.
  $(document).on("click", ".deleteMessageButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const hiddenMessageId = $(this)
      .closest(".messageForm")
      .find(".hiddenMessageId")
      .val();
    // Llamar a la función "deleteMessage" con los valores obtenidos.
    deleteMessage(hiddenMessageId as number);
  });
  //___________________________________________________FUNCIONES___________________________________________________//
  // Definimos una función para hacer la petición AJAX para reportar un error.
  function reportError(errorType: string, fileName: string) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/error_handler.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
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
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          console.log("Error reportado");
        } else {
          console.log("Error no reportado\n" + `${response.message}`);
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(
          "Error no reportado\n" +
            "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown
        );
      },
    });
  }
});
