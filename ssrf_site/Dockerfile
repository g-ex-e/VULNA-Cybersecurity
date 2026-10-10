# Utilisation de l'image Python officielle
FROM python:3.9

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers dans le conteneur
COPY app/ app/
COPY requirements.txt requirements.txt

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port 5000
EXPOSE 5050

# Lancer l'application
CMD ["python", "app/app.py"]
