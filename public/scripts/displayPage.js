// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Default to dark mode
    document.body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");
    document.getElementById("darkMode-button").checked = (savedTheme === "dark");
});


// Toggle dark mode functionality
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}


// Fetch Minecraft avatar with random UUID
async function getMinecraftBody() {

    // Array of popular Minecraft UUIDs for random selection
    const minecraftUUIDs = [
        "f47c9b3d-f6de-4c85-84a3-67a90985da5e",
        "24aeb2f1-09b9-4137-b3f7-9d6b380547a7",
        "0346c9a9-51ef-4785-b888-dbd0d6c5f594",
        "f5fe670f-5692-4e8a-8eae-b9065b4bba0a",
        "dffb28bb-7209-4665-9804-32113bb8a3b7",
        "9c8b415d-1b5c-42e9-b4a0-63c5c7a89e9a",
        "e9fe317d-1db7-4be9-bf94-e601d0b27745",
        "9b5225b2-79c4-4eb6-8a5a-8f8f5f56491e"
    ];
    const randomUUID = minecraftUUIDs[Math.floor(Math.random() * minecraftUUIDs.length)];

    const url = `https://crafatar.com/renders/body/${randomUUID}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Image not found");

        document.getElementById("minecraft-body").src = url;
        document.getElementById("minecraft-body").alt = "Minecraft Avatar";
    } catch (error) {
        console.error("Error fetching the Minecraft body:", error);
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

// Fetch user's top contributions
async function getTopContributions(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        if (!response.ok) throw new Error("Failed to fetch repositories");

        const repos = await response.json();

        // Sort repos by stargazers_count in descending order
        const sortedRepos = repos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
        const topRepo = sortedRepos[0];
        
        // Return the top repository's name and stargazer count, if available
        return topRepo
            ? `${topRepo.name} ⭐ ${formatNumberToK(topRepo.stargazers_count) || 0}`
            : "N/A";
    } catch (error) {
        console.error("Error fetching top contributions:", error);
        return "None";
    }
}

function formatNumberToK(number) {
    if (number >= 1000) {
        // Divide the number by 1000 and round to one decimal place
        let formatted = (number / 1000).toFixed(1);
        return `${formatted}k`;
    }
    return number.toString(); // Return the number as-is if less than 1000
}

async function updateStats() {
    const userData = JSON.parse(window.localStorage.getItem("userData"));

    if (userData) {
        console.log('Loaded user data:', userData);

        // Update GitHub stats
        document.getElementById("github-name").textContent = userData.login || "Name not available";
        document.getElementById("github-pfp").src = userData.avatar_url || "default-avatar.png";
        document.getElementById("github-repos").textContent = userData.public_repos || "0";
        document.getElementById("github-followers").textContent = formatNumberToK(userData.followers) || "0";
        document.getElementById("github-following").textContent = formatNumberToK(userData.following) || "0";

        document.querySelector(".profile-details").style.position = "normal";

        
        const hireableElement = document.getElementById("github-hireable");
        hireableElement.textContent = userData.hireable ? "Available for work" : "Unavailable for work";
        hireableElement.style.color = userData.hireable ? "green" : "rgb(205, 33, 33)";

        const locationElement = document.getElementById("github-location");
        if (userData.location) {
            locationElement.innerHTML = `<img src="./images/location.png" alt="" class="location-icon"> ${userData.location}`;
        } else {
            const locationElementParent = document.querySelector(".profile-details");
            locationElementParent.style.position = "relative";
            locationElement.style.display = "none";
            locationElement.style.position = "absolute";
        }
        

        const createdAtElement = document.getElementById("github-created-at");
        if (userData.created_at) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = new Date(userData.created_at).toLocaleDateString('en-US', options);
            createdAtElement.innerHTML = `<i class="fas fa-calendar-alt"></i> Joined on ${formattedDate}`;
        } else {
            createdAtElement.textContent = "Join date not available";
        }

        // Update top contributions
         const topContributions = await getTopContributions(userData.login);
        document.getElementById("top-contributions").textContent = topContributions || "No data available";

        // Set "View GitHub" button link
        const viewGitHubButton = document.getElementById("github-link");
        viewGitHubButton.href = `https://github.com/${userData.login}`;

    } else {
        userInfoDiv.innerHTML = '<p>No user data available.</p>';
    }
}

// Initialize
getMinecraftBody();
updateStats();