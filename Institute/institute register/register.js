/* =====================================================
   INSTITUTE REGISTRATION
   BREVO EMAIL OTP VERSION
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
   EDGE FUNCTION
===================================================== */

/*
   IMPORTANT:

   Your Supabase Edge Function URL shown in your
   dashboard is:

   /functions/v1/smart-endpoint

   Therefore the function name below is:

   smart-endpoint
*/

const OTP_FUNCTION_NAME =
    "smart-endpoint";


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


/* =====================================================
   CLEAR ERROR
===================================================== */

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


/* =====================================================
   NUMERIC ONLY
===================================================== */

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


    if (!timer) {

        return;

    }


    if (resendButton) {

        resendButton.disabled =
            true;

    }


    if (sendButton) {

        sendButton.disabled =
            true;

    }


    timer.textContent =
        "Resend OTP in 30s";


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


                if (resendButton) {

                    resendButton.disabled =
                        false;

                }


                if (sendButton) {

                    sendButton.disabled =
                        false;

                    sendButton.textContent =
                        "Send OTP";

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


    /* =========================
       EMAIL VALIDATION
    ========================== */

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
        !emailPattern.test(email)
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


    /* =========================
       SUPABASE CHECK
    ========================== */

    if (
        typeof supabaseClient ===
            "undefined" ||
        !supabaseClient
    ) {

        alert(
            "Supabase is not initialized."
        );

        return false;

    }


    /* =========================
       BUTTON
    ========================== */

    if (sendButton) {

        sendButton.disabled =
            true;

        sendButton.textContent =
            "Sending...";

    }


    try {


        /* =========================
           CALL EDGE FUNCTION
        ========================== */

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


        /* =========================
           EDGE FUNCTION ERROR
        ========================== */

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


        /* =========================
           FUNCTION RESPONSE
        ========================== */

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
           TEMPORARY TEST VERSION:

           Your current Edge Function returns:

           {
               success: true,
               otp: "123456"
           }

           We store that value here so the
           frontend can verify it.

           We will move verification to the
           server later for production security.
        */

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


        lastOtpEmail =
            email;


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

            otpInput.focus();

        }


        clearError(
            "emailOtp",
            "emailOtpError"
        );


        startOtpTimer();


        alert(
            "A 6-digit OTP has been sent to:\n\n" +
            email
        );


        return true;

    }
    catch (error) {


        console.error(
            "❌ OTP sending error:",
            error
        );


        if (sendButton) {

            sendButton.disabled =
                false;

            sendButton.textContent =
                "Send OTP";

        }


        alert(
            "Unable to send OTP.\n\n" +
            error.message
        );


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


    if (!emailInput || !otpInput) {

        return false;

    }


    const email =
        emailInput.value
            .trim()
            .toLowerCase();


    const otp =
        otpInput.value
            .trim();


    /* =========================
       EMAIL CHECK
    ========================== */

    if (!email) {

        showError(
            "instituteEmail",
            "instituteEmailError",
            "Please enter the institute email address."
        );

        return false;

    }


    /* =========================
       OTP SENT CHECK
    ========================== */

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


    /* =========================
       OTP LENGTH
    ========================== */

    if (
        otp.length !== 6
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


    /* =========================
       OTP COMPARISON
    ========================== */

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


    /* =========================
       SUCCESS
    ========================== */

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


            if (
                this.value.length === 6
            ) {

                await verifyEmailOtp();

            }

        }
    );

}


/* =====================================================
   ENSURE SUPABASE USER
===================================================== */

/*
   We are no longer using Supabase email OTP.

   However, your institutes table currently stores
   a user_id.

   Therefore we create a Supabase anonymous user
   so the database row still receives a valid user_id.
*/

async function ensureSupabaseUser() {


    if (
        typeof supabaseClient ===
            "undefined" ||
        !supabaseClient
    ) {

        throw new Error(
            "Supabase is not initialized."
        );

    }


    /* =========================
       CHECK EXISTING SESSION
    ========================== */

    const {
        data: sessionData,
        error: sessionError
    } =
        await supabaseClient.auth.getSession();


    if (sessionError) {

        console.error(
            "Session error:",
            sessionError
        );

    }


    if (
        sessionData &&
        sessionData.session &&
        sessionData.session.user
    ) {

        return (
            sessionData
                .session
                .user
        );

    }


    /* =========================
       CREATE ANONYMOUS USER
    ========================== */

    const {
        data,
        error
    } =
        await supabaseClient.auth
            .signInAnonymously();


    if (error) {

        console.error(
            "Anonymous sign-in error:",
            error
        );


        throw new Error(
            "Could not create a Supabase user.\n\n" +
            error.message +
            "\n\nPlease make sure Anonymous Sign-Ins are enabled in Supabase."
        );

    }


    if (
        !data ||
        !data.user
    ) {

        throw new Error(
            "Supabase did not return a user."
        );

    }


    return data.user;

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
               ADDRESS
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
               EMAIL
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

                /*
                   Document is optional.
                */

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


            /* =================================================
               STOP IF INVALID
            ================================================= */

            if (!isValid) {

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
                   CREATE / GET SUPABASE USER
                ================================================= */

                const user =
                    await ensureSupabaseUser();


                const userIdForDatabase =
                    user.id;


                /* =================================================
                   DATABASE INSERT
                ================================================= */

                const {
                    error
                } =
                    await supabaseClient
                        .from("institutes")
                        .insert([
                            {

                                user_id:
                                    userIdForDatabase,

                                institute_type:
                                    instituteType,

                                institute_name:
                                    instituteName,

                                institute_address:
                                    instituteAddress,

                                institute_email:
                                    instituteEmail,

                                head_name:
                                    headName,

                                institute_mobile:
                                    instituteMobile ||
                                    null,

                                authorization_document_path:
                                    null

                            }
                        ]);


                /* =================================================
                   DATABASE ERROR
                ================================================= */

                if (error) {

                    console.error(
                        "❌ Supabase insert error:",
                        error
                    );


                    /* =========================
                       DUPLICATE USER ID
                    ========================== */

                    if (
                        error.code ===
                        "23505"
                    ) {

                        showError(
                            "userId",
                            "userIdError",
                            "This User ID already exists. Please choose another."
                        );


                        document
                            .getElementById(
                                "userId"
                            )
                            .focus();


                        return;

                    }


                    /* =========================
                       RLS ERROR
                    ========================== */

                    if (
                        error.code ===
                        "42501"
                    ) {

                        alert(
                            "Registration failed.\n\n" +
                            "Supabase Row Level Security is blocking this registration.\n\n" +
                            "If Anonymous Sign-Ins are enabled, your institutes INSERT policy may also need to allow authenticated users."
                        );


                        return;

                    }


                    alert(
                        "Registration failed.\n\n" +
                        error.message
                    );


                    return;

                }


                /* =================================================
                   SUCCESS
                ================================================= */

                console.log(
                    "✅ Institute registration submitted successfully."
                );


                alert(
                    "Institute registration request submitted successfully.\n\n" +
                    "Your request is currently pending approval."
                );


                /* =================================================
                   STOP OTP TIMER
                ================================================= */

                clearInterval(
                    otpTimerInterval
                );


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


                /* =================================================
                   RESET OTP UI
                ================================================= */

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


                alert(
                    "Something went wrong while submitting the registration.\n\n" +
                    error.message
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
   DEBUG
===================================================== */

console.log(
    "✅ Institute registration JavaScript loaded."
);

console.log(
    "✅ Brevo Email OTP system enabled."
);