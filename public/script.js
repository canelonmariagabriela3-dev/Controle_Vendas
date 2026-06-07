const API = window.location.origin + "/api";

// Variável global para sabermos qual cliente foi clicado ao abrir o modal
let idClienteSelecionado = null;

async function listarClientes() {
    const res = await fetch(`${API}/clientes`);
    const data = await res.json();

    // ID CORRIGIDO: Alinhado exatamente com o container do HTML
    const lista = document.getElementById("container-lista-fiado");
    if (!lista) return;
    lista.innerHTML = "";

    // ID CORRIGIDO: Alinhado para atualizar o valor interno do card Velvet
    const totalGeral = data.reduce((sum, c) => sum + parseFloat(c.saldo_fiado || 0), 0);
    const cardTotal = document.getElementById("total-a-receber-valor");
    if (cardTotal) cardTotal.innerText = `R$ ${totalGeral.toFixed(2)}`;

    data.forEach(cliente => {
        // Renderiza no padrão visual Velvet Mobile incluindo os botões de ação rápida por cliente
        lista.innerHTML += `
            <div class="ledger-item" style="flex-direction: column; align-items: stretch; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div class="item-info">
                        <span class="item-name">${cliente.nome}</span>
                        <span class="item-date">📞 ${cliente.telefone} | 💼 ${cliente.local_trabalho}</span>
                        <span class="item-date" style="color: var(--accent-purple)">⭐ Pontos: ${cliente.pontos_fidelidade || 0}</span>
                    </div>
                    <div class="item-value-badge">R$ ${parseFloat(cliente.saldo_fiado || 0).toFixed(2)}</div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button 
                        class="btn-action btn-primary-pink" 
                        style="height: 38px; font-size: 0.85rem;"
                        onclick="abrirModalTransacao(${cliente.id}, 'venda')"
                    >
                        + Venda
                    </button>
                    <button 
                        class="btn-action btn-secondary-velvet" 
                        style="height: 38px; font-size: 0.85rem;"
                        onclick="abrirModalTransacao(${cliente.id}, 'pagamento')"
                    >
                        $ Pago
                    </button>
                </div>
            </div>
        `;
    });
}

async function criarCliente() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const local = document.getElementById("local").value;

    // Validação simples para evitar envio vazio
    if (!nome || !telefone) {
        alert("Por favor, preencha o nome e o telefone.");
        return;
    }

    await fetch(`${API}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, local_trabalho: local })
    });

    alert("Cliente criado!");
    
    // Limpa os campos do formulário após criar
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("local").value = "";

    listarClientes();
}

// ==========================================
// CONTROLE DO MODAL VELVET
// ==========================================
const modalOverlay = document.getElementById('modal-registro-transacao');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const formFiado = document.getElementById('form-registrar-fiado');

function abrirModalTransacao(id_cliente, tipo) {
    idClienteSelecionado = id_cliente;
    
    // Altera o select de tipo do modal automaticamente (+Venda ou $Pago)
    const selectTipo = document.getElementById('select-tipo');
    if (selectTipo) selectTipo.value = tipo;
    
    // Abre o modal visualmente
    if (modalOverlay) modalOverlay.classList.add('active');
}

// Evento do botão "X" para fechar
if (btnFecharModal) {
    btnFecharModal.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
}

// Fechar se clicar fora da área útil do modal
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
}

// Envio unificado do formulário Velvet
if (formFiado) {
    formFiado.addEventListener('submit', async (e) => {
        e.preventDefault();

        const valor = document.getElementById('input-valor').value;
        const tipo = document.getElementById('select-tipo').value;

        if (!valor || !idClienteSelecionado) return;

        const rotaFinal = tipo === 'venda' ? 'venda' : 'pagamento';

        await fetch(`${API}/historico/${rotaFinal}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_cliente: idClienteSelecionado,
                valor: parseFloat(valor)
            })
        });

        alert(`${tipo === 'venda' ? 'Venda' : 'Pagamento'} registrado!`);
        
        // Limpa e fecha tudo
        formFiado.reset();
        modalOverlay.classList.remove('active');
        idClienteSelecionado = null;

        // Atualiza a tela Velvet com os novos saldos
        listarClientes();
    });
}

// Filtro de pesquisa adaptado para a estrutura Velvet
function pesquisarCliente() {
    const texto = document.getElementById("pesquisa").value.toLowerCase();
    const cards = document.querySelectorAll("#container-lista-fiado .ledger-item");

    cards.forEach(card => {
        const nome = card.innerText.toLowerCase();
        card.style.display = nome.includes(texto) ? "flex" : "none";
    });
}

// Inicializa listando os clientes ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    listarClientes();
    
    // Vincula a pesquisa caso o input dinâmico seja digitado
    const inputPesquisa = document.getElementById("pesquisa");
    if (inputPesquisa) {
        inputPesquisa.addEventListener("input", pesquisarCliente);
    }
});