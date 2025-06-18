import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

function Quartos() {
  const [quartos, setQuartos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    tipo: '',
    capacidade: '',
    preco_diaria: '',
    status: 'disponível',
  });

  const tiposQuarto = ['solteiro', 'casal', 'luxo', 'triplo'];
  const statusQuarto = ['disponível', 'ocupado', 'manutenção'];

  useEffect(() => {
    carregarQuartos();
  }, []);

  const carregarQuartos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/quartos');
      setQuartos(response.data);
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditando(null);
    setFormData({
      numero: '',
      tipo: '',
      capacidade: '',
      preco_diaria: '',
      status: 'disponível',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const dadosParaEnviar = {
        ...formData,
        capacidade: parseInt(formData.capacidade),
        preco_diaria: parseFloat(formData.preco_diaria),
        numero: parseInt(formData.numero),
      };

      if (editando) {
        await axios.put(`http://localhost:3000/quartos/${editando}`, dadosParaEnviar);
      } else {
        await axios.post('http://localhost:3000/quartos', dadosParaEnviar);
      }
      handleClose();
      carregarQuartos();
    } catch (error) {
      console.error('Erro ao salvar quarto:', error);
    }
  };

  const handleEdit = (quarto) => {
    setEditando(quarto.id_quarto);
    setFormData({
      numero: quarto.numero.toString(),
      tipo: quarto.tipo,
      capacidade: quarto.capacidade.toString(),
      preco_diaria: quarto.preco_diaria.toString(),
      status: quarto.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este quarto?')) {
      try {
        await axios.delete(`http://localhost:3000/quartos/${id}`);
        carregarQuartos();
      } catch (error) {
        console.error('Erro ao excluir quarto:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Quartos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ mb: 2 }}
      >
        Novo Quarto
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Capacidade</TableCell>
              <TableCell>Preço Diária</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quartos.map((quarto) => (
              <TableRow key={quarto.id_quarto}>
                <TableCell>{quarto.numero}</TableCell>
                <TableCell>{quarto.tipo}</TableCell>
                <TableCell>{quarto.capacidade}</TableCell>
                <TableCell>R$ {quarto.preco_diaria.toFixed(2)}</TableCell>
                <TableCell>{quarto.status}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(quarto)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(quarto.id_quarto)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editando ? 'Editar Quarto' : 'Novo Quarto'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="numero"
            label="Número"
            type="number"
            fullWidth
            value={formData.numero}
            onChange={handleInputChange}
          />
          <TextField
            select
            margin="dense"
            name="tipo"
            label="Tipo"
            fullWidth
            value={formData.tipo}
            onChange={handleInputChange}
          >
            {tiposQuarto.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="capacidade"
            label="Capacidade"
            type="number"
            fullWidth
            value={formData.capacidade}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="preco_diaria"
            label="Preço Diária"
            type="number"
            fullWidth
            value={formData.preco_diaria}
            onChange={handleInputChange}
          />
          <TextField
            select
            margin="dense"
            name="status"
            label="Status"
            fullWidth
            value={formData.status}
            onChange={handleInputChange}
          >
            {statusQuarto.map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Quartos; 