import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('usd');

  // Usamos useCallback para que la función sea estable y Vercel no marque error
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${currency}&days=7&interval=daily`
      );
      const formattedData = response.data.prices.map(price => ({
        date: new Date(price[0]).toLocaleDateString(),
        value: price[1]
      }));
      setData(formattedData);
    } catch (err) {
      setError('Error al conectar con la API de Dinametra');
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container">
      <header className="header">
        <h1>Dashboard Dinametra</h1>
        <div className="filters">
          <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Moneda:</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="usd">USD - Dólares</option>
            <option value="eur">EUR - Euros</option>
            <option value="mxn">MXN - Pesos</option>
          </select>
        </div>
      </header>

      {error && (
        <div className="error" style={{ color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          <strong>⚠️ {error}</strong>
        </div>
      )}

      <div className="card">
        <h3>Histórico Bitcoin (Últimos 7 días)</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Obteniendo datos reales del mercado...</p>
          </div>
        ) : (
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Precio']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#007bff"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#007bff', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <footer style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
        Desarrollado por <strong>Juan Carlos Pavón Ábrego</strong> | Datos en tiempo real vía CoinGecko
      </footer>
    </div>
  );
}

export default App;