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

let emailOtpSentTo = "";
let emailOtpVerified = false;


const sendEmailOtpBtn =
    document.getElementById(
        "sendEmailOtp"
    );


if (sendEmailOtpBtn) {

    sendEmailOtpBtn.addEventListener(
        "click",
        async function () {

            const email =
                document
                    .getElementById(
                        "instituteEmail"
                    )
                    .value
                    .trim();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            /* =====================
               EMAIL REQUIRED
            ===================== */

            if (!email) {

                showError(
                    "instituteEmail",
                    "emailError",
                    "Please enter the institute email address."
                );


                document
                    .getElementById(
                        "instituteEmail"
                    )
                    .focus();


                return;

            }


            /* =====================
               EMAIL FORMAT
            ===================== */

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


                document
                    .getElementById(
                        "instituteEmail"
                    )
                    .focus();


                return;

            }


            clearError(
                "instituteEmail",
                "emailError"
            );


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


                return;

            }


            sendEmailOtpBtn.disabled =
                true;


            sendEmailOtpBtn.textContent =
                "Sending...";


            try {

                const {
                    error
                } =
                    await supabaseClient.auth.signInWithOtp({

                        email: email,

                        options: {

                            shouldCreateUser:
                                true

                        }

                    });


                if (error) {

                    console.error(
                        "❌ Email OTP error:",
                        error
                    );


                    alert(
                        "Unable to send Email OTP.\n\n" +
                        error.message
                    );


                    return;

                }


                emailOtpSentTo =
                    email;


                emailOtpVerified =
                    false;


                /*
                   Clear old OTP
                */

                document
                    .getElementById(
                        "emailOtp"
                    )
                    .value = "";


                clearError(
                    "emailOtp",
                    "emailOtpError"
                );


                alert(
                    "A 6-digit OTP has been sent to:\n\n" +
                    email
                );


                document
                    .getElementById(
                        "emailOtp"
                    )
                    .focus();

            }

            catch (error) {

                console.error(
                    "❌ Unexpected Email OTP error:",
                    error
                );


                alert(
                    "Something went wrong while sending the Email OTP."
                );

            }

            finally {

                sendEmailOtpBtn.disabled =
                    false;


                sendEmailOtpBtn.textContent =
                    "Send Email OTP";

            }

        }
    );

}


/* =========================
   VERIFY EMAIL OTP
========================= */

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


    /* =====================
       EMAIL CHECK
    ===================== */

    if (!email) {

        showError(
            "instituteEmail",
            "emailError",
            "Please enter the institute email address."
        );


        return false;

    }


    /* =====================
       OTP SENT CHECK
    ===================== */

    if (
        !emailOtpSentTo ||
        emailOtpSentTo !== email
    ) {

        showError(
            "emailOtp",
            "emailOtpError",
            "Please send a new Email OTP for this email address."
        );


        return false;

    }


    /* =====================
       OTP LENGTH
    ===================== */

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


    /* =====================
       SUPABASE CHECK
    ===================== */

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
            error
        } =
            await supabaseClient.auth.verifyOtp({

                email:
                    email,

                token:
                    otp,

                type:
                    "email"

            });


        if (error) {

            console.error(
                "❌ Email OTP verification error:",
                error
            );


            showError(
                "emailOtp",
                "emailOtpError",
                "Invalid or expired Email OTP."
            );


            emailOtpVerified =
                false;


            return false;

        }


        emailOtpVerified =
            true;


        clearError(
            "emailOtp",
            "emailOtpError"
        );


        console.log(
            "✅ Email OTP verified successfully."
        );


        return true;

    }

    catch (error) {

        console.error(
            "❌ Unexpected Email OTP verification error:",
            error
        );


        showError(
            "emailOtp",
            "emailOtpError",
            "Unable to verify Email OTP."
        );


        emailOtpVerified =
            false;


        return false;

    }

}


/* =========================
   MOBILE OTP
========================= */

let mobileOtpSentTo = "";
let mobileOtpVerified = false;


const sendMobileOtpBtn =
    document.getElementById(
        "sendMobileOtp"
    );


