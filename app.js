const UPI_ID = "ravinderpuri23@okaxis";
const PAYEE = "Ravi Goswami";
const CAMPAIGN = "Donate Nepal - Life Save Mission";

let selectedAmount = 2500;

const $ = id => document.getElementById(id);

const amountEl = $("selectedAmount");
const custom = $("customAmount");
const nameEl = $("donorName");
const mobileEl = $("donorMobile");
const emailEl = $("donorEmail");
const pay = $("payBtn");
const toast = $("toast");

const inr = n =>
    "₹" + Number(n || 0).toLocaleString("en-IN");

function msg(text) {
    if (!toast) return;

    toast.textContent = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function setAmount(n) {
    n = Number(n);

    if (!Number.isFinite(n) || n < 1 || n > 1000000) {
        return;
    }

    selectedAmount = n;

    if (amountEl) {
        amountEl.textContent = inr(n);
    }

    document.querySelectorAll(".amount").forEach(button => {
        button.classList.toggle(
            "active",
            Number(button.dataset.amount) === n
        );
    });
}

document.querySelectorAll(".amount").forEach(button => {
    button.addEventListener("click", () => {

        if (custom) {
            custom.value = "";
        }

        setAmount(button.dataset.amount);
    });
});

if (custom) {
    custom.addEventListener("input", () => {

        if (custom.value) {

            document
                .querySelectorAll(".amount")
                .forEach(button => {
                    button.classList.remove("active");
                });

            setAmount(custom.value);
        }
    });
}

function getAmount() {

    const customValue =
        Number(custom?.value || 0);

    return customValue > 0
        ? customValue
        : selectedAmount;
}

function createUPIUrl(amount) {

    return (
        "upi://pay" +

        "?pa=" +
        encodeURIComponent(UPI_ID) +

        "&pn=" +
        encodeURIComponent(PAYEE) +

        "&am=" +
        encodeURIComponent(
            Number(amount).toFixed(2)
        ) +

        "&cu=INR" +

        "&tn=" +
        encodeURIComponent(CAMPAIGN)
    );
}


/* =====================================
   SAVE DONATION
===================================== */

async function saveDonation() {

    const donorName =
        nameEl.value.trim();

    const mobile =
        mobileEl.value.trim();

    const email =
        emailEl.value.trim();

    const donationAmount =
        getAmount();


    if (!donorName) {

        alert("Please enter your name.");

        nameEl.focus();

        return false;
    }


    if (
        mobile.replace(/\D/g, "").length < 10
    ) {

        alert("Please enter a valid mobile number.");

        mobileEl.focus();

        return false;
    }


    if (
        !Number.isFinite(donationAmount) ||
        donationAmount < 1 ||
        donationAmount > 1000000
    ) {

        alert(
            "Enter a valid donation amount."
        );

        return false;
    }


    try {

        /*
         * IMPORTANT:
         * Backend is running on port 5000.
         */

        const response =
            await fetch(
                "http://localhost:5000/api/donations",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        donorName,
                        mobile,
                        email,
                        amount: donationAmount
                    })
                }
            );


        const text =
            await response.text();


        let data = {};

        try {

            data =
                text
                    ? JSON.parse(text)
                    : {};

        } catch {

            throw new Error(
                "Invalid response from server."
            );
        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                `Server Error ${response.status}`
            );
        }


        console.log(
            "Donation record:",
            data
        );


        return true;

    } catch (error) {

        console.error(
            "Donation save error:",
            error
        );


        alert(
            "Could not save donation record. " +
            error.message
        );


        return false;
    }
}


/* =====================================
   PAY BUTTON
===================================== */

if (pay) {

    pay.addEventListener(
        "click",
        async () => {

            pay.disabled = true;

            pay.textContent =
                "Preparing Payment...";


            const saved =
                await saveDonation();


            if (saved) {

                msg(
                    "Donation record saved. Opening UPI..."
                );


                setTimeout(() => {

                    const amount =
                        getAmount();

                    window.location.href =
                        createUPIUrl(amount);

                }, 350);

            } else {

                pay.disabled = false;

                pay.textContent =
                    "Continue to Payment →";
            }

        }
    );
}


/* =====================================
   COPY UPI
===================================== */

const copyUpi =
    $("copyUpi");

if (copyUpi) {

    copyUpi.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    UPI_ID
                );

                msg("UPI ID copied!");

            } catch {

                msg(UPI_ID);
            }

        }
    );
}


/* =====================================
   YEAR
===================================== */

const year =
    $("year");

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =====================================
   INITIAL AMOUNT
===================================== */

setAmount(2500);