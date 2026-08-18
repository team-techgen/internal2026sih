document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SIDEBAR CONTAINER
    ========================= */

    const sidebarContainer = document.createElement("div");

    sidebarContainer.id = "sidebar-container";

    document.body.appendChild(sidebarContainer);


    /* =========================
       OVERLAY
    ========================= */

    const overlay = document.createElement("div");

    overlay.className = "sidebar-overlay";

    document.body.appendChild(overlay);


    /* =========================
       LOAD SIDEBAR
    ========================= */

    fetch("../sidebar/sidebar.html")

        .then(response => {

            if (!response.ok) {
                throw new Error("Sidebar could not be loaded");
            }

            return response.text();

        })

        .then(data => {

            sidebarContainer.innerHTML = data;

            const sidebar =
                document.getElementById("sidebar");

            const closeButton =
                document.getElementById("closeSidebar");


            /* =========================
               CLOSE BUTTON
            ========================= */

            if (closeButton) {

                closeButton.addEventListener("click", function () {

                    sidebar.classList.remove("active");

                    overlay.classList.remove("active");

                });

            }


            /* =========================
               OVERLAY CLICK
            ========================= */

            overlay.addEventListener("click", function () {

                sidebar.classList.remove("active");

                overlay.classList.remove("active");

            });

        })

        .catch(error => {

            console.error("Sidebar Error:", error);

        });

});