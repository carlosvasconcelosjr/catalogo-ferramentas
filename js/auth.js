// js/auth.js
// Importando funções específicas do SDK modular via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Cole as suas credenciais aqui
const firebaseConfig = {
  apiKey: "AIzaSyCCXlUsHT8TILtlaLs3gMdYCwx2CbR8k0c",
  authDomain: "catalogo-ferramentas-bbca8.firebaseapp.com",
  projectId: "catalogo-ferramentas-bbca8",
  storageBucket: "catalogo-ferramentas-bbca8.firebasestorage.app",
  messagingSenderId: "201666518459",
  appId: "1:201666518459:web:feab557e225364a689b89e"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Função de Login
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Usuário logado:", user.displayName);
        // Redireciona para a área administrativa após o login
        window.location.href = "admin.html"; 
    } catch (error) {
        console.error("Erro ao fazer login:", error.message);
        alert("Falha na autenticação. Tente novamente.");
    }
};

// Função de Logout
export const logout = async () => {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Erro ao sair:", error.message);
    }
};

// Monitora o estado de autenticação para proteger rotas
export const checkAuthState = (requireAuth = false) => {
    onAuthStateChanged(auth, (user) => {
        if (requireAuth && !user) {
            // Se a página exige login e não há usuário, expulsa para a index
            window.location.href = "index.html";
        } else if (!requireAuth && user && window.location.pathname.includes("index.html")) {
             // Opcional: Se já está logado e na index, muda o botão de login para "Ir para Painel"
             const btnLogin = document.getElementById('btnLogin');
             if(btnLogin) {
                 btnLogin.textContent = "Ir para o Painel";
                 btnLogin.onclick = () => window.location.href = "admin.html";
             }
        }
    });
};