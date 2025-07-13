// Importa as funções do Firebase que vamos precisar
import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";

// Pega os elementos do HTML que vamos manipular
const loginContainer = document.getElementById('login-container');
const cadastroContainer = document.getElementById('cadastro-container');
const linkCadastro = document.getElementById('link-cadastro');
const linkLogin = document.getElementById('link-login');

const loginEmailInput = document.getElementById('login-email');
const loginSenhaInput = document.getElementById('login-senha');
const botaoLogin = document.getElementById('botao-login');

const cadastroEmailInput = document.getElementById('cadastro-email');
const cadastroSenhaInput = document.getElementById('cadastro-senha');
const botaoCadastro = document.getElementById('botao-cadastro');

const mensagemErroEl = document.getElementById('mensagem-erro');

// --- Funções de validação ---
function validarEmail(email) {
    // Expressão regular simples para validar email
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validarSenha(senha) {
    // Senha deve ter no mínimo 6 caracteres
    return senha.length >= 6;
}

function mostrarErro(mensagem) {
    mensagemErroEl.textContent = mensagem;
}

// --- Lógica para alternar entre telas de Login e Cadastro ---
linkCadastro.addEventListener('click', (e) => {
    e.preventDefault(); // Impede que o link recarregue a página
    loginContainer.style.display = 'none';
    cadastroContainer.style.display = 'block';
    mostrarErro(''); // Limpa mensagens de erro
});

linkLogin.addEventListener('click', (e) => {
    e.preventDefault();
    cadastroContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    mostrarErro('');
});

// --- Lógica de Autenticação ---

// Fica "escutando" se o usuário já está logado ou não
onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
        // Se o usuário já estiver logado, redireciona para o painel
        console.log("Usuário já está logado:", usuario.email);
        window.location.href = 'painel.html';
    } else {
        console.log("Nenhum usuário logado.");
    }
});

// Adiciona o evento de clique no botão de LOGIN
botaoLogin.addEventListener('click', () => {
    const email = loginEmailInput.value;
    const senha = loginSenhaInput.value;

    // Validação básica dos campos
    if (!email || !senha) {
        mostrarErro("Por favor, preencha todos os campos.");
        return;
    }
    
    // Tenta fazer o login com o Firebase
    signInWithEmailAndPassword(auth, email, senha)
        .then((credenciaisDoUsuario) => {
            // Se der certo, o onAuthStateChanged vai cuidar do redirecionamento
            console.log("Login bem-sucedido!", credenciaisDoUsuario.user);
        })
        .catch((erro) => {
            // Se der erro, mostra uma mensagem amigável
            console.error("Erro no login:", erro.code, erro.message);
            if (erro.code === 'auth/invalid-credential' || erro.code === 'auth/wrong-password' || erro.code === 'auth/user-not-found') {
                mostrarErro("Email ou senha inválidos.");
            } else {
                mostrarErro("Ocorreu um erro ao tentar fazer login.");
            }
        });
});

// Adiciona o evento de clique no botão de CADASTRO
botaoCadastro.addEventListener('click', () => {
    const email = cadastroEmailInput.value;
    const senha = cadastroSenhaInput.value;

    // Validação dos campos
    if (!validarEmail(email)) {
        mostrarErro("Por favor, insira um email válido.");
        return;
    }
    if (!validarSenha(senha)) {
        mostrarErro("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    // Tenta criar uma nova conta com o Firebase
    createUserWithEmailAndPassword(auth, email, senha)
        .then((credenciaisDoUsuario) => {
            // Se o cadastro for bem-sucedido, o onAuthStateChanged vai redirecionar
            console.log("Cadastro realizado com sucesso!", credenciaisDoUsuario.user);
        })
        .catch((erro) => {
            // Se der erro, mostra uma mensagem amigável
            console.error("Erro no cadastro:", erro.code, erro.message);
            if (erro.code === 'auth/email-already-in-use') {
                mostrarErro("Este email já está em uso.");
            } else {
                mostrarErro("Ocorreu um erro ao tentar se cadastrar.");
            }
        });
});
