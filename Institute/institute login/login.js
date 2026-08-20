/* =========================
   INSTITUTE LOGIN
========================= */


/* =========================
   CAPTCHA
========================= */

/*
   Allowed characters:

   ABDEFGHMNPQRT
   abdefghmnpqrt
   1234567890

   Repeated characters are allowed.

   The same CAPTCHA will not be
   generated twice consecutively.
*/

const CAPTCHA_CHARACTERS =
    "ABDEFGHMNPQRTabdefghmnpqrt1234567890";


let currentCaptcha = "";


function generateCaptcha() {

    let newCaptcha = "";

    do {

        newCaptcha = "";

        for (let i = 0; i < 5; i++) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    CAPTCHA_CHARACTERS.length
                );

            newCaptcha +=
                CAPTCHA_CHARACTERS[randomIndex];

        }

    } while (
        newCaptcha === currentCaptcha
    );


    currentCaptcha = newCaptcha;

    document.getElementById(
        "captchaCode"
    ).textContent = currentCaptcha;


    document.getElementById(
        "captchaInput"
    ).value = "";


    clearError(
        "captchaInput",
        "captchaError"
    );
}


/* =========================
   CAPTCHA REFRESH
========================= */

document.getElementById(
    "refreshCaptcha"
).addEventListener(
    "click",
    generateCaptcha
);


/* Generate CAPTCHA when page loads */

generateCaptcha();



/* =========================
   ERROR FUNCTIONS
========================= */

function showError(
    inputId,
    errorId,
    message
) {

    const input =
        document.getElementById(inputId);

    const error =
        document.getElementById(errorId);


    if (input) {

        input.classList.add(
            "input-invalid"
        );

        input.classList.remove(
            "input-valid"
        );

    }


    if (error) {

        error.textContent = message;

    }

}


function clearError(
    inputId,
    errorId
) {

    const input =
        document.getElementById(inputId);

    const error =
        document.getElementById(errorId);


    if (input) {

        input.classList.remove(
            "input-invalid"
        );

    }


    if (error) {

        error.textContent = "";

    }

}


/* =========================
   OTP BOXES
========================= */

const otpBoxes =
    document.querySelectorAll(
        ".otp-box"
    );


otpBoxes.forEach(
    (box, index) => {


        /* Only numbers */

        box.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^0-9]/g,
                        ""
                    );


                if (
                    this.value &&
                    index < otpBoxes.length - 1
                ) {

                    otpBoxes[
                        index + 1
                    ].focus();

                }

            }
        );


        /* Backspace */

        box.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Backspace" &&
                    !this.value &&
                    index > 0
                ) {

                    otpBoxes[
                        index - 1
                    ].focus();

                }

            }
        );


        /* Paste 6 digit OTP */

        box.addEventListener(
            "paste",
            function (event) {

                event.preventDefault();


                const pasted =
                    (
                        event.clipboardData ||
                        window.clipboardData
                    )
                    .getData("text")
                    .replace(
                        /[^0-9]/g,
                        ""
                    )
                    .slice(0, 6);


                for (
                    let i = 0;
                    i < pasted.length &&
                    i < otpBoxes.length;
                    i++
                ) {

                    otpBoxes[i].value =
                        pasted[i];

                }


                if (pasted.length > 0) {

                    const nextIndex =
                        Math.min(
                            pasted.length,
                            otpBoxes.length - 1
                        );


                    otpBoxes[
                        nextIndex
                    ].focus();

                }

            }
        );

    }
);



/* =========================
   SEND OTP
========================= */

document.getElementById(
    "sendOtpBtn"
).addEventListener(
    "click",
    function () {

        const username =
            document.getElementById(
                "username"
            ).value.trim();


        if (!username) {

            showError(
                "username",
                "usernameError",
                "Please enter your username, institute ID or email."
            );

            document.getElementById(
                "username"
            ).focus();

            return;

        }


        /* Currently non-functional */

        alert(
            "OTP functionality will be added later."
        );

    }
);



/* =========================
   LOGIN VALIDATION
========================= */

document.getElementById(
    "loginForm"
).addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        let isValid = true;


        /* =====================
           USERNAME
        ===================== */

        const username =
            document.getElementById(
                "username"
            ).value.trim();


        if (!username) {

            showError(
                "username",
                "usernameError",
                "Please enter your username, institute ID or email."
            );

            isValid = false;

        } else {

            clearError(
                "username",
                "usernameError"
            );

        }



        /* =====================
           PASSWORD
        ===================== */

        const password =
            document.getElementById(
                "password"
            ).value;


        if (!password) {

            showError(
                "password",
                "passwordError",
                "Please enter your password."
            );

            isValid = false;

        } else {

            clearError(
                "password",
                "passwordError"
            );

        }



        /* =====================
           CAPTCHA
        ===================== */

        const captchaInput =
            document.getElementById(
                "captchaInput"
            ).value.trim();


        if (!captchaInput) {

            showError(
                "captchaInput",
                "captchaError",
                "Please enter the CAPTCHA."
            );

            isValid = false;

        } else if (
            captchaInput !== currentCaptcha
        ) {

            showError(
                "captchaInput",
                "captchaError",
                "Incorrect CAPTCHA. Please try again."
            );

            isValid = false;

        } else {

            clearError(
                "captchaInput",
                "captchaError"
            );

        }



        /* =====================
           OTP
        ===================== */

        let otp = "";


        otpBoxes.forEach(
            box => {
                otp += box.value;
            }
        );


        if (otp.length !== 6) {

            otpBoxes.forEach(
                box => {

                    box.classList.add(
                        "input-invalid"
                    );

                }
            );


            document.getElementById(
                "otpError"
            ).textContent =
                "Please enter the complete 6-digit OTP.";


            isValid = false;

        } else {

            otpBoxes.forEach(
                box => {

                    box.classList.remove(
                        "input-invalid"
                    );

                }
            );


            document.getElementById(
                "otpError"
            ).textContent = "";

        }



        /* =====================
           FINAL RESULT
        ===================== */

        if (!isValid) {

            return;

        }


        /*
         * Authentication will be
         * connected to backend later.
         */

        alert(
            "Login functionality will be connected later."
        );

    }
);



/* =========================
   FORGOT CREDENTIAL
========================= */

document.getElementById(
    "forgotCredentialBtn"
).addEventListener(
    "click",
    function () {

        alert(
            "Forgot credential functionality will be added later."
        );

    }
);



/* =========================
   REGISTER BUTTON
========================= */

document.getElementById(
    "registerBtn"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "../institute%20register/register.html";

    }
);