import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import successAnimation from '../../assets/succes-page.json';

interface Props {
  isVisible: boolean;
  onComplete: () => void;
}

export function SuccessOverlay({ isVisible, onComplete }: Props) {
  const handleAnimationComplete = () => {
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-10000 flex items-center justify-center bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md"
        >
          <div className="w-500px h-500px">
            <Lottie 
              animationData={successAnimation} 
              loop={false} 
              onComplete={handleAnimationComplete}
              style={{ width: '100%', height: '100%' }}
              speed={0.6}
            />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-24 text-center"
          >
            <h2 className="text-3xl font-black text-sage-600 tracking-tighter">SUCCESS!</h2>
            <p className="text-slate-400 font-medium">Your PDF is ready.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
