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
    <div className="titlebar relative">
      {/* Native Drag Region */}
      <div 
        data-tauri-drag-region 
        className="absolute inset-0 cursor-default" 
      />

      <div className="relative flex items-center h-full px-4 gap-2 pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-brand-primary" />
        <span className="text-[11px] font-bold tracking-widest uppercase text-text-muted">kayePDF</span>
      </div>
      
      <div className="relative flex h-full items-center">
        <button 
          className="relative inline-flex items-center justify-center w-11 h-full transition-colors hover:bg-hover-main z-10"
          onClick={handleMinimize}
          title="Minimize"
        >
          <Minus size={14} />
        </button>
        <button 
          className="relative inline-flex items-center justify-center w-11 h-full transition-colors hover:bg-hover-main z-10"
          onClick={handleMaximize}
          title="Maximize"
        >
          <Square size={10} />
        </button>
        <button 
          className="relative inline-flex items-center justify-center w-11 h-full transition-colors hover:bg-brand-error hover:text-text-inverse z-10"
          onClick={handleClose}
          title="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