if (sendMobileOtpBtn) {

    sendMobileOtpBtn.addEventListener(
        "click",
        async function () {

            const mobile =
                document
                    .getElementById(
                        "instituteMobile"
                    )
                    .value
                    .trim();


            /*
               Mobile is optional.
            */

            if (!mobile) {

                alert(
                    "Please enter a mobile number to receive Mobile OTP."
                );


                return;

            }


            /* =====================
               MOBILE VALIDATION
            ===================== */

            if (
                mobile.length !== 10
            ) {

                showError(
                    "instituteMobile",
                    "mobileError",
                    "Please enter a valid 10-digit mobile number."
                );


                document
                    .getElementById(
                        "instituteMobile"
                    )
                    .focus();


                return;

            }


            clearError(
                "instituteMobile",
                "mobileError"
            );


            /* =====================
               SUPABASE CHECK
            ===================== */

            if (
                typeof supabaseClient ===
                "undefined" ||
                !supabaseClient
            ) {

                alert(
                    "Supabase is not initialized."
                );


                return;

            }


            const phone =
                "+91" + mobile;


            sendMobileOtpBtn.disabled =
                true;


            sendMobileOtpBtn.textContent =
                "Sending...";


            try {

                const {
                    error
                } =
                    await supabaseClient.auth.signInWithOtp({

                        phone:
                            phone

                    });


                if (error) {

                    console.error(
                        "❌ Mobile OTP error:",
                        error
                    );


                    alert(
                        "Unable to send Mobile OTP.\n\n" +
                        error.message
                    );


                    return;

                }


                mobileOtpSentTo =
                    mobile;


                mobileOtpVerified =
                    false;


                document
                    .getElementById(
                        "mobileOtp"
                    )
                    .value = "";


                clearError(
                    "mobileOtp",
                    "mobileOtpError"
                );


                alert(
                    "A 6-digit OTP has been sent to:\n\n" +
                    "+91 " +
                    mobile
                );


                document
                    .getElementById(
                        "mobileOtp"
                    )
                    .focus();

            }

            catch (error) {

                console.error(
                    "❌ Unexpected Mobile OTP error:",
                    error
                );


                alert(
                    "Something went wrong while sending the Mobile OTP."
                );

            }

            finally {

                sendMobileOtpBtn.disabled =
                    false;


                sendMobileOtpBtn.textContent =
                    "Send Mobile OTP";

            }

        }
    );

}


/* =========================
   VERIFY MOBILE OTP
========================= */

