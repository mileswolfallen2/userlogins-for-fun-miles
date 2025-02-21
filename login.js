const { createClient } = supabase;
const supabaseUrl = 'https://dijdxuhvyvvwqtlpkajt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpamR4dWh2eXZ2d3F0bHBrYWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjU3MzcsImV4cCI6MjA1NTc0MTczN30.gz_hX11RC6gKwIpGlbBWk1s7skDOwix-FQh_chE5xkU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) {
        console.error("Error signing up:", error.message);
    } else {
        console.log("User signed up:", user);
    }
}

async function signIn(email, password) {
    const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
    });
    if (error) {
        console.error("Error signing in:", error.message);
    } else {
        console.log("User signed in:", user);
    }
}

async function saveCookies(userId, cookies) {
    const { data, error } = await supabase
        .from('cookies') // Ensure you have a 'cookies' table in your database
        .insert([{ user_id: userId, cookies: cookies }]);
    if (error) {
        console.error("Error saving cookies:", error.message);
    } else {
        console.log("Cookies saved successfully:", data);
    }
}

async function getCookies(userId) {
    const { data, error } = await supabase
        .from('cookies')
        .select('cookies')
        .eq('user_id', userId);
    if (error) {
        console.error("Error retrieving cookies:", error.message);
    } else {
        console.log("Retrieved cookies:", data);
        return data;
    }
}