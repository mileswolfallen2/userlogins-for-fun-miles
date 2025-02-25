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
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
});

// Function to save note to local storage
function saveNote() {
    const note = document.getElementById('note-input').value;
    if (!note) {
        alert('Please enter a note to save.');
        return;
    }

    // Get existing notes from local storage
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ userId: currentUser.userId, text: note }); // Add new note
    localStorage.setItem('notes', JSON.stringify(notes)); // Save to local storage

    alert('Note saved successfully!');
    document.getElementById('note-input').value = ''; // Clear input
}

// Function to load notes from local storage
function loadNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Clear existing notes

    // Get notes from local storage
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    if (notes.length > 0) {
        notes.forEach(note => {
            const noteItem = document.createElement('li');
            noteItem.className = 'note-item';
            noteItem.textContent = note.text;

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.marginLeft = '10px';
            deleteButton.onclick = () => deleteNote(note.text); // Bind delete function

            noteItem.appendChild(deleteButton);
            notesList.appendChild(noteItem);
        });
    } else {
        alert('No notes found for this user.');
    }
}

// Function to delete a note from local storage
function deleteNote(noteText) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.filter(note => note.text !== noteText); // Remove the note
    localStorage.setItem('notes', JSON.stringify(updatedNotes)); // Update local storage
    alert('Note deleted successfully!');
    loadNotes(); // Reload notes after deletion
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
document.getElementById('load-notes').addEventListener('click', loadNotes);
document.getElementById('logout-button').addEventListener('click', logout);