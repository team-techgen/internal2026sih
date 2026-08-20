/* =====================================================
   INSTITUTE REGISTRATION
   BREVO EMAIL OTP + REAL SUPABASE USER VERSION
===================================================== */


/* =====================================================
   SUPABASE CHECK
===================================================== */

if (
    typeof supabaseClient === "undefined" ||
    !supabaseClient
) {
    console.error(
        "❌ Supabase client is not available."
    );
}


/* =====================================================
   EDGE FUNCTIONS
===================================================== */

const OTP_FUNCTION_NAME =
    "send-otp";

const REGISTRATION_FUNCTION_NAME =
    "register-institute";


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentCaptcha = "";

let emailOtpVerified = false;

let currentOtp = "";

let lastOtpEmail = "";

let otpTimerInterval = null;

let otpSeconds = 0;


/* =====================================================
   ERROR FUNCTIONS
===================================================== */

function showError(
    inputId,
    errorId,
    message
) {

    const input =
        document.getElementById(
            inputId
        );

    const error =
        document.getElementById(
            errorId
        );


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


/* =====================================================
   CLEAR ERROR
===================================================== */

function clearError(
    inputId,
    errorId
) {

    const input =
        document.getElementById(
            inputId
        );

    const error =
        document.getElementById(
            errorId
        );


    if (input) {

        input.classList.remove(
            "input-invalid"
        );
    }


    if (error) {

        error.textContent =
            "";
    }
}


/* =====================================================
   NUMERIC ONLY
===================================================== */

function numericOnly(
    inputId
) {

    const input =
        document.getElementById(
            inputId
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(
                        /[^0-9]/g,
                        ""
                    );
        }
    );
}


numericOnly(
    "instituteMobile"
);

numericOnly(
    "emailOtp"
);


/* =====================================================
   CAPTCHA
===================================================== */

const CAPTCHA_CHARACTERS =
    "ABDEFGHMNPQRTabdefghmnpqrt0123456789@#";


/* =====================================================
   GENERATE CAPTCHA
===================================================== */

function generateCaptcha() {

    let newCaptcha = "";


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
        newCaptcha ===
        currentCaptcha
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

        captchaInput.value =
            "";
    }


    clearError(
        "captchaInput",
        "captchaError"
    );
}


/* =====================================================
   CAPTCHA REFRESH
===================================================== */

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


/* =====================================================
   INITIAL CAPTCHA
===================================================== */

generateCaptcha();


/* =====================================================
   OTP TIMER
===================================================== */

function startOtpTimer() {

    clearInterval(
        otpTimerInterval
    );


    otpSeconds =
        30;


    const timer =
        document.getElementById(
            "otpTimer"
        );


    const resendButton =
        document.getElementById(
            "resendOtpBtn"
        );


    const sendButton =
        document.getElementById(
            "sendEmailOtp"
        );


    if (!timer) {
        return;
    }


    /* -----------------------------------------------
       SEND BUTTON
    ------------------------------------------------ */

    if (sendButton) {

        sendButton.disabled =
            true;

        sendButton.textContent =
            "OTP Sent";
    }


    /* -----------------------------------------------
       RESEND BUTTON
    ------------------------------------------------ */

    if (resendButton) {

        resendButton.disabled =
            true;
    }


    timer.textContent =
        "Resend OTP in 30s";


    /* -----------------------------------------------
       TIMER
    ------------------------------------------------ */

    otpTimerInterval =
        setInterval(
            function () {

                otpSeconds--;


                if (
                    otpSeconds > 0
                ) {

                    timer.textContent =
                        "Resend OTP in " +
                        otpSeconds +
                        "s";

                    return;
                }


                clearInterval(
                    otpTimerInterval
                );


                otpTimerInterval =
                    null;


                timer.textContent =
                    "You can request a new OTP";


                /* -----------------------------------
                   ENABLE SEND
                ----------------------------------- */

                if (sendButton) {

                    sendButton.disabled =
                        false;

                    sendButton.textContent =
                        "Send OTP";
                }


                /* -----------------------------------
                   ENABLE RESEND
                ----------------------------------- */

                if (resendButton) {

                    resendButton.disabled =
                        false;
                }

            },
            1000
        );
}


/* =====================================================
   SEND OTP USING BREVO
===================================================== */

