// DOM Elements
const searchForm = document.getElementById('search-form');
const usernameInput = document.getElementById('username-input');
const searchBtn = document.getElementById('search-btn');

const statusSection = document.getElementById('status-section');
const statusMessage = document.getElementById('status-message');
const refreshInfo = document.getElementById('refresh-info');
const lastUpdatedSpan = document.getElementById('last-updated');
const countdownTimerSpan = document.getElementById('countdown-timer');
const manualRefreshBtn = document.getElementById('manual-refresh-btn');

const ownerSection = document.getElementById('owner-section');
const reposSection = document.getElementById('repos-section');
const reposContainer = document.getElementById('repos-container');
const reposHeading = document.getElementById('repos-heading');

// Application State
let currentUsername = '';
let autoRefreshIntervalId = null;
let countdownIntervalId = null;
const REFRESH_INTERVAL_SECONDS = 60;
let remainingSeconds = REFRESH_INTERVAL_SECONDS;

// Event Listeners
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) {
    currentUsername = username;
    startTracking(username);
  }
});

manualRefreshBtn.addEventListener('click', () => {
  if (currentUsername) {
    trackUser(currentUsername, true);
    resetCountdown();
  }
});

/**
 * Start tracking user and initialize interval timers
 * @param {string} username 
 */
function startTracking(username) {
  // Clear any existing timers
  clearInterval(autoRefreshIntervalId);
  clearInterval(countdownIntervalId);

  // Initial fetch
  trackUser(username, false);

  // Setup periodic auto-refresh every 60 seconds
  autoRefreshIntervalId = setInterval(() => {
    console.log(`[Auto-Refresh] Fetching latest data for "${currentUsername}"...`);
    trackUser(currentUsername, true);
    resetCountdown();
  }, REFRESH_INTERVAL_SECONDS * 1000);

  // Setup 1-second countdown display
  resetCountdown();
  countdownIntervalId = setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds < 0) {
      remainingSeconds = REFRESH_INTERVAL_SECONDS;
    }
    countdownTimerSpan.textContent = remainingSeconds;
  }, 1000);
}

/**
 * Reset countdown timer display
 */
function resetCountdown() {
  remainingSeconds = REFRESH_INTERVAL_SECONDS;
  countdownTimerSpan.textContent = remainingSeconds;
}

/**
 * Fetch owner details and public repositories using async/await
 * @param {string} username 
 * @param {boolean} isBackgroundRefresh 
 */
async function trackUser(username, isBackgroundRefresh = false) {
  if (!isBackgroundRefresh) {
    showLoading(`Fetching information for "${username}"...`);
    hideDataSections();
  }

  try {
    // Fetch Owner Details
    const ownerData = await fetchOwnerDetails(username);

    // Fetch Public Repositories
    const reposData = await fetchPublicRepositories(username);

    // Log to console
    console.log(`[GitHub Tracker] Successfully fetched data for ${username}:`, {
      owner: ownerData,
      repositories: reposData
    });

    // Display Owner Details and Repository Information
    displayOwnerDetails(ownerData);
    displayRepositories(reposData, username);

    // Update refresh timestamps
    const now = new Date();
    lastUpdatedSpan.textContent = now.toLocaleTimeString();
    statusSection.style.display = 'block';
    refreshInfo.style.display = 'flex';
    hideStatusMessage();
  } catch (error) {
    console.error(`[GitHub Tracker Error]:`, error);
    // Handle errors gracefully
    handleError(error);
  }
}

/**
 * Part 2: Fetch owner profile information using GitHub Users API
 * @param {string} username 
 * @returns {Promise<Object>}
 */
async function fetchOwnerDetails(username) {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`USER_NOT_FOUND`);
    } else if (response.status === 403) {
      throw new Error(`RATE_LIMITED`);
    } else {
      throw new Error(`HTTP_${response.status}`);
    }
  }

  return await response.json();
}

/**
 * Part 1: Fetch all public repositories for the specified user using GitHub REST API
 * @param {string} username 
 * @returns {Promise<Array>}
 */
async function fetchPublicRepositories(username) {
  // Sorting by updated to show latest changes
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`USER_NOT_FOUND`);
    } else if (response.status === 403) {
      throw new Error(`RATE_LIMITED`);
    } else {
      throw new Error(`HTTP_${response.status}`);
    }
  }

  return await response.json();
}

/**
 * Render owner details to the DOM
 * @param {Object} owner 
 */
