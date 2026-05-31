import { useState } from 'preact/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { FileStack, Home } from 'lucide-preact';
import { MergePage } from './features/merge/MergePage';
import { Titlebar } from './components/common/Titlebar';
import { NotificationContainer } from './components/common/Notification';

type Page = 'home' | 'merge';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'merge', label: 'Merge PDF', icon: <FileStack size={20} /> },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Titlebar />
      <NotificationContainer />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="sidebar w-64">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id as Page)}
              >
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full w-full"
            >
              {currentPage === 'home' && (
                <div className="p-16 max-w-5xl mx-auto h-full flex flex-col justify-center">
                  <header className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter mb-4">
                      Simple. Local. <span className="text-brand-primary">Secure.</span>
                    </h1>
                    <p className="text-xl text-text-muted font-medium">
                      The all-in-one local PDF toolkit for your privacy.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ToolCard 
                      title="Merge PDF" 
                      desc="Combine multiple PDFs into one document easily." 
                      icon={<FileStack size={32} className="text-brand-primary" />}
                      onClick={() => setCurrentPage('merge')}
                    />
                  </div>
                </div>
              )}
              {currentPage === 'merge' && <MergePage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function ToolCard({ title, desc, icon, onClick }: any) {
  return (
    <motion.div 
      className="card-surface group cursor-pointer" 
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-16 h-16 rounded-3xl bg-bg-accent flex items-center justify-center mb-8 transition-colors duration-200 group-hover:bg-brand-surface">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-text-muted leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

export default App;