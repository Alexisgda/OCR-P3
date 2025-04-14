// scripts/login.js

console.log("Étape 1 : login.js chargé");

// 🔐 Gère la connexion de l'utilisateur
const handleLogin = async (event) => {
    console.log("Étape 3 : Formulaire soumis, handleLogin appelé");
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
        console.error("Champs email ou mot de passe introuvables.");
        alert("Erreur : Les champs email ou mot de passe sont manquants.");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Identifiants incorrects.");

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "./index.html";
        } else {
            throw new Error("Connexion échouée : token manquant.");
        }
    } catch (error) {
        alert(error.message);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
  
    // Remet tous les liens à l'état normal
    navLinks.forEach(link => {
      link.style.textDecoration = "none";
      link.style.color = "black";
      link.style.fontWeight = "normal";
    });
  
    // Met "login" en gras si on est sur login.html
    const loginLink = document.getElementById("nav-login");
    if (loginLink) {
      loginLink.style.fontWeight = "bold";
    }
  });
  
