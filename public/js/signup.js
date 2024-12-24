document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    // Store the user credentials (for demonstration purposes)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign up successful! Please log in.');
    window.location.href = 'login.html';
});
