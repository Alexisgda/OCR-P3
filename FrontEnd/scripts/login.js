// === 🔐 Connexion utilisateur (login.js) ===

console.log("Étape 1 : login.js chargé"); // 🪵 Pour vérifier que le script est bien exécuté

// 🧠 Fonction principale pour gérer la soumission du formulaire
const handleLogin = async (event) => {
  console.log("Étape 3 : Formulaire soumis, handleLogin appelé"); // 📩 Log au clic sur "Se connecter"
  event.preventDefault(); // 🛑 Empêche le rechargement de la page

  // 📨 Récupération des champs email et mot de passe
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // ❌ Vérifie que les champs existent bien dans le DOM
  if (!emailInput || !passwordInput) {
    console.error("Champs email ou mot de passe introuvables.");
    alert("Erreur : Les champs email ou mot de passe sont manquants.");
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  // 🛑 Empêche l'envoi si un champ est vide
  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  // 🔄 Envoi de la requête à l'API pour vérifier les identifiants
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 📦 On envoie des données JSON
      },
      body: JSON.stringify({ email, password }), // 🔐 Données envoyées au backend
    });

    // ❌ Si la réponse est en erreur (ex : mauvais mot de passe)
    if (!response.ok) throw new Error("Identifiants incorrects.");

    const data = await response.json(); // 📥 Récupération de la réponse JSON

    // ✅ Si on reçoit un token, on le stocke et on redirige
    if (data.token) {
      localStorage.setItem("token", data.token); // 🗝️ Stocke le token dans le navigateur
      window.location.href = "./index.html"; // 🔁 Redirige vers la page d’accueil
    } else {
      throw new Error("Connexion échouée : token manquant.");
    }
  } catch (error) {
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    // Réinitialise
    emailError.style.display = "none";
    passwordError.style.display = "none";
    emailError.textContent = "";
    passwordError.textContent = "";

    // Affiche le message sous les deux champs pour ne pas faire d’erreur
    emailError.textContent = "E-mail incorrect";
    emailError.style.display = "block";

    passwordError.textContent =  "mot de passe incorrect";
    passwordError.style.display = "block";
  }
};

// 🖱️ Cible le formulaire et attache l'événement "submit"
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", handleLogin); // 🚀 Lance handleLogin quand on clique sur "Se connecter"
