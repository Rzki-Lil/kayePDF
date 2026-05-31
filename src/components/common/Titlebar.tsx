import { getCurrentWindow } from '@tauri-apps/api/window';
import { X, Minus, Square } from 'lucide-preact';
import { useEffect } from 'preact/hooks';

const appWindow = getCurrentWindow();

export function Titlebar() {
  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();
  const handleClose = () => appWindow.close();

  useEffect(() => {
    let unlistenFn: (() => void) | null = null;

    const setup = async () => {
      const unlisten = await appWindow.onResized(() => {
      });
      unlistenFn = unlisten;
    };

    setup();

    return () => {
      if (unlistenFn) unlistenFn();
    };
  }, []);

  return (
    <div className="titlebar relative flex items-center justify-between bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-800 select-none z-50">
      {/* Native Drag Region */}
      <div 
        data-tauri-drag-region 
        className="absolute inset-0 cursor-default" 
      />

      <div className="relative flex items-center h-full px-4 gap-2 pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-sage-500" />
        <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">kayePDF</span>
      </div>
      
      <div className="relative flex h-full items-center">
        <button 
          className="relative inline-flex items-center justify-center w-11 h-full transition-colors hover:bg-slate-200/50 text-[#4d4948] dark:hover:bg-white/5 z-10"
          onClick={handleMinimize}
          title="Minimize"
        >
          <Minus size={14} />
        </button>
        <button 
          className="relative inline-flex items-center justify-center w-11 h-full transition-colors hover:bg-slate-200/50 text-[#4d4948] dark:hover:bg-white/5 z-10"
          onClick={handleMaximize}
          title="Maximize"
        >
          <Square size={10} />
        </button>
        <button 
          className="relative inline-flex items-center justify-center w-11 h-full transition-colors hover:bg-red-500 hover:text-white text-[#4d4948] z-10"
          onClick={handleClose}
          title="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
