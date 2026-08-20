/* =========================
   INSTITUTE REGISTRATION
========================= */


/* =========================
   SUPABASE CHECK
========================= */

if (
    typeof supabaseClient === "undefined" ||
    !supabaseClient
) {

    console.error(
        "❌ Supabase client is not available."
    );

}



/* =========================
   GLOBAL VARIABLES
========================= */

let currentCaptcha = "";

let emailOtpVerified = false;

let otpTimerInterval = null;

let otpSeconds = 30;

let lastOtpEmail = "";



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


numericOnly(
    "instituteMobile"
);

numericOnly(
    "emailOtp"
);



/* =========================
   CAPTCHA
========================= */

const CAPTCHA_CHARACTERS =
    "ABDEFGHMNPQRTabdefghmnpqrt0123456789@#";


/* =========================
   GENERATE CAPTCHA
========================= */

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


generateCaptcha();



/* =====================================================
   OTP TIMER
===================================================== */


/* =========================
   START OTP TIMER
========================= */

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


    if (!timer || !resendButton) {

        return;

    }


    resendButton.disabled =
        true;


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

                }
                else {

                    clearInterval(
                        otpTimerInterval
                    );


                    timer.textContent =
                        "You can request a new OTP";


                    resendButton.disabled =
                        false;

                }

            },
            1000
        );

}



/* =========================
   SEND EMAIL OTP
========================= */

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

        return;

    }


    const email =
        emailInput.value.trim();


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    /* =========================
       VALIDATE EMAIL
    ========================== */

    if (!email) {

        showError(
            "instituteEmail",
            "emailError",
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
            "emailError",
            "Please enter a valid email address."
        );

        emailInput.focus();

        return false;

    }


    clearError(
        "instituteEmail",
        "emailError"
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
       DISABLE BUTTON
    ========================== */

    if (sendButton) {

        sendButton.disabled =
            true;

        sendButton.textContent =
            "Sending...";

    }


    try {

        /* =========================
           SEND OTP
        ========================== */

        const {
            error
        } =
            await supabaseClient.auth.signInWithOtp({

                email: email,

                options: {

                    shouldCreateUser: true

                }

            });


        /* =========================
           SUPABASE ERROR
        ========================== */

        if (error) {

            console.error(
                "❌ Email OTP error:",
                error
            );


            alert(
                "Unable to send Email OTP.\n\n" +
                error.message
            );


            return false;

        }


        /* =========================
           OTP SENT
        ========================== */

        emailOtpVerified =
            false;


        lastOtpEmail =
            email;


        const otpSection =
            document.getElementById(
                "otpSection"
            );


        if (otpSection) {

            otpSection.classList.add(
                "otp-active"
            );

        }


        const otpInput =
            document.getElementById(
                "emailOtp"
            );


        if (otpInput) {

            otpInput.value = "";

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
            "❌ Unexpected Email OTP error:",
            error
        );


        alert(
            "Something went wrong while sending the Email OTP."
        );


        return false;

    }
    finally {

        if (sendButton) {

            sendButton.disabled =
                false;

            sendButton.textContent =
                "Send Email OTP";

        }

    }

}



/* =========================
   SEND OTP BUTTON
========================= */

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

            /* =========================
               SAFETY CHECK
            ========================== */

            if (
                otpSeconds > 0
            ) {

                return;

            }


            const email =
                document
                    .getElementById(
                        "instituteEmail"
                    )
                    .value
                    .trim();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !email ||
                !emailPattern.test(email)
            ) {

                showError(
                    "instituteEmail",
                    "emailError",
                    "Please enter a valid email address."
                );

                return;

            }


            resendOtpBtn.disabled =
                true;

            resendOtpBtn.textContent =
                "Sending...";


            try {

                /* =========================
                   SEND NEW OTP
                ========================== */

                const {
                    error
                } =
                    await supabaseClient.auth.signInWithOtp({

                        email: email,

                        options: {

                            shouldCreateUser: true

                        }

                    });


                if (error) {

                    console.error(
                        "❌ Resend OTP error:",
                        error
                    );


                    alert(
                        "Unable to resend OTP.\n\n" +
                        error.message
                    );


                    resendOtpBtn.disabled =
                        false;

                    resendOtpBtn.textContent =
                        "Resend OTP";

                    return;

                }


                emailOtpVerified =
                    false;


                lastOtpEmail =
                    email;


                const otpInput =
                    document.getElementById(
                        "emailOtp"
                    );


                if (otpInput) {

                    otpInput.value = "";

                    otpInput.focus();

                }


                clearError(
                    "emailOtp",
                    "emailOtpError"
                );


                startOtpTimer();


                alert(
                    "A new 6-digit OTP has been sent to:\n\n" +
                    email
                );

            }
            catch (error) {

                console.error(
                    "❌ Unexpected resend error:",
                    error
                );


                alert(
                    "Something went wrong while resending the OTP."
                );


                resendOtpBtn.disabled =
                    false;

                resendOtpBtn.textContent =
                    "Resend OTP";

            }

        }
    );

}