async function verifyMobileOtp() {

    const mobile =
        document
            .getElementById(
                "instituteMobile"
            )
            .value
            .trim();


    const otp =
        document
            .getElementById(
                "mobileOtp"
            )
            .value
            .trim();


    /*
       Mobile is optional.
    */

    if (!mobile) {

        mobileOtpVerified =
            false;

        return true;

    }


    /* =====================
       OTP SENT CHECK
    ===================== */

    if (
        !mobileOtpSentTo ||
        mobileOtpSentTo !== mobile
    ) {

        showError(
            "mobileOtp",
            "mobileOtpError",
            "Please send a new Mobile OTP for this mobile number."
        );


        return false;

    }


    /* =====================
       OTP LENGTH
    ===================== */

    if (
        otp.length !== 6
    ) {

        showError(
            "mobileOtp",
            "mobileOtpError",
            "Please enter the complete 6-digit Mobile OTP."
        );


        return false;

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
            "Supabase is not initialized."
        );


        return false;

    }


    const phone =
        "+91" + mobile;


    try {

        const {
            error
        } =
            await supabaseClient.auth.verifyOtp({

                phone:
                    phone,

                token:
                    otp,

                type:
                    "sms"

            });


        if (error) {

            console.error(
                "❌ Mobile OTP verification error:",
                error
            );


            showError(
                "mobileOtp",
                "mobileOtpError",
                "Invalid or expired Mobile OTP."
            );


            mobileOtpVerified =
                false;


            return false;

        }


        mobileOtpVerified =
            true;


        clearError(
            "mobileOtp",
            "mobileOtpError"
        );


        console.log(
            "✅ Mobile OTP verified successfully."
        );


        return true;

    }

    catch (error) {

        console.error(
            "❌ Unexpected Mobile OTP verification error:",
            error
        );


        showError(
            "mobileOtp",
            "mobileOtpError",
            "Unable to verify Mobile OTP."
        );


        mobileOtpVerified =
            false;


        return false;

    }

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


            /* =====================
               INSTITUTE TYPE
            ===================== */

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


            /* =====================
               INSTITUTE NAME
            ===================== */

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


            /* =====================
               INSTITUTE ADDRESS
            ===================== */

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


            /* =====================
               INSTITUTE EMAIL
            ===================== */

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


            /* =====================
               MOBILE
               OPTIONAL
            ===================== */

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


            /* =========================
               AUTHORIZATION DOCUMENT
               OPTIONAL
            ========================= */

            const authorizationDocument =
                document.getElementById(
                    "authorizationDocument"
                );


            /*
               Document is optional.

               If a document is selected,
               validate its type and size.
            */

            if (
                authorizationDocument &&
                authorizationDocument.files.length > 0
            ) {

                const file =
                    authorizationDocument
                        .files[0];


                const allowedTypes = [

                    "application/pdf",

                    "image/jpeg",

                    "image/png"

                ];


                /* =====================
                   FILE TYPE
                ===================== */

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

                else {

                    clearError(
                        "authorizationDocument",
                        "authorizationError"
                    );

                }


                /* =====================
                   FILE SIZE
                ===================== */

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

            else {

                clearError(
                    "authorizationDocument",
                    "authorizationError"
                );

            }


            /* =========================
               EMAIL OTP
            ========================= */

            if (
                instituteEmail !==
                emailOtpSentTo
            ) {

                showError(
                    "emailOtp",
                    "emailOtpError",
                    "Please send an Email OTP for this email address."
                );


                isValid = false;

            }

            else {

                const emailOtp =
                    document
                        .getElementById(
                            "emailOtp"
                        )
                        .value
                        .trim();


                if (
                    emailOtp.length !== 6
                ) {

                    showError(
                        "emailOtp",
                        "emailOtpError",
                        "Please enter the complete 6-digit Email OTP."
                    );


                    isValid = false;

                }

                else {

                    const verified =
                        await verifyEmailOtp();


                    if (!verified) {

                        isValid = false;

                    }

                }

            }


            /* =========================
               MOBILE OTP
            ========================= */

            if (instituteMobile) {

                if (
                    instituteMobile !==
                    mobileOtpSentTo
                ) {

                    showError(
                        "mobileOtp",
                        "mobileOtpError",
                        "Please send a new Mobile OTP for this mobile number."
                    );


                    isValid = false;

                }

                else {

                    const mobileOtp =
                        document
                            .getElementById(
                                "mobileOtp"
                            )
                            .value
                            .trim();


                    if (
                        mobileOtp.length !== 6
                    ) {

                        showError(
                            "mobileOtp",
                            "mobileOtpError",
                            "Please enter the complete 6-digit Mobile OTP."
                        );


                        isValid = false;

                    }

                    else {

                        const verified =
                            await verifyMobileOtp();


                        if (!verified) {

                            isValid = false;

                        }

                    }

                }

            }

            else {

                clearError(
                    "mobileOtp",
                    "mobileOtpError"
                );

            }


            /* =========================
               CAPTCHA
            ========================= */

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
               STOP IF INVALID
            ========================= */

            if (!isValid) {

                return;

            }


            /* =========================
               SUPABASE CHECK
            ========================= */

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
               SUBMIT BUTTON
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


                                authorization_document_path:
                                    null

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


                        document
                            .getElementById(
                                "userId"
                            )
                            .focus();


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
                   RESET OTP STATES
                ========================= */

                emailOtpSentTo =
                    "";

                emailOtpVerified =
                    false;


                mobileOtpSentTo =
                    "";

                mobileOtpVerified =
                    false;


                /* =========================
                   NEW CAPTCHA
                ========================= */

                generateCaptcha();


                /* =========================
                   CLEAR OTP BOXES
                ========================= */

                otpBoxes.forEach(
                    function (box) {

                        box.value =
                            "";

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