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
           HEADER LOADED EVENT
        ========================= */

        document.dispatchEvent(
            new Event("headerLoaded")
        );


        /* =========================
           MOBILE NAV DROPDOWN
        ========================= */

        const toggle =
            document.getElementById("mobileNavToggle");

        const dropdown =
            document.getElementById("mobileNavDropdown");


        if (toggle && dropdown) {

            toggle.addEventListener(
                "click",
                function () {

                    dropdown.classList.toggle("active");

                    toggle.classList.toggle("active");


                    const isOpen =
                        dropdown.classList.contains("active");


                    toggle.setAttribute(
                        "aria-expanded",
                        isOpen
                    );

                }
            );


            /* Close when a link is clicked */

            const links =
                dropdown.querySelectorAll("a");

            links.forEach(link => {

                link.addEventListener(
                    "click",
                    function () {

                        dropdown.classList.remove(
                            "active"
                        );

                        toggle.classList.remove(
                            "active"
                        );

                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });

        }

    })
    .catch(error => {

        console.error(
            "Header Error:",
            error
        );

    });