async function sendEmailOTP() {

    const emailInput =
        document.getElementById(
            "instituteEmail"
        );


    const sendButton =
        document.getElementById(
            "sendEmailOtp"
        );


    if (!emailInput) {

        return false;
    }


    const email =
        emailInput.value
            .trim()
            .toLowerCase();


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    /* =================================================
       CHECK COOLDOWN
    ================================================= */

    if (
        otpSeconds > 0
    ) {

        return false;
    }


    /* =================================================
       EMAIL REQUIRED
    ================================================= */

    if (!email) {

        showError(
            "instituteEmail",
            "instituteEmailError",
            "Please enter the institute email address."
        );


        emailInput.focus();


        return false;
    }


    /* =================================================
       EMAIL FORMAT
    ================================================= */

    if (
        !emailPattern.test(
            email
        )
    ) {

        showError(
            "instituteEmail",
            "instituteEmailError",
            "Please enter a valid email address."
        );


        emailInput.focus();


        return false;
    }


    clearError(
        "instituteEmail",
        "instituteEmailError"
    );


    /* =================================================
       SUPABASE CHECK
    ================================================= */

    if (
        typeof supabaseClient ===
            "undefined" ||
        !supabaseClient
    ) {

        showError(
            "instituteEmail",
            "instituteEmailError",
            "OTP service is not available. Please try again."
        );


        console.error(
            "❌ Supabase is not initialized."
        );


        return false;
    }


    /* =================================================
       BUTTON
    ================================================= */

    if (sendButton) {

        sendButton.disabled =
            true;

        sendButton.textContent =
            "Sending...";
    }


    try {

        /* =================================================
           CALL BREVO EDGE FUNCTION
        ================================================= */

        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    OTP_FUNCTION_NAME,
                    {
                        body: {
                            email: email
                        }
                    }
                );


        /* =================================================
           EDGE FUNCTION ERROR
        ================================================= */

        if (error) {

            console.error(
                "❌ Edge Function error:",
                error
            );


            throw new Error(
                error.message ||
                "Unable to contact OTP service."
            );
        }


        /* =================================================
           FUNCTION RESPONSE
        ================================================= */

        console.log(
            "OTP function response:",
            data
        );


        if (
            !data ||
            data.success !== true
        ) {

            throw new Error(
                data?.message ||
                "OTP could not be sent."
            );
        }


        /* =================================================
           STORE OTP

           TEMPORARY TEST VERSION

           send-otp currently returns:

           {
               success: true,
               otp: "123456"
           }

           This allows browser-side OTP verification.
        ================================================= */

        currentOtp =
            String(
                data.otp || ""
            );


        if (
            currentOtp.length !== 6
        ) {

            throw new Error(
                "OTP was not returned by the server."
            );
        }


        /* =================================================
           STORE EMAIL
        ================================================= */

        lastOtpEmail =
            email;


        emailOtpVerified =
            false;


        /* =================================================
           RESET OTP INPUT
        ================================================= */

        const otpInput =
            document.getElementById(
                "emailOtp"
            );


        if (otpInput) {

            otpInput.value =
                "";

            otpInput.classList.remove(
                "input-valid"
            );

            otpInput.focus();
        }


        clearError(
            "emailOtp",
            "emailOtpError"
        );


        /* =================================================
           START TIMER
        ================================================= */

        startOtpTimer();


        /* =================================================
           SUCCESS

           NO POPUP
        ================================================= */

        console.log(
            "✅ Brevo OTP sent successfully."
        );


        return true;

    }
    catch (error) {

        console.error(
            "❌ OTP sending error:",
            error
        );


        showError(
            "emailOtp",
            "emailOtpError",
            error.message ||
            "Unable to send OTP. Please try again."
        );


        if (sendButton) {

            sendButton.disabled =
                false;

            sendButton.textContent =
                "Send OTP";
        }


        return false;
    }
}


/* =====================================================
   SEND OTP BUTTON
===================================================== */

const sendEmailOtpBtn =
    document.getElementById(
        "sendEmailOtp"
    );


if (sendEmailOtpBtn) {

    sendEmailOtpBtn.addEventListener(
        "click",
        async function () {

            await sendEmailOTP();

        }
    );
}


/* =====================================================
   RESEND OTP
===================================================== */

const resendOtpBtn =
    document.getElementById(
        "resendOtpBtn"
    );


