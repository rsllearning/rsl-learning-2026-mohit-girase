# GitHub Repository Tracker

A lightweight Vanilla JavaScript web application that tracks public GitHub repositories for any user, displays owner profile information, and automatically refreshes repository data every 60 seconds.

## Features & Requirements

- **Part 1 – Fetch Public Repositories**:
  - Accepts a GitHub username input.
  - Fetches public repositories using `https://api.github.com/users/{username}/repos`.
  - Displays repository details (name, description, language, stars, forks, last updated date) on the page and logs data to the console.
- **Part 2 – Fetch Owner Details**:
  - Fetches owner's profile details using `https://api.github.com/users/{username}`.
  - Displays avatar, name, username, bio, follower count, and public repos count.
- **Part 3 – Refresh Data Automatically**:
  - Automatically updates repository and profile data every 60 seconds using `setInterval()`.
  - Shows "Last refreshed" timestamp and a live countdown to the next refresh.
- **Part 4 – Error Handling**:
  - Gracefully handles invalid usernames (404), API rate limits (403), network failures, and users with zero public repositories.
- **Part 5 – Async/Await**:
  - Built with clean asynchronous JavaScript (`async/await`) and structured `try...catch` blocks.

## How to Run

1. Open `index.html` directly in your web browser, or serve it using any local static server (e.g. `npx serve`, Live Server in VS Code, or Python `python3 -m http.server 3000`).
2. Enter a GitHub username (e.g., `octocat`, `torvalds` or `<your username>`) and click **Track**.
