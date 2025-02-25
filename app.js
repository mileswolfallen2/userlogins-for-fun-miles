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
        const username = document.getElementById('login-username').value
        alert('Login successful!');
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('cookie-management').style.display = 'block';
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
});

// Function to save cookies to Userbase
async function saveCookies() {
    const cookies = document.cookie;
    try {
        const user = await userbase.getUser();
        await userbase.insert({
            database: 'user_cookies',
            item: { userId: user.userId, cookies: cookies }
        });
        alert('Cookies saved successfully!');
    } catch (error) {
        console.error('Error saving cookies:', error);
        alert('Failed to save cookies: ' + error.message);
    }
}

// Function to load cookies from Userbase
async function loadCookies() {
    try {
        const user = await userbase.getUser();
        const result = await userbase.query({
            database: 'user_cookies',
            filter: { userId: user.userId }
        });
        if (result.length > 0) {
            const cookies = result[0].cookies;
            document.cookie = cookies;
            alert('Cookies loaded successfully!');
        } else {
            alert('No cookies found for this user.');
        }
    } catch (error) {
        console.error('Error loading cookies:', error);
        alert('Failed to load cookies: ' + error.message);
    }
}

// Event listeners for buttons
document.getElementById('save-cookies').addEventListener('click', saveCookies);
document.getElementById('load-cookies').addEventListener('click', loadCookies);