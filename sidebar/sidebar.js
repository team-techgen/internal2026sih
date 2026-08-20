/* =========================
   SIDEBAR LOADER
========================= */


/*
   IMPORTANT:
   Save the script element before DOMContentLoaded.
   document.currentScript may become null later.
*/

const sidebarScript = document.currentScript;


/* =========================
   LOAD SIDEBAR
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const sidebarContainer =
            document.getElementById("sidebar");


        /* =========================
           CHECK SIDEBAR CONTAINER
        ========================= */

        if (!sidebarContainer) {

            console.error(
                "❌ #sidebar container not found"
            );

            return;
        }


        /* =========================
           FIND PROJECT ROOT
        ========================= */

        const projectRoot =
            new URL(
                "../",
                sidebarScript.src
            );


        /* =========================
           SIDEBAR HTML URL
        ========================= */

        const sidebarURL =
            new URL(
                "sidebar/sidebar.html?v=21",
                projectRoot
            );


        /* =========================
           LOAD SIDEBAR HTML
        ========================= */

        fetch(sidebarURL)

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load sidebar.html: " +
                        response.status
                    );

                }

                return response.text();

            })

            .then(function (html) {

                sidebarContainer.innerHTML =
                    html;


                console.log(
                    "✅ Sidebar HTML loaded"
                );


                initializeSidebar();

            })

            .catch(function (error) {

                console.error(
                    "❌ Sidebar Error:",
                    error
                );

            });

    }
);


/* =========================
   INITIALIZE SIDEBAR
========================= */

function initializeSidebar() {


    /* =========================
       SIDEBAR ELEMENTS
    ========================= */

    const sidebar =
        document.getElementById(
            "sidebarPanel"
        );


    const closeButton =
        document.getElementById(
            "sidebarClose"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    /* =========================
       CHECK SIDEBAR
    ========================= */

    if (!sidebar) {

        console.error(
            "❌ #sidebarPanel not found"
        );

        return;
    }


    console.log(
        "✅ Sidebar initialized"
    );


    /* =========================
       OPEN SIDEBAR
    ========================= */

    function openSidebar() {

        sidebar.classList.add(
            "active"
        );


        if (overlay) {

            overlay.classList.add(
                "active"
            );

        }


        document.body.classList.add(
            "sidebar-open"
        );


        console.log(
            "✅ Sidebar opened"
        );

    }


    /* =========================
       CLOSE SIDEBAR
    ========================= */

    function closeSidebar() {

        sidebar.classList.remove(
            "active"
        );


        if (overlay) {

            overlay.classList.remove(
                "active"
            );

        }


        document.body.classList.remove(
            "sidebar-open"
        );


        console.log(
            "✅ Sidebar closed"
        );

    }


    /* =========================
       CONNECT HEADER MENU BUTTON
    ========================= */

    function connectMenuButton() {

        const menuButton =
            document.getElementById(
                "sidebarToggle"
            );


        /* =========================
           BUTTON NOT FOUND
        ========================= */

        if (!menuButton) {

            console.log(
                "⏳ Waiting for sidebarToggle..."
            );

            return false;
        }


        /* =========================
           PREVENT DUPLICATE EVENT
        ========================= */

        if (
            menuButton.dataset
                .sidebarConnected === "true"
        ) {

            return true;

        }


        /* =========================
           MARK AS CONNECTED
        ========================= */

        menuButton.dataset
            .sidebarConnected = "true";


        /* =========================
           MENU BUTTON CLICK
        ========================= */

        menuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                openSidebar();

            }
        );


        console.log(
            "✅ Sidebar menu button connected"
        );


        return true;

    }


    /* =========================
       TRY TO CONNECT NOW
    ========================= */

    if (!connectMenuButton()) {


        /*
           Header is loaded dynamically.
           Watch the page until the
           sidebarToggle button appears.
        */

        const observer =
            new MutationObserver(
                function () {

                    if (
                        connectMenuButton()
                    ) {

                        observer.disconnect();

                    }

                }
            );


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );


        /*
           Stop observing after 15 seconds.
        */

        setTimeout(
            function () {

                observer.disconnect();

            },
            15000
        );

    }


    /* =========================
       CLOSE BUTTON
    ========================= */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                closeSidebar();

            }
        );

    }
    else {

        console.error(
            "❌ #sidebarClose not found"
        );

    }


    /* =========================
       OVERLAY CLICK
    ========================= */

    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                closeSidebar();

            }
        );

    }


    /* =========================
       ESCAPE KEY
    ========================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeSidebar();

            }

        }
    );


    /* =========================
       SIDEBAR LOADED EVENT
    ========================= */

    document.dispatchEvent(
        new Event(
            "sidebarLoaded"
        )
    );


    console.log(
        "✅ Sidebar setup complete"
    );

}