/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import "./styles/app.css";

// Gestion des interactions communes pour les pages d'authentification

document.addEventListener("DOMContentLoaded", function () {
    // Animation d'entrée pour les champs de formulaire
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input, index) => {
        input.style.opacity = "0";
        input.style.transform = "translateY(20px)";

        setTimeout(() => {
            input.style.transition = "all 0.5s ease";
            input.style.opacity = "1";
            input.style.transform = "translateY(0)";
        }, 100 * index);
    });

    // Validation en temps réel pour les champs de mot de passe
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach((input) => {
        input.addEventListener("input", function () {
            validatePasswordStrength(this);
        });
    });

    // Validation en temps réel pour les emails
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach((input) => {
        input.addEventListener("blur", function () {
            validateEmail(this);
        });
    });

    // Validation en temps réel pour les URLs
    const urlInputs = document.querySelectorAll('input[type="url"]');
    urlInputs.forEach((input) => {
        input.addEventListener("blur", function () {
            validateUrl(this);
        });
    });
});

// Validation de la force du mot de passe
function validatePasswordStrength(input) {
    const password = input.value;
    const strengthIndicator =
        input.parentElement.querySelector(".password-strength");

    if (!strengthIndicator) {
        const indicator = document.createElement("div");
        indicator.className = "password-strength";
        indicator.style.cssText = `
            margin-top: 5px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        input.parentElement.appendChild(indicator);
    }

    const indicator = input.parentElement.querySelector(".password-strength");

    if (password.length === 0) {
        indicator.style.display = "none";
        return;
    }

    let strength = 0;
    let message = "";
    let color = "";

    // Vérifications
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    switch (strength) {
        case 0:
        case 1:
            message = "Très faible";
            color = "#e74c3c";
            break;
        case 2:
            message = "Faible";
            color = "#f39c12";
            break;
        case 3:
            message = "Moyen";
            color = "#f1c40f";
            break;
        case 4:
            message = "Fort";
            color = "#27ae60";
            break;
        case 5:
            message = "Très fort";
            color = "#2ecc71";
            break;
    }

    indicator.innerHTML = `
        <span style="color: ${color};">●</span>
        <span style="color: ${color};">${message}</span>
    `;
    indicator.style.display = "flex";
}

// Validation d'email
function validateEmail(input) {
    const email = input.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        showFieldError(input.id, "Format d'email invalide");
    } else {
        clearFieldError(input.id);
    }
}

// Validation d'URL
function validateUrl(input) {
    const url = input.value;

    if (url) {
        try {
            new URL(url);
            clearFieldError(input.id);
        } catch {
            showFieldError(input.id, "Format d'URL invalide");
        }
    } else {
        clearFieldError(input.id);
    }
}

// Affichage d'erreur pour un champ
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorDiv = document.getElementById(fieldName + "Error");

    if (field && errorDiv) {
        field.classList.add("error");
        errorDiv.textContent = message;
        errorDiv.style.display = "flex";
    }
}

// Effacement d'erreur pour un champ
function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorDiv = document.getElementById(fieldName + "Error");

    if (field && errorDiv) {
        field.classList.remove("error");
        errorDiv.style.display = "none";
    }
}

// Fonction utilitaire pour afficher des notifications
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;

    // Couleurs selon le type
    switch (type) {
        case "success":
            notification.style.background = "#27ae60";
            break;
        case "error":
            notification.style.background = "#e74c3c";
            break;
        case "warning":
            notification.style.background = "#f39c12";
            break;
        default:
            notification.style.background = "#3498db";
    }

    document.body.appendChild(notification);

    // Suppression automatique après 5 secondes
    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Ajout des styles CSS pour les animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .password-strength {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
