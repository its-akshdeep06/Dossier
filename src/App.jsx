import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig, AnimatePresence } from 'framer-motion';
import Cursor from '@/components/shared/Cursor';
import Grain from '@/components/shared/Grain';
import Landing from '@/pages/Landing';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import DuelSetup from '@/pages/DuelSetup';
import Duel from '@/pages/Duel';
import ScrollToTop from './components/ScrollToTop';

function AppRoutes() {
  const location = useLocation();

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/duel" element={<DuelSetup />} />
          <Route path="/duel/:usernameA" element={<DuelSetup />} />
          <Route path="/duel/:usernameA/:usernameB" element={<Duel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Grain />
      <Cursor />
    </MotionConfig>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}

export default App
