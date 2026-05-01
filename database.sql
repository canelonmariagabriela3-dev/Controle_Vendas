// Criação do banco de dados e tabelas para o sistema de controle de vendas.
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    local_trabalho VARCHAR(100),
    telefone VARCHAR(20),
    saldo_fiado DECIMAL(10, 2) DEFAULT 0.00,
    pontos_fidelidade INT DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    tipo ENUM('venda_fiado', 'pagamento', 'ganhou_ponto'),
    valor DECIMAL(10, 2),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE
);