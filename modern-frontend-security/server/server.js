const express = require("express");
const path = require("path");
const crypto = require("crypto");

const { user, defaultSettings } = require("./data");

const app = express();
const PORT = 3000;

app.use(express.json());

/*
 * Content Security Policy & Clickjacking Protection Middleware
 */
app.use((req, res, next) => {
    const nonce = crypto.randomBytes(16).toString("base64");
    res.locals.nonce = nonce;

    // Content Security Policy
    res.setHeader(
        "Content-Security-Policy",
        `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none';`
    );

    // Clickjacking defense for legacy browsers
    res.setHeader("X-Frame-Options", "DENY");

    next();
});

/*
 * Data Transfer Object (DTO) for SSR Data Minimization
 */
function createUserDTO(userData) {
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
    };
}

/*
 * Allowed settings properties to prevent Prototype Pollution
 */
const allowedKeys = new Set(["theme", "language", "fontSize"]);

/*
 * Home page
 */
app.get("/", (req, res) => {
    // SSR Token Leakage Prevention: Send safe DTO instead of full user object
    const clientUser = createUserDTO(user);
    const initialUserData = JSON.stringify(clientUser);

    // Store sensitive authentication token in an HttpOnly cookie
    res.setHeader(
        "Set-Cookie",
        `sessionToken=${user.sessionToken}; HttpOnly; SameSite=Lax; Path=/`
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >
            <title>User Security Dashboard</title>
            <link rel="stylesheet" href="/styles.css">
        </head>

        <body>
            <header class="header">
                <h1>User Security Dashboard</h1>
                <nav>
                    <a href="/">Dashboard</a>
                    <a href="/account">Account Settings</a>
                </nav>
            </header>

            <main class="container">
                <div id="app"></div>

                <section class="settings">
                    <h2>User Settings</h2>

                    <label>
                        Theme:
                        <select id="theme">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>

                    <label>
                        Language:
                        <select id="language">
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                    </label>

                    <label>
                        Font Size:
                        <select id="fontSize">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </label>

                    <button id="save-settings">
                        Save Settings
                    </button>

                    <p id="settings-status"></p>
                </section>
            </main>

            <script nonce="${res.locals.nonce}">
                window.initialUser = ${initialUserData};
            </script>

            <script src="/app.js"></script>
        </body>
        </html>
    `);
});

/*
 * Profile API - SSR Token Leakage Prevention: Exposes only safe DTO data
 */
app.get("/api/profile", (req, res) => {
    res.json(createUserDTO(user));
});

/*
 * Settings API - Prototype Pollution Prevention: Allowlist properties & prototype-free object
 */
app.get("/api/settings", (req, res) => {
    res.json(defaultSettings);
});

app.post("/api/settings", (req, res) => {
    const incomingSettings = req.body;
    const settings = Object.create(null);

    for (const key in incomingSettings) {
        if (allowedKeys.has(key)) {
            settings[key] = incomingSettings[key];
        }
    }

    res.json({
        message: "Settings saved successfully.",
        settings
    });
});

/*
 * Account page
 */
app.get("/account", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >
            <title>Account Settings</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f4f4f4;
                    margin: 0;
                    padding: 40px;
                }

                .account-card {
                    max-width: 600px;
                    margin: auto;
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                }

                .danger {
                    background: #c62828;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    cursor: pointer;
                    border-radius: 4px;
                }
            </style>
        </head>

        <body>
            <div class="account-card">
                <h1>Account Settings</h1>

                <p>
                    <strong>Name:</strong>
                    ${user.name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${user.email}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${user.role}
                </p>

                <button
                    id="delete-account"
                    class="danger"
                >
                    Delete Account
                </button>

                <p id="status"></p>
            </div>

            <script nonce="${res.locals.nonce}">
                document
                    .getElementById("delete-account")
                    .addEventListener("click", () => {
                        document.getElementById("status").textContent =
                            "Account deletion action triggered.";
                    });
            </script>
        </body>
        </html>
    `);
});

app.use(express.static(path.join(__dirname, "..", "client")));

app.listen(PORT, () => {
    console.log(`Application running at http://localhost:${PORT}`);
});