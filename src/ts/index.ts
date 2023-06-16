// La función se ejecuta cuando el documento está listo.
$(document).ready(function () {
  // Definimos una función para hacer la petición AJAX para el inicio de sesión.
  function login(username: string, userPassword: string) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/login.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        username: username,
        userPassword: userPassword,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          window.location.href = "./main.php";
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          if (response.exceptionMessage !== null) {
            reportError(response.exceptionMessage, "login.php");
          }
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
          "login.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de inicio de sesión.
  $(document).on("click", "#loginButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos de entrada de usuario y contraseña.
    const username = $("#username").val();
    const userPassword = $("#userPassword").val();
    // Verificar que no están vacíos
    if (username !== "" || userPassword !== "") {
      // Llamar a la función de "login" con los valores obtenidos.
      login(username as string, userPassword as string);
    }
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
