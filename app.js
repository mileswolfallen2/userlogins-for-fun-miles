// Initialize Userbase
userbase.init({ appId: '7cd8e25b-723d-4af7-8bdf-ef558bd0dfcc' }); // Replace with your Userbase app ID

// Initialize Supabase
const supabaseUrl = 'https://ebakaygajiweacgkvhbl.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYWtheWdhaml3ZWFjZ2t2aGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTMyMTAsImV4cCI6MjA1NTk4OTIxMH0.agRu-oM2QeLfLDyek5Og_r0uzp_Nq6exW8kos4LX1K0'; // Replace with your Supabase anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
    const noteText = document.getElementById('note-input').value;
    if (!noteText) {
        alert('Please enter a note to save.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('notes') // Replace with your table name
            .insert([{ userId: currentUser.userId, text: noteText }]); // Save note with user ID
        if (error) throw error;
        alert('Note saved to cloud successfully!');
        document.getElementById('note-input').value = ''; // Clear input
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note: ' + error.message);
    }
}

// Function to load notes from Supabase
async function loadNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Clear existing notes

    try {
        const { data, error } = await supabase
            .from('notes') // Replace with your table name
            .select('*')
            .eq('userId', currentUser.userId); // Filter notes by user ID

        if (error) throw error;

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

// Function to download notes as a CSV file
async function downloadNotes() {
    try {
        const { data, error } = await supabase
            .from('notes') // Replace with your table name
            .select('*')
            .eq('userId', currentUser.userId); // Filter notes by user ID

        if (error) throw error;

        if (data.length > 0) {
            const csvContent = "data:text/csv;charset=utf-8," 
                + data.map(note => note.text).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "notes.csv");
            document.body.appendChild(link); // Required for FF

            link.click(); // This will download the data file named "notes.csv"
            alert('Notes downloaded successfully!');
        } else {
            alert('No notes found to download.');
        }
    } catch (error) {
        console.error('Error downloading notes:', error);
        alert('Failed to download notes: ' + error.message);
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
document.getElementById('load-notes').addEventListener('click', loadNotes);
document.getElementById('download-notes').addEventListener('click', downloadNotes);
document.getElementById('logout-button').addEventListener('click', logout);