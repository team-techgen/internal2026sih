/* =====================================================
   EQUILINE - INSTITUTE REGISTRATION
   SECURE BREVO OTP VERSION
   ===================================================== */

/*
   REQUIRED GLOBAL:

   supabaseClient

   This must already be created by:
   supabase-config.js

   Required Edge Functions:

   1. send-otp
   2. verify-otp
   3. register-institute
*/


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

const VERIFY_OTP_FUNCTION_NAME =
    "verify-otp";

const REGISTER_FUNCTION_NAME =
    "register-institute";


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentCaptcha = "";

let emailOtpVerified = false;

let lastOtpEmail = "";

let otpTimerInterval = null;

let otpSeconds = 0;

let otpVerificationInProgress = false;


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

        error.textContent = "";
    }
}


/* =====================================================
   NUMERIC ONLY
===================================================== */

function numericOnly(inputId) {

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
    "ABDEFGHMNPQRTabdefghmnpqrt0123456789";


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

        captchaInput.value = "";
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


generateCaptcha();


/* =====================================================
   FORM MESSAGE
   NO POPUP
===================================================== */

function showFormMessage(
    message,
    type = "error"
) {

    let messageBox =
        document.getElementById(
            "registrationMessage"
        );

    if (!messageBox) {

        messageBox =
            document.createElement(
                "div"
            );

        messageBox.id =
            "registrationMessage";

        messageBox.style.width =
            "100%";

        messageBox.style.margin =
            "15px 0";

        messageBox.style.padding =
            "12px 16px";

        messageBox.style.borderRadius =
            "8px";

        messageBox.style.fontSize =
            "14px";

        messageBox.style.fontWeight =
            "600";

        messageBox.style.boxSizing =
            "border-box";


        if (registerForm) {

            registerForm.prepend(
                messageBox
            );
        }
    }


    messageBox.textContent =
        message;


    if (type === "success") {

        messageBox.style.background =
            "#e7f8f1";

        messageBox.style.color =
            "#087443";

        messageBox.style.border =
            "1px solid #8ed9b8";

    }
    else {

        messageBox.style.background =
            "#fff0f0";

        messageBox.style.color =
            "#c62828";

        messageBox.style.border =
            "1px solid #ef9a9a";
    }
}


/* =====================================================
   CLEAR FORM MESSAGE
===================================================== */

function clearFormMessage() {

    const messageBox =
        document.getElementById(
            "registrationMessage"
        );

    if (messageBox) {

        messageBox.textContent =
            "";

        messageBox.style.display =
            "none";
    }
}


/* =====================================================
   OTP TIMER
===================================================== */

function startOtpTimer() {

    clearInterval(
        otpTimerInterval
    );

    otpSeconds = 30;


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


    if (sendButton) {

        sendButton.disabled =
            true;

        sendButton.textContent =
            "OTP Sent";
    }


    if (resendButton) {

        resendButton.disabled =
            true;
    }


    if (timer) {

        timer.textContent =
            "Resend OTP in 30s";
    }


    otpTimerInterval =
        setInterval(
            function () {

                otpSeconds--;


                if (
                    otpSeconds > 0
                ) {

                    if (timer) {

                        timer.textContent =
                            "Resend OTP in " +
                            otpSeconds +
                            "s";
                    }

                    return;
                }


                clearInterval(
                    otpTimerInterval
                );

                otpTimerInterval =
                    null;


                if (timer) {

                    timer.textContent =
                        "You can request a new OTP";
                }


                if (sendButton) {

                    sendButton.disabled =
                        false;

                    sendButton.textContent =
                        "Send OTP";
                }


                if (resendButton) {

                    resendButton.disabled =
                        false;
                }

            },
            1000
        );
}


/* =====================================================
   SEND EMAIL OTP
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

    const otpInput =
        document.getElementById(
            "emailOtp"
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
       COOLDOWN
    ================================================= */

    if (
        otpSeconds > 0
    ) {

        return false;
    }


    /* =================================================
       EMAIL VALIDATION
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
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        showError(
            "emailOtp",
            "emailOtpError",
            "OTP service is not available. Please try again."
        );

        return false;
    }


    /* =================================================
       RESET OTP STATE
    ================================================= */

    emailOtpVerified =
        false;

    lastOtpEmail =
        "";


    if (otpInput) {

        otpInput.value = "";

        otpInput.classList.remove(
            "input-valid"
        );
    }


    clearError(
        "emailOtp",
        "emailOtpError"
    );


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

        /* =============================================
           CALL SEND-OTP
        ============================================= */

        const {
            data,
            error
        } =
            await supabaseClient.functions.invoke(
                OTP_FUNCTION_NAME,
                {
                    body: {
                        email: email
                    }
                }
            );


        /* =============================================
           EDGE FUNCTION ERROR
        ============================================= */

        if (error) {

            console.error(
                "❌ send-otp Edge Function error:",
                error
            );

            throw new Error(
                error.message ||
                "Unable to contact OTP service."
            );
        }


        /* =============================================
           RESPONSE
        ============================================= */

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


        /*
           IMPORTANT:

           DO NOT READ:

           data.otp

           DO NOT STORE OTP.

           DO NOT COMPARE OTP IN BROWSER.

           The server stores the OTP hash.
        */


        lastOtpEmail =
            email;

        emailOtpVerified =
            false;


        if (otpInput) {

            otpInput.value = "";

            otpInput.classList.remove(
                "input-valid"
            );

            otpInput.focus();
        }


        clearError(
            "emailOtp",
            "emailOtpError"
        );


        startOtpTimer();


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
            error?.message ||
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


            await sendEmailOTP();

        }
    );
}


