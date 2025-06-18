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
  Select,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: '',
    data_checkin: '',
    data_checkout: '',
    status: 'pendente',
    quartos_selecionados: [],
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [reservasRes, clientesRes, quartosRes] = await Promise.all([
        axios.get(`${API_URL}/reservas`),
        axios.get(`${API_URL}/clientes`),
        axios.get(`${API_URL}/quartos`),
      ]);

      setReservas(reservasRes.data);
      setClientes(clientesRes.data);
      setQuartos(quartosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditando(null);
    setFormData({
      id_cliente: '',
      data_checkin: '',
      data_checkout: '',
      status: 'pendente',
      quartos_selecionados: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuartosChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      quartos_selecionados: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const dadosParaEnviar = {
        id_cliente: parseInt(formData.id_cliente),
        data_checkin: formData.data_checkin,
        data_checkout: formData.data_checkout,
        status: formData.status,
        quartos: formData.quartos_selecionados.map(id => parseInt(id)),
      };

      if (editando) {
        await axios.put(`${API_URL}/reservas/${editando}`, dadosParaEnviar);
      } else {
        await axios.post(`${API_URL}/reservas`, dadosParaEnviar);
      }
      handleClose();
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
    }
  };

  const handleEdit = async (reserva) => {
    try {
      const reservaCompleta = await axios.get(`${API_URL}/reservas/${reserva.id_reserva}`);
      const quartosReserva = reservaCompleta.data.quartos || [];

      setEditando(reserva.id_reserva);
      setFormData({
        id_cliente: reserva.id_cliente.toString(),
        data_checkin: reserva.data_checkin.split('T')[0],
        data_checkout: reserva.data_checkout.split('T')[0],
        status: reserva.status,
        quartos_selecionados: quartosReserva.map(q => q.id_quarto.toString()),
      });
      setOpen(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes da reserva:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        await axios.delete(`${API_URL}/reservas/${id}`);
        carregarDados();
      } catch (error) {
        console.error('Erro ao excluir reserva:', error);
      }
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Reservas
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ mb: 2 }}
      >
        Nova Reserva
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.id_reserva}>
                <TableCell>
                  {clientes.find(c => c.id_cliente === reserva.id_cliente)?.nome || 'Cliente não encontrado'}
                </TableCell>
                <TableCell>{formatarData(reserva.data_checkin)}</TableCell>
                <TableCell>{formatarData(reserva.data_checkout)}</TableCell>
                <TableCell>{reserva.status}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(reserva)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(reserva.id_reserva)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editando ? 'Editar Reserva' : 'Nova Reserva'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Cliente</InputLabel>
              <Select
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleInputChange}
                label="Cliente"
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id_cliente} value={cliente.id_cliente.toString()}>
                    {cliente.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="data_checkin"
              label="Data de Check-in"
              type="date"
              fullWidth
              value={formData.data_checkin}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              name="data_checkout"
              label="Data de Check-out"
              type="date"
              fullWidth
              value={formData.data_checkout}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="confirmada">Confirmada</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Quartos</InputLabel>
              <Select
                multiple
                value={formData.quartos_selecionados}
                onChange={handleQuartosChange}
                label="Quartos"
              >
                {quartos.map((quarto) => (
                  <MenuItem key={quarto.id_quarto} value={quarto.id_quarto.toString()}>
                    Quarto {quarto.numero} - {quarto.tipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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

export default Reservas; 