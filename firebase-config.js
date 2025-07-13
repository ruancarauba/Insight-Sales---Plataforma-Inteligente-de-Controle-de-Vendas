// Importa as funções que a gente precisa do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Suas credenciais do Firebase que você forneceu
const firebaseConfig = {
  apiKey: "AIzaSyDWuRaQL0ACL6WNcxuwx83oi-qyMu-djdU",
  authDomain: "clima-c44d3.firebaseapp.com",
  databaseURL: "https://clima-c44d3-default-rtdb.firebaseio.com",
  projectId: "clima-c44d3",
  storageBucket: "clima-c44d3.firebasestorage.app",
  messagingSenderId: "229528756598",
  appId: "1:229528756598:web:2d1e76c977f0e236151a57",
  measurementId: "G-VX59KMHTVT"
};

// Inicializa o Firebase com as nossas configurações
const app = initializeApp(firebaseConfig);

// Pega as referências dos serviços que vamos usar
const auth = getAuth(app); // Autenticação
const db = getFirestore(app); // Banco de dados Firestore

// Exporta as referências para que outros arquivos possam usá-las
export { auth, db };
