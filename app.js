// Initialize Userbase
userbase.init({ appId: '7cd8e25b-723d-4af7-8bdf-ef558bd0dfcc' }); // Replace with your Userbase app ID

let currentUser; // Variable to hold the current user object

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value; // Email as username
    const password = document.getElementById('signup-password').value;

    try {
        const user = await userbase.signUp({ username: username, password });
        document.cookie = `user=${user.username}; path=/;`;
        alert('Signup successful!');
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value; // Email as username
    const password = document.getElementById('login-password').value;

    try {
        currentUser = await userbase.signIn({
            username: username,
            password: password,
            rememberMe: 'local' // Set session persistence
        });
        document.cookie = `user=${currentUser.username}; path=/;`;
        alert('Login successful!');
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('note-management').style.display = 'block';

        // Open the Userbase database
        await openUserbaseDatabase();
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
});

// Function to open Userbase database
async function openUserbaseDatabase() {
    try {
        await userbase.openDatabase({
            databaseName: 'notes-database',
            changeHandler: function (items) {
                const notesList = document.getElementById('notes-list');
                notesList.innerHTML = ''; // Clear existing notes
                items.forEach(item => {
                    const noteItem = document.createElement('li');
                    noteItem.className = 'note-item';
                    noteItem.textContent = item.item.text;

                    // Create delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.style.marginLeft = '10px';
                    deleteButton.onclick = () => deleteNote(item.itemId); // Bind delete function

                    noteItem.appendChild(deleteButton);
                    notesList.appendChild(noteItem);
                });
            }
        });
        console.log('Database opened successfully.');
    } catch (error) {
        console.error('Error opening database:', error);
    }
}

// Function to save note to Userbase
async function saveNote() {
    const noteText = document.getElementById('note-input').value;
    if (!noteText) {
        alert('Please enter a note to save.');
        return;
    }

    try {
        await userbase.insertItem({
            databaseName: 'notes-database',
            item: { text: noteText }
        });
        alert('Note saved successfully!');
        document.getElementById('note-input').value = ''; // Clear input
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note: ' + error.message);
    }
}

// Function to delete a note from Userbase
async function deleteNote(itemId) {
    try {
        await userbase.deleteItem({
            databaseName: 'notes-database',
            itemId: itemId
        });
        alert('Note deleted successfully!');
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note: ' + error.message);
    }
}

// Function to log out the user
async function logout() {
    try {
        await userbase.signOut(); // Sign out from Userbase
        currentUser = null; // Clear current user
        document.getElementById('form-container').style.display = 'block'; // Show login/signup forms
        document.getElementById('note-management').style.display = 'none'; // Hide note management
        alert('Logged out successfully!');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
}

// Event listeners for buttons
document.getElementById('save-note').addEventListener('click', saveNote);
document.getElementById('logout-button').addEventListener('click', logout);
