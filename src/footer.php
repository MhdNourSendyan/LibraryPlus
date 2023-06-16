<footer class="container-xl bg-white p-3 mt-2 rounded-4 fw-bold shadow-lg">
    <!-- Section: Social media -->
    <section class="d-flex justify-content-center justify-content-between">
        <!-- Left -->
        <div class="me-5">
            <p class="text-center m-2">
                <?php echo $_SESSION["lang"]["Footer.php"]["MadeBy"]; ?> Mhd Nour Sendyan.
            </p>
        </div>
        <!-- Right -->
        <!-- Botones de idiomas -->
        <div class="row d-flex justify-content-end">
            <div class="col-auto" id="langButtons">
                <div class="hstack">
                    <button class="langButton btn p-1" id="es">
                        <img src="./assets/images/es.svg" alt="Es Icon" class="langIcon" width="25">
                    </button>
                    <button class="langButton btn p-1" id="en">
                        <img src="./assets/images/uk.svg" alt="Uk Icon" class="langIcon" width="25">
                    </button>
                    <button class="langButton btn p-1" id="fr">
                        <img src="./assets/images/fr.svg" alt="Fr Icon" class="langIcon" width="25">
                    </button>
                    <button class="langButton btn p-1" id="it">
                        <img src="./assets/images/it.svg" alt="It Icon" class="langIcon" width="25">
                    </button>
                    <button class="langButton btn p-1" id="ar">
                        <img src="./assets/images/sy.svg" alt="Sy Icon" class="langIcon" width="25">
                    </button>
                </div>
            </div>
        </div>
    </section>
    <!-- Copyright -->
    <p class="text-center m-2">
        <?php echo $_SESSION["lang"]["Footer.php"]["Copyright"]; ?>
    </p>
</footer>