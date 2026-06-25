import { useLocation } from 'react-router-dom';
export default function PageNotFound() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-light text-gray-300">404</h1>
        <h2 className="font-bangers text-3xl text-cv-dark">Página no encontrada</h2>
        <p className="text-gray-500">"{location.pathname}" no existe.</p>
        <button onClick={() => window.location.href = '/'} className="btn-cv-primary">
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
