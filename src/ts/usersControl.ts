// La función se ejecuta cuando el documento está listo.
$(document).ready(function () {
  // Esta función se activa cuando se hace clic en un elemento con la clase "usersOption1".
  $(".usersOption1").on("click", function () {
    // Oculta el elemento con el ID "showUsersDiv".
    $("#showUsersDiv").addClass("d-none");
    // Muestra el elemento con el ID "registerUsersDiv".
    $("#registerUsersDiv").removeClass("d-none");
    // Añade la clase "list-group-item-dark" al elemento en el que se hizo clic.
    $(this).addClass("list-group-item-dark");
    // Remueve la clase "list-group-item-dark" del otro elemento.
    $(".usersOption2").removeClass("list-group-item-dark");
  });
  // Esta función se activa cuando se hace clic en un elemento con la clase "usersOption2".
  $(".usersOption2").on("click", function () {
    // Oculta el elemento con el ID "registerUsersDiv".
    $("#registerUsersDiv").addClass("d-none");
    // Muestra el elemento con el ID "showUsersDiv".
    $("#showUsersDiv").removeClass("d-none");
    // Añade la clase "list-group-item-dark" al elemento en el que se hizo clic.
    $(this).addClass("list-group-item-dark");
    // Remueve la clase "list-group-item-dark" del otro elemento.
    $(".usersOption1").removeClass("list-group-item-dark");
  });
  //___________________________________________________AJAX___________________________________________________//
  // Definimos una función para hacer la petición AJAX para registrar usuarios.
  function registerUser(
    username: string,
    userFullName: string,
    userEmail: string,
    userPassword: string
  ) {
    $.ajax({
      // URL a la que se envía la petición.
      method: "POST",
      // El método de envió.
      url: "./php/server/registerUser.php",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        username: username,
        userFullName: userFullName,
        userEmail: userEmail,
        userPassword: userPassword,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#resetRegisterButton").click();
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadUsers(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "registerUser.php");
        }
      },
      // Función que se ejecuta cuando la petición es exitosa.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "registerUser.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de registrar.
  $(document).on("click", "#submitRegisterButton", async function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const username = $("#username").val();
    const userFullName = $("#userFullName").val();
    const userEmail = $("#userEmail").val();
    const userPassword = $("#password2").val();
    // Llamar a la función de "registerUser" con los valores obtenidos.
    registerUser(
      username as string,
      userFullName as string,
      userEmail as string,
      userPassword as string
    );
  });
  // Definimos una función para hacer la petición AJAX para cargar los usuarios de la base de datos con la paginación.
  function loadUsers(userPage: number, searchTerm: string) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/loadUsers.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        userPage: userPage,
        searchTerm: searchTerm,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#UsersPagination").html(response.pagination);
          $("#userTable tbody").html(response.tbody);
          $("#totalUsers").html(response.totalUsers);
        } else {
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
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "loadUsers.php"
        );
      },
    })
      // Función que se ejecuta después de que la promesa se resuelve exitosamente.
      .then(function () {
        validateEditUserForm();
      });
  }
  // Primera carga de usuarios al inicio de la página.
  loadUsers(1, "");
  // Manejador de evento para el elemento de Paginación de usuarios.
  $(document).on("click", ".userPageItem", function () {
    // Obtención del número de página del atributo ID del elemento HTML seleccionado.
    let userPage = parseInt($(this).attr("id") as string);
    // Obtención del término de búsqueda actual en el campo de búsqueda correspondiente.
    let searchTerm = $("#searchUserInput").val() as string;
    // Llamar a la función de "loadUsers" con los valores obtenidos.
    loadUsers(userPage, searchTerm);
  });
  // Manejador de evento para cuando se escribe sobre el campo de búsqueda de dispositivos.
  $(document).on("input", "#searchUserInput", function () {
    // Obtener el término de búsqueda actual.
    let searchTerm = $(this).val() as string;
    // Reiniciar el número de página a mostrar.
    let userPage = 1;
    // Llamar a la función de "loadUsers" con los valore obtenidos.
    loadUsers(userPage as number, searchTerm as string);
  });
  // Definimos una función para hacer la petición AJAX para editar los datos del usuario.
  function editUser(
    hiddenUserId: number,
    editUsername: string,
    editUserFullName: string,
    editUserEmail: string,
    editUserPassword: string
  ) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/editUser.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        hiddenUserId: hiddenUserId,
        editUsername: editUsername,
        editUserFullName: editUserFullName,
        editUserEmail: editUserEmail,
        editUserPassword: editUserPassword,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#editUserModal" + hiddenUserId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadUsers(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "editUser.php");
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
          "editUser.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de editar usuarios.
  $(document).on("click", ".editUserButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const [
      hiddenUserId,
      editUsername,
      editUserFullName,
      editUserEmail,
      editUserPassword,
    ] = [
      $(this).closest("tr").find(".hiddenUserId").val(),
      $(this).closest("tr").find(".editUsername").val(),
      $(this).closest("tr").find(".editUserFullName").val(),
      $(this).closest("tr").find(".editUserEmail").val(),
      $(this).closest("tr").find(".editUserPassword").val(),
    ];
    // Llama a la función "editUser".
    editUser(
      hiddenUserId as number,
      editUsername as string,
      editUserFullName as string,
      editUserEmail as string,
      editUserPassword as string
    );
  });
  // Definimos una función para hacer la petición AJAX para desactivar la cuenta del usuario.
  function deactivateAccount(hiddenUserId: number) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/deactivateAccount.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        hiddenUserId: hiddenUserId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#editUserModal" + hiddenUserId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadUsers(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "deactivateAccount.php");
        }
      },
      // Función que se ejecuta cuando la petición es exitosa.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "deactivateAccount.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de desactivar la cuenta del usuario.
  $(document).on("click", ".deactivateAccountButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const [hiddenUserId] = [$(this).closest("tr").find(".hiddenUserId").val()];
    // Llamar a la función de "deleteUser" con los valores obtenidos.
    deactivateAccount(hiddenUserId as number);
  });
  // Definimos una función para hacer la petición AJAX para desactivar la cuenta del usuario.
  function activateAccount(hiddenUserId: number) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/activateAccount.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        hiddenUserId: hiddenUserId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#editUserModal" + hiddenUserId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadUsers(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "activateAccount.php");
        }
      },
      // Función que se ejecuta cuando la petición es exitosa.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "activateAccount.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de activar la cuenta del usuario.
  $(document).on("click", ".activateAccountButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const [hiddenUserId] = [$(this).closest("tr").find(".hiddenUserId").val()];
    // Llamar a la función de "deleteUser" con los valores obtenidos.
    activateAccount(hiddenUserId as number);
  });
  // Definimos una función para hacer la petición AJAX para activar la cuenta del usuario.
  function deleteUser(hiddenUserId: number) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/deleteUser.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        hiddenUserId: hiddenUserId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#editUserModal" + hiddenUserId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadUsers(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "deleteUser.php");
        }
      },
      // Función que se ejecuta cuando la petición es exitosa.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "deleteUser.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de eliminar usuarios.
  $(document).on("click", ".deleteUserButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const [hiddenUserId] = [$(this).closest("tr").find(".hiddenUserId").val()];
    // Llamar a la función de "deleteUser" con los valores obtenidos.
    deleteUser(hiddenUserId as number);
  });

  //___________________________________________________VALIDAR FORMULARIOS___________________________________________________//
  // Definimos una función para validar el campo.
  const validateField = (
    expression: RegExp,
    input: HTMLInputElement,
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
    if (input.name == "password1" || input.name == "password2") {
      confirmPassword();
    }
    // Cambiamos el estado del botón de submit dependiendo de los errores encontrados.
    submitControler(errorObject);
  };
  // Definimos una función para controlar el botón submit.
  const submitControler = (errorObject: { [key: string]: boolean }): void => {
    switch (errorObject) {
      case registerErrors:
        submitRegisterButton.disabled =
          Object.values(errorObject).filter((value) => value == true).length >
          0;
        break;
      case editUsersErrors:
        const editUserButtons = document.querySelectorAll(
          ".editUserButton"
        ) as NodeListOf<HTMLButtonElement>;
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
  // Definimos una función para añadir listeners de eventos a los campos de los formularios.
  const addFormListeners = (
    formInputs: NodeListOf<HTMLInputElement>,
    expressions: { [key: string]: RegExp },
    errorObject: { [key: string]: boolean }
  ): void => {
    formInputs.forEach((input: HTMLInputElement) => {
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
  // Función para comprobar si las contraseñas coinciden y cumplen con los requisitos.
  const confirmPassword = () => {
    checkPassword();
    // Obtenemos los elementos input de las contraseñas.
    const password1 = document.querySelector("#password1") as HTMLInputElement;
    const confirmPassword = document.querySelector(
      "#password2"
    ) as HTMLInputElement;
    // Comprobamos si ambas contraseñas coinciden.
    const isMatch = confirmPassword.value == password1.value;
    // Comprobamos si ambas contraseñas cumplen los requisitos usando una expresión regular.
    const isValidPassword =
      usersRegExp.expUserPassword.test(password1.value) &&
      usersRegExp.expUserPassword.test(confirmPassword.value);
    // Agregamos o quitamos la clase 'is-valid' a confirmPassword dependiendo si ambas contraseñas coinciden y cumplen los requisitos.
    confirmPassword.classList.toggle("is-valid", isMatch && isValidPassword);
    // Agregamos o quitamos la clase 'is-invalid' a confirmPassword dependiendo si ambas contraseñas no coinciden o no cumplen los requisitos.
    confirmPassword.classList.toggle(
      "is-invalid",
      !isMatch || !isValidPassword
    );
    // Guardamos en registerErrors.password1 si ambas contraseñas coinciden y cumplen los requisitos.
    registerErrors.password1 = !isMatch || !isValidPassword;
    // Llamamos..
    submitControler(registerErrors);
  };
  // Función para comprobar la fortaleza de la contraseña.
  function checkPassword(): void {
    // Obtenemos el valor del input de la contraseña.
    let password = (document.querySelector("#password1") as HTMLInputElement)
      .value;
    // Definimos expresiones regulares para comprobar la fortaleza de la contraseña.
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;
    let minLength = 8;
    // Comprobamos si la contraseña contiene letras minúsculas y agregamos o quitamos la clase 'valid' o 'invalid' a #lowerCaseLetters dependiendo del resultado.
    if (password.match(lowerCaseLetters)) {
      $("#lowerCaseLetters").addClass("valid").removeClass("invalid");
    } else {
      $("#lowerCaseLetters").addClass("invalid").removeClass("valid");
    }
    // Comprobamos si la contraseña contiene letras mayúsculas y agregamos o quitamos la clase 'valid' o 'invalid' a #upperCaseLetters dependiendo del resultado.
    if (password.match(upperCaseLetters)) {
      $("#upperCaseLetters").addClass("valid").removeClass("invalid");
    } else {
      $("#upperCaseLetters").addClass("invalid").removeClass("valid");
    }
    // Comprobamos si la contraseña contiene números y agregamos o quitamos la clase 'valid' o 'invalid' a #numbers dependiendo del resultado.
    if (password.match(numbers)) {
      $("#numbers").addClass("valid").removeClass("invalid");
    } else {
      $("#numbers").addClass("invalid").removeClass("valid");
    }
    // Comprobamos si la contraseña es lo suficientemente larga y agregamos o quitamos la clase 'valid' o 'invalid' a #minLength dependiendo del resultado.
    if (password.length >= minLength) {
      $("#minLength").addClass("valid").removeClass("invalid");
    } else {
      $("#minLength").addClass("invalid").removeClass("valid");
    }
  }
  // Formulario de registrar usuarios.
  // Definimos una interfaz para tipar los objetos de expresiones regulares.
  interface usersRegExp {
    expUsername: RegExp;
    expUserFullName: RegExp;
    expUserEmail: RegExp;
    expUserPassword: RegExp;
    [key: string]: RegExp;
  }
  // Inicializamos la interfaz mainRegExp para tipar el objeto de expresiones regulares de control de usuarios.
  const usersRegExp = {
    expUsername: /^[A-Za-z0-9._]{5,255}$/, // Expresión regular para validar el nombre de usuario (solo letras, números, puntos y guiones bajos, entre 5 y 255 caracteres)
    expUserFullName: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜýÝ\s]{5,255}$/, // Expresión regular para validar el nombre completo del usuario (solo letras, espacios y caracteres acentuados, entre 5 y 255 caracteres)
    expUserEmail: /^[a-zA-Z0-9.]{5,255}@educa.madrid.org$/, // Expresión regular para validar el correo electrónico del usuario (formato específico para el dominio educa.madrid.org, entre 5 y 255 caracteres)
    expUserPassword: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,25}$/, // Expresión regular para validar la contraseña del usuario (debe contener al menos 1 número, 1 letra minúscula, 1 letra mayúscula, entre 8 y 25 caracteres)
  };
  // Definimos los objetos de errores para cada formulario y los inicializamos a true.
  const registerErrors: { [key: string]: boolean } = {
    username: true,
    userFullName: true,
    userEmail: true,
    password1: true,
  };
  // Obtenemos los botones de submit y los desactivamos hasta que no haya errores.
  const submitRegisterButton = document.querySelector(
    "#submitRegisterButton"
  ) as HTMLButtonElement;
  if (submitRegisterButton !== null) {
    submitRegisterButton.disabled = true;
  }
  // Obtenemos los inputs de los formularios correspondientes y las expresiones regulares correspondientes.
  const registerUsersFormInputs = document.querySelectorAll(
    "#registerUsersForm .form-control"
  ) as NodeListOf<HTMLInputElement>;
  const registerExpressions = {
    username: usersRegExp.expUsername,
    userFullName: usersRegExp.expUserFullName,
    userEmail: usersRegExp.expUserEmail,
    password1: usersRegExp.expUserPassword,
    password2: usersRegExp.expUserPassword,
  };
  // Agregamos los listeners a los inputs correspondientes.
  addFormListeners(
    registerUsersFormInputs,
    registerExpressions,
    registerErrors
  );
  // Obtenemos los botones para resetear los formularios.
  const resetRegisterButton = document.querySelector(
    "#resetRegisterButton"
  ) as HTMLButtonElement;
  if (resetRegisterButton !== null) {
    resetRegisterButton.addEventListener("click", (_: MouseEvent) => {
      // Reseteamos los inputs del formulario y los errores correspondientes.
      submitRegisterButton.disabled = true;
      $(registerUsersFormInputs).removeClass("is-valid is-invalid");
      Object.keys(registerErrors).forEach(
        (key) => (registerErrors[key] = true)
      );
      $(registerUsersFormInputs).closest("form").trigger("reset");
      $("#checkList li").removeClass("valid invalid");
    });
  }
  // Formulario de editar usuario.
  // Definimos los objetos de errores para cada formulario y los inicializamos a true.
  const editUsersErrors: { [key: string]: boolean } = {
    editUsername: false,
    editUserFullName: false,
    editUserEmail: false,
    editUserPassword: false,
  };
  // Función que se ejecuta cuando se cargan los usuarios correctamente.
  function validateEditUserForm() {
    // Obtenemos los botones de submit y los desactivamos hasta que no haya errores.
    const editUserButtons = document.querySelectorAll(
      ".editUserButton"
    ) as NodeListOf<HTMLButtonElement>;
    // Obtenemos los inputs de los formularios correspondientes y las expresiones regulares correspondientes.
    const editUserFormInputs = document.querySelectorAll(
      ".editUserForm .form-control"
    ) as NodeListOf<HTMLInputElement>;
    const editUserExpressions = {
      editUsername: usersRegExp.expUsername,
      editUserFullName: usersRegExp.expUserFullName,
      editUserEmail: usersRegExp.expUserEmail,
      editUserPassword: usersRegExp.expUserPassword,
    };
    // Agregamos los listeners a los inputs correspondientes.
    addFormListeners(editUserFormInputs, editUserExpressions, editUsersErrors);
    // Al pulsar el botón de cerrar el modal se restear el formulario.
    const closeModalButtons = document.querySelectorAll(
      ".closeEUModalButton"
    ) as NodeListOf<HTMLButtonElement>;
    if (closeModalButtons !== null) {
      closeModalButtons.forEach((button) => {
        button.addEventListener("click", (_: MouseEvent) => {
          // Reseteamos los inputs del formulario.
          $(editUserFormInputs).removeClass("is-valid is-invalid");
          Object.keys(editUsersErrors).forEach(
            (key) => (editUsersErrors[key] = false)
          );
          if (editUserButtons) {
            editUserButtons.forEach((button) => {
              button.disabled = false;
            });
          }
          const editUserForm = document.querySelectorAll(
            ".editUserForm"
          ) as NodeListOf<HTMLFormElement>;
          editUserForm.forEach((form) => {
            form.reset();
          });
        });
      });
    }
  }
  //___________________________________________________FUNCIONES___________________________________________________//
  // Se obtienen los elementos HTML de los campos de contraseña y el botón de mostrar/ocultar contraseña.
  const passwordInputs: NodeListOf<HTMLInputElement> =
    document.querySelectorAll(
      "input[type=password]"
    ) as NodeListOf<HTMLInputElement>;
  // Se obtiene el elemento de generar contraseña.
  const generatePasswordIcon = document.querySelector(
    "#generatePassword"
  ) as HTMLImageElement;
  // Agregar el evento click al elemento "generatePasswordIcon".
  generatePasswordIcon.addEventListener("click", function () {
    // Generar contraseña.
    const password = generatePassword();
    // Iterar sobre cada elemento input de tipo password.
    passwordInputs.forEach((input) => {
      // Asignar la contraseña a los input.
      input.value = password;
    });
  });
  // Función para generar una contraseña aleatoria.
  function generatePassword(): string {
    // Expresión regular para validar la contraseña del usuario.
    const expUserPassword =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,25}$/;
    // Cadena de caracteres disponibles para la contraseña.
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    // Generar una longitud aleatoria para la contraseña entre 8 y 25 caracteres.
    const passwordLength = Math.floor(Math.random() * (25 - 8 + 1)) + 8;
    let password = ""; // Variable para almacenar la contraseña generada.
    let isValidPassword = false; // Bandera para indicar si la contraseña es válida.
    while (!isValidPassword) {
      // Limpiar la contraseña en cada iteración del ciclo while.
      password = "";
      // Generar la contraseña aleatoria agregando caracteres de la cadena.
      for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      // Verificar si la contraseña cumple con la expresión regular.
      isValidPassword = expUserPassword.test(password);
    }
    return password; // Devolver la contraseña generada.
  }
  // Se obtiene el elemento de copiar la contraseña.
  const copyPasswordIcon = document.querySelector(
    "#copyPassword"
  ) as HTMLImageElement;
  // Agregar el evento click al elemento "copyPasswordIcon".
  copyPasswordIcon.addEventListener("click", function () {
    // Obtener el input de la contraseña.
    const passwordInput = passwordInputs[1];
    // Verificar si el navegador admite el comando "execCommand".
    if (document.queryCommandSupported("copy")) {
      // Crear un elemento de texto temporal.
      const tempInput = document.createElement("input");
      // Establecer el valor del elemento temporal como la contraseña.
      tempInput.value = passwordInput.value;
      // Agregar el elemento temporal al documento.
      document.body.appendChild(tempInput);
      // Seleccionar el contenido del elemento temporal.
      tempInput.select();
      // Ejecutar el comando de copiar.
      document.execCommand("copy");
      // Eliminar el elemento temporal del documento.
      document.body.removeChild(tempInput);
      // Aplicar cambios visuales para indicar éxito.
      copyPasswordIcon.style.transform = "scale(1.2)";
      setTimeout(function () {
        copyPasswordIcon.style.transform = "scale(1)";
      }, 500);
    }
  });
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
