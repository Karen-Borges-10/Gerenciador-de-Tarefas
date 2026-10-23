 function formatarData(data) {
        const partes = data.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
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

function criarTarefa(descricao, categoria, prioridade, data) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("concluir-tarefa");
    const tarefa = document.createElement("div");
    tarefa.classList.add("tarefa");
    tarefa.dataset.descricao = descricao;
    tarefa.dataset.categoria = categoria;
    tarefa.dataset.prioridade = prioridade;
    tarefa.dataset.data = data;
    tarefa.dataset.concluida = "false";
    const botaoExcluir = document.createElement("button");
    botaoExcluir.innerHTML = '<i class="fa-solid fa-trash"></i>';
    botaoExcluir.classList.add("excluir-tarefa");
    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "✎";
    botaoEditar.classList.add("editar-tarefa");
    let icone_prioridade = "";
    if(prioridade === "alta") {
        icone_prioridade = '<i class="fa-solid fa-arrow-up"></i>';
    }else if(prioridade === "media") {
        icone_prioridade ="<i class=\"fa-solid fa-minus\"></i>";
    }else if(prioridade === "baixa") {
        icone_prioridade = '<i class="fa-solid fa-arrow-down"></i>';
    }
    // 
    const nomeCategoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    const nomePrioridade = prioridade.charAt(0).toUpperCase() + prioridade.slice(1);
    tarefa.innerHTML = `
        <div class="informacoes-tarefa">
            <p>${descricao}</p>
            <p>
                <span class="bolinha-categoria ${categoria}"></span>
                <span class="texto-categoria ${categoria}">${nomeCategoria}</span>
            </p>
            <p>
                <strong class="icone-prioridade ${prioridade}">${icone_prioridade}</strong>${nomePrioridade}
            </p>
            <p><strong><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4e4e4e"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg></strong> ${formatarData(data)}</p>
        </div>
        `;

        tarefa.prepend(checkbox);

        checkbox.addEventListener("change", function() {
        if (tarefa.closest(".exemplo")) {
            checkbox.checked = false;
            return;
        }
        tarefa.classList.toggle("concluida", checkbox.checked);
        salvar_tarefas();
        atualizar_contadores();
        aplicar_filtros();
    });

    tarefa.appendChild(botaoEditar);
    tarefa.appendChild(botaoExcluir);    

    botaoEditar.addEventListener("click", function() {
    if (tarefa.closest(".exemplo")) {
        return;
    }
    const informacoes = tarefa.querySelector(".informacoes-tarefa");
    const paragrafos = informacoes.querySelectorAll("p");

    document.getElementById("descricao").value = paragrafos[0].textContent.replace("Descrição:", "").trim();
    document.getElementById("categoria").value = categoria;
    document.getElementById("conclusao").value = data;
    document.querySelector(`input[name="prioridade"][value="${prioridade}"]`).checked = true;
    tarefas_editando = tarefa;
    document.getElementById("adicionar").textContent = "Salvar Alterações";});

    botaoExcluir.addEventListener("click", function() {
    if (tarefa.closest(".exemplo")) {
        return;
    }
        const confirmar = confirm("Tem certeza de que deseja excluir esta tarefa?");
        if(!confirmar) {
            return;
        }
        const bloco = tarefa.closest(".bloco");

        if (bloco) {
            bloco.remove();
            const indice = tarefas.indexOf(bloco);
            if (indice !== -1) {
                tarefas.splice(indice, 1);
            }
        }else {
            tarefa.remove();
        }
        if(tarefas_editando === tarefa) {
            tarefas_editando = null;
            document.getElementById("informacao").reset();
            document.getElementById("adicionar").textContent = "+ Adicionar Tarefa";
        }
        atualizar_contadores();
        aplicar_filtros();
        salvar_tarefas();
    });
    return tarefa;
}
listas.appendChild(titulo);
const tarefas = [];
let tarefas_editando = null;
let situacao_selecionada = "todas";
let categoria_selecionada = "todas";

function salvar_tarefas() {
    const dados_tarefas = tarefas.map(function(bloco) {
        const tarefa = bloco.querySelector(".tarefa");
        const checkbox = tarefa.querySelector(".concluir-tarefa");

        return {
            descricao: tarefa.dataset.descricao,
            categoria: tarefa.dataset.categoria,
            prioridade: tarefa.dataset.prioridade,
            data: tarefa.dataset.data,
            concluida: checkbox.checked
        };
    });

    localStorage.setItem("tarefas", JSON.stringify(dados_tarefas));
}

function aplicar_filtros(){
    tarefas.forEach(function(bloco){
        const tarefa = bloco.querySelector(".tarefa");
        const checkbox = tarefa.querySelector(".concluir-tarefa");
        
        const categoria = tarefa.querySelector(".texto-categoria").textContent.trim().toLowerCase();

        const situacao_corresponde = situacao_selecionada === "todas" || 
        (situacao_selecionada === "pendente" && !checkbox.checked) ||
        (situacao_selecionada === "concluida" && checkbox.checked);
    
        const categoria_corresponde = categoria_selecionada === "todas" ||
        categoria_selecionada === categoria;

        bloco.style.display = situacao_corresponde && categoria_corresponde ? "" : "none";
    });
}