/* =====================================================
   VERIFY EMAIL OTP
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
       PREVENT DOUBLE VERIFICATION
    ================================================= */

    if (
        otpVerificationInProgress
    ) {

        return false;
    }


    if (
        emailOtpVerified
    ) {

        return true;
    }


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
       SUPABASE CHECK
    ================================================= */

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        showError(
            "emailOtp",
            "emailOtpError",
            "OTP verification service is unavailable."
        );

        return false;
    }


    otpVerificationInProgress =
        true;


    try {

        /* =============================================
           SERVER-SIDE OTP VERIFICATION
        ============================================= */

        const {
            data,
            error
        } =
            await supabaseClient.functions.invoke(
                VERIFY_OTP_FUNCTION_NAME,
                {
                    body: {
                        email: email,
                        otp: otp
                    }
                }
            );


        if (error) {

            console.error(
                "❌ verify-otp Edge Function error:",
                error
            );

            throw new Error(
                error.message ||
                "Unable to verify OTP."
            );
        }


        console.log(
            "OTP verification response:",
            data
        );


        if (
            !data ||
            data.success !== true ||
            data.verified !== true
        ) {

            throw new Error(
                data?.message ||
                "Incorrect or expired OTP."
            );
        }


        /* =============================================
           SUCCESS
        ============================================= */

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
    catch (error) {

        console.error(
            "❌ OTP verification error:",
            error
        );


        emailOtpVerified =
            false;


        showError(
            "emailOtp",
            "emailOtpError",
            error?.message ||
            "Incorrect or expired OTP."
        );


        return false;

    }
    finally {

        otpVerificationInProgress =
            false;
    }
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


            if (
                this.value.length === 6 &&
                !emailOtpVerified
            ) {

                await verifyEmailOtp();
            }

        }
    );
}


