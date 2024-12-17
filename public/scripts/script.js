// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Default to dark mode
    document.documentElement.classList.toggle("dark-mode", savedTheme === "dark");
    document.getElementById("darkMode-button").checked = (savedTheme === "dark");
});

// Toggle dark mode functionality
function toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle("dark-mode");
    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

// Show and animate error message
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    errorMessage.style.opacity = 0;
    errorMessage.style.transform = "translateY(20px)";
    setTimeout(() => {
        errorMessage.style.opacity = 1;
        errorMessage.style.transform = "translateY(0)";
    }, 10);

    // Remove the error after 3 seconds
    setTimeout(() => {
        errorMessage.style.opacity = 0;
        errorMessage.style.transform = "translateY(20px)";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 500);
    }, 3000);
}

// Handle form submission
document.getElementById("usernameForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const usernameInput = document.getElementById("username");
    const submitButton = document.querySelector("#usernameForm button[type='submit']"); // Define the submit button
    const username = usernameInput.value.trim();
    console.log("Submitted username:", username);

    if (!username) {
        showError("Username cannot be empty.");
        return;
    }

    // Disable the input box and button, show loading state
    usernameInput.disabled = true;
    usernameInput.style.filter = "blur(1px)";
    usernameInput.placeholder = "Loading...";
    submitButton.disabled = true;

    try {
        console.log("Before sending.");
        const response = await fetch("/validate-username", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });
        console.log("After sending.");
        const result = await response.json();
        console.log("Server response:", result);

        if (response.ok) {
            window.localStorage.setItem("userData", JSON.stringify(result));
            window.location.href = "./displayPage.html";
        } else {
            // Handle errors returned by the server
            if (response.status === 404) {
                showError("User not found");
            } else {
                showError("Something went wrong. Please try again later.");
            }
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle network-related errors (e.g., no internet connection)
        if (error.message === "Failed to fetch") {
            showError("Please check your internet connection.");
        } else {
            showError("Something went wrong. Please try again later.");
        }
    } finally {
        // Reset input fields state regardless of success/failure in the background
        resetInputField(usernameInput, submitButton);
    }
});

// Reset the input field and submit button
function resetInputField(input, button) {
    setTimeout(() => {
        input.disabled = false;
        input.style.filter = "none";
        input.value = "";
        input.placeholder = "Enter your GitHub username...";
        button.disabled = false;
    }, 1000); // A slight delay to simulate smooth clearing in the background
}