const botoes_situacao = document.querySelectorAll(".filtro-situacao");
const botoes_categoria = document.querySelectorAll(".filtro-categoria");

botoes_situacao.forEach(function(botao) {
    botao.addEventListener("click", function() {
        situacao_selecionada = botao.dataset.situacao;

        botoes_situacao.forEach(function(outroBotao) {
            outroBotao.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        aplicar_filtros();
    });
});

botoes_categoria.forEach(function(botao) {
    botao.addEventListener("click", function() {
        categoria_selecionada = botao.dataset.categoria;

        botoes_categoria.forEach(function(outroBotao) {
            outroBotao.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        aplicar_filtros();
    });
});


function atualizar_contadores() {
    const botoes_situacao = document.querySelectorAll(".filtro-situacao");
    const botoes_categoria = document.querySelectorAll(".filtro-categoria");

    let total = tarefas.length;
    let pendentes = 0;
    let concluidas = 0;

    let estudo = 0;
    let trabalho = 0;
    let pessoal = 0;

    tarefas.forEach(function(bloco) {
        const tarefa = bloco.querySelector(".tarefa");
        const checkbox = tarefa.querySelector(".concluir-tarefa");
        const categoria = tarefa.querySelector(".texto-categoria")
            .textContent.trim().toLowerCase();

        if (checkbox.checked) {
            concluidas++;
        } else {
            pendentes++;
        }

        if (categoria === "estudo") {
            estudo++;
        } else if (categoria === "trabalho") {
            trabalho++;
        } else if (categoria === "pessoal") {
            pessoal++;
        }
    });

    botoes_situacao.forEach(function(botao) {
        const situacao = botao.dataset.situacao;
        const contador = botao.querySelector(".contador");

        if (situacao === "todas") {
            contador.textContent = total;
        } else if (situacao === "pendente") {
            contador.textContent = pendentes;
        } else if (situacao === "concluida") {
            contador.textContent = concluidas;
        }
    });

    botoes_categoria.forEach(function(botao) {
        const categoria = botao.dataset.categoria;
        const contador = botao.querySelector(".contador");

        if (categoria === "todas") {
            contador.textContent = total;
        } else if (categoria === "estudo") {
            contador.textContent = estudo;
        } else if (categoria === "trabalho") {
            contador.textContent = trabalho;
        } else if (categoria === "pessoal") {
            contador.textContent = pessoal;
        }
    });
}


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
   if (tarefas_editando !== null) {
        const tarefaAntiga = tarefas_editando;
        const bloco = tarefaAntiga.closest(".bloco");
        const estavaConcluida = tarefaAntiga.querySelector(".concluir-tarefa").checked;
        const novaTarefa = criarTarefa(descricao, categoria, prioridade, data);
        const checkbox = novaTarefa.querySelector(".concluir-tarefa");
        checkbox.checked = estavaConcluida;
        novaTarefa.classList.toggle("concluida", estavaConcluida);
        if(bloco){
            bloco.replaceChild(novaTarefa, tarefaAntiga);
        }
        tarefas_editando = null;
        document.getElementById("adicionar").textContent = "+ Adicionar Tarefa";
    } else {
        listas.querySelectorAll(".exemplo").forEach(function(exemplo) {
            exemplo.remove();
        });
        const tarefa = criarTarefa(descricao, categoria, prioridade, data);
        const bloco = document.createElement("div");
        bloco.classList.add("bloco");
        bloco.appendChild(tarefa);

        tarefas.push(bloco);
        listas.appendChild(bloco);
    }
        document.getElementById("informacao").reset();
        atualizar_contadores();
        aplicar_filtros();
        salvar_tarefas();
}

function mostrar_exemplo(){
     const exemplos = [
        {
            descricao: "Estudar JavaScript",
            categoria: "estudo",
            prioridade: "alta",
            data: "2026-10-25"
        },
        {
            descricao: "Organizar tarefas da semana",
            categoria: "pessoal",
            prioridade: "media",
            data: "2026-10-28"
        }
    ];

    exemplos.forEach(function(dados) {
        const tarefa = criarTarefa(
            dados.descricao,
            dados.categoria,
            dados.prioridade,
            dados.data
        );

        const bloco = document.createElement("div");
        bloco.classList.add("bloco", "exemplo");
        bloco.appendChild(tarefa);

        listas.appendChild(bloco);
    });
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas === null) {
        mostrar_exemplo();
        atualizar_contadores();
        return;
    }

    const dadosTarefas = JSON.parse(tarefasSalvas);

    if (dadosTarefas.length === 0) {
        mostrar_exemplo();
        atualizar_contadores();
        return;
    }

    dadosTarefas.forEach(function(dados) {
        const tarefa = criarTarefa(
            dados.descricao,
            dados.categoria,
            dados.prioridade,
            dados.data
        );

        const checkbox = tarefa.querySelector(".concluir-tarefa");

        checkbox.checked = dados.concluida;
        tarefa.classList.toggle("concluida", dados.concluida);
        tarefa.dataset.concluida = String(dados.concluida);

        const bloco = document.createElement("div");
        bloco.classList.add("bloco");
        bloco.appendChild(tarefa);

        tarefas.push(bloco);
        listas.appendChild(bloco);
    });

    atualizar_contadores();
    aplicar_filtros();
}
carregarTarefas();