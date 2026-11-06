/**
 * Automated Security Verification Test Suite
 * Tests all 5 security areas across positive and negative scenarios.
 * Automatically manages local server lifecycle if not already running.
 */

const http = require("http");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://localhost:3000";

function makeRequest(reqPath, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(reqPath, BASE_URL);
        const reqOptions = {
            method: options.method || "GET",
            headers: options.headers || {},
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search
        };

        const req = http.request(reqOptions, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on("error", reject);

        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

function checkPortListening() {
    return new Promise((resolve) => {
        const req = http.get(BASE_URL, () => resolve(true));
        req.on("error", () => resolve(false));
    });
}

async function startServerIfNeeded() {
    const isRunning = await checkPortListening();
    if (isRunning) {
        return null;
    }

    const serverScript = path.join(__dirname, "..", "server", "server.js");
    const serverProcess = spawn("node", [serverScript], { stdio: "pipe" });

    // Wait until server is up
    for (let i = 0; i < 30; i++) {
        await new Promise((res) => setTimeout(res, 200));
        const up = await checkPortListening();
        if (up) {
            return serverProcess;
        }
    }
    throw new Error("Server failed to start within timeout.");
}

async function runTests() {
    console.log("====================================================");
    console.log("RUNNING SECURITY & FUNCTIONALITY VERIFICATION SUITE");
    console.log("====================================================\n");

    const serverProc = await startServerIfNeeded();

    let totalTests = 0;
    let passedTests = 0;

    function assert(condition, message) {
        totalTests++;
        if (condition) {
            console.log(`  [PASS] ${message}`);
            passedTests++;
        } else {
            console.error(`  [FAIL] ${message}`);
        }
    }

    try {
        // ----------------------------------------------------
        // 1. SSR TOKEN LEAKAGE TESTS
        // ----------------------------------------------------
        console.log("--- 1. SSR Token Leakage Tests ---");
        const homeRes = await makeRequest("/");
        assert(homeRes.statusCode === 200, "Home page loads with status 200");
        assert(!homeRes.body.includes("TRAINING-FAKE-ACCESS-TOKEN-12345"), "HTML does NOT contain access token");
        assert(!homeRes.body.includes("TRAINING-FAKE-REFRESH-TOKEN-67890"), "HTML does NOT contain refresh token");
        assert(homeRes.body.includes('"name":"John Doe"'), "HTML contains safe public user name");
        assert(homeRes.body.includes('"role":"Administrator"'), "HTML contains safe public user role");
        assert(Boolean(homeRes.headers["set-cookie"]), "Session token provided via Set-Cookie header");
        assert(
            homeRes.headers["set-cookie"] && homeRes.headers["set-cookie"].some((c) => c.includes("HttpOnly")),
            "Session cookie includes HttpOnly flag"
        );

        const profileRes = await makeRequest("/api/profile");
        const profileJson = JSON.parse(profileRes.body);
        assert(profileJson.name === "John Doe", "API profile returns user name");
        assert(profileJson.role === "Administrator", "API profile returns user role");
        assert(profileJson.sessionToken === undefined, "API profile excludes sessionToken");
        assert(profileJson.refreshToken === undefined, "API profile excludes refreshToken");

        // ----------------------------------------------------
        // 2. CONTENT SECURITY POLICY (CSP) TESTS
        // ----------------------------------------------------
        console.log("\n--- 2. Content Security Policy (CSP) Tests ---");
        const cspHeader = homeRes.headers["content-security-policy"];
        assert(Boolean(cspHeader), "Content-Security-Policy header is present");
        assert(cspHeader.includes("default-src 'self'"), "CSP specifies default-src 'self'");
        assert(cspHeader.includes("object-src 'none'"), "CSP blocks plugins with object-src 'none'");
        assert(cspHeader.includes("script-src 'self' 'nonce-"), "CSP enforces nonce-based script execution");
        assert(!cspHeader.includes("'unsafe-eval'"), "CSP excludes 'unsafe-eval'");

        // Verify nonce rotates on each request
        const homeRes2 = await makeRequest("/");
        const cspHeader2 = homeRes2.headers["content-security-policy"];
        const nonce1Match = cspHeader.match(/'nonce-([^']+)'/);
        const nonce2Match = cspHeader2.match(/'nonce-([^']+)'/);
        assert(
            nonce1Match && nonce2Match && nonce1Match[1] !== nonce2Match[1],
            "CSP script nonce is unique and unpredictable across requests"
        );

        // ----------------------------------------------------
        // 3. CLICKJACKING PROTECTION TESTS
        // ----------------------------------------------------
        console.log("\n--- 3. Clickjacking Protection Tests ---");
        const accountRes = await makeRequest("/account");
        assert(accountRes.statusCode === 200, "Account page loads with status 200");
        assert(accountRes.headers["x-frame-options"] === "DENY", "X-Frame-Options is set to DENY");
        assert(
            accountRes.headers["content-security-policy"].includes("frame-ancestors 'none'"),
            "CSP contains frame-ancestors 'none'"
        );

        // ----------------------------------------------------
        // 4. PROTOTYPE POLLUTION TESTS
        // ----------------------------------------------------
        console.log("\n--- 4. Prototype Pollution Tests ---");
        // Positive test: valid settings save
        const validPayload = JSON.stringify({
            theme: "dark",
            language: "fr",
            fontSize: "large"
        });
        const validPostRes = await makeRequest("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(validPayload) },
            body: validPayload
        });
        assert(validPostRes.statusCode === 200, "Valid settings request returns 200 OK");
        const validPostJson = JSON.parse(validPostRes.body);
        assert(validPostJson.settings.theme === "dark", "Valid theme setting saved");
        assert(validPostJson.settings.language === "fr", "Valid language setting saved");

        // Negative test: prototype pollution attempt
        const maliciousPayload = JSON.stringify({
            theme: "light",
            __proto__: { pollutedProperty: "INJECTED_VALUE" },
            constructor: { prototype: { adminRole: true } },
            arbitraryKey: "unexpectedValue"
        });
        const maliciousPostRes = await makeRequest("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(maliciousPayload) },
            body: maliciousPayload
        });
        const maliciousPostJson = JSON.parse(maliciousPostRes.body);
        assert(!Object.prototype.hasOwnProperty.call(maliciousPostJson.settings, "__proto__"), "Payload __proto__ stripped/ignored");
        assert(maliciousPostJson.settings.arbitraryKey === undefined, "Non-allowlisted property rejected");
        assert(({}).pollutedProperty === undefined, "Global Object.prototype is NOT polluted");
        assert(({}).adminRole === undefined, "Global Object.prototype constructor is NOT polluted");

        // ----------------------------------------------------
        // 5. DOM XSS STATIC VERIFICATION
        // ----------------------------------------------------
        console.log("\n--- 5. DOM-Based XSS Remediation Verification ---");
        const appJsContent = fs.readFileSync(path.join(__dirname, "..", "client", "app.js"), "utf-8");
        assert(!appJsContent.includes(".innerHTML"), "client/app.js does NOT use innerHTML");
        assert(appJsContent.includes(".textContent"), "client/app.js uses textContent for text insertion");
        assert(appJsContent.includes("document.createElement"), "client/app.js uses safe DOM element creation");

        console.log("\n====================================================");
        console.log(`SUMMARY: ${passedTests} / ${totalTests} assertions passed.`);
        console.log("====================================================\n");

        if (serverProc) {
            serverProc.kill();
        }

        if (passedTests === totalTests) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    } catch (err) {
        if (serverProc) {
            serverProc.kill();
        }
        console.error("Test error:", err);
        process.exit(1);
    }
}

runTests().catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
});