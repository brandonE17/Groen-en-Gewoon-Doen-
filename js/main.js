document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const closeBtn = document.querySelector(".close");
    const loginForm = document.getElementById("loginForm");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");
    const loginMessage = document.getElementById("loginMessage");

    // Open login modal
    loginBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // Sluit modal
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Sluit modal als je buiten klikt
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Verwerk login formulier
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // Stop normale form submit

        const uname = document.getElementById("uname").value;
        const psw = document.getElementById("psw").value;

        try {
            // Stuur login request naar server
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `uname=${uname}&psw=${psw}`
            });

            const data = await response.json();

            if (data.success) {
                // Login geslaagd!
                modal.style.display = "none";
                loginForm.reset();
                loginMessage.style.display = "none";
                
                // Update UI
                loginBtn.style.display = "none";
                logoutBtn.style.display = "inline-block";
                userInfo.style.display = "inline";
                userName.textContent = uname;

                // Alert succesbericht
                alert('✓ Welkom ' + uname + '! Je bent succesvol ingelogd.');
            } else {
                // Login gefaald
                loginMessage.style.display = "block";
                loginMessage.textContent = '✗ ' + data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            loginMessage.style.display = "block";
            loginMessage.textContent = '✗ Server error';
        }
    });

    // Logout functie
    logoutBtn.addEventListener("click", async function () {
        try {
            const response = await fetch('/logout', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                // Update UI
                loginBtn.style.display = "inline-block";
                logoutBtn.style.display = "none";
                userInfo.style.display = "none";
                alert('Je bent uitgelogd');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Check of je al ingelogd bent (bij pagina refresh)
    async function checkLogin() {
        try {
            const response = await fetch('/check-login');
            const data = await response.json();

            if (data.loggedIn) {
                // Je bent ingelogd
                loginBtn.style.display = "none";
                logoutBtn.style.display = "inline-block";
                userInfo.style.display = "inline";
                userName.textContent = data.user;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Check login status wanneer pagina laadt
    checkLogin();

});