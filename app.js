// Initialize Userbase
userbase.init({ appId: '7cd8e25b-723d-4af7-8bdf-ef558bd0dfcc' }); // Replace with your Userbase app ID

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const user = await userbase.signUp({ username: email, password });
        document.cookie = `user=${user.username}; path=/;`;
        alert('Signup successful!');
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const user = await userbase.signIn({ username: email, password });
        document.cookie = `user=${user.username}; path=/;`;
        alert('Login successful!');
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('user-container').style.display = 'block';
        loadUserText(user.username);
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
});

document.getElementById('save-text').addEventListener('click', async () => {
    const text = document.getElementById('user-text').value;
    const user = getCookie('user');

    if (user) {
        try {
            await userbase.upsertItem({
                database: 'user-data',
                item: { username: user, text: text },
            });
            alert('Text saved!');
            displaySavedText(text);
        } catch (error) {
            console.error('Error saving text:', error);
        }
    }
});

// Function to load user text
async function loadUserText(username) {
    try {
        const items = await userbase.getItems({ database: 'user-data', username });
        if (items.length > 0) {
            document.getElementById('saved-text').innerText = items[0].text;
        }
    } catch (error) {
        console.error('Error loading text:', error);
    }
}

// Function to display saved text
function displaySavedText(text) {
    document.getElementById('saved-text').innerText = text;
}

// Function to load cookies
function loadCookies() {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(row => row.startsWith('user='));
    if (userCookie) {
        const user = userCookie.split('=')[1];
        alert(`Welcome back, ${user}!`);
    }
}

// Function to get a specific cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Load cookies on page load
window.onload = loadCookies;