if (resendOtpBtn) {

    resendOtpBtn.addEventListener(
        "click",
        async function () {


            if (
                otpSeconds > 0
            ) {

                return;
            }


            const emailInput =
                document.getElementById(
                    "instituteEmail"
                );


            if (!emailInput) {

                return;
            }


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            if (!email) {

                showError(
                    "instituteEmail",
                    "instituteEmailError",
                    "Please enter the institute email address."
                );


                return;
            }


            await sendEmailOTP();

        }
    );
}


/* =====================================================
   VERIFY BREVO OTP
===================================================== */

async function verifyEmailOtp() {

    const emailInput =
        document.getElementById(
            "instituteEmail"
        );


    const otpInput =
        document.getElementById(
            "emailOtp"
        );


    if (
        !emailInput ||
        !otpInput
    ) {

        return false;
    }


    const email =
        emailInput.value
            .trim()
            .toLowerCase();


    const otp =
        otpInput.value
            .trim();


    /* =================================================
       EMAIL CHECK
    ================================================= */

    if (!email) {

        showError(
            "instituteEmail",
            "instituteEmailError",
            "Please enter the institute email address."
        );


        return false;
    }


    /* =================================================
       OTP SENT CHECK
    ================================================= */

    if (
        !lastOtpEmail ||
        lastOtpEmail !== email
    ) {

        showError(
            "emailOtp",
            "emailOtpError",
            "Please send a new OTP for this email address."
        );


        emailOtpVerified =
            false;


        return false;
    }


    /* =================================================
       OTP LENGTH
    ================================================= */

    if (
        !/^\d{6}$/.test(
            otp
        )
    ) {

        showError(
            "emailOtp",
            "emailOtpError",
            "Please enter the complete 6-digit OTP."
        );


        emailOtpVerified =
            false;


        return false;
    }


    /* =================================================
       OTP COMPARISON
    ================================================= */

    if (
        otp !== currentOtp
    ) {

        showError(
            "emailOtp",
            "emailOtpError",
            "Incorrect OTP. Please check the email and try again."
        );


        emailOtpVerified =
            false;


        return false;
    }


    /* =================================================
       SUCCESS
    ================================================= */

    emailOtpVerified =
        true;


    clearError(
        "emailOtp",
        "emailOtpError"
    );


    otpInput.classList.add(
        "input-valid"
    );


    const timer =
        document.getElementById(
            "otpTimer"
        );


    if (timer) {

        timer.textContent =
            "Email verified successfully";
    }


    if (resendOtpBtn) {

        resendOtpBtn.disabled =
            true;
    }


    if (sendEmailOtpBtn) {

        sendEmailOtpBtn.disabled =
            true;

        sendEmailOtpBtn.textContent =
            "Verified";
    }


    clearInterval(
        otpTimerInterval
    );


    otpTimerInterval =
        null;


    otpSeconds =
        0;


    console.log(
        "✅ Brevo Email OTP verified."
    );


    return true;
}


/* =====================================================
   OTP INPUT
===================================================== */

const emailOtpInput =
    document.getElementById(
        "emailOtp"
    );


if (emailOtpInput) {

    emailOtpInput.addEventListener(
        "input",
        async function () {

            this.value =
                this.value
                    .replace(
                        /[^0-9]/g,
                        ""
                    )
                    .slice(
                        0,
                        6
                    );


            clearError(
                "emailOtp",
                "emailOtpError"
            );


            /* -----------------------------------------
               AUTOMATIC VERIFICATION
            ----------------------------------------- */

            if (
                this.value.length === 6
            ) {

                await verifyEmailOtp();
            }

        }
    );
}


/* =====================================================
   RESET OTP WHEN EMAIL CHANGES
===================================================== */

const instituteEmailInput =
    document.getElementById(
        "instituteEmail"
    );


