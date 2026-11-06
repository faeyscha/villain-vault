
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("rentalForm");
    const resultBox = document.getElementById("result");

    if (!form || !resultBox) return;

    const lairPrices = {
        bunker: 300,
        volcano: 500,
        tower: 800
    };

    const lairNames = {
        bunker: "Underground Bunker",
        volcano: "Volcano Fortress",
        tower: "Sky Tower Hideout"
    };

    const discounts = {
        basic: 0,
        silver: 0.10,
        gold: 0.15,
        vip: 0.20
    };

    const fields = [
        "customerName",
        "email",
        "lairType",
        "nights",
        "membership"
    ];

    
    function showError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + "Error");

    input.classList.add("input-error");
    input.classList.remove("input-valid");
    input.setAttribute("aria-invalid", "true");

    error.textContent = message;

    // FORCE ERROR TEXT TO RED
    error.style.setProperty("color", "#FF0000", "important");
    error.style.setProperty("font-weight", "700", "important");
}


    function clearError(id) {
        const input = document.getElementById(id);
        const error = document.getElementById(id + "Error");

        input.classList.remove("input-error");
        input.removeAttribute("aria-invalid");

        error.textContent = "";
    }

    function validateField(id) {
        const input = document.getElementById(id);
        const value = input.value.trim();

        clearError(id);

        if (value === "") {
            showError(id, "This field is required.");
            return false;
        }

        if (id === "customerName" && value.length < 2) {
            showError(id, "Please enter at least 2 characters.");
            return false;
        }

        if (id === "email") {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!pattern.test(value)) {
                showError(id, "Please enter a valid email address.");
                return false;
            }
        }

        if (id === "nights") {
            const nights = Number(value);

            if (!Number.isInteger(nights) ||
                nights < 1 || nights > 30) {
                showError(id, "Enter a whole number from 1 to 30.");
                return false;
            }
        }

        if (id === "lairType" &&
            !Object.hasOwn(lairPrices, value)) {
            showError(id, "Please select a valid lair.");
            return false;
        }

        if (id === "membership" &&
            !Object.hasOwn(discounts, value)) {
            showError(id, "Please select a valid membership.");
            return false;
        }

        input.classList.add("input-valid");
        return true;
    }

    // LIVE VALIDATION
    fields.forEach(function (id) {
        const input = document.getElementById(id);

        const eventType =
            input.tagName === "SELECT" ? "change" : "input";

        input.addEventListener(eventType, function () {
            if (input.classList.contains("input-error")) {
                validateField(id);
            }
        });

        input.addEventListener("blur", function () {
            if (input.value.trim() !== "") {
                validateField(id);
            }
        });
    });

    function formatMoney(amount) {
        return "RM " + amount.toFixed(2);
    }

    function addRow(label, value, isTotal = false) {
        const row = document.createElement("div");
        row.className = "result-row";

        const labelElement = document.createElement("span");
        labelElement.textContent = label;

        const valueElement = document.createElement("strong");
        valueElement.textContent = value;

        if (isTotal) {
            valueElement.className = "final-total";
        }

        row.appendChild(labelElement);
        row.appendChild(valueElement);
        resultBox.appendChild(row);
    }

    // FORM SUBMISSION
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        resultBox.hidden = true;
        resultBox.replaceChildren();

        let valid = true;
        let firstError = null;

        fields.forEach(function (id) {
            if (!validateField(id)) {
                valid = false;

                if (firstError === null) {
                    firstError = id;
                }
            }
        });

        if (!valid) {
            document.getElementById(firstError).focus();
            return;
        }

        const name =
            document.getElementById("customerName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const lair =
            document.getElementById("lairType").value;

        const nights =
            Number(document.getElementById("nights").value);

        const membership =
            document.getElementById("membership").value;

        // CALCULATION
        const pricePerNight = lairPrices[lair];
        const subtotal = pricePerNight * nights;
        const discountRate = discounts[membership];
        const discountAmount = subtotal * discountRate;
        const finalTotal = subtotal - discountAmount;

        // RESULT DISPLAY
        const heading = document.createElement("h2");
        heading.textContent = "Your Rental Summary";
        resultBox.appendChild(heading);

        addRow("Customer Name", name);
        addRow("Email Address", email);
        addRow("Selected Lair", lairNames[lair]);
        addRow("Rental Duration", nights + " night(s)");
        addRow("Membership", membership.toUpperCase());
        addRow("Price Per Night", formatMoney(pricePerNight));
        addRow("Subtotal", formatMoney(subtotal));
        addRow("Discount Rate", (discountRate * 100) + "%");
        addRow("Discount Amount", "- " + formatMoney(discountAmount));
        addRow("Final Total", formatMoney(finalTotal), true);

        resultBox.hidden = false;

        resultBox.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // RESET
    form.addEventListener("reset", function () {
        fields.forEach(function (id) {
            clearError(id);

            document.getElementById(id)
                .classList.remove("input-valid");
        });

        resultBox.hidden = true;
        resultBox.replaceChildren();
    });

});
