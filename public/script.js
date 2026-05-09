const API = window.location.origin + "/api";

async function listarClientes() {
    const res = await fetch(`${API}/clientes`);
    const data = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    data.forEach(cliente => {
        lista.innerHTML += `
  <div class="col-md-4 mb-3">

    <div class="card shadow h-100">

      <div class="card-body">

        <h5 class="card-title text-danger">
          ${cliente.nome}
        </h5>

        <p class="card-text">
          📞 ${cliente.telefone}
        </p>

        <p class="card-text">
          💼 ${cliente.local_trabalho}
        </p>

        <p class="card-text">
          💰 Saldo: R$ ${cliente.saldo_fiado}
        </p>

        <p class="card-text">
          ⭐ Pontos: ${cliente.pontos_fidelidade || 0}
        </p>
        <button 
        class="btn btn-danger w-100"
        onclick="registrarVenda(${cliente.id})"
        >
        Registrar Venda
        </button>
        <button 
        class="btn btn-warning w-100 mt-2"
        onclick="registrarPagamento(${cliente.id})"
        >
        Registrar Pagamento
        </button>

      </div>

    </div>

  </div>
`;
    });
}
async function criarCliente() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const local = document.getElementById("local").value;

    await fetch(`${API}/clientes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            telefone,
            local_trabalho: local
        })
    });

    alert("Cliente criado!");
} 
async function registrarVenda(id_cliente) {

  const valor = prompt("Valor da venda:");

  if (!valor) return;

  await fetch(`${API}/historico/venda`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      id_cliente,
      valor
    })
  });

  alert("Venda registrada!");

  listarClientes();
}
async function registrarPagamento(id_cliente) {

  const valor = prompt("Valor do pagamento:");

  if (!valor) return;

  await fetch(`${API}/historico/pagamento`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      id_cliente,
      valor
    })

  });

  alert("Pagamento registrado!");

  listarClientes();
}
function pesquisarCliente() {

  const texto = document
    .getElementById("pesquisa")
    .value
    .toLowerCase();

  const cards = document.querySelectorAll(".col-md-4");

  cards.forEach(card => {

    const nome = card.innerText.toLowerCase();

    if (nome.includes(texto)) {

      card.style.display = "block";

    } else {

      card.style.display = "none";

    }

  });

}