if (instituteEmailInput) {

    instituteEmailInput.addEventListener(
        "input",
        function () {

            const currentEmail =
                this.value
                    .trim()
                    .toLowerCase();


            /*
             * If the user changes the email,
             * the previous OTP is no longer valid.
             */

            if (
                currentEmail !==
                lastOtpEmail
            ) {

                emailOtpVerified =
                    false;

                currentOtp =
                    "";

                lastOtpEmail =
                    "";


                const otpInput =
                    document.getElementById(
                        "emailOtp"
                    );


                if (otpInput) {

                    otpInput.value =
                        "";

                    otpInput.classList.remove(
                        "input-valid"
                    );
                }


                clearError(
                    "emailOtp",
                    "emailOtpError"
                );


                const timer =
                    document.getElementById(
                        "otpTimer"
                    );


                if (timer) {

                    timer.textContent =
                        "Send OTP to verify email";
                }


                if (sendEmailOtpBtn) {

                    sendEmailOtpBtn.disabled =
                        false;

                    sendEmailOtpBtn.textContent =
                        "Send OTP";
                }


                if (resendOtpBtn) {

                    resendOtpBtn.disabled =
                        true;
                }


                clearInterval(
                    otpTimerInterval
                );


                otpTimerInterval =
                    null;


                otpSeconds =
                    0;
            }

        }
    );
}


