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


    roleDropdowns.forEach(role => {

        const roleButton =
            role.querySelector(".role-btn");


        roleButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                /* Close other roles */

                roleDropdowns.forEach(
                    otherRole => {

                        if (otherRole !== role) {

                            otherRole.classList.remove(
                                "active"
                            );

                        }

                    }
                );


                /* Toggle selected role */

                role.classList.toggle(
                    "active"
                );

            }
        );

    });


    /* =========================
       LOGIN / REGISTER
       CURRENTLY NON-FUNCTIONAL
    ========================= */

    const actionButtons =
        getStartedMenu.querySelectorAll(
            ".role-submenu button"
        );


    actionButtons.forEach(button => {

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const role =
                    button
                        .closest(".role-dropdown")
                        .querySelector(".role-btn span")
                        .textContent
                        .trim();


                const action =
                    button.textContent.trim();


                console.log(
                    role + " - " + action
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