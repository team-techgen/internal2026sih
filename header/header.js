document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       CREATE HEADER CONTAINER
    ========================= */

    const headerContainer = document.createElement("div");

    headerContainer.id = "header-container";

    document.body.prepend(headerContainer);


    /* =========================
       LOAD HEADER
    ========================= */

    fetch("../header/header.html")

        .then(response => {

            if (!response.ok) {
                throw new Error("Header could not be loaded");
            }

            return response.text();

        })

        .then(data => {

            headerContainer.innerHTML = data;


            /* =========================
               SIDEBAR BUTTON
            ========================= */

            const menuButton =
                document.getElementById("sidebarToggle");


            if (menuButton) {

                menuButton.addEventListener("click", function () {

                    const sidebar =
                        document.getElementById("sidebar");

                    const overlay =
                        document.querySelector(".sidebar-overlay");


                    if (sidebar) {
                        sidebar.classList.add("active");
                    }

                    if (overlay) {
                        overlay.classList.add("active");
                    }

                });

            }

        })

        .catch(error => {

            console.error("Header Error:", error);

        });

});