/* =====================================================
   REGISTRATION FORM
===================================================== */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            let isValid =
                true;


            /* =================================================
               USER ID
            ================================================= */

            const userId =
                document
                    .getElementById(
                        "userId"
                    )
                    .value
                    .trim();


            if (!userId) {

                showError(
                    "userId",
                    "userIdError",
                    "Please enter a User ID."
                );


                isValid =
                    false;

            }
            else {

                clearError(
                    "userId",
                    "userIdError"
                );
            }


            /* =================================================
               INSTITUTE TYPE
            ================================================= */

            const instituteType =
                document
                    .getElementById(
                        "instituteType"
                    )
                    .value;


            if (!instituteType) {

                showError(
                    "instituteType",
                    "instituteTypeError",
                    "Please select an institute type."
                );


                isValid =
                    false;

            }
            else {

                clearError(
                    "instituteType",
                    "instituteTypeError"
                );
            }


            /* =================================================
               INSTITUTE NAME
            ================================================= */

            const instituteName =
                document
                    .getElementById(
                        "instituteName"
                    )
                    .value
                    .trim();


            if (!instituteName) {

                showError(
                    "instituteName",
                    "instituteNameError",
                    "Please enter the institute name."
                );


                isValid =
                    false;

            }
            else {

                clearError(
                    "instituteName",
                    "instituteNameError"
                );
            }


            /* =================================================
               INSTITUTE ADDRESS
            ================================================= */

            const instituteAddress =
                document
                    .getElementById(
                        "instituteAddress"
                    )
                    .value
                    .trim();


            if (!instituteAddress) {

                showError(
                    "instituteAddress",
                    "instituteAddressError",
                    "Please enter the institute address."
                );


                isValid =
                    false;

            }
            else {

                clearError(
                    "instituteAddress",
                    "instituteAddressError"
                );
            }


            /* =================================================
               INSTITUTE EMAIL
            ================================================= */

            const instituteEmail =
                document
                    .getElementById(
                        "instituteEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!instituteEmail) {

                showError(
                    "instituteEmail",
                    "instituteEmailError",
                    "Please enter the institute email address."
                );


                isValid =
                    false;

            }
            else if (
                !emailPattern.test(
                    instituteEmail
                )
            ) {

                showError(
                    "instituteEmail",
                    "instituteEmailError",
                    "Please enter a valid email address."
                );


                isValid =
                    false;

            }
            else {

                clearError(
                    "instituteEmail",
                    "instituteEmailError"
                );
            }


            /* =================================================
               MOBILE - OPTIONAL
            ================================================= */

            const instituteMobile =
                document
                    .getElementById(
                        "instituteMobile"
                    )
                    .value
                    .trim();


            if (
                instituteMobile &&
                instituteMobile.length !== 10
            ) {

                showError(
                    "instituteMobile",
                    "instituteMobileError",
                    "Please enter a valid 10-digit mobile number."
                );


                isValid =
                    false;

            }
            else {

                clearError(
                    "instituteMobile",
                    "instituteMobileError"
                );
            }


            /* =================================================
               HEAD NAME
            ================================================= */

            const headName =
                document
                    .getElementById(
                        "headName"
                    )
                    .value
                    .trim();


            if (!headName) {

                showError(
                    "headName",
                    "headNameError",
                    "Please enter the head / authorized person's name."
                );


                isValid =
                    false;

            }
            else {

                clearError(
                    "headName",
                    "headNameError"
                );
            }


            /* =================================================
               APPROVAL DOCUMENT - OPTIONAL
            ================================================= */

            const approvalDocument =
                document.getElementById(
                    "approvalDocument"
                );


            if (
                approvalDocument &&
                approvalDocument.files.length > 0
            ) {

                const file =
                    approvalDocument.files[0];


                const allowedTypes = [
                    "application/pdf",
                    "image/jpeg",
                    "image/png"
                ];


                /* -----------------------------------------
                   FILE TYPE
                ----------------------------------------- */

                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    showError(
                        "approvalDocument",
                        "approvalDocumentError",
                        "Only PDF, JPG or PNG files are allowed."
                    );


                    isValid =
                        false;

                }
                else {

                    clearError(
                        "approvalDocument",
                        "approvalDocumentError"
                    );
                }


                /* -----------------------------------------
                   FILE SIZE
                ----------------------------------------- */

                const maxFileSize =
                    5 *
                    1024 *
                    1024;


                if (
                    file.size >
                    maxFileSize
                ) {

                    showError(
                        "approvalDocument",
                        "approvalDocumentError",
                        "File size must be 5 MB or less."
                    );


                    isValid =
                        false;
                }

            }
            else {

                clearError(
                    "approvalDocument",
                    "approvalDocumentError"
                );
            }


            /* =================================================
               EMAIL OTP
            ================================================= */

            const emailOtp =
                document
                    .getElementById(
                        "emailOtp"
                    )
                    .value
                    .trim();


            if (
                !emailOtpVerified
            ) {

                if (
                    !emailOtp ||
                    emailOtp.length !== 6
                ) {

                    showError(
                        "emailOtp",
                        "emailOtpError",
                        "Please enter and verify the 6-digit Email OTP."
                    );

                }
                else {

                    showError(
                        "emailOtp",
                        "emailOtpError",
                        "Please verify the Email OTP."
                    );
                }


                isValid =
                    false;
            }


            /* =================================================
               CAPTCHA
            ================================================= */

            const captchaInput =
                document
                    .getElementById(
                        "captchaInput"
                    )
                    .value
                    .trim();


            if (!captchaInput) {

                showError(
                    "captchaInput",
                    "captchaError",
                    "Please enter the CAPTCHA."
                );


                isValid =
                    false;

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


                isValid =
                    false;

            }
            else {

                clearError(
                    "captchaInput",
                    "captchaError"
                );
            }


            /* =================================================
               TERMS
            ================================================= */

            const terms =
                document.getElementById(
                    "terms"
                );


            if (
                !terms ||
                !terms.checked
            ) {

                showError(
                    "terms",
                    "termsError",
                    "Please confirm that the information is accurate and that you are authorized to register this institute."
                );


                isValid =
                    false;

            }
            else {

                clearError(
                    "terms",
                    "termsError"
                );
            }


            /* =================================================
               STOP IF INVALID
            ================================================= */

            if (!isValid) {

                return;
            }


            /* =================================================
               SUPABASE CHECK
            ================================================= */

            if (
                typeof supabaseClient ===
                    "undefined" ||
                !supabaseClient
            ) {

                showRegistrationMessage(
                    "Supabase is not initialized. Please refresh the page and try again.",
                    true
                );


                return;
            }


            /* =================================================
               SUBMIT BUTTON
            ================================================= */

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

                /* =================================================
                   REAL SUPABASE REGISTRATION

                   IMPORTANT:

                   DO NOT CALL:

                   signInAnonymously()

                   The Edge Function now creates the
                   real Supabase Auth user securely.
                ================================================= */

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .functions
                        .invoke(
                            REGISTRATION_FUNCTION_NAME,
                            {
                                body: {

                                    userId:
                                        userId,

                                    instituteType:
                                        instituteType,

                                    instituteName:
                                        instituteName,

                                    instituteAddress:
                                        instituteAddress,

                                    instituteEmail:
                                        instituteEmail,

                                    instituteMobile:
                                        instituteMobile ||
                                        null,

                                    headName:
                                        headName

                                }
                            }
                        );


                /* =================================================
                   EDGE FUNCTION ERROR
                ================================================= */

                if (error) {

                    console.error(
                        "❌ Registration Edge Function error:",
                        error
                    );


                    throw new Error(
                        error.message ||
                        "Could not contact the registration service."
                    );
                }


                /* =================================================
                   SERVER RESPONSE
                ================================================= */

                console.log(
                    "Registration function response:",
                    data
                );


                if (
                    !data ||
                    data.success !== true
                ) {

                    throw new Error(
                        data?.message ||
                        "Could not create the Supabase user."
                    );
                }


                /* =================================================
                   REAL USER CREATED
                ================================================= */

                console.log(
                    "✅ Real Supabase user created:",
                    data.userId
                );


                console.log(
                    "✅ Institute registration created:",
                    data.instituteId
                );


                /* =================================================
                   SUCCESS MESSAGE
                ================================================= */

                showRegistrationMessage(
                    "Institute registration submitted successfully. Your request is currently pending approval.",
                    false
                );


                /* =================================================
                   STOP OTP TIMER
                ================================================= */

                clearInterval(
                    otpTimerInterval
                );


                otpTimerInterval =
                    null;


                /* =================================================
                   RESET FORM
                ================================================= */

                registerForm.reset();


                /* =================================================
                   RESET OTP STATE
                ================================================= */

                emailOtpVerified =
                    false;


                currentOtp =
                    "";


                lastOtpEmail =
                    "";


                otpSeconds =
                    0;


                /* =================================================
                   RESET OTP UI
                ================================================= */

                const timer =
                    document.getElementById(
                        "otpTimer"
                    );


                if (timer) {

                    timer.textContent =
                        "Send OTP to verify email";
                }


                if (sendEmailOtpBtn) {

                    sendEmailOtpBtn.disabled =
                        false;

                    sendEmailOtpBtn.textContent =
                        "Send OTP";
                }


                if (resendOtpBtn) {

                    resendOtpBtn.disabled =
                        true;

                    resendOtpBtn.textContent =
                        "Resend OTP";
                }


                /* =================================================
                   NEW CAPTCHA
                ================================================= */

                generateCaptcha();


                /* =================================================
                   CLEAR ERRORS
                ================================================= */

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
                    "❌ Registration error:",
                    error
                );


                /* =================================================
                   NO POPUP

                   SHOW ERROR ON PAGE
                ================================================= */

                showRegistrationMessage(
                    error.message ||
                    "Something went wrong while submitting the registration.",
                    true
                );

            }
            finally {

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


/* =====================================================
   REGISTRATION MESSAGE
   NO POPUP
===================================================== */

function showRegistrationMessage(
    message,
    isError
) {

    /*
     * Try to use an existing message element first.
     */

    let messageElement =
        document.getElementById(
            "registrationMessage"
        );


    /*
     * If the HTML does not already contain
     * registrationMessage, create it automatically.
     */

    if (!messageElement) {

        messageElement =
            document.createElement(
                "div"
            );


        messageElement.id =
            "registrationMessage";


        messageElement.style.width =
            "100%";


        messageElement.style.marginTop =
            "15px";


        messageElement.style.padding =
            "12px 16px";


        messageElement.style.borderRadius =
            "8px";


        messageElement.style.fontSize =
            "14px";


        messageElement.style.lineHeight =
            "1.5";


        const submitButton =
            registerForm
                ? registerForm.querySelector(
                    'button[type="submit"]'
                )
                : null;


        if (
            submitButton &&
            submitButton.parentNode
        ) {

            submitButton.parentNode.insertBefore(
                messageElement,
                submitButton
            );

        }
        else if (registerForm) {

            registerForm.appendChild(
                messageElement
            );

        }
    }


    if (!messageElement) {

        console.log(
            message
        );

        return;
    }


    messageElement.textContent =
        message;


    /*
     * Use classes so your CSS can control
     * the appearance.
     */

    messageElement.classList.remove(
        "registration-success",
        "registration-error"
    );


    if (isError) {

        messageElement.classList.add(
            "registration-error"
        );

    }
    else {

        messageElement.classList.add(
            "registration-success"
        );
    }


    messageElement.style.display =
        "block";
}


/* =====================================================
   LOGIN REDIRECTION
===================================================== */

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


/* =====================================================
   DEBUG
===================================================== */

console.log(
    "✅ Institute registration JavaScript loaded."
);


console.log(
    "✅ Brevo Email OTP system enabled."
);


console.log(
    "✅ Real Supabase registration enabled."
);