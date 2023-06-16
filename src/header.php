<header class="container-xl bg-white p-3 mb-2 rounded-4 shadow-lg">
    <div class="row border-bottom justify-content-evenly">
        <!-- Bienvenida -->
        <h2 class="col-auto d-inline-block text-capitalize">
            <?php
            echo $_SESSION["lang"]["Header.php"]["H1"]["Welcome"];
            echo "&#160;";
            // Crear una nueva conexión a la base de datos.
            $pdo = new DB();
            // Realizar una consulta preparada con el nombre de usuario.
            $pdo->query("SELECT username FROM users WHERE userId = ?");
            $pdo->bind(1, $_SESSION["userInfo"]["userId"], PDO::PARAM_INT);
            $pdo->execute();
            echo $pdo->single()["username"];
            ?>
        </h2>
        <!-- Reloj -->
        <div class="col-auto d-inline-block ms-md-auto">
            <p class="text-center" id="clock"></p>
        </div>
    </div>
    <!-- Navbar  -->
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img src="./assets/images/logo.svg" alt="Logo" width="25" height="25"
                    class="d-inline-block align-text-top">
                Library Plus
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <img src="./assets/images/menu.svg" alt="Menu Icon" style="width: 1.2rem;">
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <?php
                    if (isset($_SESSION["auth"])) {
                        // Main
                        $pages = [
                            [
                                "url" => "./main.php",
                                "label" => $_SESSION["lang"]["Header.php"]["Nav"]["Main"],
                                "active" => (basename($_SERVER["PHP_SELF"]) == "main.php")
                            ]
                        ];
                        if ($_SESSION["userInfo"]["userId"] != 1) {
                            // Contactar con el administrador.
                            $pages[] = [
                                "url" => "./sendMessages.php",
                                "label" => $_SESSION["lang"]["Header.php"]["Nav"]["ContactTheAdministrator"],
                                "active" => (basename($_SERVER["PHP_SELF"]) == "sendMessages.php")
                            ];
                            // Solicitar.
                            $pages[] = [
                                "url" => "./sendRequests.php",
                                "label" => $_SESSION["lang"]["Header.php"]["Nav"]["Solicit"],
                                "active" => (basename($_SERVER["PHP_SELF"]) == "sendRequests.php")
                            ];
                        } else {
                            // Mensajes.
                            $pages[] = [
                                "url" => "./messages.php",
                                "label" => $_SESSION["lang"]["Header.php"]["Nav"]["Messages"],
                                "active" => (basename($_SERVER["PHP_SELF"]) == "messages.php")
                            ];

                            // Solicitudes.
                            $pages[] = [
                                "url" => "./requests.php",
                                "label" => $_SESSION["lang"]["Header.php"]["Nav"]["Request"],
                                "active" => (basename($_SERVER["PHP_SELF"]) == "requests.php")
                            ];

                            // Control de usuarios.
                            $pages[] = [
                                "url" => "./usersControl.php",
                                "label" => $_SESSION["lang"]["Header.php"]["Nav"]["UsersControl"],
                                "active" => (basename($_SERVER["PHP_SELF"]) == "usersControl.php")
                            ];
                        }
                        // Cerrar Sesión
                        $pages[] = [
                            "url" => "./php/logout.php",
                            "label" => $_SESSION["lang"]["Header.php"]["Nav"]["Logout"],
                            "active" => (basename($_SERVER["PHP_SELF"]) == "logout.php")
                        ];
                    }
                    foreach ($pages as $page) {
                        $active = $page["active"] ? "active" : "";
                        echo "<a href='{$page["url"]}' class='nav-link {$active}'>{$page["label"]}</a>";
                    }
                    ?>
                </div>
            </div>
        </div>
    </nav>
</header>