function displayOwnerDetails(owner) {
  ownerSection.innerHTML = `
    <div class="owner-card">
      <img src="${escapeHtml(owner.avatar_url)}" alt="${escapeHtml(owner.login)}" class="owner-avatar" />
      <div class="owner-info">
        <h2>
          <a href="${escapeHtml(owner.html_url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(owner.name || owner.login)}
          </a>
        </h2>
        <div class="owner-username">@${escapeHtml(owner.login)}</div>
        ${owner.bio ? `<p class="owner-bio">${escapeHtml(owner.bio)}</p>` : ''}
        <div class="owner-stats">
          <span><strong>${owner.public_repos}</strong> Public Repos</span>
          <span><strong>${owner.followers}</strong> Followers</span>
          <span><strong>${owner.following}</strong> Following</span>
          ${owner.location ? `<span>📍 ${escapeHtml(owner.location)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
  ownerSection.style.display = 'block';
}

/**
 * Render repositories list to the DOM
 * @param {Array} repos 
 * @param {string} username 
 */
function displayRepositories(repos, username) {
  reposContainer.innerHTML = '';
  reposSection.style.display = 'block';

  // Part 4: Handle user with no public repositories
  if (!repos || repos.length === 0) {
    reposHeading.textContent = `Public Repositories (0)`;
    reposContainer.innerHTML = `
      <div class="status-message empty">
        User <strong>${escapeHtml(username)}</strong> does not have any public repositories.
      </div>
    `;
    return;
  }

  reposHeading.textContent = `Public Repositories (${repos.length})`;

  repos.forEach(repo => {
    const repoCard = document.createElement('div');
    repoCard.className = 'repo-card';

    const updatedDate = new Date(repo.updated_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    repoCard.innerHTML = `
      <div class="repo-header">
        <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="repo-name">
          ${escapeHtml(repo.name)}
        </a>
        <span class="repo-visibility">${escapeHtml(repo.visibility || 'public')}</span>
      </div>
      <p class="repo-description">${escapeHtml(repo.description || 'No description provided.')}</p>
      <div class="repo-meta">
        ${repo.language ? `<span class="meta-item">💻 ${escapeHtml(repo.language)}</span>` : ''}
        <span class="meta-item">⭐ ${repo.stargazers_count}</span>
        <span class="meta-item">🍴 ${repo.forks_count}</span>
        <span class="meta-item">🕒 Updated ${updatedDate}</span>
      </div>
    `;

    reposContainer.appendChild(repoCard);
  });
}

/**
 * Show loading message
 * @param {string} message 
 */
function showLoading(message) {
  statusSection.style.display = 'block';
  statusMessage.style.display = 'block';
  statusMessage.className = 'status-message info';
  statusMessage.textContent = message;
}

/**
 * Hide loading / status banner
 */
function hideStatusMessage() {
  statusMessage.style.display = 'none';
}

/**
 * Hide owner and repository sections
 */
function hideDataSections() {
  ownerSection.style.display = 'none';
  reposSection.style.display = 'none';
}

/**
 * Part 4: Handle error scenarios gracefully
 * @param {Error} error 
 */
function handleError(error) {
  // Clear intervals on fatal errors like user not found
  if (error.message === 'USER_NOT_FOUND') {
    clearInterval(autoRefreshIntervalId);
    clearInterval(countdownIntervalId);
    refreshInfo.style.display = 'none';
  }

  statusSection.style.display = 'block';
  statusMessage.style.display = 'block';
  statusMessage.className = 'status-message error';

  if (error.message === 'USER_NOT_FOUND') {
    statusMessage.innerHTML = `❌ <strong>User Not Found:</strong> The GitHub username <em>"${escapeHtml(currentUsername)}"</em> does not exist. Please check the spelling.`;
    hideDataSections();
  } else if (error.message === 'RATE_LIMITED') {
    statusMessage.innerHTML = `⚠️ <strong>API Rate Limit Exceeded:</strong> GitHub API rate limit reached. Please wait a few minutes before trying again.`;
  } else if (!navigator.onLine || error.name === 'TypeError') {
    statusMessage.innerHTML = `⚠️ <strong>Network Error:</strong> Failed to connect to GitHub. Please check your internet connection.`;
  } else {
    statusMessage.innerHTML = `⚠️ <strong>Error:</strong> Failed to fetch data (${escapeHtml(error.message)}).`;
  }
}

/**
 * Utility to prevent XSS when inserting user data into HTML
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
