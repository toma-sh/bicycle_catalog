// bike_catalog/frontend/static/js/auth.js

document.addEventListener('DOMContentLoaded', function() {
    // Pobranie formularzy logowania i rejestracji
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Obsługa formularza logowania
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Pobranie pól formularza
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Walidacja
            if (!username || !password) {
                showError('Wszystkie pola są wymagane');
                return;
            }
            
            try {
                // Konwersja danych do formatu wymaganego przez API
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('password', password);
                
                // Wywołanie API
                const response = await fetch('/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.detail || 'Wystąpił błąd podczas logowania');
                }
                
                // Zapisanie tokenu do localStorage
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('token_type', data.token_type);
                
                // Przekierowanie do strony profilu
                window.location.href = '/profile.html';
                
            } catch (error) {
                showError(error.message);
            }
        });
    }
    
    // Obsługa formularza rejestracji
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Pobranie pól formularza
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const firstName = document.getElementById('first_name').value;
            const lastName = document.getElementById('last_name').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            // Walidacja
            if (!username || !email || !password || !confirmPassword) {
                showError('Wymagane pola nie mogą być puste');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Hasła nie są identyczne');
                return;
            }
            
            try {
                // Wywołanie API
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        first_name: firstName,
                        last_name: lastName,
                        password
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.detail || 'Wystąpił błąd podczas rejestracji');
                }
                
                // Wyświetlenie komunikatu o sukcesie
                showSuccess('Konto zostało utworzone. Możesz się teraz zalogować.');
                
                // Przekierowanie do strony logowania po 2 sekundach
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
                
            } catch (error) {
                showError(error.message);
            }
        });
    }
    
    // Funkcja wyświetlająca błąd
    function showError(message) {
        const errorContainer = document.querySelector('.error-message');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';

            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        } else {
            // Jeśli kontener błędu nie istnieje, utwórz go
            const form = loginForm || registerForm;
            const newErrorContainer = document.createElement('div');
            newErrorContainer.className = 'error-message';
            newErrorContainer.textContent = message;
            form.insertBefore(newErrorContainer, form.firstChild);
        }
    }
    
    // Funkcja wyświetlająca komunikat o sukcesie
    function showSuccess(message) {
        const successContainer = document.querySelector('.success-message');
        if (successContainer) {
            successContainer.textContent = message;
            successContainer.style.display = 'block';

            setTimeout(() => {
                successContainer.style.display = 'none';
            }, 5000);
        } else {
            // Jeśli kontener sukcesu nie istnieje, utwórz go
            const form = loginForm || registerForm;
            const newSuccessContainer = document.createElement('div');
            newSuccessContainer.className = 'success-message alert alert-success';
            newSuccessContainer.textContent = message;
            form.insertBefore(newSuccessContainer, form.firstChild);
        }
    }
    
    // Sprawdzanie czy użytkownik jest zalogowany
    function isLoggedIn() {
        return localStorage.getItem('access_token') !== null;
    }
    
    // Aktualizacja UI w zależności od stanu logowania
    function updateUI() {
        const loggedInElements = document.querySelectorAll('.logged-in');
        const loggedOutElements = document.querySelectorAll('.logged-out');
        
        if (isLoggedIn()) {
            loggedInElements.forEach(el => el.style.display = 'block');
            loggedOutElements.forEach(el => el.style.display = 'none');
        } else {
            loggedInElements.forEach(el => el.style.display = 'none');
            loggedOutElements.forEach(el => el.style.display = 'block');
        }
    }
    
    // Wylogowanie użytkownika
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_type');
            window.location.href = '/index.html';
        });
    }
    
    // Aktualizacja UI przy ładowaniu strony
    updateUI();
});