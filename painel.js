// Importa as funções do Firebase que vamos usar
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";

// Pega os elementos do HTML que vamos manipular
const emailUsuarioEl = document.getElementById('email-usuario');
const botaoSair = document.getElementById('botao-sair');
const inputNovaTarefa = document.getElementById('input-nova-tarefa');
const botaoAdicionarTarefa = document.getElementById('botao-adicionar-tarefa');
const listaDeTarefasEl = document.getElementById('lista-de-tarefas');

let usuarioAtual = null;

// Função para buscar e mostrar as tarefas do usuário logado
function buscarTarefas(uid) {
    // Cria uma query para buscar tarefas onde o 'donoId' é igual ao uid do usuário
    const tarefasQuery = query(collection(db, "tarefas"), where("donoId", "==", uid));

    // Escuta as mudanças em tempo real na coleção de tarefas
    onSnapshot(tarefasQuery, (snapshot) => {
        // Limpa a lista de tarefas no HTML antes de adicionar as novas
        listaDeTarefasEl.innerHTML = '';
        if (snapshot.empty) {
            listaDeTarefasEl.innerHTML = '<li>Nenhuma tarefa ainda. Adicione uma!</li>';
            return;
        }
        
        // Para cada tarefa encontrada, cria um item na lista
        snapshot.forEach((documento) => {
            const dadosTarefa = documento.data();
            const li = document.createElement('li');
            li.textContent = dadosTarefa.texto;

            // Cria um botão para deletar a tarefa
            const botaoDeletar = document.createElement('button');
            botaoDeletar.textContent = 'Excluir';
            botaoDeletar.className = 'botao-deletar';
            botaoDeletar.onclick = () => deletarTarefa(documento.id);
            
            li.appendChild(botaoDeletar);
            listaDeTarefasEl.appendChild(li);
        });
    });
}

// Função para adicionar uma nova tarefa
async function adicionarTarefa() {
    const textoTarefa = inputNovaTarefa.value.trim();
    if (textoTarefa === '' || !usuarioAtual) {
        alert('Por favor, digite uma tarefa.');
        return;
    }

    try {
        // Adiciona um novo documento na coleção "tarefas"
        await addDoc(collection(db, "tarefas"), {
            texto: textoTarefa,
            donoId: usuarioAtual.uid, // Salva o ID do usuário para saber de quem é a tarefa
            criadoEm: new Date()
        });
        // Limpa o campo de input depois de adicionar
        inputNovaTarefa.value = '';
    } catch (erro) {
        console.error("Erro ao adicionar tarefa: ", erro);
        alert('Ocorreu um erro ao adicionar a tarefa. Tente novamente.');
    }
}

// Função para deletar uma tarefa
async function deletarTarefa(idTarefa) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
    }
    try {
        // Deleta o documento da coleção "tarefas" usando o ID
        await deleteDoc(doc(db, "tarefas", idTarefa));
    } catch (erro) {
        console.error("Erro ao deletar tarefa: ", erro);
        alert('Ocorreu um erro ao excluir a tarefa.');
    }
}

// Fica monitorando o estado da autenticação
onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
        // Se o usuário está logado, guarda os dados dele
        usuarioAtual = usuario;
        emailUsuarioEl.textContent = usuario.email;
        // Busca as tarefas do usuário
        buscarTarefas(usuario.uid);
    } else {
        // Se não tem ninguém logado, volta para a tela de login
        console.log("Nenhum usuário logado. Redirecionando para login.");
        window.location.href = 'index.html';
    }
});

// Adiciona o evento de clique no botão de sair
botaoSair.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log("Usuário deslogado com sucesso.");
        // Redireciona para a página de login após sair
        window.location.href = 'index.html';
    }).catch((erro) => {
        console.error("Erro ao sair:", erro);
    });
});

// Adiciona o evento de clique no botão de adicionar tarefa
botaoAdicionarTarefa.addEventListener('click', adicionarTarefa);
