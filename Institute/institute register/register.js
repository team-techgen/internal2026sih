/* =========================
   INSTITUTE REGISTRATION
========================= */


/* =========================
   SUPABASE CHECK
========================= */

console.log(
    "Supabase client:",
    supabaseClient
);


if (!supabaseClient) {

    console.error(
        "❌ Supabase client is not available."
    );

}


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

        error.textContent =
            message;

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
   NUMERIC ONLY
========================= */

function numericOnly(inputId) {

    const input =
        document.getElementById(inputId);


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );

}


/* =========================
   NUMERIC INPUTS
========================= */

numericOnly("instituteMobile");

numericOnly("emailOtp");

numericOnly("mobileOtp");


/* =========================
   CAPTCHA
========================= */

const CAPTCHA_CHARACTERS =
    "ABDEFGHMNPQRTabdefghmnpqrt0123456789@#";


let currentCaptcha = "";


/* =========================
   GENERATE CAPTCHA
========================= */

function generateCaptcha() {

    let newCaptcha = "";


    do {

        newCaptcha = "";


        /*
           Generate 6 characters

           Allowed:
           Selected uppercase letters
           Selected lowercase letters
           0-9
           @
           #
        */

        for (let i = 0; i < 6; i++) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    CAPTCHA_CHARACTERS.length
                );


            newCaptcha +=
                CAPTCHA_CHARACTERS[
                    randomIndex
                ];

        }

    } while (
        newCaptcha === currentCaptcha
    );


    currentCaptcha =
        newCaptcha;


    const captchaCode =
        document.getElementById(
            "captchaCode"
        );


    if (captchaCode) {

        captchaCode.textContent =
            currentCaptcha;

    }


    const captchaInput =
        document.getElementById(
            "captchaInput"
        );


    if (captchaInput) {

        captchaInput.value = "";

    }


    clearError(
        "captchaInput",
        "captchaError"
    );

}


/* =========================
   CAPTCHA REFRESH
========================= */

const refreshCaptcha =
    document.getElementById(
        "refreshCaptcha"
    );


if (refreshCaptcha) {

    refreshCaptcha.addEventListener(
        "click",
        generateCaptcha
    );

}


/* =========================
   INITIAL CAPTCHA
========================= */

generateCaptcha();


/* =========================
   OTP INPUTS
========================= */

const otpBoxes =
    document.querySelectorAll(
        ".otp-box"
    );


