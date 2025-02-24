const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

const { authMiddleware } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).send(error.message);
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { session, error } = await supabase.auth.signIn({ email, password });
    if (error) return res.status(401).send('Invalid credentials');
    const token = jwt.sign({ userId: session.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.send('User logged in');
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

app.post('/save-cookie', authMiddleware, async (req, res) => {
  try {
    const { cookie } = req.body;
    const { data, error } = await supabase
      .from('cookies')
      .insert([{ user_id: req.user.id, cookie: JSON.stringify(cookie) }]);
    if (error) return res.status(500).send('Error saving cookie to cloud');
    res.send('Cookie saved to cloud');
  } catch (error) {
    res.status(500).send('Error saving cookie to cloud');
  }
});

app.get('/retrieve-cookie', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cookies')
      .select('cookie')
      .eq('user_id', req.user.id)
      .single();
    if (error) return res.status(500).send('Error retrieving cookie from cloud');
    const cookie = JSON.parse(data.cookie);
    res.json(cookie);
  } catch (error) {
    res.status(500).send('Error retrieving cookie from cloud');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});