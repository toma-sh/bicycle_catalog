// bike_catalog/frontend/static/js/profile.js

document.addEventListener('DOMContentLoaded', function() {
    // Sprawdzenie czy użytkownik jest zalogowany
    if (!localStorage.getItem('access_token')) {
        window.location.href = '/login.html';
        return;
    }
    
    // Pobieranie danych profilu
    fetchProfileData();
    
    // Obsługa formularza aktualizacji profilu
    const updateProfileForm = document.getElementById('update-profile-form');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Pobranie pól formularza
            const firstName = document.getElementById('first_name').value;
            const lastName = document.getElementById('last_name').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            // Walidacja hasła jeśli podane
            if (password && password !== confirmPassword) {
                showError('Hasła nie są identyczne');
                return;
            }
            
            try {
                // Przygotowanie danych do aktualizacji
                const updateData = {};
                if (firstName) updateData.first_name = firstName;
                if (lastName) updateData.last_name = lastName;
                if (password) updateData.password = password;
                
                // Wywołanie API
                const response = await fetch('/users/me', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify(updateData)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.detail || 'Wystąpił błąd podczas aktualizacji profilu');
                }
                
                // Wyświetlenie komunikatu o sukcesie
                showSuccess('Profil został zaktualizowany');
                
                // Ponowne pobranie danych profilu
                fetchProfileData();
                
            } catch (error) {
                showError(error.message);
            }
        });
    }
    
    // Funkcja do pobierania danych profilu
    async function fetchProfileData() {
        try {
            const response = await fetch('/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            
            if (!response.ok) {
                // Jeśli status to 401, przekieruj do strony logowania
                if (response.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('token_type');
                    window.location.href = '/login.html';
                    return;
                }
                throw new Error('Nie udało się pobrać danych profilu');
            }
            
            const userData = await response.json();
            
            // Aktualizacja danych w interfejsie
            document.getElementById('profile-username').textContent = userData.username;
            document.getElementById('profile-email').textContent = userData.email;
            document.getElementById('profile-name').textContent = `${userData.first_name || ''} ${userData.last_name || ''}`;
            
            // Inicjały do avatara
            const initials = getInitials(userData.first_name, userData.last_name);
            document.getElementById('profile-avatar').textContent = initials;
            
            // Wypełnienie formularza aktualizacji
            if (updateProfileForm) {
                document.getElementById('first_name').value = userData.first_name || '';
                document.getElementById('last_name').value = userData.last_name || '';
            }
            
            // Sprawdzenie czy użytkownik jest adminem
            if (userData.is_admin) {
                const adminElements = document.querySelectorAll('.admin-only');
                adminElements.forEach(el => el.style.display = 'block');
            }
            
        } catch (error) {
            showError(error.message);
        }
    }
    
    // Funkcja do generowania inicjałów
    function getInitials(firstName, lastName) {
        let initials = '';
        if (firstName) initials += firstName[0].toUpperCase();
        if (lastName) initials += lastName[0].toUpperCase();
        return initials || '?';
    }
    
    // Funkcja wyświetlająca błąd
    function showError(message) {
        const errorContainer = document.querySelector('.error-message');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
        } else {
            const container = document.querySelector('.profile-content');
            const newErrorContainer = document.createElement('div');
            newErrorContainer.className = 'error-message alert alert-error';
            newErrorContainer.textContent = message;
            container.insertBefore(newErrorContainer, container.firstChild);
        }
    }
    
    // Funkcja wyświetlająca komunikat o sukcesie
    function showSuccess(message) {
        const successContainer = document.querySelector('.success-message');
        if (successContainer) {
            successContainer.textContent = message;
            successContainer.style.display = 'block';
        } else {
            const container = document.querySelector('.profile-content');
            const newSuccessContainer = document.createElement('div');
            newSuccessContainer.className = 'success-message alert alert-success';
            newSuccessContainer.textContent = message;
            container.insertBefore(newSuccessContainer, container.firstChild);
        }
    }
});