/* =====================================================
   VERIFY EMAIL OTP
===================================================== */

async function verifyEmailOtp() {

    const email =
        document
            .getElementById(
                "instituteEmail"
            )
            .value
            .trim();


    const otp =
        document
            .getElementById(
                "emailOtp"
            )
            .value
            .trim();


    /* =========================
       EMAIL CHECK
    ========================== */

    if (!email) {

        showError(
            "instituteEmail",
            "emailError",
            "Please enter the institute email address."
        );

        return false;

    }


    /* =========================
       OTP CHECK
    ========================== */

    if (
        otp.length !== 6
    ) {

        showError(
            "emailOtp",
            "emailOtpError",
            "Please enter the complete 6-digit Email OTP."
        );

        return false;

    }


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


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.verifyOtp({

                email: email,

                token: otp,

                type: "email"

            });


        if (error) {

            console.error(
                "❌ Email OTP verification error:",
                error
            );


            emailOtpVerified =
                false;


            showError(
                "emailOtp",
                "emailOtpError",
                "Invalid or expired Email OTP."
            );


            return false;

        }


        /* =========================
           VERIFIED
        ========================== */

        emailOtpVerified =
            true;


        clearError(
            "emailOtp",
            "emailOtpError"
        );


        const otpInput =
            document.getElementById(
                "emailOtp"
            );


        if (otpInput) {

            otpInput.classList.add(
                "input-valid"
            );

        }


        const timer =
            document.getElementById(
                "otpTimer"
            );


        if (timer) {

            timer.textContent =
                "Email verified successfully";

        }


        const resendButton =
            document.getElementById(
                "resendOtpBtn"
            );


        if (resendButton) {

            resendButton.disabled =
                true;

        }


        clearInterval(
            otpTimerInterval
        );


        console.log(
            "✅ Email OTP verified successfully.",
            data
        );


        return true;

    }
    catch (error) {

        console.error(
            "❌ Unexpected OTP verification error:",
            error
        );


        emailOtpVerified =
            false;


        showError(
            "emailOtp",
            "emailOtpError",
            "Unable to verify Email OTP."
        );


        return false;

    }

}



/* =====================================================
   EMAIL OTP AUTO VERIFY ON CHANGE
===================================================== */

const emailOtpInput =
    document.getElementById(
        "emailOtp"
    );


