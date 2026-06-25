import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/cv/Layout';
import Home from './pages/Home';
import Verduras from './pages/Verduras';
import Videos from './pages/Videos';
import Karaoke from './pages/Karaoke.jsx';
import Fotos from './pages/Fotos';
import Acordes from './pages/Acordes';
import Canciones from './pages/Canciones';
import Shows from './pages/Shows';
import Novedades from './pages/Novedades';
import Juegos from './pages/Juegos';
import Dibujos from './pages/Dibujos';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/canciones" element={<Canciones />} />
            <Route path="/verduras" element={<Verduras />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/karaoke" element={<Karaoke />} />
            <Route path="/fotos" element={<Fotos />} />
            <Route path="/acordes" element={<Acordes />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/dibujos" element={<Dibujos />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  )
}

export default App
