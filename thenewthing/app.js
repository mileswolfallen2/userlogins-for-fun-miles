import { supabase } from './supabaseClient.js';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert('Error registering user: ' + error.message);
  } else {
    alert('User registered successfully');
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { session, error } = await supabase.auth.signIn({ email, password });
  if (error) {
    alert('Invalid credentials');
  } else {
    document.cookie = `token=${session.access_token}; Secure; HttpOnly`;
    alert('User logged in successfully');
  }
});

document.getElementById('cookie-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const cookieData = document.getElementById('cookie-data').value;
  const token = getCookie('token');

  if (!token) {
    alert('User not logged in');
    return;
  }

  const { user } = await supabase.auth.api.getUser(token);
  const { data, error } = await supabase
    .from('cookies')
    .insert([{ user_id: user.id, cookie: JSON.stringify(cookieData) }]);
  if (error) {
    alert('Error saving cookie to cloud');
  } else {
    alert('Cookie saved to cloud');
  }
});

document.getElementById('retrieve-cookie').addEventListener('click', async () => {
  const token = getCookie('token');

  if (!token) {
    alert('User not logged in');
    return;
  }

  const { user } = await supabase.auth.api.getUser(token);
  const { data, error } = await supabase
    .from('cookies')
    .select('cookie')
    .eq('user_id', user.id)
    .single();
  if (error) {
    alert('Error retrieving cookie from cloud');
  } else {
    document.getElementById('cookie-display').innerText = data.cookie;
  }
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}