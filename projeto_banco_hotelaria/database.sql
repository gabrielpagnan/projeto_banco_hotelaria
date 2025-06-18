-- Criação das tabelas
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    documento_identidade VARCHAR(20) UNIQUE,
    data_cadastro DATE DEFAULT CURRENT_DATE
);

CREATE TABLE quartos (
    id_quarto SERIAL PRIMARY KEY,
    numero INT UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    capacidade INT NOT NULL,
    preco_diaria DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'disponível'
);

CREATE TABLE reservas (
    id_reserva SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES clientes(id_cliente),
    data_checkin DATE NOT NULL,
    data_checkout DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'pendente',
    data_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservas_quartos (
    id_reserva INT REFERENCES reservas(id_reserva) ON DELETE CASCADE,
    id_quarto INT REFERENCES quartos(id_quarto),
    PRIMARY KEY (id_reserva, id_quarto)
);

CREATE TABLE pagamentos (
    id_pagamento SERIAL PRIMARY KEY,
    id_reserva INT REFERENCES reservas(id_reserva),
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(30),
    status_pagamento VARCHAR(20) DEFAULT 'pendente',
    data_pagamento TIMESTAMP
);

CREATE TABLE funcionarios (
    id_funcionario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    data_contratacao DATE NOT NULL
);

CREATE TABLE checkins (
    id_checkin SERIAL PRIMARY KEY,
    id_reserva INT REFERENCES reservas(id_reserva),
    id_funcionario INT REFERENCES funcionarios(id_funcionario),
    data_checkin TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servicos (
    id_servico SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL
);

-- Inserção de dados de exemplo
INSERT INTO clientes (nome, email, telefone, documento_identidade)
VALUES
  ('Ana Souza', 'ana.souza@email.com', '11988887777', '12345678900'),
  ('Carlos Lima', 'carlos.lima@email.com', '21999996666', '98765432100'),
  ('Juliana Rocha', 'juliana.rocha@email.com', '31988776655', '11122233344'),
  ('Lucas Pereira', 'lucas.pereira@email.com', '11977776666', '33344455566'),
  ('Beatriz Gomes', 'beatriz.gomes@email.com', '31966665555', '44455566677');

INSERT INTO quartos (numero, tipo, capacidade, preco_diaria, status)
VALUES
  (101, 'Solteiro', 1, 150.00, 'disponível'),
  (102, 'Casal', 2, 220.00, 'ocupado'),
  (201, 'Luxo', 3, 350.00, 'manutenção'),
  (202, 'Casal', 2, 230.00, 'disponível'),
  (203, 'Triplo', 3, 310.00, 'disponível');

INSERT INTO reservas (id_cliente, data_checkin, data_checkout, status)
VALUES
  (1, '2025-06-15', '2025-06-20', 'confirmada'),
  (2, '2025-06-18', '2025-06-22', 'pendente'),
  (3, '2025-07-01', '2025-07-05', 'pendente'),
  (4, '2025-07-10', '2025-07-15', 'confirmada'),
  (5, '2025-07-12', '2025-07-14', 'confirmada');

INSERT INTO reservas_quartos (id_reserva, id_quarto)
VALUES
  (1, 1),
  (1, 3),
  (2, 2),
  (3, 5),
  (4, 4);

INSERT INTO pagamentos (id_reserva, valor_total, forma_pagamento, status_pagamento, data_pagamento)
VALUES
  (1, 2500.00, 'cartão', 'pago', '2025-06-10 14:30:00'),
  (2, 880.00, 'pix', 'pendente', NULL),
  (3, 560.00, 'dinheiro', 'pago', '2025-06-25 11:00:00'),
  (4, 3150.00, 'cartão', 'pago', '2025-06-28 15:45:00'),
  (5, 280.00, 'pix', 'pendente', NULL);

INSERT INTO funcionarios (nome, cargo, email, telefone, data_contratacao)
VALUES
  ('Mariana Alves', 'Recepcionista', 'mariana.alves@hotel.com', '11955554444', '2023-02-15'),
  ('Roberto Silva', 'Gerente', 'roberto.silva@hotel.com', '11944443333', '2022-08-01'),
  ('Cláudia Ferreira', 'Camareira', 'claudia.ferreira@hotel.com', '11933332222', '2024-01-10'),
  ('Tiago Mendes', 'Segurança', 'tiago.mendes@hotel.com', '21922221111', '2023-06-20'),
  ('Patrícia Lopes', 'Supervisora', 'patricia.lopes@hotel.com', '11922223333', '2022-03-01');

INSERT INTO checkins (id_reserva, id_funcionario)
VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

INSERT INTO servicos (nome, descricao, preco)
VALUES
  ('Café da manhã', 'Servido das 7h às 10h', 30.00),
  ('Lavanderia', 'Lavagem e secagem de roupas pessoais', 50.00),
  ('Translado Aeroporto', 'Transporte até o aeroporto internacional', 120.00),
  ('Spa', 'Massagem relaxante de 1 hora', 150.00),
  ('Jantar', 'Buffet completo servido das 18h às 21h', 70.00); 