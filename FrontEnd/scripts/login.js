// scripts/login.js

console.log("Étape 1 : login.js chargé");

// 🔐 Fonction qui gère la soumission du formulaire de connexion
const handleLogin = async (event) => {
    console.log("Étape 3 : Formulaire soumis, handleLogin appelé");
    event.preventDefault(); // 🔒 Empêche le rechargement de la page

    // 🔍 Récupération des champs email et mot de passe
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // ❌ Vérifie que les champs existent dans le HTML
    if (!emailInput || !passwordInput) {
        console.error("Étape 4 : Les champs email ou password n'existent pas dans le HTML.");
        alert("Erreur : Les champs email ou mot de passe ne sont pas trouvés.");
        return;
    }

    // 🧾 Récupère les valeurs des champs
    const email = emailInput.value;
    const password = passwordInput.value;
    console.log("Étape 4 : Email saisi :", email);
    console.log("Étape 4 : Mot de passe saisi :", password);

    // ⚠️ Si un champ est vide, on arrête
    if (!email || !password) {
        console.log("Étape 5 : Champs vides détectés");
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // 📡 Envoi de la requête à l'API pour se connecter
    try {
        console.log("Étape 6 : Envoi de la requête à l'API /api/users/login");
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        console.log("Étape 7 : Réponse reçue, statut :", response.status);

        // ❌ Mauvais identifiants
        if (!response.ok) throw new Error("Erreur lors de la connexion : identifiants incorrects.");

        const data = await response.json();
        console.log("Étape 8 : Réponse de l'API login :", data);

        // ✅ Si le token est présent → connexion réussie
        if (data.token) {
            localStorage.setItem("token", data.token); // 🔐 Stocke le token
            console.log("Étape 9 : Token stocké dans localStorage :", data.token);
            window.location.href = "./index.html"; // 🔁 Redirection vers la page principale
        } else {
            throw new Error("Échec de la connexion : token non reçu.");
        }
    } catch (error) {
        // ⚠️ Affiche l'erreur dans la console et une alerte
        console.error("Étape 11 : Erreur lors de la connexion :", error.message);
        alert(error.message);
    }
};

// 🎨 Applique dynamiquement les styles à la page login
const applyLoginStyles = () => {
    const body = document.body;
    body.style.backgroundColor = "#FFFEF8";
    body.style.fontFamily = "'Work Sans', sans-serif";

    // 🎯 Mise en page de la section login
    const section = document.getElementById("login");
    section.style.display = "flex";
    section.style.flexDirection = "column";
    section.style.justifyContent = "center";
    section.style.alignItems = "center";
    section.style.minHeight = "80vh";
    section.style.gap = "20px";

    // 🎨 Style du titre "Log In"
    const h2 = section.querySelector("h2");
    h2.style.color = "#1D6154";
    h2.style.fontSize = "1.5rem";
    h2.style.marginBottom = "10px";

    // 📋 Style du formulaire
    const form = document.getElementById("login-form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.gap = "15px";
    form.style.width = "300px";

    // 🧾 Style des champs email et mot de passe
    const inputs = form.querySelectorAll("input[type='email'], input[type='password']");
    inputs.forEach(input => {
        input.style.padding = "12px";
        input.style.border = "none";
        input.style.borderRadius = "5px";
        input.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.05)";
        input.style.fontSize = "1rem";
    });

    // 🟢 Style du bouton "Se connecter"
    const submit = form.querySelector("input[type='submit']");
    submit.style.padding = "12px";
    submit.style.border = "none";
    submit.style.borderRadius = "20px";
    submit.style.backgroundColor = "#1D6154";
    submit.style.color = "white";
    submit.style.cursor = "pointer";
    submit.style.fontWeight = "bold";
    submit.style.fontSize = "1rem";
    submit.style.marginTop = "10px";

    // 🔗 Lien "Mot de passe oublié"
    const forgot = section.querySelector("p");
    forgot.style.marginTop = "15px";
    forgot.querySelector("a").style.color = "#000";
    forgot.querySelector("a").style.textDecoration = "underline";
    forgot.querySelector("a").style.fontSize = "0.9em";
};

// 🚀 Quand la page est chargée
document.addEventListener("DOMContentLoaded", () => {
    console.log("Étape 2 : DOM chargé, recherche du formulaire #login-form");

    // 🔗 Si le formulaire existe, on ajoute l'action au clic
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        console.log("Étape 2 : Formulaire #login-form trouvé, ajout de l'écouteur d'événement");
        loginForm.addEventListener("submit", handleLogin);
    } else {
        console.error("Étape 2 : L'élément #login-form n'existe pas dans le HTML.");
    }

    // 🎨 On applique tous les styles de la page login
    applyLoginStyles();
});

// 💡 Met le lien "login" en gras si on est sur la page login.html
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");

    // Réinitialise tous les liens
    navLinks.forEach(link => {
        link.style.textDecoration = "none";
        link.style.color = "black";
        link.style.fontWeight = "normal";
    });

    // Met "login" en gras si on est sur cette page
    const loginLink = document.getElementById("nav-login");
    if (loginLink) {
        loginLink.style.fontWeight = "bold";
    }
});
