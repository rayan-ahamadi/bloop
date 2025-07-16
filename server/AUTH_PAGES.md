# Pages d'Authentification - Symfony E.io

## 📋 Vue d'ensemble

Les pages d'authentification ont été créées avec Twig et sont conçues pour fonctionner avec votre API REST Symfony. Elles offrent une expérience utilisateur moderne et responsive.

## 🎨 Design et Fonctionnalités

### Design

-   **Interface moderne** avec gradient de couleurs
-   **Responsive** pour tous les appareils
-   **Animations fluides** et transitions
-   **Validation en temps réel** des formulaires
-   **Indicateur de force** pour les mots de passe

### Fonctionnalités

-   ✅ **Connexion** avec email/mot de passe
-   ✅ **Inscription** avec validation complète
-   ✅ **Validation côté client** et serveur
-   ✅ **Gestion d'erreurs** en français
-   ✅ **États de chargement** avec animations
-   ✅ **Sécurité** avec validation des mots de passe
-   ✅ **Accessibilité** avec autocomplete et labels

## 📁 Structure des fichiers

```
templates/
├── base.html.twig              # Template de base
├── auth/
│   ├── login.html.twig         # Page de connexion
│   └── register.html.twig      # Page d'inscription
└── home/
    └── index.html.twig         # Page d'accueil

assets/
├── styles/
│   └── app.css                 # Styles CSS
└── app.js                      # JavaScript

src/Controller/
├── AuthController.php          # Contrôleur d'authentification
└── HomeController.php          # Contrôleur d'accueil
```

## 🚀 Routes disponibles

| Route                 | Méthode | Description          |
| --------------------- | ------- | -------------------- |
| `/`                   | GET     | Page d'accueil       |
| `/login`              | GET     | Page de connexion    |
| `/register`           | GET     | Page d'inscription   |
| `/api/login_check`    | POST    | API de connexion JWT |
| `/api/users/register` | POST    | API d'inscription    |

## 🎯 Utilisation

### 1. Page d'accueil (`/`)

-   Présentation de l'application
-   Liens vers connexion et inscription
-   Design moderne avec grille de fonctionnalités

### 2. Page de connexion (`/login`)

-   Formulaire simple avec email et mot de passe
-   Validation en temps réel
-   Gestion des erreurs d'authentification
-   Redirection automatique après connexion

### 3. Page d'inscription (`/register`)

-   Formulaire complet avec tous les champs
-   Validation robuste côté client et serveur
-   Indicateur de force du mot de passe
-   Champs optionnels (bio, localisation, site web)

## 🔧 Configuration

### Variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your_jwt_passphrase_here
```

### Compilation des assets

```bash
# Développement
npm run dev

# Production
npm run build
```

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies dans `assets/styles/app.css` :

-   **Primaire** : `#667eea` (bleu)
-   **Secondaire** : `#764ba2` (violet)
-   **Succès** : `#27ae60` (vert)
-   **Erreur** : `#e74c3c` (rouge)

### Police

-   **Famille** : Inter (Google Fonts)
-   **Fallback** : -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

## 🔒 Sécurité

### Validation des mots de passe

-   Minimum 8 caractères
-   Au moins une majuscule
-   Au moins une minuscule
-   Au moins un chiffre
-   Au moins un caractère spécial

### Validation des emails

-   Format standard RFC 5322
-   Validation côté client et serveur

### Protection CSRF

-   Les formulaires utilisent des tokens CSRF automatiques
-   Validation côté serveur

## 📱 Responsive Design

### Breakpoints

-   **Mobile** : < 480px
-   **Tablet** : 480px - 768px
-   **Desktop** : > 768px

### Adaptations

-   Grille flexible pour les fonctionnalités
-   Boutons empilés sur mobile
-   Espacement adaptatif
-   Taille de police responsive

## 🚀 Intégration avec React

### Redirection après connexion

Après une connexion réussie, l'utilisateur est redirigé vers `/app` où votre application React peut être servie.

### Token JWT

Le token JWT est stocké dans `localStorage` et peut être utilisé par votre application React pour les requêtes API.

### Configuration recommandée

```javascript
// Dans votre app React
const token = localStorage.getItem("jwt_token");
if (token) {
    // Utiliser le token pour les requêtes API
    fetch("/api/users", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
```

## 🐛 Dépannage

### Problèmes courants

1. **Assets non compilés**

    ```bash
    npm run dev
    ```

2. **Erreur JWT**

    - Vérifiez les clés JWT dans `.env`
    - Générez les clés si nécessaire

3. **Erreurs de validation**
    - Vérifiez les contraintes dans les DTOs
    - Consultez les logs Symfony

### Logs utiles

```bash
# Logs Symfony
tail -f var/log/dev.log

# Logs webpack
npm run dev -- --watch
```

## 📈 Améliorations futures

-   [ ] **Authentification à deux facteurs**
-   [ ] **Récupération de mot de passe**
-   [ ] **Connexion avec réseaux sociaux**
-   [ ] **Thème sombre/clair**
-   [ ] **Internationalisation (i18n)**
-   [ ] **Tests E2E avec Cypress**

## 🤝 Contribution

Pour contribuer aux pages d'authentification :

1. Respectez les conventions Symfony
2. Testez sur différents appareils
3. Vérifiez l'accessibilité
4. Documentez les changements

---

**Développé avec ❤️ pour Symfony E.io**
