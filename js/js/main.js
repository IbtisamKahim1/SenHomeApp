console.log("JavaScript is connected!");

//page navigation function
function navigateToPage(page) {
    window.location.href = page; // Redirect to the page specified
}
//Fetch API example
fetch("http://localhost:5000/")
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((err) => console.error("Error fetching API:", err));


// Function to open the modal and display the clicked image
function showModal(image) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");

    modal.style.display = "block"; // Show the modal
    modalImage.src = image.src; // Set the image source
    captionText.innerHTML = image.alt; // Set the image caption
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none"; // Hide the modal
}

// Close modal when clicking outside of the image
window.onclick = function (event) {
    const modal = document.getElementById("imageModal");
    if (event.target === modal) {
        modal.style.display = "none"; // Hide if clicked outside modal
    }
};


// Callback request function
function requestCallback(roomName) {
    const email = prompt(`Enter your email to request more information about ${roomName}:`);
    if (email) {
        // Submit the request via JavaScript or redirect to a form
        alert(`Request for ${roomName} has been sent. Our team will contact you at ${email}.`);
        // Optionally send the request to the server
        console.log(`Callback request sent for ${roomName} to ${email}`);
    }
}

// Validate password function for registration
function validatePassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }
    return true;
}


//Basket array to store items
let basket = [];

// Add item to the basket
function addToBasket(itemName, itemPrice) {
    basket.push({name: itemName, price: itemPrice });
    alert(`${itemName} has been added to your basket.`);
    localStorage.setItem('basket', JSON.stringify(basket)); // Save basket to localStorage
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("basket-page")) {
        // Populate basket items
        const basket = JSON.parse(localStorage.getItem("basket")) || [];
        const basketItemsDiv = document.getElementById("basket-items");
        const totalPriceSpan = document.getElementById("total-price");

        let total = 0;
        basket.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.textContent = `${item.name} - £${item.price.toFixed(2)}`;
            basketItemsDiv.appendChild(itemDiv);
            total += item.price;
        });

        totalPriceSpan.textContent = total.toFixed(2);
    }
});


// Load basket from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedBasket = localStorage.getItem('basket');
    if (storedBasket) {
        basket = JSON.parse(storedBasket);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // BASKET PAGE LOGIC
    if (document.body.classList.contains("basket-page")) {
        // Populate basket items
        const basket = JSON.parse(localStorage.getItem("basket")) || [];
        const basketItemsDiv = document.getElementById("basket-items");
        const totalPriceSpan = document.getElementById("total-price");

        let total = 0;
        basketItemsDiv.innerHTML = ''; // Clear previous entries

        basket.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.textContent = `${item.name} - £${item.price.toFixed(2)}`;
            basketItemsDiv.appendChild(itemDiv);
            total += item.price;
        });

        totalPriceSpan.textContent = total.toFixed(2);

        // Store total price in localStorage for checkout
        localStorage.setItem("basketTotal", total.toFixed(2));

        // Proceed to payment page when clicking checkout
        const checkoutBtn = document.getElementById("checkout-btn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                window.location.href = "payment.html"; // Redirect to payment page
            });
        }
    }

    // PAYMENT PAGE LOGIC
    if (document.body.classList.contains("payment-page")) {
        // Get basket total from localStorage
        const paymentTotalSpan = document.getElementById("payment-total");
        const basketTotal = localStorage.getItem("basketTotal") || "0.00";
        paymentTotalSpan.textContent = basketTotal;
    }
});
//Resoursces toggle dropdown button
const dropdownButton = document.getElementById("dropdownButton");

if (dropdownButton) {  // ✅ Check if the button exists before adding event listener
    dropdownButton.addEventListener("click", function() {
        document.getElementById("trainingDropdown").classList.toggle("show");
    });
} else {
    console.warn("Dropdown button not found. This is expected on non-resources pages.");
}


// Login Functionality
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch("http://localhost:5000/api/login", {  // ✅ Correct API route
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");

                // ✅ Store user details in localStorage
                localStorage.setItem("username", data.username);
                localStorage.setItem("email", email);
                localStorage.setItem("isLoggedIn", "true");

                // ✅ Redirect to user profile page
                window.location.href = "user_profile.html";
            } else {
                alert(data.error || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Server error. Please try again later.");
        }
    });
}


// Register Functionality
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {  // ✅ FIXED API ROUTE
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration successful!");
                localStorage.setItem("username", username);
                localStorage.setItem("email", email);
                localStorage.setItem("joinDate", new Date().toLocaleDateString());
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "user_profile.html"; 
            } else {
                alert(data.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Server error. Please try again later.");
        }
    });
} else {
    console.warn("Register form not found on this page.");
}
