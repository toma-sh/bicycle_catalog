import os

def create_structure(base_path, structure):
    for path in structure:
        full_path = os.path.join(base_path, path)
        if path.endswith('/'):
            os.makedirs(full_path, exist_ok=True)
        else:
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'w', encoding='utf-8') as f:
                pass  # Tworzy pusty plik

structure = [
    "bike_catalog/backend/database/__init__.py",
    "bike_catalog/backend/database/models.py",
    "bike_catalog/backend/database/database.py",
    "bike_catalog/backend/database/crud.py",
    "bike_catalog/backend/routers/__init__.py",
    "bike_catalog/backend/routers/auth.py",
    "bike_catalog/backend/routers/users.py",
    "bike_catalog/backend/routers/bikes.py",
    "bike_catalog/backend/schemas/__init__.py",
    "bike_catalog/backend/schemas/user.py",
    "bike_catalog/backend/schemas/bike.py",
    "bike_catalog/backend/utils/__init__.py",
    "bike_catalog/backend/utils/auth.py",
    "bike_catalog/backend/__init__.py",
    "bike_catalog/backend/main.py",
    "bike_catalog/backend/config.py",
    "bike_catalog/frontend/static/css/styles.css",
    "bike_catalog/frontend/static/js/auth.js",
    "bike_catalog/frontend/static/js/bikes.js",
    "bike_catalog/frontend/static/js/favorites.js",
    "bike_catalog/frontend/static/js/profile.js",
    "bike_catalog/frontend/static/img/",
    "bike_catalog/frontend/templates/index.html",
    "bike_catalog/frontend/templates/login.html",
    "bike_catalog/frontend/templates/register.html",
    "bike_catalog/frontend/templates/profile.html",
    "bike_catalog/frontend/templates/catalog.html",
    "bike_catalog/frontend/templates/favorites.html",
    "bike_catalog/frontend/templates/admin/dashboard.html",
    "bike_catalog/frontend/templates/admin/users.html",
    "bike_catalog/frontend/templates/admin/bikes.html",
    "bike_catalog/requirements.txt",
    "bike_catalog/README.md",
]

base_path = os.getcwd()  # Tworzy strukturę w bieżącym katalogu
create_structure(base_path, structure)

print("Struktura katalogów i plików została utworzona.")