if (emailOtpInput) {

    emailOtpInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                ).slice(0, 6);


            clearError(
                "emailOtp",
                "emailOtpError"
            );


            /*
             * Automatically verify once
             * all 6 digits are entered.
             */

            if (
                this.value.length === 6
            ) {

                verifyEmailOtp();

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


            let isValid = true;



            /* =========================
               USER ID
            ========================== */

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

                isValid = false;

            }
            else {

                clearError(
                    "userId",
                    "userIdError"
                );

            }



            /* =========================
               INSTITUTE TYPE
            ========================== */

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

                isValid = false;

            }
            else {

                clearError(
                    "instituteType",
                    "instituteTypeError"
                );

            }



            /* =========================
               INSTITUTE NAME
            ========================== */

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

                isValid = false;

            }
            else {

                clearError(
                    "instituteName",
                    "instituteNameError"
                );

            }



            /* =========================
               ADDRESS
            ========================== */

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

                isValid = false;

            }
            else {

                clearError(
                    "instituteAddress",
                    "instituteAddressError"
                );

            }



            /* =========================
               EMAIL
            ========================== */

            const instituteEmail =
                document
                    .getElementById(
                        "instituteEmail"
                    )
                    .value
                    .trim();


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



            /* =========================
               HEAD NAME
            ========================== */

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

                isValid = false;

            }
            else {

                clearError(
                    "headName",
                    "headNameError"
                );

            }



            /* =========================
               APPROVAL DOCUMENT
               OPTIONAL
            ========================== */

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

                    isValid = false;

                }
                else {

                    clearError(
                        "approvalDocument",
                        "approvalDocumentError"
                    );

                }


                const maxFileSize =
                    5 * 1024 * 1024;


                if (
                    file.size >
                    maxFileSize
                ) {

                    showError(
                        "approvalDocument",
                        "approvalDocumentError",
                        "File size must be 5 MB or less."
                    );

                    isValid = false;

                }

            }
            else {

                /*
                 * Document is optional.
                 */

                clearError(
                    "approvalDocument",
                    "approvalDocumentError"
                );

            }



            /* =========================
               EMAIL OTP
            ========================== */

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
                        "Please wait for Email OTP verification to complete."
                    );

                }


                isValid = false;

            }



            /* =========================
               CAPTCHA
            ========================== */

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



            /* =========================
               TERMS
            ========================== */

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

                isValid = false;

            }
            else {

                clearError(
                    "terms",
                    "termsError"
                );

            }



            /* =========================
               STOP IF INVALID
            ========================== */

            if (!isValid) {

                return;

            }



            /* =========================
               SUPABASE CHECK
            ========================== */

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



            /* =========================
               GET CURRENT USER
            ========================== */

            const {
                data: sessionData
            } =
                await supabaseClient.auth.getSession();


            let userIdForDatabase =
                sessionData &&
                sessionData.session &&
                sessionData.session.user
                    ? sessionData.session.user.id
                    : null;


            /*
             * If the OTP verification created
             * a Supabase session, use its user ID.
             */

            if (!userIdForDatabase) {

                const {
                    data: userData
                } =
                    await supabaseClient.auth.getUser();


                if (
                    userData &&
                    userData.user
                ) {

                    userIdForDatabase =
                        userData.user.id;

                }

            }


            if (!userIdForDatabase) {

                alert(
                    "Email verification session was not found.\n\nPlease send a new OTP and verify your email again."
                );

                emailOtpVerified =
                    false;

                return;

            }



            /* =========================
               SUBMIT BUTTON
            ========================== */

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
                ========================== */

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

                                institute_mobile:
                                    null,

                                authorization_document_path:
                                    null

                            }

                        ]);



                /* =========================
                   DATABASE ERROR
                ========================== */

                if (error) {

                    console.error(
                        "❌ Supabase insert error:",
                        error
                    );


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


                    alert(
                        "Registration failed.\n\n" +
                        error.message
                    );

                    return;

                }



                /* =========================
                   SUCCESS
                ========================== */

                console.log(
                    "✅ Institute registration submitted successfully."
                );


                alert(
                    "Institute registration request submitted successfully.\n\n" +
                    "Your request is currently pending approval."
                );


                /* =========================
                   STOP TIMER
                ========================== */

                clearInterval(
                    otpTimerInterval
                );


                /* =========================
                   RESET FORM
                ========================== */

                registerForm.reset();


                /* =========================
                   RESET OTP STATE
                ========================== */

                emailOtpVerified =
                    false;

                lastOtpEmail =
                    "";


                const timer =
                    document.getElementById(
                        "otpTimer"
                    );


                if (timer) {

                    timer.textContent =
                        "Send OTP to start verification";

                }


                const resendButton =
                    document.getElementById(
                        "resendOtpBtn"
                    );


                if (resendButton) {

                    resendButton.disabled =
                        true;

                    resendButton.textContent =
                        "Resend OTP";

                }


                /* =========================
                   NEW CAPTCHA
                ========================== */

                generateCaptcha();


                /* =========================
                   CLEAR ERRORS
                ========================== */

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
   DEBUG
========================= */

console.log(
    "✅ Institute registration JavaScript loaded."
);