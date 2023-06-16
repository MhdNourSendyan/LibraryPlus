// La función se ejecuta cuando el documento está listo.
$(document).ready(function () {
  //___________________________________________________AJAX___________________________________________________//
  // Definimos una función para hacer la petición AJAX para enviar una solicitud.
  function sendRequests(
    userId: number,
    requestStudentFullName: string,
    requestStudentEmail: string,
    requestBooks: string,
    requestDevice: string,
    requestText: string
  ) {
    $.ajax({
      // URL a la que se envía la petición.
      method: "POST",
      // El método de envió.
      url: "./php/server/sendRequests.php",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        userId: userId,
        requestStudentFullName: requestStudentFullName,
        requestStudentEmail: requestStudentEmail,
        requestBooks: requestBooks,
        requestDevice: requestDevice,
        requestText: requestText,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#resetRequestsButton").click();
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "sendRequests.php");
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
          "sendRequests.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de enviar.
  $(document).on("click", "#submitRequestsButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const userId = $("#hiddenUserId").val();
    const requestStudentFullName = $("#requestStudentFullName").val();
    const requestStudentEmail = $("#requestStudentEmail").val();
    const requestBooks = $("#requestBooks").val();
    const requestDevice = $("#requestDevice").val();
    const requestText = $("#requestText").val();
    // Llamar a la función de "sendRequests" con los valores obtenidos.
    if (requestBooks === "" && requestDevice === "") {
    } else {
      sendRequests(
        userId as number,
        requestStudentFullName as string,
        requestStudentEmail as string,
        requestBooks as string,
        requestDevice as string,
        requestText as string
      );
    }
  });
  //___________________________________________________VALIDAR FORMULARIOS___________________________________________________//
  // Definimos una función para validar el campo.
  const validateField = (
    expression: RegExp,
    input: HTMLInputElement | HTMLTextAreaElement,
    errorObject: { [key: string]: boolean }
  ): void => {
    // Comprobamos que el campo no esté vacío y que cumpla con la expresión regular.
    const isValid =
      input.value.trim().length !== 0 && expression.test(input.value);
    // Agregamos la clase "is-valid" o "is-invalid" dependiendo de si es válido o no.
    input.classList.toggle("is-valid", isValid);
    input.classList.toggle("is-invalid", !isValid);
    // Agregamos la información del campo al objeto de errores correspondiente.
    errorObject[input.name] = !isValid;
    // Cambiamos el estado del botón de submit dependiendo de los errores encontrados.
    submitControler(errorObject);
  };
  // Definimos una función para controlar el botón submit.
  const submitControler = (errorObject: { [key: string]: boolean }): void => {
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
  // Definimos una función para añadir listeners de eventos a los campos de los formularios.
  const addFormListeners = (
    formInputs: NodeListOf<HTMLInputElement | HTMLTextAreaElement>,
    expressions: { [key: string]: RegExp },
    errorObject: { [key: string]: boolean }
  ): void => {
    formInputs.forEach((input: HTMLInputElement | HTMLTextAreaElement) => {
      const expression = expressions[input.name];
      // Agregamos un listener para el evento "input".
      input.addEventListener("input", (e: Event) => {
        validateField(expression, input, errorObject);
      });
      // Agregamos un listener para el evento "blur".
      input.addEventListener("blur", (e: Event) => {
        validateField(expression, input, errorObject);
      });
    });
  };
  // Definimos una interfaz para tipar los objetos de expresiones regulares.
  interface requestsRegExp {
    expRequestStudentFullName: RegExp;
    expRequestStudentEmail: RegExp;
    expRequestBooks: RegExp;
    expRequestDevice: RegExp;
    expRequestsText: RegExp;
    [key: string]: RegExp;
  }
  // Inicializamos la interfaz mainRegExp para tipar el objeto de expresiones regulares de enviar solicitudes.
  // Expresiones regulares para validar los campos de las solicitudes.
  const requestsRegExp = {
    expRequestStudentFullName: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜýÝ\s]{5,255}$/, // Expresión regular para validar el nombre completo del estudiante (solo letras, espacios y caracteres acentuados, entre 5 y 255 caracteres)
    expRequestStudentEmail: /^[a-zA-Z0-9.]{5,255}@educa.madrid.org$/, // Expresión regular para validar el correo electrónico del estudiante (formato específico para el dominio educa.madrid.org, entre 5 y 255 caracteres)
    expRequestBooks: /^[A-Z]+-\d+(,\s[A-Z]+-\d+)?$/, // Expresión regular para validar el identificador del/ de los libros solicitados
    expRequestDevice: /^[A-Z]+-\d+$/, // Expresión regular para validar el identificador del dispositivo solicitado
    expRequestsText: /.+/, // Expresión regular para validar el mensaje de la solicitud (cualquier cadena de al menos un carácter)
  };
  // Definimos los objetos de errores para cada formulario y los inicializamos a true.
  const sendRequestsErrors: { [key: string]: boolean } = {
    requestStudentFullName: true,
    requestStudentEmail: true,
    requestText: true,
  };
  // Obtenemos los botones de submit y los desactivamos hasta que no haya errores.
  const submitRequestsButton = document.querySelector(
    "#submitRequestsButton"
  ) as HTMLButtonElement;
  if (submitRequestsButton !== null) {
    submitRequestsButton.disabled = true;
  }
  // Obtenemos los inputs de los formularios correspondientes y las expresiones regulares correspondientes.
  const sendRequestsFormInputs = document.querySelectorAll(
    "#requestForm .form-control"
  ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
  const sendRequestsExpressions = {
    requestStudentFullName: requestsRegExp.expRequestStudentFullName,
    requestStudentEmail: requestsRegExp.expRequestStudentEmail,
    requestBooks: requestsRegExp.expRequestBooks,
    requestDevice: requestsRegExp.expRequestDevice,
    requestText: requestsRegExp.expRequestsText,
  };
  // Agregamos los listeners a los inputs correspondientes.
  addFormListeners(
    sendRequestsFormInputs,
    sendRequestsExpressions,
    sendRequestsErrors
  );
  // Obtenemos los botones para resetear los formularios.
  const resetRequestsButton = document.querySelector(
    "#resetRequestsButton"
  ) as HTMLButtonElement;
  if (resetRequestsButton !== null) {
    resetRequestsButton.addEventListener("click", (_: MouseEvent) => {
      // Reseteamos los inputs del formulario y los errores correspondientes.
      submitRequestsButton.disabled = true;
      $(sendRequestsFormInputs).removeClass("is-valid is-invalid");
      $(sendRequestsFormInputs).closest("form").trigger("reset");
      // Verificar si la propiedad "requestBooks" existe en sendRequestsErrors
      if (sendRequestsErrors.hasOwnProperty("requestBooks")) {
        // Eliminar la propiedad "requestBooks" del objeto "sendRequestsErrors"
        delete sendRequestsErrors.requestBooks;
      }
      // Verificar si la propiedad "requestDevice" existe en sendRequestsErrors
      if (sendRequestsErrors.hasOwnProperty("requestDevice")) {
        // Eliminar la propiedad "requestDevice" del objeto "sendRequestsErrors"
        delete sendRequestsErrors.requestDevice;
      }
    });
  }
  //___________________________________________________FUNCIONES___________________________________________________//
  // Definición de la función para convertir a mayúsculas
  function convertToUpperCase(input: HTMLInputElement): void {
    input.addEventListener("keyup", () => {
      // Obtener el valor actual del input
      const currentValue = input.value;
      // Convertir el valor a mayúsculas
      const upperCaseValue = currentValue.toUpperCase();
      // Asignar el valor convertido al input
      input.value = upperCaseValue;
    });
  }
  // Obtener el elemento de input con el id "requestBooksInput"
  const requestBooksInput = document.querySelector(
    "#requestBooks"
  ) as HTMLInputElement;
  // Obtener el elemento de input con el id "requestDeviceInput"
  const requestDeviceInput = document.querySelector(
    "#requestDevice"
  ) as HTMLInputElement;
  // Aplicar la función de convertir a mayúsculas a los inputs
  convertToUpperCase(requestBooksInput);
  convertToUpperCase(requestDeviceInput);
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
