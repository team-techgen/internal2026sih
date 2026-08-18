document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       CREATE HOME BUTTON
    ========================= */

    const homeBar = document.createElement("button");

    homeBar.className = "home-bar";

    homeBar.innerHTML = "☰ Home";

    document.body.appendChild(homeBar);


    /* =========================
       CREATE SIDEBAR CONTAINER
    ========================= */

    const sidebarContainer = document.createElement("div");

    sidebarContainer.id = "sidebar-container";

    document.body.appendChild(sidebarContainer);


    /* =========================
       CREATE OVERLAY
    ========================= */

    const overlay = document.createElement("div");

    overlay.className = "sidebar-overlay";

    document.body.appendChild(overlay);


    /* =========================
       LOAD SIDEBAR HTML
    ========================= */

    fetch("/sidebar/sidebar.html")

        .then(response => {

            if (!response.ok) {
                throw new Error("Sidebar could not be loaded");
            }

            return response.text();
        })

        .then(data => {

            sidebarContainer.innerHTML = data;

            const sidebar = document.getElementById("sidebar");

            const closeButton =
                document.getElementById("closeSidebar");


            /* =========================
               OPEN SIDEBAR
            ========================= */

            homeBar.addEventListener("click", function () {

                sidebar.classList.add("active");

                overlay.classList.add("active");

            });


            /* =========================
               CLOSE SIDEBAR
            ========================= */

            closeButton.addEventListener("click", function () {

                sidebar.classList.remove("active");

                overlay.classList.remove("active");

            });


            /* =========================
               CLOSE WHEN CLICKING OUTSIDE
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