// Import the Supabase client
import { createClient } from '@supabase/supabase-js';

// Load environment variables (if using Node.js)
require('dotenv').config();

const supabaseUrl = 'https://ebakaygajiweacgkvhbl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Use the environment variable
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Function to save note to Supabase
async function saveNote() {
    const note = document.getElementById('note-input').value;
    if (!note) {
        alert('Please enter a note to save.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('notes')
            .insert([{ user_id: currentUser.id, text: note }]); // Use currentUser object
        if (error) throw error;
        alert('Note saved successfully!');
        document.getElementById('note-input').value = ''; // Clear input
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note: ' + error.message);
    }
}

// Function to load notes from Supabase
async function loadNotes() {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', currentUser.id); // Filter by user ID

        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = ''; // Clear existing notes

        if (data.length > 0) {
            data.forEach(note => {
                const noteItem = document.createElement('li');
                noteItem.className = 'note-item';
                noteItem.textContent = note.text;

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.marginLeft = '10px';
                deleteButton.onclick = () => deleteNote(note.id); // Bind delete function

                noteItem.appendChild(deleteButton);
                notesList.appendChild(noteItem);
            });
        } else {
            alert('No notes found for this user.');
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        alert('Failed to load notes: ' + error.message);
    }
}

// Function to delete a note from Supabase
async function deleteNote(noteId) {
    try {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId); // Delete by note ID
        if (error) throw error;
        alert('Note deleted successfully!');
        loadNotes(); // Reload notes after deletion
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note: ' + error.message);
    }
}

// Function to get user metadata
async function getUserMetadata() {
    try {
        const user = supabase.auth.user();
        alert(`User Metadata Retrieved: ${JSON.stringify(user)}`);
    } catch (error) {
        console.error('Error fetching user metadata:', error);
        alert('Error fetching user metadata: ' + error.message);
    }
}

// Example usage of getUserMetadata
document.getElementById('get-user-metadata').addEventListener('click', getUserMetadata);

// Event listeners for buttons
document.getElementById('save-note').addEventListener('click', saveNote);
document.getElementById('load-notes').addEventListener('click', loadNotes);