/* =====================================================
   EMAIL CHANGE
   OTP BECOMES INVALID IF EMAIL CHANGES
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


            if (
                lastOtpEmail &&
                currentEmail !==
                lastOtpEmail
            ) {

                emailOtpVerified =
                    false;


                const otpInput =
                    document.getElementById(
                        "emailOtp"
                    );


                if (otpInput) {

                    otpInput.value = "";

                    otpInput.classList.remove(
                        "input-valid"
                    );
                }


                if (sendEmailOtpBtn) {

                    sendEmailOtpBtn.disabled =
                        false;

                    sendEmailOtpBtn.textContent =
                        "Send OTP";
                }


                clearInterval(
                    otpTimerInterval
                );

                otpTimerInterval =
                    null;

                otpSeconds =
                    0;


                const timer =
                    document.getElementById(
                        "otpTimer"
                    );


                if (timer) {

                    timer.textContent =
                        "Email changed. Send a new OTP";
                }

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


            clearFormMessage();


            let isValid =
                true;


            /* =========================================
               USER ID
            ========================================= */

            const userIdElement =
                document.getElementById(
                    "userId"
                );


            const userId =
                userIdElement
                    ? userIdElement.value.trim()
                    : "";


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


            /* =========================================
               INSTITUTE TYPE
            ========================================= */

            const instituteTypeElement =
                document.getElementById(
                    "instituteType"
                );


            const instituteType =
                instituteTypeElement
                    ? instituteTypeElement.value
                    : "";


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


            /* =========================================
               INSTITUTE NAME
            ========================================= */

            const instituteNameElement =
                document.getElementById(
                    "instituteName"
                );


            const instituteName =
                instituteNameElement
                    ? instituteNameElement.value.trim()
                    : "";


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


            /* =========================================
               ADDRESS
            ========================================= */

            const instituteAddressElement =
                document.getElementById(
                    "instituteAddress"
                );


            const instituteAddress =
                instituteAddressElement
                    ? instituteAddressElement.value.trim()
                    : "";


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


            /* =========================================
               EMAIL
            ========================================= */

            const instituteEmailElement =
                document.getElementById(
                    "instituteEmail"
                );


            const instituteEmail =
                instituteEmailElement
                    ? instituteEmailElement.value
                        .trim()
                        .toLowerCase()
                    : "";


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


            /* =========================================
               MOBILE
            ========================================= */

            const instituteMobileElement =
                document.getElementById(
                    "instituteMobile"
                );


            const instituteMobile =
                instituteMobileElement
                    ? instituteMobileElement.value.trim()
                    : "";


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


            /* =========================================
               HEAD NAME
            ========================================= */

            const headNameElement =
                document.getElementById(
                    "headName"
                );


            const headName =
                headNameElement
                    ? headNameElement.value.trim()
                    : "";


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


            /* =========================================
               APPROVAL DOCUMENT
               OPTIONAL
            ========================================= */

            const approvalDocument =
                document.getElementById(
                    "approvalDocument"
                );


            if (
                approvalDocument &&
                approvalDocument.files &&
                approvalDocument.files.length > 0
            ) {

                const file =
                    approvalDocument.files[0];


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


            /* =========================================
               EMAIL OTP
            ========================================= */

            const emailOtpElement =
                document.getElementById(
                    "emailOtp"
                );


            const emailOtp =
                emailOtpElement
                    ? emailOtpElement.value.trim()
                    : "";


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


            /* =========================================
               CAPTCHA
            ========================================= */

            const captchaInputElement =
                document.getElementById(
                    "captchaInput"
                );


            const captchaInput =
                captchaInputElement
                    ? captchaInputElement.value.trim()
                    : "";


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


            /* =========================================
               TERMS
            ========================================= */

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
                    "Please confirm the authorization statement."
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


            /* =========================================
               STOP IF INVALID
            ========================================= */

            if (!isValid) {

                return;
            }


            /* =========================================
               SUPABASE CHECK
            ========================================= */

            if (
                typeof supabaseClient === "undefined" ||
                !supabaseClient
            ) {

                showFormMessage(
                    "Supabase is not initialized."
                );

                return;
            }


            /* =========================================
               FINAL EMAIL CHECK
            ========================================= */

            if (
                lastOtpEmail !==
                instituteEmail
            ) {

                emailOtpVerified =
                    false;


                showError(
                    "emailOtp",
                    "emailOtpError",
                    "Email was changed. Please verify the new email address."
                );

                return;
            }


            /* =========================================
               SUBMIT BUTTON
            ========================================= */

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

                /* =====================================
                   FINAL SERVER REGISTRATION

                   IMPORTANT:

                   NO anonymous user.
                   NO auth.signUp().
                   NO client-side database insert.

                   The Edge Function will:

                   1. Verify the OTP was verified.
                   2. Create the REAL Supabase user.
                   3. Insert the institute record.
                ===================================== */


                const {
                    data,
                    error
                } =
                    await supabaseClient.functions.invoke(
                        REGISTER_FUNCTION_NAME,
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
                                    headName,

                                authorizationDocumentPath:
                                    null
                            }
                        }
                    );


                /* =====================================
                   EDGE FUNCTION ERROR
                ===================================== */

                if (error) {

                    console.error(
                        "❌ Registration Edge Function error:",
                        error
                    );

                    throw new Error(
                        error.message ||
                        "Registration request failed."
                    );
                }


                console.log(
                    "Registration response:",
                    data
                );


                /* =====================================
                   SERVER RESPONSE
                ===================================== */

                if (
                    !data ||
                    data.success !== true
                ) {

                    throw new Error(
                        data?.message ||
                        "Registration could not be completed."
                    );
                }


                /* =====================================
                   SUCCESS
                ===================================== */

                console.log(
                    "✅ Institute registration submitted successfully."
                );


                showFormMessage(
                    data.message ||
                    "Institute registration submitted successfully. Your request is pending approval.",
                    "success"
                );


                /* =====================================
                   STOP OTP TIMER
                ===================================== */

                clearInterval(
                    otpTimerInterval
                );

                otpTimerInterval =
                    null;

                otpSeconds =
                    0;


                /* =====================================
                   RESET FORM
                ===================================== */

                registerForm.reset();


                /* =====================================
                   RESET OTP STATE
                ===================================== */

                emailOtpVerified =
                    false;

                lastOtpEmail =
                    "";

                otpVerificationInProgress =
                    false;


                /* =====================================
                   RESET OTP UI
                ===================================== */

                const timer =
                    document.getElementById(
                        "otpTimer"
                    );


                if (timer) {

                    timer.textContent =
                        "Send OTP to start verification";
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


                /* =====================================
                   RESET CAPTCHA
                ===================================== */

                generateCaptcha();


                /* =====================================
                   CLEAR VALIDATION ERRORS
                ===================================== */

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


                /*
                   Keep success message visible.
                */


            }
            catch (error) {

                console.error(
                    "❌ Registration error:",
                    error
                );


                showFormMessage(
                    error?.message ||
                    "Something went wrong while submitting the registration."
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
   INITIAL MESSAGE
===================================================== */

clearFormMessage();


/* =====================================================
   DEBUG
===================================================== */

console.log(
    "✅ Institute registration JavaScript loaded."
);

console.log(
    "✅ Secure Brevo OTP system enabled."
);

console.log(
    "✅ Client-side OTP storage disabled."
);

console.log(
    "✅ Anonymous Supabase sign-in disabled."
);