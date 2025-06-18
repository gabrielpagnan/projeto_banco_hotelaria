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
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function Quartos() {
  const [quartos, setQuartos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    numero: '',
    tipo: '',
    capacidade: '',
    preco_diaria: '',
    status: 'disponível',
  });
  const [formErrors, setFormErrors] = useState({});

  const tiposQuarto = ['solteiro', 'casal', 'luxo', 'triplo'];
  const statusQuarto = ['disponível', 'ocupado', 'manutenção'];

  useEffect(() => {
    carregarQuartos();
  }, []);

  const carregarQuartos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/quartos`);
      setQuartos(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar quartos: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setFormErrors({});
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
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const erros = {};
    if (!formData.numero) erros.numero = 'Número é obrigatório';
    if (!formData.tipo) erros.tipo = 'Tipo é obrigatório';
    if (!formData.capacidade) erros.capacidade = 'Capacidade é obrigatória';
    if (!formData.preco_diaria) erros.preco_diaria = 'Preço da diária é obrigatório';
    if (parseFloat(formData.preco_diaria) <= 0) erros.preco_diaria = 'Preço deve ser maior que zero';
    if (parseInt(formData.capacidade) <= 0) erros.capacidade = 'Capacidade deve ser maior que zero';
    return erros;
  };

  const handleSubmit = async () => {
    try {
      const erros = validarFormulario();
      if (Object.keys(erros).length > 0) {
        setFormErrors(erros);
        return;
      }

      setLoading(true);
      const dadosParaEnviar = {
        ...formData,
        capacidade: parseInt(formData.capacidade),
        preco_diaria: parseFloat(formData.preco_diaria),
        numero: parseInt(formData.numero),
      };

      if (editando) {
        await axios.put(`${API_URL}/quartos/${editando}`, dadosParaEnviar);
        setSnackbar({
          open: true,
          message: 'Quarto atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        await axios.post(`${API_URL}/quartos`, dadosParaEnviar);
        setSnackbar({
          open: true,
          message: 'Quarto criado com sucesso!',
          severity: 'success'
        });
      }
      handleClose();
      carregarQuartos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao salvar quarto: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
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
    setFormErrors({});
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este quarto?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/quartos/${id}`);
        setSnackbar({
          open: true,
          message: 'Quarto excluído com sucesso!',
          severity: 'success'
        });
        carregarQuartos();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erro ao excluir quarto: ' + error.message,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gerenciamento de Quartos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          disabled={loading}
        >
          Novo Quarto
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

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
                <TableCell>R$ {Number(quarto.preco_diaria).toFixed(2)}</TableCell>
                <TableCell>{quarto.status}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(quarto)}
                    disabled={loading}
                  >
                    Editar
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(quarto.id_quarto)}
                    disabled={loading}
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
        <DialogTitle>{editando ? 'Editar Quarto' : 'Novo Quarto'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Número"
            type="number"
            fullWidth
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            error={!!formErrors.numero}
            helperText={formErrors.numero}
          />
          <TextField
            select
            margin="dense"
            label="Tipo"
            fullWidth
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            error={!!formErrors.tipo}
            helperText={formErrors.tipo}
          >
            {tiposQuarto.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Capacidade"
            type="number"
            fullWidth
            name="capacidade"
            value={formData.capacidade}
            onChange={handleInputChange}
            error={!!formErrors.capacidade}
            helperText={formErrors.capacidade}
          />
          <TextField
            margin="dense"
            label="Preço Diária"
            type="number"
            fullWidth
            name="preco_diaria"
            value={formData.preco_diaria}
            onChange={handleInputChange}
            error={!!formErrors.preco_diaria}
            helperText={formErrors.preco_diaria}
          />
          <TextField
            select
            margin="dense"
            label="Status"
            fullWidth
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            {statusQuarto.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Quartos; 