import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Datos de conexión con Supabase
const supabaseUrl = 'https://gzkksskwixobbokrgckn.supabase.co';
const supabaseAnonKey = 'sb_publishable_UsviIs0rkeotUjN3djY4ew_NV2c4H6V';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const [form, setForm] = useState({
    cliente: '',
    telefono: '',
    placa: '',
    modelo_moto: '',
    descripcion_trabajo: '',
    estado: 'Pendiente'
  });

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {
    cargarReparaciones();
  }, []);

  const cargarReparaciones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reparaciones')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al cargar datos:', error);
    } else {
      setReparaciones(data || []);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.cliente || !form.telefono || !form.placa || !form.modelo_moto || !form.descripcion_trabajo) {
      setMensaje({ texto: 'Por favor complete todos los campos obligatorios.', tipo: 'error' });
      return;
    }

    const { error } = await supabase.from('reparaciones').insert([form]);

    if (error) {
      setMensaje({ texto: 'Ocurrió un error al guardar la reparación.', tipo: 'error' });
    } else {
      setMensaje({ texto: '¡Reparación registrada correctamente!', tipo: 'exito' });
      setForm({
        cliente: '',
        telefono: '',
        placa: '',
        modelo_moto: '',
        descripcion_trabajo: '',
        estado: 'Pendiente'
      });
      cargarReparaciones();
    }
  };

  const reparacionesFiltradas = reparaciones.filter((item) => {
    const coincideTexto =
      item.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.placa.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === 'Todos' || item.estado === filtroEstado;

    return coincideTexto && coincideEstado;
  });

  const totalReparaciones = reparaciones.length;
  const pendientes = reparaciones.filter((r) => r.estado === 'Pendiente').length;
  const enProceso = reparaciones.filter((r) => r.estado === 'En proceso').length;
  const listas = reparaciones.filter((r) => r.estado === 'Lista').length;
  const entregadas = reparaciones.filter((r) => r.estado === 'Entregada').length;

  return (
    <div style={{ padding: '30px 20px', maxWidth: '1000px', margin: '0 auto', color: '#f0f0f0' }}>
      
      {/* Encabezado sin letras encimadas */}
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '8px', lineHeight: '1.3' }}>
          Sistema de Gestión para Taller de Motos y Repuestos
        </h1>
        <p style={{ color: '#aaa', fontSize: '14px' }}>
          Aplicación para el registro, seguimiento y control del estado de reparaciones de motocicletas.
        </p>
      </header>

      {/* Resumen de Información */}
      <section style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Total</span>
          <span style={cardValueStyle}>{totalReparaciones}</span>
        </div>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Pendientes</span>
          <span style={{ ...cardValueStyle, color: '#ffc107' }}>{pendientes}</span>
        </div>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>En proceso</span>
          <span style={{ ...cardValueStyle, color: '#17a2b8' }}>{enProceso}</span>
        </div>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Listas</span>
          <span style={{ ...cardValueStyle, color: '#28a745' }}>{listas}</span>
        </div>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Entregadas</span>
          <span style={{ ...cardValueStyle, color: '#6c757d' }}>{entregadas}</span>
        </div>
      </section>

      {/* Formulario de Registro */}
      <section style={{ background: '#1e1e1e', padding: '25px', borderRadius: '10px', marginBottom: '35px', border: '1px solid #333' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#ffffff' }}>Registrar nueva reparación</h2>

        {mensaje.texto && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '6px',
            backgroundColor: mensaje.tipo === 'error' ? '#5a1e24' : '#1e4620',
            color: mensaje.tipo === 'error' ? '#ff9999' : '#99ff99',
            border: mensaje.tipo === 'error' ? '1px solid #882222' : '1px solid #228822'
          }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <input type="text" name="cliente" placeholder="Nombre del cliente *" value={form.cliente} onChange={handleChange} style={inputStyle} />
          <input type="text" name="telefono" placeholder="Teléfono *" value={form.telefono} onChange={handleChange} style={inputStyle} />
          <input type="text" name="placa" placeholder="Placa de la motocicleta *" value={form.placa} onChange={handleChange} style={inputStyle} />
          <input type="text" name="modelo_moto" placeholder="Modelo de la moto *" value={form.modelo_moto} onChange={handleChange} style={inputStyle} />
          <textarea name="descripcion_trabajo" placeholder="Descripción del trabajo a realizar *" value={form.descripcion_trabajo} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />
          <select name="estado" value={form.estado} onChange={handleChange} style={inputStyle}>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Lista">Lista</option>
            <option value="Entregada">Entregada</option>
          </select>
          <button type="submit" style={btnStyle}>
            Guardar Reparación
          </button>
        </form>
      </section>

      {/* Consulta y Filtros */}
      <section style={{ background: '#1e1e1e', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#ffffff' }}>Consulta de reparaciones</h2>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por cliente o placa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={inputStyle}>
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Lista">Lista</option>
            <option value="Entregada">Entregada</option>
          </select>
        </div>

        {loading ? (
          <p style={{ color: '#aaa' }}>Cargando registros...</p>
        ) : reparacionesFiltradas.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            No se encontraron reparaciones que coincidan con la búsqueda.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#2d2d2d', color: '#ffffff', borderBottom: '2px solid #444' }}>
                  <th style={cellStyle}>Cliente</th>
                  <th style={cellStyle}>Placa</th>
                  <th style={cellStyle}>Modelo</th>
                  <th style={cellStyle}>Trabajo</th>
                  <th style={cellStyle}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reparacionesFiltradas.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={cellStyle}>
                      <strong style={{ color: '#fff' }}>{r.cliente}</strong>
                      <br />
                      <span style={{ fontSize: '12px', color: '#888' }}>{r.telefono}</span>
                    </td>
                    <td style={cellStyle}><code style={{ background: '#2a2a2a', padding: '2px 6px', borderRadius: '4px', color: '#00d2ff' }}>{r.placa}</code></td>
                    <td style={cellStyle}>{r.modelo_moto}</td>
                    <td style={cellStyle}>{r.descripcion_trabajo}</td>
                    <td style={cellStyle}>
                      <span style={getEstadoBadge(r.estado)}>{r.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// Estilos visuales optimizados
const cardStyle = {
  border: '1px solid #333',
  padding: '15px',
  borderRadius: '8px',
  background: '#1e1e1e',
  flex: '1',
  minWidth: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const cardTitleStyle = {
  fontSize: '12px',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '5px'
};

const cardValueStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#ffffff'
};

const cellStyle = {
  padding: '12px 10px',
  fontSize: '14px',
  color: '#dddddd'
};

const inputStyle = {
  padding: '12px 14px',
  borderRadius: '6px',
  border: '1px solid #444',
  background: '#2a2a2a',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none'
};

const btnStyle = {
  padding: '12px',
  backgroundColor: '#0066cc',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '15px'
};

function getEstadoBadge(estado) {
  const base = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  };

  switch (estado) {
    case 'Pendiente':
      return { ...base, background: '#4a3b00', color: '#ffda6a' };
    case 'En proceso':
      return { ...base, background: '#00384d', color: '#6edff6' };
    case 'Lista':
      return { ...base, background: '#0f401b', color: '#75b798' };
    case 'Entregada':
      return { ...base, background: '#383d41', color: '#b1b5ba' };
    default:
      return base;
  }
}