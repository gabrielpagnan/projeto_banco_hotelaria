const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hotel',
  password: process.env.DB_PASSWORD || 'sua_senha',
  port: process.env.DB_PORT || 5432,
});

app.use(cors());
app.use(express.json());

// Rotas para Clientes
app.get('/clientes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes ORDER BY nome');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM clientes WHERE id_cliente = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/clientes', async (req, res) => {
  try {
    const { nome, email, telefone, documento_identidade } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO clientes (nome, email, telefone, documento_identidade) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, telefone, documento_identidade]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, documento_identidade } = req.body;
    const { rows } = await pool.query(
      'UPDATE clientes SET nome = $1, email = $2, telefone = $3, documento_identidade = $4 WHERE id_cliente = $5 RETURNING *',
      [nome, email, telefone, documento_identidade, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Quartos
app.get('/quartos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM quartos ORDER BY numero');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/quartos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM quartos WHERE id_quarto = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Quarto não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/quartos', async (req, res) => {
  try {
    const { numero, tipo, capacidade, preco_diaria, status } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO quartos (numero, tipo, capacidade, preco_diaria, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [numero, tipo, capacidade, preco_diaria, status]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/quartos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, tipo, capacidade, preco_diaria, status } = req.body;
    const { rows } = await pool.query(
      'UPDATE quartos SET numero = $1, tipo = $2, capacidade = $3, preco_diaria = $4, status = $5 WHERE id_quarto = $6 RETURNING *',
      [numero, tipo, capacidade, preco_diaria, status, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Quarto não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/quartos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM quartos WHERE id_quarto = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Quarto não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Reservas
app.get('/reservas', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, 
             array_agg(json_build_object('id_quarto', rq.id_quarto)) as quartos
      FROM reservas r
      LEFT JOIN reservas_quartos rq ON r.id_reserva = rq.id_reserva
      GROUP BY r.id_reserva
      ORDER BY r.data_checkin DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/reservas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT r.*, 
             array_agg(json_build_object('id_quarto', rq.id_quarto)) as quartos
      FROM reservas r
      LEFT JOIN reservas_quartos rq ON r.id_reserva = rq.id_reserva
      WHERE r.id_reserva = $1
      GROUP BY r.id_reserva
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/reservas', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id_cliente, data_checkin, data_checkout, status, quartos } = req.body;
    const { rows } = await client.query(
      'INSERT INTO reservas (id_cliente, data_checkin, data_checkout, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_cliente, data_checkin, data_checkout, status]
    );
    
    const reservaId = rows[0].id_reserva;
    for (const quartoId of quartos) {
      await client.query(
        'INSERT INTO reservas_quartos (id_reserva, id_quarto) VALUES ($1, $2)',
        [reservaId, quartoId]
      );
    }
    
    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.put('/reservas/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { id_cliente, data_checkin, data_checkout, status, quartos } = req.body;
    
    const { rows } = await client.query(
      'UPDATE reservas SET id_cliente = $1, data_checkin = $2, data_checkout = $3, status = $4 WHERE id_reserva = $5 RETURNING *',
      [id_cliente, data_checkin, data_checkout, status, id]
    );
    
    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }
    
    await client.query('DELETE FROM reservas_quartos WHERE id_reserva = $1', [id]);
    
    for (const quartoId of quartos) {
      await client.query(
        'INSERT INTO reservas_quartos (id_reserva, id_quarto) VALUES ($1, $2)',
        [id, quartoId]
      );
    }
    
    await client.query('COMMIT');
    res.json(rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.delete('/reservas/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    await client.query('DELETE FROM reservas_quartos WHERE id_reserva = $1', [id]);
    const { rowCount } = await client.query('DELETE FROM reservas WHERE id_reserva = $1', [id]);
    
    if (rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }
    
    await client.query('COMMIT');
    res.status(204).send();
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 