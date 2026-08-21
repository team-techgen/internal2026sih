/* =====================================================
   EQUILINE - INSTITUTE REGISTRATION
   SECURE BREVO OTP VERSION
   ===================================================== */


/* =====================================================
   REQUIRED GLOBAL

   supabaseClient must be created by:
   supabase-config.js

   Required Edge Functions:
   1. send-otp
   2. verify-otp
   3. register-institute
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

        error.style.display =
            "block";

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

        error.style.display =
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
    "ABDEFGHMNPQRTabdefghmnpqrt0123456789";


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


        if (
            typeof registerForm !==
            "undefined" &&
            registerForm
        ) {

            registerForm.prepend(
                messageBox
            );

        }

    }


    messageBox.textContent =
        message;


    messageBox.style.display =
        "block";


    if (
        type ===
        "success"
    ) {

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
   PROFESSIONAL POPUP
===================================================== */

function showProfessionalPopup(
    title,
    message,
    type = "success"
) {

    /* Remove existing popup */
    const existingPopup =
        document.getElementById(
            "professionalPopup"
        );

    if (existingPopup) {
        existingPopup.remove();
    }


    /* =========================================
       OVERLAY
    ========================================= */

    const overlay =
        document.createElement("div");

    overlay.id =
        "professionalPopup";


    overlay.innerHTML = `

        <div class="professional-popup-card">

            <button
                type="button"
                class="professional-popup-close"
                id="professionalPopupClose"
                aria-label="Close"
            >
                &times;
            </button>


            <div
                class="professional-popup-icon
                ${type === "success"
                    ? "popup-success"
                    : "popup-error"}"
            >

                ${
                    type === "success"
                        ? "✓"
                        : "!"
                }

            </div>


            <h2 class="professional-popup-title">
                ${title}
            </h2>


            <p class="professional-popup-message">
                ${message}
            </p>


            <button
                type="button"
                class="professional-popup-button"
                id="professionalPopupOk"
            >
                OK
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    /* =========================================
       POPUP CSS
    ========================================= */

    if (
        !document.getElementById(
            "professionalPopupStyles"
        )
    ) {

        const style =
            document.createElement("style");


        style.id =
            "professionalPopupStyles";


        style.textContent = `

            #professionalPopup {

                position: fixed;

                inset: 0;

                width: 100%;
                height: 100%;

                background:
                    rgba(4, 43, 45, 0.48);

                backdrop-filter:
                    blur(5px);

                -webkit-backdrop-filter:
                    blur(5px);

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 20px;

                box-sizing: border-box;

                z-index: 99999;

                animation:
                    popupOverlayIn
                    0.2s ease;

            }


            .professional-popup-card {

                width: min(
                    460px,
                    100%
                );

                background: #ffffff;

                border-radius: 20px;

                padding: 34px 30px 30px;

                text-align: center;

                position: relative;

                box-sizing: border-box;

                box-shadow:
                    0 25px 70px
                    rgba(0, 0, 0, 0.22);

                animation:
                    popupCardIn
                    0.28s ease;

            }


            .professional-popup-close {

                position: absolute;

                top: 12px;

                right: 14px;

                width: 36px;

                height: 36px;

                border: none;

                background:
                    transparent;

                color: #6b7f80;

                font-size: 28px;

                line-height: 36px;

                cursor: pointer;

                border-radius: 50%;

            }


            .professional-popup-close:hover {

                background: #f1f6f5;

                color: #024d50;

            }


            .professional-popup-icon {

                width: 72px;

                height: 72px;

                border-radius: 50%;

                display: flex;

                align-items: center;

                justify-content: center;

                margin: 0 auto 20px;

                font-size: 38px;

                font-weight: 700;

            }


            .popup-success {

                background: #e4f7ef;

                color: #129267;

                border: 1px solid #b9e8d4;

            }


            .popup-error {

                background: #fff0f0;

                color: #d73535;

                border: 1px solid #f2bcbc;

            }


            .professional-popup-title {

                margin: 0 0 10px;

                color: #064f52;

                font-size: 24px;

                font-weight: 700;

            }


            .professional-popup-message {

                margin: 0 auto 25px;

                max-width: 390px;

                color: #607879;

                font-size: 15px;

                line-height: 1.6;

            }


            .professional-popup-button {

                width: 100%;

                max-width: 180px;

                border: none;

                border-radius: 10px;

                padding: 13px 24px;

                background: #15966f;

                color: #ffffff;

                font-size: 15px;

                font-weight: 700;

                cursor: pointer;

                transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease;

            }


            .professional-popup-button:hover {

                transform:
                    translateY(-1px);

                box-shadow:
                    0 7px 18px
                    rgba(21, 150, 111, 0.25);

            }


            @keyframes popupOverlayIn {

                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }

            }


            @keyframes popupCardIn {

                from {

                    opacity: 0;

                    transform:
                        translateY(15px)
                        scale(0.96);

                }

                to {

                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);

                }

            }


            @media (max-width: 480px) {

                .professional-popup-card {

                    padding:
                        30px 20px 24px;

                    border-radius:
                        17px;

                }


                .professional-popup-title {

                    font-size:
                        21px;

                }


                .professional-popup-message {

                    font-size:
                        14px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =========================================
       CLOSE FUNCTIONS
    ========================================= */

    function closePopup() {

        const popup =
            document.getElementById(
                "professionalPopup"
            );

        if (popup) {

            popup.remove();

        }

    }


    const closeButton =
        document.getElementById(
            "professionalPopupClose"
        );


    const okButton =
        document.getElementById(
            "professionalPopupOk"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePopup
        );

    }


    if (okButton) {

        okButton.addEventListener(
            "click",
            closePopup
        );

    }


    /* Close only when clicking outside card */

    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                overlay
            ) {

                closePopup();

            }

        }
    );

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


    if (
        otpSeconds > 0
    ) {

        return false;

    }


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


    if (
        typeof supabaseClient ===
        "undefined" ||
        !supabaseClient
    ) {

        showError(
            "emailOtp",
            "emailOtpError",
            "OTP service is not available. Please try again."
        );


        return false;

    }


    emailOtpVerified =
        false;


    lastOtpEmail =
        "";


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


    if (sendButton) {

        sendButton.disabled =
            true;

        sendButton.textContent =
            "Sending...";

    }


    try {

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


        lastOtpEmail =
            email;


        emailOtpVerified =
            false;


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


    if (!email) {

        showError(
            "instituteEmail",
            "instituteEmailError",
            "Please enter the institute email address."
        );


        return false;

    }


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


    if (
        typeof supabaseClient ===
        "undefined" ||
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


    emailOtpVerified =
        false;


    showError(
        "emailOtp",
        "emailOtpError",
        "Invalid OTP. Please enter the correct OTP."
    );


    showProfessionalPopup(
        "Invalid OTP",
        "The OTP you entered is incorrect or has expired. Please enter the correct OTP.",
        "error"
    );


    return false;

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

    emailOtpVerified =
        false;


    showError(
        "emailOtp",
        "emailOtpError",
        "Invalid OTP. Please enter the correct OTP."
    );


    showProfessionalPopup(
        "Invalid OTP",
        "The OTP you entered is incorrect or has expired. Please enter the correct OTP.",
        "error"
    );


    return false;

}


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

                    otpInput.value =
                        "";

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
   GET ACTUAL EDGE FUNCTION ERROR
===================================================== */

/*
   IMPORTANT FIX:

   The register-institute Edge Function returns:

   409 + "Email already registered..."
       OR
   409 + "User ID already exists..."

   Therefore 409 by itself is NOT enough to determine
   which field caused the conflict.

   This function reads the actual server response.
*/

async function getRegistrationErrorMessage(
    error
) {

    let status =
        error?.context?.status ||
        null;


    let message =
        "";


    try {

        const response =
            error?.context;


        if (
            response &&
            typeof response.clone ===
            "function"
        ) {

            try {

                const clonedResponse =
                    response.clone();


                const responseData =
                    await clonedResponse.json();


                if (
                    responseData &&
                    typeof responseData.message ===
                    "string"
                ) {

                    message =
                        responseData.message.trim();

                }

            }
            catch (jsonError) {

                console.warn(
                    "Could not parse Edge Function JSON:",
                    jsonError
                );

            }


            if (!message) {

                try {

                    const clonedResponse =
                        response.clone();


                    const responseText =
                        await clonedResponse.text();


                    if (responseText) {

                        try {

                            const parsed =
                                JSON.parse(
                                    responseText
                                );


                            if (
                                parsed &&
                                typeof parsed.message ===
                                "string"
                            ) {

                                message =
                                    parsed.message.trim();

                            }
                            else {

                                message =
                                    responseText.trim();

                            }

                        }
                        catch (
                            parseError
                        ) {

                            message =
                                responseText.trim();

                        }

                    }

                }
                catch (textError) {

                    console.warn(
                        "Could not read Edge Function text:",
                        textError
                    );

                }

            }

        }

    }
    catch (readError) {

        console.warn(
            "Unable to read Edge Function error response:",
            readError
        );

    }


    if (!message) {

        message =
            error?.message
                ? String(
                    error.message
                )
                : "";

    }


    return {
        status:
            status,

        message:
            message
    };

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
                typeof supabaseClient ===
                "undefined" ||
                !supabaseClient
            ) {

                showFormMessage(
                    "Supabase is not initialized."
                );


                return;

            }


            /* =========================================
               FINAL EMAIL / OTP CHECK
            ========================================= */

            /* =========================================
   FINAL OTP VERIFICATION CHECK
========================================= */

/*
   NEVER allow registration unless the OTP
   has actually been verified successfully.
*/

if (
    !emailOtpVerified
) {

    showError(
        "emailOtp",
        "emailOtpError",
        "Please verify your email OTP before submitting."
    );


    showProfessionalPopup(
        "Email Verification Required",
        "Please enter the OTP sent to your institute email and verify it before submitting the registration.",
        "error"
    );


    const otpInput =
        document.getElementById(
            "emailOtp"
        );


    if (otpInput) {

        otpInput.focus();

    }


    return;

}


/* =========================================
   EMAIL MUST MATCH OTP EMAIL
========================================= */

if (
    !lastOtpEmail ||
    lastOtpEmail !==
    instituteEmail
) {

    emailOtpVerified =
        false;


    showError(
        "emailOtp",
        "emailOtpError",
        "Email was changed. Please send and verify a new OTP."
    );


    showProfessionalPopup(
        "Email Verification Required",
        "The email address was changed after the OTP was sent. Please send a new OTP and verify it.",
        "error"
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
                   REGISTER-INSTITUTE EDGE FUNCTION
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

                   IMPORTANT:

                   DO NOT USE:

                       if (status === 409)
                           email duplicate

                   because both email and User ID
                   duplicates return 409.

                   Read the actual server message.
                ===================================== */

                if (error) {

                    console.error(
                        "❌ Registration Edge Function error:",
                        error
                    );


                    const registrationError =
                        await getRegistrationErrorMessage(
                            error
                        );


                    const serverMessage =
                        registrationError.message ||
                        "";


                    const normalizedMessage =
                        serverMessage
                            .toLowerCase()
                            .trim();


                    console.error(
                        "Registration Edge Function status:",
                        registrationError.status
                    );


                    console.error(
                        "Registration Edge Function message:",
                        serverMessage
                    );


                    /* =================================
                       EMAIL DUPLICATE
                    ================================= */

                    if (
                        normalizedMessage.includes(
                            "email already registered"
                        ) ||
                        normalizedMessage.includes(
                            "institute email is already registered"
                        )
                    ) {

                        showError(
                            "instituteEmail",
                            "instituteEmailError",
                            "Email already registered. Please login."
                        );


                        showFormMessage(
                            "Email already registered. Please login."
                        );


                        if (
                            instituteEmailElement
                        ) {

                            instituteEmailElement.focus();

                        }


                        return;

                    }


                    /* =================================
                       USER ID DUPLICATE
                    ================================= */

                    if (
                        normalizedMessage.includes(
                            "user id already exists"
                        ) ||
                        normalizedMessage.includes(
                            "this user id already exists"
                        )
                    ) {

                        showError(
                            "userId",
                            "userIdError",
                            "User ID already exists. Please choose another."
                        );


                        showFormMessage(
                            "User ID already exists. Please choose another."
                        );


                        if (
                            userIdElement
                        ) {

                            userIdElement.focus();

                        }


                        return;

                    }


                    /* =================================
                       OTHER ERROR
                    ================================= */

                    throw new Error(
                        serverMessage ||
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

                    const serverMessage =
                        data?.message
                            ? String(
                                data.message
                            ).trim()
                            : "";


                    const normalizedMessage =
                        serverMessage
                            .toLowerCase();


                    /* =================================
                       DUPLICATE EMAIL
                    ================================= */

                    if (
                        normalizedMessage.includes(
                            "email already registered"
                        ) ||
                        normalizedMessage.includes(
                            "institute email is already registered"
                        )
                    ) {

                        showError(
                            "instituteEmail",
                            "instituteEmailError",
                            "Email already registered. Please login."
                        );


                        showFormMessage(
                            "Email already registered. Please login."
                        );


                        if (
                            instituteEmailElement
                        ) {

                            instituteEmailElement.focus();

                        }


                        return;

                    }


                    /* =================================
                       DUPLICATE USER ID
                    ================================= */

                    if (
                        normalizedMessage.includes(
                            "user id already exists"
                        ) ||
                        normalizedMessage.includes(
                            "this user id already exists"
                        )
                    ) {

                        showError(
                            "userId",
                            "userIdError",
                            "User ID already exists. Please choose another."
                        );


                        showFormMessage(
                            "User ID already exists. Please choose another."
                        );


                        if (
                            userIdElement
                        ) {

                            userIdElement.focus();

                        }


                        return;

                    }


                    throw new Error(
                        serverMessage ||
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
                    function (errorElement) {

                        errorElement.textContent =
                            "";

                    }
                );

            }
            catch (error) {

                console.error(
                    "❌ Registration error:",
                    error
                );


                const errorMessage =
                    error?.message
                        ? String(
                            error.message
                        )
                        : "";


                const normalizedError =
                    errorMessage
                        .toLowerCase();


                /* =====================================
                   FINAL EMAIL DUPLICATE SAFETY CHECK
                ===================================== */

                if (
                    normalizedError.includes(
                        "email already registered"
                    ) ||
                    normalizedError.includes(
                        "institute email is already registered"
                    )
                ) {

                    showError(
                        "instituteEmail",
                        "instituteEmailError",
                        "Email already registered. Please login."
                    );


                    showFormMessage(
                        "Email already registered. Please login."
                    );


                    if (
                        instituteEmailElement
                    ) {

                        instituteEmailElement.focus();

                    }


                    return;

                }


                /* =====================================
                   FINAL USER ID DUPLICATE SAFETY CHECK
                ===================================== */

                if (
                    normalizedError.includes(
                        "user id already exists"
                    ) ||
                    normalizedError.includes(
                        "this user id already exists"
                    )
                ) {

                    showError(
                        "userId",
                        "userIdError",
                        "User ID already exists. Please choose another."
                    );


                    showFormMessage(
                        "User ID already exists. Please choose another."
                    );


                    if (
                        userIdElement
                    ) {

                        userIdElement.focus();

                    }


                    return;

                }


                /* =====================================
                   GENERIC ERROR
                ===================================== */

                showFormMessage(
                    errorMessage ||
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

console.log(
    "✅ Duplicate email/User ID handling enabled."
);