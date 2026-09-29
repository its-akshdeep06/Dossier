import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useAnimationControls } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Magnetic from '@/components/shared/Magnetic';
import PageTransition from '@/components/shared/PageTransition';
import LandingNav from '@/components/landing/LandingNav';
import RevealText from '@/components/shared/RevealText';
import { validateUsername } from '@/lib/validate';

export default function DuelSetup() {
  const { usernameA: initialA } = useParams();
  const navigate = useNavigate();
  const controlsA = useAnimationControls();
  const controlsB = useAnimationControls();
  
  const [userA, setUserA] = useState(initialA || '');
  const [userB, setUserB] = useState('');
  
  const [errorA, setErrorA] = useState(null);
  const [errorB, setErrorB] = useState(null);

  const go = () => {
    const resA = validateUsername(userA);
    const resB = validateUsername(userB);
    
    let hasError = false;
    if (resA.error) {
      setErrorA(resA.error);
      controlsA.start({ x: [0, -12, 9, -6, 3, 0], transition: { duration: 0.45 } });
      hasError = true;
    } else {
      setErrorA(null);
    }
    
    if (resB.error) {
      setErrorB(resB.error);
      controlsB.start({ x: [0, -12, 9, -6, 3, 0], transition: { duration: 0.45 } });
      hasError = true;
    } else {
      setErrorB(null);
    }

    if (!hasError) {
      navigate(`/duel/${resA.value}/${resB.value}`);
    }
  };

  return (
    <PageTransition>
      <LandingNav />
      <main className="min-h-screen pt-24 px-5 md:px-10 flex flex-col justify-center pb-24">
        <div className="max-w-4xl mx-auto w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-12 text-center"
          >
            <RevealText text="Dossier Duel" />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-ink/70 max-w-lg mx-auto mb-16 text-lg"
          >
            Two GitHub profiles. Six measurable dimensions. One head-to-head comparison.
          </motion.p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Player A */}
            <div className="w-full md:w-1/2 flex flex-col">
              <motion.div animate={controlsA} className={`flex items-end gap-3 border-b-2 pb-2 transition-colors duration-300 ${errorA ? 'border-signal' : 'border-ink focus-within:border-signal'}`}>
                <input
                  value={userA}
                  onChange={(e) => { setUserA(e.target.value); if (errorA) setErrorA(null); }}
                  placeholder="Profile A"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent font-display text-4xl leading-none outline-none placeholder:text-ink/20"
                />
              </motion.div>
              <p className="min-h-[1.5rem] pt-2 font-mono text-xs text-signal">{errorA}</p>
            </div>
            
            {/* VS */}
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="font-display text-3xl text-signal italic mx-4 flex-shrink-0"
            >
              VS
            </motion.div>
            
            {/* Player B */}
            <div className="w-full md:w-1/2 flex flex-col">
              <motion.div animate={controlsB} className={`flex items-end gap-3 border-b-2 pb-2 transition-colors duration-300 ${errorB ? 'border-signal' : 'border-ink focus-within:border-signal'}`}>
                <input
                  value={userB}
                  onChange={(e) => { setUserB(e.target.value); if (errorB) setErrorB(null); }}
                  placeholder="Profile B"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent font-display text-4xl leading-none outline-none placeholder:text-ink/20"
                />
              </motion.div>
              <p className="min-h-[1.5rem] pt-2 font-mono text-xs text-signal">{errorB}</p>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <Magnetic>
              <button 
                onClick={go}
                className="group flex items-center gap-3 rounded-full bg-ink text-paper px-8 py-4 text-xl font-display transition-colors duration-300 hover:bg-signal"
              >
                <span>Start Duel</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Magnetic>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
