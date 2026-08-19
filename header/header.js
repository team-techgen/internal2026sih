fetch("../header/header.html")
    .then(response => {

        if (!response.ok) {
            throw new Error("Header file not found");
        }

        return response.text();
    })
    .then(data => {

        document.getElementById("header").innerHTML = data;

        document.dispatchEvent(
            new Event("headerLoaded")
        );

    })
    .catch(error => {

        console.error("Header Error:", error);

    });
    fetch("../header/header.html")
    .then(response => {

        if (!response.ok) {
            throw new Error("Header file not found");
        }

        return response.text();

    })
    .then(data => {

        document.getElementById("header").innerHTML = data;

        /*
         * Tell sidebar.js that header
         * has finished loading
         */
        document.dispatchEvent(
            new Event("headerLoaded")
        );


        /* =========================
           MOBILE DROPDOWN
        ========================== */

        const mobileMenuToggle =
            document.getElementById("mobileMenuToggle");

        const mobileDropdown =
            document.getElementById("mobileDropdown");


        if (mobileMenuToggle && mobileDropdown) {

            mobileMenuToggle.addEventListener(
                "click",
                function () {

                    const isOpen =
                        mobileDropdown.classList.toggle("active");


                    mobileMenuToggle.setAttribute(
                        "aria-expanded",
                        isOpen
                    );


                    /*
                     * Rotate arrow
                     */

                    const arrow =
                        mobileMenuToggle.querySelector(
                            ".menu-arrow"
                        );

                    if (arrow) {

                        arrow.style.transform =
                            isOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)";
                    }

                }
            );


            /*
             * Close dropdown after
             * selecting a link
             */

            const mobileLinks =
                mobileDropdown.querySelectorAll(
                    ".mobile-nav a"
                );

            mobileLinks.forEach(link => {

                link.addEventListener(
                    "click",
                    function () {

                        mobileDropdown.classList.remove(
                            "active"
                        );

                        mobileMenuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        const arrow =
                            mobileMenuToggle.querySelector(
                                ".menu-arrow"
                            );

                        if (arrow) {
                            arrow.style.transform =
                                "rotate(0deg)";
                        }

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