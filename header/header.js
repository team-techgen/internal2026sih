fetch("../header/header.html")
    .then(response => {

        if (!response.ok) {
            throw new Error("Header file not found");
        }

        return response.text();

    })
    .then(data => {

        document.getElementById("header").innerHTML = data;


        /* =========================
           MOBILE NAVIGATION
        ========================= */

        const navToggle =
            document.getElementById("navToggle");

        const headerNav =
            document.getElementById("headerNav");


        if (navToggle && headerNav) {

            navToggle.addEventListener("click", function () {

                headerNav.classList.toggle("mobile-open");


                const isOpen =
                    headerNav.classList.contains("mobile-open");


                navToggle.setAttribute(
                    "aria-expanded",
                    isOpen
                );


                /* Change arrow */

                if (isOpen) {

                    navToggle.textContent = "▲";

                } else {

                    navToggle.textContent = "▼";

                }

            });

        }


        /* =========================
           HEADER LOADED
        ========================= */

        document.dispatchEvent(
            new Event("headerLoaded")
        );

    })
    .catch(error => {

        console.error(
            "Header Error:",
            error
        );

    });