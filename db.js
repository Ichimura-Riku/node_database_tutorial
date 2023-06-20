const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// ダミーユーザーデータベース
const users = [
    { id: 1, username: 'user1', password: '$2b$10$KDH4i3d.K0dI5PvVe7j9S.Dmf9E8Rl3RZ0T32e8YSSuFqjiNco3DO' } // パスワード: password1
];

// ログインページの表示
app.get('/login', (req, res) => {
    res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

// ログイン処理
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (!user) {
        res.status(401).send('Invalid username ');
        // res.status(401).send('Invalid username or password');
        return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            req.session.userId = user.id;
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Invalid password');
            // res.status(401).send('Invalid username or password');
        }
    });
});

// ダッシュボードの表示
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        res.redirect('/login');
        return;
    }

    res.send(`
    <h1>Welcome to the Dashboard</h1>
    <p>User ID: ${req.session.userId}</p>
    <a href="/logout">Logout</a>
  `);
});

// ログアウト処理
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// サーバーの起動
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
