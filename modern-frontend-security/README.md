# Modern Front-End Security – User Security Dashboard

## Setup & Running

```bash
# Install dependencies
npm install

# Start application (Dashboard: http://localhost:3000 | Account: http://localhost:3000/account)
npm start

# Run automated security verification suite (30/30 tests passed)
npm test
```

---

## 1. Vulnerabilities Identified

| # | Domain | File Location | Root Cause | Fix Applied |
| :- | :--- | :--- | :--- | :--- |
| 1 | **DOM-Based XSS** | `client/app.js` | Untrusted URL query param (`location.search`) rendered directly into `innerHTML` | Replaced with `document.createElement()` and `.textContent` |
| 2 | **Prototype Pollution** | `client/app.js`, `server/server.js` | Unrestricted key iteration on plain objects (`{}`) | Enforced `allowedKeys` allowlist and `Object.create(null)` |
| 3 | **SSR Token Leakage** | `server/server.js` | Raw `user` object with `sessionToken` & `refreshToken` serialized into client HTML | Implemented DTO pattern (`createUserDTO`) and `HttpOnly` cookie |
| 4 | **Missing CSP** | `server/server.js` | No Content Security Policy header defined | Configured strict CSP with per-request cryptographic nonces |
| 5 | **Clickjacking** | `server/server.js` | Missing frame protection headers on sensitive `/account` page | Added `frame-ancestors 'none'` in CSP and `X-Frame-Options: DENY` |

---

## 2. Vulnerable Implementation, Fixes & Verification

### 2.1 DOM-Based Cross-Site Scripting (DOM XSS)
* **Vulnerable Implementation (`client/app.js`):**
  ```javascript
  const username = params.get("name") || window.initialUser?.name || "Guest";
  app.innerHTML = `<h2>Welcome, ${username}</h2>...`;
  ```
* **Security Fix:** Replaced `innerHTML` with safe DOM construction and `textContent`:
  ```javascript
  const profileCard = document.createElement("section");
  const heading = document.createElement("h2");
  heading.textContent = `Welcome, ${username}`;
  profileCard.appendChild(heading);
  app.replaceChildren(profileCard);
  ```
* **Testing & Verification:**
  * *Positive:* Visiting `/?name=Alice` renders `Welcome, Alice`.
  * *Negative:* Visiting `/?name=<img src=x onerror=alert(1)>` renders literal text; no script executes.

### 2.2 Prototype Pollution
* **Vulnerable Implementation (`client/app.js` & `server/server.js`):**
  ```javascript
  const settings = {};
  for (const key in incomingSettings) {
      settings[key] = incomingSettings[key];
  }
  ```
* **Security Fix:** Added property allowlist and prototype-free object dictionary:
  ```javascript
  const allowedKeys = new Set(["theme", "language", "fontSize"]);
  const settings = Object.create(null);
  for (const key in incomingSettings) {
      if (allowedKeys.has(key)) {
          settings[key] = incomingSettings[key];
      }
  }
  ```
* **Testing & Verification:**
  * *Positive:* Valid settings (`theme`, `language`, `fontSize`) save successfully.
  * *Negative:* Payloads with `__proto__` or `constructor` are ignored; `({}).polluted` remains `undefined`.

### 2.3 SSR Token Leakage
* **Vulnerable Implementation (`server/server.js`):**
  ```javascript
  const initialUserData = JSON.stringify(user); // Leaked sessionToken & refreshToken in HTML
  ```
* **Security Fix:** Applied Data Transfer Object (DTO) pattern and moved token to `HttpOnly` cookie:
  ```javascript
  function createUserDTO(userData) {
      return { id: userData.id, name: userData.name, email: userData.email, role: userData.role };
  }
  const clientUser = createUserDTO(user);
  res.setHeader("Set-Cookie", `sessionToken=${user.sessionToken}; HttpOnly; SameSite=Lax; Path=/`);
  ```
