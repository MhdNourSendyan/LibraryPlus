// La función se ejecuta cuando el documento está listo.
$(document).ready(function () {
  //___________________________________________________AJAX___________________________________________________//
  // Definimos una función para hacer la petición AJAX para enviar un mensaje.
  function sendMessages(
    userId: number,
    messageDemand: string,
    messageText: string
  ) {
    $.ajax({
      // URL a la que se envía la petición.
      method: "POST",
      // El método de envió.
      url: "./php/server/sendMessages.php",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        userId: userId,
        messageDemand: messageDemand,
        messageText: messageText,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#resetSendMessagesButton").click();
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
          reportError(response.exceptionMessage, "sendMessages.php");
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
          "sendMessages.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de enviar.
  $(document).on("click", "#submitSendMessagesButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
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
    // Llamar a la función de "sendMessages" con los valores obtenidos.
    sendMessages(
      userId as number,
      messageDemand as string,
      messageText as string
    );
  });
  //___________________________________________________VALIDAR FORMULARIOS___________________________________________________//
  // Definimos una interfaz para tipar los objetos de expresiones regulares.
  interface messagesRegExp {
    expMessageDemand: RegExp;
    expMessageText: RegExp;
    [key: string]: RegExp;
  }
  // Inicializamos la interfaz mainRegExp para tipar el objeto de expresiones regulares del mensajes.
  const messagesRegExp = {
    expMessageDemand: /[1-4]/, // Expresión regular para validar la demanda del mensaje (solo se aceptan los dígitos del 1 al 4)
    expMessageText: /.+/, // Expresión regular para validar el texto del mensaje (cualquier cadena de al menos un carácter)
  };
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
      case sendMessagesErrors:
        submitSendMessagesButton.disabled =
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
      input.addEventListener("input", (e: Event) =>
        validateField(expression, input, errorObject)
      );
      // Agregamos un listener para el evento "blur".
      input.addEventListener("blur", (e: Event) =>
        validateField(expression, input, errorObject)
      );
    });
  };
  // Definimos los objetos de errores para cada formulario y los inicializamos a true.
  const sendMessagesErrors: { [key: string]: boolean } = {
    messageDemand: true,
    messageText: true,
  };
  // Obtenemos los botones de submit y los desactivamos hasta que no haya errores.
  const submitSendMessagesButton = document.querySelector(
    "#submitSendMessagesButton"
  ) as HTMLButtonElement;
  if (submitSendMessagesButton !== null) {
    submitSendMessagesButton.disabled = true;
  }
  // Obtenemos los inputs de los formularios correspondientes y las expresiones regulares correspondientes.
  const sendMessagesFormInputs = document.querySelectorAll(
    "#sendMessagesForm .form-control"
  ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
  const sendMessagesExpressions = {
    messageDemand: messagesRegExp.expMessageDemand,
    messageText: messagesRegExp.expMessageText,
  };
  // Agregamos los listeners a los inputs correspondientes.
  addFormListeners(
    sendMessagesFormInputs,
    sendMessagesExpressions,
    sendMessagesErrors
  );
  // Obtenemos los botones para resetear los formularios.
  const resetSendMessagesButton = document.querySelector(
    "#resetSendMessagesButton"
  ) as HTMLButtonElement;
  if (resetSendMessagesButton !== null) {
    resetSendMessagesButton.addEventListener("click", (_: MouseEvent) => {
      // Reseteamos los inputs del formulario y los errores correspondientes.
      submitSendMessagesButton.disabled = true;
      $(sendMessagesFormInputs).removeClass("is-valid is-invalid");
      Object.keys(sendMessagesErrors).forEach(
        (key) => (sendMessagesErrors[key] = true)
      );
      $(sendMessagesFormInputs).closest("form").trigger("reset");
    });
  }
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
