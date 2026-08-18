document.addEventListener("DOMContentLoaded", function () {

    const headerContainer = document.createElement("div");

    headerContainer.id = "header-container";

    document.body.prepend(headerContainer);


    fetch("../header/header.html")

        .then(response => response.text())

        .then(data => {

            headerContainer.innerHTML = data;


            /* =========================
               SIDEBAR TOGGLE
            ========================= */

            const sidebarButton =
                document.getElementById("sidebarToggle");


            sidebarButton.addEventListener("click", function () {

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

        })

        .catch(error => {

            console.error("Header loading error:", error);

        });

});