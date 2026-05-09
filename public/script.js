const API = window.location.origin + "/api";

async function listarClientes() {
    const res = await fetch(`${API}/clientes`);
    const data = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    data.forEach(cliente => {
        const li = document.createElement("li");
        li.innerText = `${cliente.nome} - Saldo: ${cliente.saldo_fiado}`;
        lista.appendChild(li);
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