* **Testing & Verification:**
  * *Positive:* UI displays name, email, and role correctly.
  * *Negative:* Inspecting HTML source, `window.initialUser`, and `/api/profile` confirms zero tokens are exposed.

### 2.4 Content Security Policy (CSP)
* **Vulnerable Implementation:** No `Content-Security-Policy` header was configured on HTTP responses.
* **Security Fix:** Configured strict CSP middleware generating dynamic 16-byte base64 nonces:
  ```javascript
  const nonce = crypto.randomBytes(16).toString("base64");
  res.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none';`
  );
  ```
* **Testing & Verification:**
  * *Positive:* Legitimate scripts with `<script nonce="...">` execute without errors.
  * *Negative:* Injected scripts lacking a matching nonce are blocked by the browser. Nonce rotates per request.

### 2.5 Clickjacking Protection
* **Vulnerable Implementation:** Sensitive `/account` page containing account deletion action allowed external iframe embedding.
* **Security Fix:** Added modern CSP directive and legacy header:
  ```javascript
  // In CSP: frame-ancestors 'none';
  res.setHeader("X-Frame-Options", "DENY");
  ```
* **Testing & Verification:**
  * *Positive:* Direct navigation to `/account` works normally.
  * *Negative:* Embedding `/account` inside `test/iframe-test.html` is blocked by the browser.

---

## 3. Defense-in-Depth Approach

The application uses layered defenses so no single control is a single point of failure:
1. **Input & State Layer:** Property allowlists (`allowedKeys`), prototype-free objects (`Object.create(null)`), and DTO data minimization.
2. **Execution Layer:** Safe DOM construction (`textContent`) prevents markup interpretation; strict nonce-based CSP blocks script execution if untrusted input ever reaches a sink.
3. **Browser & Network Layer:** Session tokens isolated in `HttpOnly` / `SameSite=Lax` cookies; `frame-ancestors 'none'` and `X-Frame-Options: DENY` prevent clickjacking.

---

## 4. Automated Verification Test Output

Running `npm test` executes the complete verification suite across all five security domains:

```text
====================================================
RUNNING SECURITY & FUNCTIONALITY VERIFICATION SUITE
====================================================

--- 1. SSR Token Leakage Tests ---
  [PASS] Home page loads with status 200
  [PASS] HTML does NOT contain access token
  [PASS] HTML does NOT contain refresh token
  [PASS] HTML contains safe public user name
  [PASS] HTML contains safe public user role
  [PASS] Session token provided via Set-Cookie header
  [PASS] Session cookie includes HttpOnly flag
  [PASS] API profile returns user name
  [PASS] API profile returns user role
  [PASS] API profile excludes sessionToken
  [PASS] API profile excludes refreshToken

--- 2. Content Security Policy (CSP) Tests ---
  [PASS] Content-Security-Policy header is present
  [PASS] CSP specifies default-src 'self'
  [PASS] CSP blocks plugins with object-src 'none'
  [PASS] CSP enforces nonce-based script execution
  [PASS] CSP excludes 'unsafe-eval'
  [PASS] CSP script nonce is unique and unpredictable across requests

--- 3. Clickjacking Protection Tests ---
  [PASS] Account page loads with status 200
  [PASS] X-Frame-Options is set to DENY
  [PASS] CSP contains frame-ancestors 'none'

--- 4. Prototype Pollution Tests ---
  [PASS] Valid settings request returns 200 OK
  [PASS] Valid theme setting saved
  [PASS] Valid language setting saved
  [PASS] Payload __proto__ stripped/ignored
  [PASS] Non-allowlisted property rejected
  [PASS] Global Object.prototype is NOT polluted
  [PASS] Global Object.prototype constructor is NOT polluted

--- 5. DOM-Based XSS Remediation Verification ---
  [PASS] client/app.js does NOT use innerHTML
  [PASS] client/app.js uses textContent for text insertion
  [PASS] client/app.js uses safe DOM element creation

====================================================
SUMMARY: 30 / 30 assertions passed.
====================================================
```

