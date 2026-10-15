function validaçao_descricao(descricao) {
    if(descricao.trim() === ""){
        alert("Descrição não pode ser vazia");
        return false;
    }
    return true;
}
function validaçao_categoria(categoria) {
    if(categoria === ""){
        alert("Categoria não pode ser vazia");
        return false;
    }
    return true;
}
function validaçao_prioridade(prioridade) {
    if(prioridade === ""){
        alert("Prioridade não pode ser vazia");
        return false;
    }
    return true;
}
function validaçao_data(data) {
    if(data === ""){
        alert("Data não pode ser vazia");
        return false;
    }
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0); 
    const dataInformada = new Date(data + "T00:00:00");
    if (dataInformada < dataAtual) {
        alert("A data informada não pode ser anterior à data atual.");
        return false;
    }
    return true;
}
const enviar = document.getElementById("adicionar");
enviar.addEventListener("click", function(event) {
    event.preventDefault();
    adicionarTarefa();
});
function limparTarefas() {
    listas.innerHTML = "";
    listas.appendChild(titulo);
    tarefas.length = 0;
}
const listas = document.getElementById("lista-tarefas");
let titulo = document.createElement("h2");
titulo.textContent = "Listas de Tarefas";

const div = document.createElement("div");
div.classList.add("bloco");

function criarTarefa(descricao, categoria, prioridade, data) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("concluir-tarefa");
    const tarefa = document.createElement("div");
    tarefa.classList.add("tarefa");
    let icone_prioridade = "";
    let icone_categoria = "";
    if(prioridade === "alta") {
        icone_prioridade = "↑";
    }else if(prioridade === "media") {
        icone_prioridade ="⊖";
    }else if(prioridade === "baixa") {
        icone_prioridade = "↓";
    }
    if(categoria === "estudo") {
        icone_categoria = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 7v14\"/><path d=\"M3 18V5a2 2 0 0 1 2-2h4a3 3 0 0 1 3 3 3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v13h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\"/></svg>";
    } else if(categoria === "trabalho") {
        icone_categoria = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 11h-4V7h-3v4h-4v3h4v4h3v-4h4v-3z\"/></svg>";
    } else if(categoria === "pessoal") {
        icone_categoria = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"#4e4e4e\"><path d=\"M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z\"/></svg>";
    }
    // 
    const nomeCategoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    const nomePrioridade = prioridade.charAt(0).toUpperCase() + prioridade.slice(1);
    tarefa.innerHTML = `
        <div class="informacoes-tarefa">
            <p><strong>Descrição:</strong> ${descricao}</p>
            <p><strong>${icone_categoria}</strong> ${nomeCategoria}</p>
            <p><strong style="color:red">${icone_prioridade}</strong> ${nomePrioridade}</p>
            <p><strong><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4e4e4e"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg></strong> ${data}</p>
        
        </div>
        `;

        tarefa.prepend(checkbox);

        checkbox.addEventListener("change", function() {
        tarefa.classList.toggle("concluida", checkbox.checked);
    });
    return tarefa;
}
listas.appendChild(titulo);
const tarefas = [];
function adicionarTarefa() {
    const descricao = document.getElementById("descricao").value;
    const categoria = document.getElementById("categoria").value;
    const prioridade_selecionada = document.querySelector('input[name="prioridade"]:checked');
    const prioridade = prioridade_selecionada ? prioridade_selecionada.value : "";
    const data = document.getElementById("conclusao").value;
    if(!validaçao_descricao(descricao) || !validaçao_categoria(categoria) ||
     !validaçao_prioridade(prioridade) || !validaçao_data(data)) {
        return;
    }
    const tarefa = criarTarefa(descricao, categoria, prioridade, data);
    const div = document.createElement("div");
    div.classList.add("bloco");
    tarefas.push(div);
    div.appendChild(tarefa);
    listas.appendChild(div);
    document.getElementById("informacao").reset();
}
