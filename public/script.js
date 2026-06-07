const API = window.location.origin + "/api";

// Variáveis que serão inicializadas no DOMContentLoaded
let idClienteSelecionado = null;
let modalOverlay = null;
let btnFecharModal = null;
let formFiado = null;
let modalNovoCliente = null;
let btnNovoCliente = null;

function toNumber(value) {
    if (value == null) return 0;
    const normalized = String(value).replace(/\./g, '').replace(',', '.');
    const n = parseFloat(normalized);
    return isNaN(n) ? 0 : n;
}

function showNotification(message, type = 'info', timeout = 3500) {
    const container = document.getElementById('notification-container') || document.body;
    const el = document.createElement('div');
    el.textContent = message;
    el.style.background = type === 'error' ? 'rgba(255,60,60,0.95)' : 'rgba(0,0,0,0.75)';
    el.style.color = '#fff';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.3)';
    el.style.marginTop = '8px';
    el.style.maxWidth = '320px';
    el.style.fontFamily = 'Inter, sans-serif';
    el.style.fontSize = '0.95rem';
    container.appendChild(el);
    setTimeout(() => {
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
    }, timeout);
}

async function listarClientes() {
    try {
        const res = await fetch(`${API}/clientes`);
        if (!res.ok) throw new Error(`Falha ao buscar clientes: ${res.status}`);
        const data = await res.json();

        const lista = document.getElementById('container-lista-fiado');
        if (!lista) return;
        // limpa lista
        lista.innerHTML = '';

        const totalGeral = data.reduce((sum, c) => sum + toNumber(c.saldo_fiado || 0), 0);
        const cardTotal = document.getElementById('total-a-receber-valor');
        if (cardTotal) cardTotal.innerText = `R$ ${totalGeral.toFixed(2)}`;

        data.forEach(cliente => {
            const item = document.createElement('div');
            item.className = 'ledger-item';
            item.style.flexDirection = 'column';
            item.style.alignItems = 'stretch';
            item.style.gap = '12px';

            const top = document.createElement('div');
            top.style.display = 'flex';
            top.style.justifyContent = 'space-between';
            top.style.alignItems = 'flex-start';

            const info = document.createElement('div');
            info.className = 'item-info';

            const nomeEl = document.createElement('span');
            nomeEl.className = 'item-name';
            nomeEl.textContent = cliente.nome || '';

            const contatoEl = document.createElement('span');
            contatoEl.className = 'item-date';
            contatoEl.textContent = `📞 ${cliente.telefone || ''} | 💼 ${cliente.local_trabalho || ''}`;

            const pontosEl = document.createElement('span');
            pontosEl.className = 'item-date';
            pontosEl.style.color = 'var(--accent-purple)';
            pontosEl.textContent = `⭐ Pontos: ${cliente.pontos_fidelidade || 0}`;

            info.appendChild(nomeEl);
            info.appendChild(contatoEl);
            info.appendChild(pontosEl);

            const valueBadge = document.createElement('div');
            valueBadge.className = 'item-value-badge';
            valueBadge.textContent = `R$ ${toNumber(cliente.saldo_fiado || 0).toFixed(2)}`;

            top.appendChild(info);
            top.appendChild(valueBadge);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const btnVenda = document.createElement('button');
            btnVenda.type = 'button';
            btnVenda.className = 'btn-action btn-primary-pink';
            btnVenda.style.height = '38px';
            btnVenda.style.fontSize = '0.85rem';
            btnVenda.textContent = '+ Venda';
            btnVenda.addEventListener('click', () => abrirModalTransacao(cliente.id, 'venda'));

            const btnPagamento = document.createElement('button');
            btnPagamento.type = 'button';
            btnPagamento.className = 'btn-action btn-secondary-velvet';
            btnPagamento.style.height = '38px';
            btnPagamento.style.fontSize = '0.85rem';
            btnPagamento.textContent = '$ Pago';
            btnPagamento.addEventListener('click', () => abrirModalTransacao(cliente.id, 'pagamento'));

            actions.appendChild(btnVenda);
            actions.appendChild(btnPagamento);

            item.appendChild(top);
            item.appendChild(actions);

            lista.appendChild(item);
        });
    } catch (err) {
        console.error(err);
        showNotification('Erro ao carregar clientes.', 'error');
    }
}

async function criarCliente() {
    try {
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const local = document.getElementById('local').value;

        if (!nome || !telefone) {
            showNotification('Por favor, preencha o nome e o telefone.', 'error');
            return;
        }

        const res = await fetch(`${API}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, local_trabalho: local })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Falha ao criar cliente');
        }

        showNotification('Cliente criado!');

        document.getElementById('nome').value = '';
        document.getElementById('telefone').value = '';
        document.getElementById('local').value = '';

        await listarClientes();
    } catch (err) {
        console.error(err);
        showNotification('Erro ao criar cliente.', 'error');
    }
}

function abrirModalTransacao(id_cliente, tipo) {
    idClienteSelecionado = id_cliente;
    const selectTipo = document.getElementById('select-tipo');
    if (selectTipo) selectTipo.value = tipo;
    if (modalOverlay) modalOverlay.classList.add('active');
}

function pesquisarCliente() {
    const input = document.getElementById('pesquisa');
    if (!input) return;
    const texto = input.value.toLowerCase();
    const cards = document.querySelectorAll('#container-lista-fiado .ledger-item');

    cards.forEach(card => {
        const nome = card.innerText.toLowerCase();
        card.style.display = nome.includes(texto) ? 'flex' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa referências que dependem do DOM
    modalOverlay = document.getElementById('modal-registro-transacao');
    btnFecharModal = document.getElementById('btn-fechar-modal');
    formFiado = document.getElementById('form-registrar-fiado');
    modalNovoCliente = document.getElementById('modal-novo-cliente');
    btnNovoCliente = document.getElementById('btn-novo-cliente');

    listarClientes();

    const inputPesquisa = document.getElementById('pesquisa');
    if (inputPesquisa) inputPesquisa.addEventListener('input', pesquisarCliente);

    if (btnFecharModal && modalOverlay) {
        btnFecharModal.addEventListener('click', () => modalOverlay.classList.remove('active'));
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.remove('active');
        });
    }

    if (modalNovoCliente) {
        modalNovoCliente.addEventListener('click', (e) => {
            if (e.target === modalNovoCliente) modalNovoCliente.classList.remove('active');
        });
    }

    if (btnNovoCliente && modalNovoCliente) {
        btnNovoCliente.addEventListener('click', () => modalNovoCliente.classList.add('active'));
    }

    if (formFiado) {
        formFiado.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const valorRaw = document.getElementById('input-valor').value;
                const tipo = document.getElementById('select-tipo').value;
                if (!valorRaw || !idClienteSelecionado) return;

                const valor = toNumber(valorRaw);
                const rotaFinal = tipo === 'venda' ? 'venda' : 'pagamento';

                const res = await fetch(`${API}/historico/${rotaFinal}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_cliente: idClienteSelecionado, valor })
                });

                if (!res.ok) {
                    const t = await res.text();
                    throw new Error(t || 'Falha ao registrar movimentação');
                }

                showNotification(`${tipo === 'venda' ? 'Venda' : 'Pagamento'} registrado!`);

                formFiado.reset();
                modalOverlay.classList.remove('active');
                idClienteSelecionado = null;
                await listarClientes();
            } catch (err) {
                console.error(err);
                showNotification('Erro ao registrar movimentação.', 'error');
            }
        });
    }
});