fetch("../header/header.html?v=3")
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
           MOBILE NAVIGATION
        ========================= */

        const mobileToggle =
            document.getElementById("mobileNavToggle");

        const mobileDropdown =
            document.getElementById("mobileNavDropdown");


        if (mobileToggle && mobileDropdown) {

            mobileToggle.addEventListener(
                "click",
                function () {

                    mobileDropdown.classList.toggle("active");

                    mobileToggle.classList.toggle("active");


                    const isOpen =
                        mobileDropdown.classList.contains("active");


                    mobileToggle.setAttribute(
                        "aria-expanded",
                        isOpen
                    );

                }
            );


            /* Close mobile navigation when link is clicked */

            const mobileLinks =
                mobileDropdown.querySelectorAll("a");


            mobileLinks.forEach(link => {

                link.addEventListener(
                    "click",
                    function () {

                        mobileDropdown.classList.remove(
                            "active"
                        );

                        mobileToggle.classList.remove(
                            "active"
                        );

                        mobileToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });

        }


        /* =========================
           GET STARTED DROPDOWN
        ========================= */

        const getStartedBtn =
            document.getElementById("getStartedBtn");

        const getStartedMenu =
            document.getElementById("getStartedMenu");

        const getStartedWrapper =
            document.querySelector(".get-started-wrapper");


        if (
            getStartedBtn &&
            getStartedMenu &&
            getStartedWrapper
        ) {

            /* Open / Close dropdown */

            getStartedBtn.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    getStartedMenu.classList.toggle(
                        "active"
                    );

                    getStartedWrapper.classList.toggle(
                        "active"
                    );


                    const isOpen =
                        getStartedMenu.classList.contains(
                            "active"
                        );


                    getStartedBtn.setAttribute(
                        "aria-expanded",
                        isOpen
                    );

                }
            );


            /* =========================
               OPTIONS
            ========================= */

            const options =
                getStartedMenu.querySelectorAll(
                    "button"
                );


            options.forEach(option => {

                option.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        /*
                         * Currently non-functional.
                         * Functions will be added later.
                         */

                        console.log(
                            "Selected:",
                            option.textContent.trim()
                        );

                    }
                );

            });


            /* =========================
               CLOSE ON OUTSIDE CLICK
            ========================= */

            document.addEventListener(
                "click",
                function (event) {

                    if (
                        !getStartedWrapper.contains(
                            event.target
                        )
                    ) {

                        getStartedMenu.classList.remove(
                            "active"
                        );

                        getStartedWrapper.classList.remove(
                            "active"
                        );

                        getStartedBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        }

    })
    .catch(error => {

        console.error(
            "Header Error:",
            error
        );

    });