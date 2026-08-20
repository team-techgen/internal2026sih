/* =========================
   INSTITUTE REGISTRATION
========================= */


/* =========================
   SUPABASE CHECK
========================= */

if (typeof supabaseClient === "undefined") {

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


/* =========================
   CLEAR ERROR
========================= */

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

numericOnly(
    "instituteMobile"
);

numericOnly(
    "emailOtp"
);

numericOnly(
    "mobileOtp"
);


/* =========================
   CAPTCHA
========================= */

/*
   Allowed CAPTCHA characters:

   Uppercase:
   A B D E F G H M N P Q R T

   Lowercase:
   a b d e f g h m n p q r t

   Numbers:
   0-9

   Symbols:
   @ #
*/

const CAPTCHA_CHARACTERS =
    "ABDEFGHMNPQRTabdefghmnpqrt0123456789@#";


let currentCaptcha = "";


/* =========================
   GENERATE CAPTCHA
========================= */

function generateCaptcha() {

    let newCaptcha = "";


    /*
       Generate a new
       6-character CAPTCHA.
    */

    do {

        newCaptcha = "";


        for (
            let i = 0;
            i < 6;
            i++
        ) {

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

    }
    while (
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
        function () {

            generateCaptcha();

        }
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
    function (
        box,
        index
    ) {


        /* =====================
           OTP INPUT
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


                const clipboard =
                    event.clipboardData ||
                    window.clipboardData;


                if (!clipboard) {

                    return;

                }


                const pasted =
                    clipboard
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


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email
                )
            ) {

                showError(
                    "instituteEmail",
                    "emailError",
                    "Please enter a valid email address."
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


            /*
               EMAIL OTP BACKEND
               WILL BE CONNECTED LATER.
            */

            alert(
                "Email OTP functionality will be connected later."
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
               Mobile number
               is optional.
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


            /*
               MOBILE OTP BACKEND
               WILL BE CONNECTED LATER.
            */

            alert(
                "Mobile OTP functionality will be connected later."
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

            }
            else {

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

            }
            else {

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

            }
            else {

                clearError(
                    "instituteName",
                    "instituteNameError"
                );

            }


            /* =====================
               INSTITUTE ADDRESS
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

            }
            else {

                clearError(
                    "instituteAddress",
                    "instituteAddressError"
                );

            }


            /* =====================
               INSTITUTE EMAIL
            ===================== */

            const instituteEmail =
                document.getElementById(
                    "instituteEmail"
                ).value.trim();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!instituteEmail) {

                showError(
                    "instituteEmail",
                    "emailError",
                    "Please enter the institute email address."
                );


                isValid = false;

            }
            else if (
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

            }
            else {

                clearError(
                    "instituteEmail",
                    "emailError"
                );

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

            }
            else {

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
                !authorizationDocument ||
                authorizationDocument.files.length === 0
            ) {

                showError(
                    "authorizationDocument",
                    "authorizationError",
                    "Please upload the approval or authorization document."
                );


                isValid = false;

            }
            else {

                clearError(
                    "authorizationDocument",
                    "authorizationError"
                );


                /*
                   Validate file type.
                */

                const file =
                    authorizationDocument
                        .files[0];


                const allowedTypes = [
                    "application/pdf",
                    "image/jpeg",
                    "image/png"
                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    showError(
                        "authorizationDocument",
                        "authorizationError",
                        "Only PDF, JPG or PNG files are allowed."
                    );


                    isValid = false;

                }


                /*
                   Maximum file size:
                   5 MB
                */

                const maxFileSize =
                    5 * 1024 * 1024;


                if (
                    file.size >
                    maxFileSize
                ) {

                    showError(
                        "authorizationDocument",
                        "authorizationError",
                        "File size must be 5 MB or less."
                    );


                    isValid = false;

                }

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

            }
            else {

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
               only if mobile number
               is provided.
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

                }
                else {

                    clearError(
                        "mobileOtp",
                        "mobileOtpError"
                    );

                }

            }
            else {

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

            }
            else if (
                captchaInput !==
                currentCaptcha
            ) {

                showError(
                    "captchaInput",
                    "captchaError",
                    "Incorrect CAPTCHA. Please try again."
                );


                isValid = false;

            }
            else {

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


            /* =====================
               SUPABASE CHECK
            ===================== */

            if (
                typeof supabaseClient ===
                "undefined" ||
                !supabaseClient
            ) {

                alert(
                    "Supabase is not initialized. Please check your Supabase configuration."
                );


                console.error(
                    "❌ supabaseClient is undefined."
                );


                return;

            }


            /* =====================
               SUBMIT BUTTON
            ===================== */

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
                                   Storage upload will be
                                   connected next.

                                   For now the document
                                   path is NULL.
                                */

                                authorization_document_path:
                                    null,

                                /*
                                   Your database already
                                   has:

                                   status = 'pending'
                                */

                            }
                        ]);


                /* =========================
                   DATABASE ERROR
                ========================= */

                if (error) {

                    console.error(
                        "❌ Supabase insert error:",
                        error
                    );


                    /* =====================
                       DUPLICATE USER ID
                    ===================== */

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


                        return;

                    }


                    /* =====================
                       RLS ERROR
                    ===================== */

                    if (
                        error.code ===
                        "42501"
                    ) {

                        alert(
                            "Registration failed.\n\n" +
                            "Supabase Row Level Security is blocking this registration.\n\n" +
                            "Please check the INSERT policy for the institutes table."
                        );


                        return;

                    }


                    /* =====================
                       GENERAL DATABASE ERROR
                    ===================== */

                    alert(
                        "Registration failed.\n\n" +
                        error.message
                    );


                    return;

                }


                /* =========================
                   SUCCESS
                ========================= */

                console.log(
                    "✅ Institute registration submitted successfully."
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


                        box.classList.remove(
                            "input-valid"
                        );

                    }
                );


                /* =========================
                   CLEAR ERRORS
                ========================= */

                const errorElements =
                    document.querySelectorAll(
                        ".input-error"
                    );


                errorElements.forEach(
                    function (error) {

                        error.textContent =
                            "";

                    }
                );


            }
            catch (error) {

                console.error(
                    "❌ Unexpected registration error:",
                    error
                );


                alert(
                    "Something went wrong while submitting the registration."
                );

            }
            finally {

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


/* =========================
   DEBUG MESSAGE
========================= */

console.log(
    "✅ Institute registration JavaScript loaded."
);