/* =========================
   HEADER LOADER
========================= */

const headerScript = document.currentScript;

const projectRoot = new URL(
    "../",
    headerScript.src
);


/* =========================
   LOAD HEADER HTML
========================= */

const headerHTML = new URL(
    "header/header.html?v=5",
    projectRoot
);


fetch(headerHTML)
    .then(response => {

        if (!response.ok) {
            throw new Error("Header file not found");
        }

        return response.text();

    })

    .then(data => {

        const header =
            document.getElementById("header");


        if (!header) {
            throw new Error(
                "Header container not found"
            );
        }


        header.innerHTML = data;


        /* =========================
           FIX LOGO PATH
        ========================= */

        const logo =
            document.getElementById(
                "siteLogoImage"
            );


        if (logo) {

            logo.src = new URL(
                "Assets/logo.png",
                projectRoot
            ).href;

        }


        /* =========================
           HOME LINK
        ========================= */

        const homeLink =
            document.getElementById(
                "headerHomeLink"
            );


        if (homeLink) {

            homeLink.href = new URL(
                "Home/index.html",
                projectRoot
            ).href;

        }


        /* =========================
           LOGO LINK
        ========================= */

        const logoLink =
            document.getElementById(
                "siteLogo"
            );


        if (logoLink) {

            logoLink.href = new URL(
                "Home/index.html",
                projectRoot
            ).href;

        }


        /* =========================
           MOBILE HOME LINK
        ========================= */

        const mobileHomeLink =
            document.getElementById(
                "mobileHomeLink"
            );


        if (mobileHomeLink) {

            mobileHomeLink.href = new URL(
                "Home/index.html",
                projectRoot
            ).href;

        }


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
            document.getElementById(
                "mobileNavToggle"
            );


        const mobileDropdown =
            document.getElementById(
                "mobileNavDropdown"
            );


        if (
            mobileToggle &&
            mobileDropdown
        ) {

            mobileToggle.addEventListener(
                "click",
                function () {

                    mobileDropdown.classList.toggle(
                        "active"
                    );


                    mobileToggle.classList.toggle(
                        "active"
                    );


                    const isOpen =
                        mobileDropdown.classList.contains(
                            "active"
                        );


                    mobileToggle.setAttribute(
                        "aria-expanded",
                        isOpen
                    );

                }
            );


            const mobileLinks =
                mobileDropdown.querySelectorAll(
                    "a"
                );


            mobileLinks.forEach(
                link => {

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

                }
            );

        }


        /* =========================
           GET STARTED DROPDOWN
        ========================= */

        const getStartedBtn =
            document.getElementById(
                "getStartedBtn"
            );


        const getStartedMenu =
            document.getElementById(
                "getStartedMenu"
            );


        const getStartedWrapper =
            document.querySelector(
                ".get-started-wrapper"
            );


        if (
            getStartedBtn &&
            getStartedMenu &&
            getStartedWrapper
        ) {


            /* =========================
               MAIN DROPDOWN
            ========================= */

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
               ROLE DROPDOWNS
            ========================= */

            const roleDropdowns =
                getStartedMenu.querySelectorAll(
                    ".role-dropdown"
                );


            roleDropdowns.forEach(
                role => {

                    const roleButton =
                        role.querySelector(
                            ".role-btn"
                        );


                    if (!roleButton) {
                        return;
                    }


                    roleButton.addEventListener(
                        "click",
                        function (event) {

                            event.stopPropagation();


                            roleDropdowns.forEach(
                                otherRole => {

                                    if (
                                        otherRole !== role
                                    ) {

                                        otherRole.classList.remove(
                                            "active"
                                        );

                                    }

                                }
                            );


                            role.classList.toggle(
                                "active"
                            );

                        }
                    );

                }
            );


            /* =========================
   LOGIN / REGISTER
========================= */

const actionButtons =
    getStartedMenu.querySelectorAll(
        ".role-submenu button"
    );


actionButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const roleElement =
                    button
                        .closest(
                            ".role-dropdown"
                        )
                        ?.querySelector(
                            ".role-btn span"
                        );


                const role =
                    roleElement
                        ?.textContent
                        .trim()
                        .toUpperCase();


                const action =
                    button.textContent
                        .trim();


                /* =========================
                   INSTITUTE LOGIN
                ========================= */

                if (
                    role === "INSTITUTE" &&
                    action === "Login"
                ) {

                    window.location.href =
                        new URL(
                            "Institute/institute%20login/login.html",
                            projectRoot
                        ).href;

                }


                /* =========================
                   INSTITUTE REGISTER
                ========================= */

                if (
                    role === "INSTITUTE" &&
                    action === "Register"
                ) {

                    window.location.href =
                        new URL(
                            "Institute/institute%20register/register.html",
                            projectRoot
                        ).href;

                }

            }
        );

    }
);


            /* =========================
               CLOSE OUTSIDE CLICK
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


                        roleDropdowns.forEach(
                            role => {

                                role.classList.remove(
                                    "active"
                                );

                            }
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