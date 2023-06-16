// La función se ejecuta cuando el documento está listo.
$(document).ready(function () {
  //___________________________________________________AJAX___________________________________________________//
  // Definimos una función para hacer la petición AJAX para cargar las solicitudes de la base de datos con la paginación.
  function loadRequests(requestPage: number, searchTerm: string) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/loadRequests.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        requestPage: requestPage,
        searchTerm: searchTerm,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#requestsPagination").html(response.pagination);
          $("#requestsContainer").html(response.cards);
        } else {
          const alert = `
          <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
            ${response.text}
          </div>
          `;
          $("#requestsContainer").html(alert);
          reportError(response.exceptionMessage, "loadRequests.php");
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
          "loadRequests.php"
        );
      },
    });
  }
  // Primera carga de solicitudes al inicio de la página.
  loadRequests(1, "");
  // Manejador de evento para el elemento de Paginación de solicitudes.
  $(document).on("click", ".page-item", function () {
    // Obtención del número de página del atributo ID del elemento HTML seleccionado.
    const requestPage = parseInt($(this).attr("id") as string);
    // Obtención del término de búsqueda actual en el campo de búsqueda correspondiente.
    const searchTerm = $("#searchRequestInput").val() as string;
    // Llamar a la función de "loadRequests" con los valores obtenidos.
    loadRequests(requestPage, searchTerm);
  });
  // Manejador de evento para cuando se escribe sobre el campo de búsqueda de solicitudes.
  $(document).on("input", "#searchRequestInput", function () {
    // Obtener el término de búsqueda actual.
    const searchTerm = $(this).val() as string;
    // Reiniciar el número de página a mostrar.
    const requestPage = 1;
    // Llamar a la función de "loadRequests" con los valore obtenidos.
    loadRequests(requestPage, searchTerm);
  });
  // Definimos una función para hacer la petición AJAX para eliminar solicitud.
  function deleteRequests(hiddenRequestId: number) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/deleteRequests.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        hiddenRequestId: hiddenRequestId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#deleteRequestModal" + hiddenRequestId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadRequests(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "deleteRequests.php");
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
          "deleteRequests.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de eliminar solicitudes.
  $(document).on("click", ".deleteRequestButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const hiddenRequestId = $(this)
      .closest(".requestForm")
      .find(".hiddenRequestId")
      .val();
    // Llamar a la función "deleteRequests" con los valores obtenidos.
    deleteRequests(hiddenRequestId as number);
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
