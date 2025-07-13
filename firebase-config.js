// Importa as funções que a gente precisa do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ATENÇÃO: Cole aqui as configurações do seu projeto Firebase
// Você pode encontrar essas configurações no console do Firebase,
// nas configurações do seu projeto, na seção "SDK Setup and Configuration".
const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "SEU_AUTH_DOMAIN.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase com as nossas configurações
const app = initializeApp(firebaseConfig);

// Pega as referências dos serviços que vamos usar
const auth = getAuth(app); // Autenticação
const db = getFirestore(app); // Banco de dados Firestore

// Exporta as referências para que outros arquivos possam usá-las
export { auth, db };
