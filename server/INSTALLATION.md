# Guide d'Installation - Projet Symfony symfony-e.io

## 🎯 Vue d'ensemble

Ce projet est une **API REST Symfony 7.3** avec authentification JWT, gestion d'utilisateurs et architecture en couches. Il utilise PHP 8.2+, MySQL comme base de données, et Webpack Encore pour les assets frontend.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

-   **PHP 8.2 ou supérieur**
-   **Composer** (gestionnaire de dépendances PHP)
-   **Node.js** (version 16 ou supérieure) et **npm**
-   **MySQL** (version 8.0 ou supérieure) - voir options d'installation ci-dessous
-   **Symfony CLI** (optionnel mais recommandé)

### Options d'installation de MySQL

**Option 1 : Installation native**

-   **macOS** : `brew install mysql`
-   **Ubuntu/Debian** : `sudo apt install mysql-server mysql-client`
-   **Windows** : Télécharger depuis [mysql.com](https://dev.mysql.com/downloads/mysql/)

**Option 2 : Avec Docker (optionnel)**

-   **Docker** et **Docker Compose** (si vous préférez cette approche)

### Vérification des prérequis

```bash
# Vérifier PHP
php --version

# Vérifier Composer
composer --version

# Vérifier Node.js
node --version
npm --version

# Vérifier MySQL
mysql --version

# Vérifier Docker (optionnel)
docker --version
docker-compose --version

# Vérifier Symfony CLI (optionnel)
symfony --version
```

## 🚀 Étapes d'installation

### 1. Cloner le projet

```bash
# Cloner le repository
git clone <URL_DU_REPO>
cd symfony-e.io
```

### 2. Installer les dépendances PHP

```bash
# Installer les dépendances avec Composer
composer install
```

### 3. Configurer l'environnement

```bash
# Copier le fichier d'environnement
cp .env .env.local

# Éditer le fichier .env.local avec vos paramètres
# Notamment les paramètres de base de données et JWT
```

### 4. Configurer les clés JWT

```bash
# Créer le répertoire pour les clés JWT
mkdir -p config/jwt

# Générer les clés privée et publique JWT
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
```

**Note :** Lors de la génération de la clé privée, vous devrez entrer une passphrase. Notez-la et mettez-la dans votre fichier `.env.local` :

```env
JWT_PASSPHRASE=votre_passphrase_ici
```

### 5. Configurer la base de données MySQL

**Option 1 : Installation native**

```bash
# Démarrer le service MySQL
# macOS
brew services start mysql

# Ubuntu/Debian
sudo systemctl start mysql
sudo systemctl enable mysql

# Créer un utilisateur et une base de données
mysql -u root -p
CREATE DATABASE app;
CREATE USER 'app'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON app.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Option 2 : Avec Docker (si vous préférez)**

```bash
# Démarrer MySQL avec Docker Compose
docker-compose up -d database

# Vérifier que la base de données est démarrée
docker-compose ps
```

### 6. Configurer la base de données

```bash
# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# (Optionnel) Charger des données de test
# php bin/console doctrine:fixtures:load
```

### 7. Installer les dépendances Node.js

```bash
# Installer les dépendances frontend
npm install
```

### 8. Compiler les assets

```bash
# Compiler les assets pour le développement
npm run dev
```

## 🏃‍♂️ Lancer le projet

### Option 1 : Avec Symfony CLI (recommandé)

```bash
# Démarrer le serveur de développement Symfony
symfony server:start

# Le projet sera accessible sur http://localhost:8000
```

### Option 2 : Avec le serveur PHP intégré

```bash
# Démarrer le serveur PHP
php -S localhost:8000 -t public/

# Le projet sera accessible sur http://localhost:8000
```

### Option 3 : Avec Docker (optionnel)

```bash
# Démarrer tous les services
docker-compose up -d

# Le projet sera accessible sur http://localhost:8000
```

## 🧪 Tests

### Lancer les tests

```bash
# Lancer tous les tests
php bin/phpunit

# Lancer les tests avec couverture de code
php bin/phpunit --coverage-html var/coverage
```

### Tests spécifiques

```bash
# Tester uniquement les contrôleurs
php bin/phpunit tests/Controller/

# Tester un fichier spécifique
php bin/phpunit tests/Controller/AuthControllerTest.php
```

## 🔧 Commandes utiles

### Développement

```bash
# Vider le cache
php bin/console cache:clear

# Compiler les assets en mode développement
npm run dev

# Compiler les assets en mode watch (recompilation automatique)
npm run watch

# Compiler les assets pour la production
npm run build
```

### Base de données

```bash
# Créer une nouvelle migration
php bin/console make:migration

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Annuler la dernière migration
php bin/console doctrine:migrations:migrate prev

# Voir le statut des migrations
php bin/console doctrine:migrations:status
```

### Entités

```bash
# Créer une nouvelle entité
php bin/console make:entity NomEntite

# Créer un contrôleur
php bin/console make:controller NomController

# Créer un service
php bin/console make:service NomService
```

## 📁 Structure du projet

```
symfony-e.io/
├── assets/                 # Assets frontend (JS, CSS)
├── bin/                   # Exécutables Symfony
├── config/                # Configuration de l'application
│   ├── jwt/              # Clés JWT
│   └── packages/         # Configuration des bundles
├── migrations/           # Migrations de base de données
├── public/              # Point d'entrée web
├── src/                 # Code source de l'application
│   ├── Controller/      # Contrôleurs
│   ├── Entity/          # Entités Doctrine
│   ├── Repository/      # Repositories
│   ├── Service/         # Services métier
│   └── Validation/      # DTOs et validateurs
├── templates/           # Templates Twig
└── tests/              # Tests unitaires et fonctionnels
```

## 🔐 Configuration de sécurité

### Authentification JWT

Le projet utilise **LexikJWTAuthenticationBundle** pour l'authentification JWT. Les endpoints d'authentification sont :

-   `POST /api/login` - Connexion utilisateur
-   `POST /api/register` - Inscription utilisateur
-   `GET /api/user/profile` - Profil utilisateur (protégé)

### Variables d'environnement importantes

```env
# Base de données
DATABASE_URL="mysql://app:votre_mot_de_passe@127.0.0.1:3306/app?serverVersion=8.0&charset=utf8mb4"

# JWT
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=votre_passphrase_ici

# Application
APP_ENV=dev
APP_SECRET=ChangeMeInEnv
```

## 🐛 Dépannage

### Problèmes courants

#### 1. Erreur de permissions sur les clés JWT

```bash
# Donner les bonnes permissions
chmod 644 config/jwt/public.pem
chmod 600 config/jwt/private.pem
```

#### 2. Base de données non accessible

**Avec installation native :**

```bash
# Vérifier que MySQL est démarré
# macOS
brew services list | grep mysql

# Ubuntu/Debian
sudo systemctl status mysql

# Redémarrer MySQL
# macOS
brew services restart mysql

# Ubuntu/Debian
sudo systemctl restart mysql
```

**Avec Docker :**

```bash
# Vérifier que Docker est démarré
docker-compose ps

# Redémarrer la base de données
docker-compose restart database
```

#### 3. Cache corrompu

```bash
# Vider complètement le cache
rm -rf var/cache/*
php bin/console cache:clear
```

#### 4. Assets non compilés

```bash
# Réinstaller les dépendances Node.js
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Logs

```bash
# Voir les logs de l'application
tail -f var/log/dev.log

# Voir les logs MySQL (installation native)
# macOS
tail -f /usr/local/var/mysql/*.err

# Ubuntu/Debian
sudo tail -f /var/log/mysql/error.log

# Voir les logs Docker (optionnel)
docker-compose logs -f database
```

## 📚 Ressources utiles

-   [Documentation Symfony 7.3](https://symfony.com/doc/7.3/)
-   [LexikJWTAuthenticationBundle](https://github.com/lexik/LexikJWTAuthenticationBundle)
-   [Doctrine ORM](https://www.doctrine-project.org/projects/orm.html)
-   [Webpack Encore](https://symfony.com/doc/current/frontend/encore/installation.html)

## 🤝 Contribution

1. Créez une branche pour votre fonctionnalité
2. Committez vos changements
3. Poussez vers la branche
4. Créez une Pull Request

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez que tous les prérequis sont installés
2. Consultez la section dépannage
3. Vérifiez les logs d'erreur
4. Contactez l'équipe de développement

---

**Bon développement ! 🚀**
