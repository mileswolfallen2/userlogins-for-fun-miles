import { supabase } from './supabaseClient.js';
import bcrypt from 'bcryptjs';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password: hashedPassword }]);
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

  const { data, error } = await supabase
    .from('users')
    .select('id, password')
    .eq('email', email)
    .single();

  if (error || !data) {
    alert('Invalid credentials');
    return;
  }

  const validPassword = await bcrypt.compare(password, data.password);
  if (!validPassword) {
    alert('Invalid credentials');
    return;
  }

  const token = btoa(JSON.stringify({ userId: data.id }));
  document.cookie = `token=${token}; Secure; HttpOnly`;
  alert('User logged in successfully');
});

document.getElementById('cookie-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const cookieData = document.getElementById('cookie-data').value;
  const token = getCookie('token');

  if (!token) {
    alert('User not logged in');
    return;
  }

  const { userId } = JSON.parse(atob(token));
  const { data, error } = await supabase
    .from('cookies')
    .insert([{ user_id: userId, cookie: JSON.stringify(cookieData) }]);
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

  const { userId } = JSON.parse(atob(token));
  const { data, error } = await supabase
    .from('cookies')
    .select('cookie')
    .eq('user_id', userId)
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