otpBoxes.forEach(
    function (box, index) {


        /* =====================
           INPUT
        ===================== */

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
                    index <
                    otpBoxes.length - 1
                ) {

                    otpBoxes[
                        index + 1
                    ].focus();

                }

            }
        );


        /* =====================
           BACKSPACE
        ===================== */

        box.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Backspace" &&
                    !this.value &&
                    index > 0
                ) {

                    otpBoxes[
                        index - 1
                    ].focus();

                }

            }
        );


        /* =====================
           PASTE OTP
        ===================== */

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


                if (
                    pasted.length > 0
                ) {

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
   EMAIL OTP
========================= */

const sendEmailOtpBtn =
    document.getElementById(
        "sendEmailOtp"
    );


if (sendEmailOtpBtn) {

    sendEmailOtpBtn.addEventListener(
        "click",
        function () {

            const email =
                document.getElementById(
                    "instituteEmail"
                ).value.trim();


            if (!email) {

                showError(
                    "instituteEmail",
                    "emailError",
                    "Please enter the institute email address."
                );

                document.getElementById(
                    "instituteEmail"
                ).focus();

                return;

            }


            clearError(
                "instituteEmail",
                "emailError"
            );


            alert(
                "Email OTP functionality will be added later."
            );

        }
    );

}


/* =========================
   MOBILE OTP
========================= */

const sendMobileOtpBtn =
    document.getElementById(
        "sendMobileOtp"
    );


if (sendMobileOtpBtn) {

    sendMobileOtpBtn.addEventListener(
        "click",
        function () {

            const mobile =
                document.getElementById(
                    "instituteMobile"
                ).value.trim();


            /*
               Mobile number is optional.
            */

            if (!mobile) {

                alert(
                    "Mobile number is optional. Please enter a mobile number to receive Mobile OTP."
                );

                return;

            }


            if (
                mobile.length !== 10
            ) {

                showError(
                    "instituteMobile",
                    "mobileError",
                    "Please enter a valid 10-digit mobile number."
                );

                document.getElementById(
                    "instituteMobile"
                ).focus();

                return;

            }


            clearError(
                "instituteMobile",
                "mobileError"
            );


            alert(
                "Mobile OTP functionality will be added later."
            );

        }
    );

}


/* =========================
   REGISTRATION FORM
========================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            let isValid = true;


            /* =====================
               USER ID
            ===================== */

            const userId =
                document.getElementById(
                    "userId"
                ).value.trim();


            if (!userId) {

                showError(
                    "userId",
                    "userIdError",
                    "Please enter a User ID."
                );

                isValid = false;

            } else {

                clearError(
                    "userId",
                    "userIdError"
                );

            }


            /* =====================
               INSTITUTE TYPE
            ===================== */

            const instituteType =
                document.getElementById(
                    "instituteType"
                ).value;


            if (!instituteType) {

                showError(
                    "instituteType",
                    "instituteTypeError",
                    "Please select an institute type."
                );

                isValid = false;

            } else {

                clearError(
                    "instituteType",
                    "instituteTypeError"
                );

            }


            /* =====================
               INSTITUTE NAME
            ===================== */

            const instituteName =
                document.getElementById(
                    "instituteName"
                ).value.trim();


            if (!instituteName) {

                showError(
                    "instituteName",
                    "instituteNameError",
                    "Please enter the institute name."
                );

                isValid = false;

            } else {

                clearError(
                    "instituteName",
                    "instituteNameError"
                );

            }


            /* =====================
               ADDRESS
            ===================== */

            const instituteAddress =
                document.getElementById(
                    "instituteAddress"
                ).value.trim();


            if (!instituteAddress) {

                showError(
                    "instituteAddress",
                    "instituteAddressError",
                    "Please enter the institute address."
                );

                isValid = false;

            } else {

                clearError(
                    "instituteAddress",
                    "instituteAddressError"
                );

            }


            /* =====================
               EMAIL
            ===================== */

            const instituteEmail =
                document.getElementById(
                    "instituteEmail"
                ).value.trim();


            if (!instituteEmail) {

                showError(
                    "instituteEmail",
                    "emailError",
                    "Please enter the institute email address."
                );

                isValid = false;

            } else {

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        instituteEmail
                    )
                ) {

                    showError(
                        "instituteEmail",
                        "emailError",
                        "Please enter a valid email address."
                    );

                    isValid = false;

                } else {

                    clearError(
                        "instituteEmail",
                        "emailError"
                    );

                }

            }


            /* =====================
               MOBILE
               OPTIONAL
            ===================== */

            const instituteMobile =
                document.getElementById(
                    "instituteMobile"
                ).value.trim();


            if (
                instituteMobile &&
                instituteMobile.length !== 10
            ) {

                showError(
                    "instituteMobile",
                    "mobileError",
                    "Please enter a valid 10-digit mobile number."
                );

                isValid = false;

            } else {

                clearError(
                    "instituteMobile",
                    "mobileError"
                );

            }


            /* =====================
               AUTHORIZATION DOCUMENT
            ===================== */

            const authorizationDocument =
                document.getElementById(
                    "authorizationDocument"
                );


            if (
                authorizationDocument &&
                authorizationDocument.files.length === 0
            ) {

                showError(
                    "authorizationDocument",
                    "authorizationError",
                    "Please upload the approval or authorization document."
                );

                isValid = false;

            } else {

                clearError(
                    "authorizationDocument",
                    "authorizationError"
                );

            }


            /* =====================
               EMAIL OTP
            ===================== */

            const emailOtp =
                document.getElementById(
                    "emailOtp"
                ).value.trim();


            if (
                emailOtp.length !== 6
            ) {

                showError(
                    "emailOtp",
                    "emailOtpError",
                    "Please enter the complete 6-digit email OTP."
                );

                isValid = false;

            } else {

                clearError(
                    "emailOtp",
                    "emailOtpError"
                );

            }


            /* =====================
               MOBILE OTP
            ===================== */

            const mobileOtp =
                document.getElementById(
                    "mobileOtp"
                ).value.trim();


            /*
               Mobile OTP is required
               only when mobile is provided.
            */

            if (instituteMobile) {

                if (
                    mobileOtp.length !== 6
                ) {

                    showError(
                        "mobileOtp",
                        "mobileOtpError",
                        "Please enter the complete 6-digit mobile OTP."
                    );

                    isValid = false;

                } else {

                    clearError(
                        "mobileOtp",
                        "mobileOtpError"
                    );

                }

            } else {

                clearError(
                    "mobileOtp",
                    "mobileOtpError"
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
               STOP IF INVALID
            ===================== */

            if (!isValid) {

                return;

            }


            /* =========================
               SUPABASE CHECK
            ========================= */

            if (!supabaseClient) {

                alert(
                    "Supabase is not initialized. Please check your Supabase configuration."
                );

                console.error(
                    "❌ supabaseClient is undefined."
                );

                return;

            }


            /* =========================
               DISABLE SUBMIT BUTTON
            ========================= */

            const submitButton =
                registerForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";

            }


            try {

                /* =========================
                   DATABASE INSERT
                ========================= */

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("institutes")
                        .insert([
                            {
                                user_id:
                                    userId,

                                institute_type:
                                    instituteType,

                                institute_name:
                                    instituteName,

                                institute_address:
                                    instituteAddress,

                                institute_email:
                                    instituteEmail,

                                institute_mobile:
                                    instituteMobile ||
                                    null,

                                /*
                                   File upload will be
                                   connected to Supabase
                                   Storage next.

                                   Therefore this remains
                                   NULL for now.
                                */

                                authorization_document_path:
                                    null,

                                /*
                                   Supabase table already
                                   has default:
                                   status = 'pending'
                                */

                            }
                        ])
                        .select();


                /* =========================
                   DATABASE ERROR
                ========================= */

                if (error) {

                    console.error(
                        "❌ Supabase insert error:",
                        error
                    );


                    /*
                       Duplicate User ID
                    */

                    if (
                        error.code ===
                        "23505"
                    ) {

                        showError(
                            "userId",
                            "userIdError",
                            "This User ID already exists. Please choose another."
                        );

                        document.getElementById(
                            "userId"
                        ).focus();

                    } else {

                        alert(
                            "Registration failed.\n\n" +
                            error.message
                        );

                    }


                    return;

                }


                /* =========================
                   SUCCESS
                ========================= */

                console.log(
                    "✅ Institute registered:",
                    data
                );


                alert(
                    "Institute registration request submitted successfully.\n\n" +
                    "Your request is currently pending approval."
                );


                /* =========================
                   RESET FORM
                ========================= */

                registerForm.reset();


                /* =========================
                   NEW CAPTCHA
                ========================= */

                generateCaptcha();


                /* =========================
                   CLEAR OTP BOXES
                ========================= */

                otpBoxes.forEach(
                    function (box) {

                        box.value = "";

                        box.classList.remove(
                            "input-invalid"
                        );

                    }
                );


            } catch (error) {

                console.error(
                    "❌ Unexpected registration error:",
                    error
                );


                alert(
                    "Something went wrong while submitting the registration."
                );

            } finally {

                /* =========================
                   ENABLE SUBMIT BUTTON
                ========================= */

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Registration Request";

                }

            }

        }
    );

}


/* =========================
   LOGIN REDIRECTION
========================= */

const loginLink =
    document.getElementById(
        "loginLink"
    );


if (loginLink) {

    loginLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            window.location.href =
                "../institute login/login.html";

        }
    );

}