import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const users = [];


app.post('/signup', async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  users.push({ username, password: hashedPassword });
  res.json({ message: 'User registered successfully' });
});


app.post('/login', async (req, res) => {
    const username = req.body.username;
  const password = req.body.password;

  const user = users.find((user) => user.username === username);

  if (!user) return res.status(400).json({ message: 'User not found!' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });
  const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '4h' });
  res.json({ message: 'Login successful!', token });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
