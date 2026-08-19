let sidebarLoaded = false;
let headerLoaded = false;


/* =========================
   LOAD SIDEBAR
========================= */

fetch("../sidebar/sidebar.html")
    .then(response => {

        if (!response.ok) {
            throw new Error("Sidebar file not found");
        }

        return response.text();

    })
    .then(data => {

        document.getElementById("sidebar").innerHTML = data;

        sidebarLoaded = true;

        setupSidebar();

    })
    .catch(error => {

        console.error("Sidebar Error:", error);

    });


/* =========================
   WAIT FOR HEADER
========================= */

document.addEventListener("headerLoaded", function () {

    headerLoaded = true;

    setupSidebar();

});


/* =========================
   SETUP SIDEBAR
========================= */

function setupSidebar() {

    if (!sidebarLoaded || !headerLoaded) {
        return;
    }


    const menuButton =
        document.getElementById("sidebarToggle");

    const closeButton =
        document.getElementById("sidebarClose");

    const sidebar =
        document.getElementById("sidebarPanel");

    const overlay =
        document.getElementById("sidebarOverlay");


    /* =========================
       CHECK ELEMENTS
    ========================= */

    if (!menuButton) {
        console.error("Menu button not found");
        return;
    }

    if (!closeButton) {
        console.error("Close button not found");
        return;
    }

    if (!sidebar) {
        console.error("Sidebar not found");
        return;
    }


    /* =========================
       OPEN SIDEBAR
    ========================= */

    menuButton.addEventListener("click", function () {

        sidebar.classList.add("active");

        if (overlay) {
            overlay.classList.add("active");
        }

    });


    /* =========================
       CLOSE SIDEBAR
    ========================= */

    closeButton.addEventListener("click", function () {

        sidebar.classList.remove("active");

        if (overlay) {
            overlay.classList.remove("active");
        }

    });


    /* =========================
       CLOSE USING OVERLAY
    ========================= */

    if (overlay) {

        overlay.addEventListener("click", function () {

            sidebar.classList.remove("active");

            overlay.classList.remove("active");

        });

    }

}