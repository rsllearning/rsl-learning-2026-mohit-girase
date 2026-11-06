const app = document.getElementById("app");

const params = new URLSearchParams(window.location.search);

const username =
    params.get("name") ||
    window.initialUser?.name ||
    "Guest";

// DOM-Based Cross-Site Scripting Remediation:
// Construct DOM elements using safe DOM APIs and textContent instead of innerHTML
const profileCard = document.createElement("section");
profileCard.className = "profile-card";

const heading = document.createElement("h2");
heading.textContent = `Welcome, ${username}`;

const emailParagraph = document.createElement("p");
emailParagraph.textContent = `Email: ${window.initialUser?.email || "Unknown"}`;

const roleParagraph = document.createElement("p");
roleParagraph.textContent = `Role: ${window.initialUser?.role || "User"}`;

profileCard.appendChild(heading);
profileCard.appendChild(emailParagraph);
profileCard.appendChild(roleParagraph);

app.replaceChildren(profileCard);

// Prototype Pollution Remediation:
// Allowlist supported configuration properties and use Object.create(null)
const allowedKeys = new Set(["theme", "language", "fontSize"]);

function prepareSettings(userSettings) {
    const settings = Object.create(null);

    for (const key in userSettings) {
        if (allowedKeys.has(key)) {
            settings[key] = userSettings[key];
        }
    }

    return settings;
}

const saveButton = document.getElementById("save-settings");

saveButton.addEventListener("click", async () => {
    const theme = document.getElementById("theme").value;
    const language = document.getElementById("language").value;
    const fontSize = document.getElementById("fontSize").value;

    const settings = prepareSettings({
        theme,
        language,
        fontSize
    });

    try {
        const response = await fetch("/api/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(settings)
        });

        const result = await response.json();

        document.getElementById("settings-status").textContent =
            result.message;
    } catch (error) {
        document.getElementById("settings-status").textContent =
            "Unable to save settings.";
    }
});