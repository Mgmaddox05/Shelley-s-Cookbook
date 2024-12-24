document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate credentials
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Save login state and username
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userName', username);
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password!');
    }
});
