import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const users = [
  { username: 'ben10', password: 'omnitrix', name: 'Ben Tennyson', isAdmin: true },
  { username: 'gwen', password: 'tennyson', name: 'Gwen Tennyson', isAdmin: false },
  { username: 'kevin', password: 'levin', name: 'Kevin Levin', isAdmin: false },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({ username: '', password: '', name: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.username || !registerData.password || !registerData.name) {
      setError('Completa todos los campos');
      return;
    }
    localStorage.setItem('user', JSON.stringify({ ...registerData, isAdmin: false }));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        {/* Logo Omnitrix */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <span className="absolute w-10 h-10 rounded-full border-4 border-green-600 bg-black" />
            <span className="absolute w-4 h-4 rounded-full bg-green-500" />
          </div>
          <span className="font-bold text-2xl text-green-700 drop-shadow">Omnitrix</span>
        </div>
        <h2 className="text-xl font-bold text-black mb-4">{showRegister ? 'Registro' : 'Iniciar Sesión'}</h2>
        {error && <div className="text-red-600 mb-2 font-semibold">{error}</div>}
        {!showRegister ? (
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <input
              className="border rounded px-3 py-2 bg-gray-100 text-black"
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              className="border rounded px-3 py-2 bg-gray-100 text-black"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700">Iniciar Sesión</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
            <input
              className="border rounded px-3 py-2 bg-gray-100 text-black"
              type="text"
              placeholder="Nombre completo"
              value={registerData.name}
              onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
              required
            />
            <input
              className="border rounded px-3 py-2 bg-gray-100 text-black"
              type="text"
              placeholder="Usuario"
              value={registerData.username}
              onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
              required
            />
            <input
              className="border rounded px-3 py-2 bg-gray-100 text-black"
              type="password"
              placeholder="Contraseña"
              value={registerData.password}
              onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700">Registrarse</button>
          </form>
        )}
        <div className="mt-4 text-sm text-black font-semibold text-center">
          {!showRegister ? (
            <span>¿No tienes cuenta?{' '}
              <button className="text-green-700 font-semibold hover:underline" onClick={() => { setShowRegister(true); setError(''); }}>Regístrate</button>
            </span>
          ) : (
            <span>¿Ya tienes cuenta?{' '}
              <button className="text-green-700 font-semibold hover:underline" onClick={() => { setShowRegister(false); setError(''); }}>Inicia sesión</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 