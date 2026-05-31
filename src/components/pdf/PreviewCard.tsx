import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { FileText, Trash2 } from 'lucide-preact';
import { PdfCanvas } from './PdfCanvas';

interface Props {
  id: string;
  path: string;
  name: string;
  index: number;
  onRemove: (id: string) => void;
}

export function PreviewCard({ id, path, name, index, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <motion.div 
      ref={setNodeRef} 
      style={style} 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative flex flex-col bg-white dark:bg-[#1a1a1a] border-2 transition-all p-3 rounded-[10px] cursor-grab active:cursor-grabbing group ${isDragging ? 'opacity-0' : 'border-transparent shadow-sm hover:border-sage-200'}`}
      {...(listeners as any)}
      {...(attributes as any)}
    >
      <div className="flex justify-between items-center mb-2.5">
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-sage-100 group-hover:text-sage-600 transition-colors">
          {index + 1}
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: '#fee2e2', color: '#ef4444' }}
          whileTap={{ scale: 0.9 }}
          onClick={(e: any) => { 
            e.stopPropagation(); 
            onRemove(id); 
          }} 
          className="p-2 rounded-xl text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>

      <div className="aspect-3/4 bg-slate-50 dark:bg-slate-900 rounded-[5px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center mb-2.5 pointer-events-none">
        <PdfCanvas path={path} pageNumber={1} scale={0.4} />
      </div>

      <div className="px-1 text-center pointer-events-none">
        <div className="flex items-center justify-center gap-2">
          <FileText size={12} className="text-sage-600 shrink-0" />
          <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate uppercase tracking-widest">{name}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function FileItemOverlay({ name, path, index }: { name: string, path: string, index: number }) {
  return (
    <div className="flex flex-col bg-white dark:bg-[#1a1a1a] border-2 border-sage-500 p-3 rounded-[10px] shadow-2xl scale-102 rotate-1">
      <div className="flex justify-between items-center mb-2.5">
        <div className="w-7 h-7 rounded-full bg-sage-600 flex items-center justify-center text-[10px] font-black text-white">
          {index + 1}
        </div>
        <div className="p-2 text-slate-100">
          <Trash2 size={16} />
        </div>
      </div>
      <div className="aspect-3/4 bg-slate-50 dark:bg-slate-900 rounded-[5px] overflow-hidden border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-2.5">
        <PdfCanvas path={path} pageNumber={1} scale={0.4} />
      </div>
      <div className="px-1 text-center">
        <div className="flex items-center justify-center gap-2">
          <FileText size={12} className="text-sage-600 shrink-0" />
          <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate uppercase tracking-widest">{name}</span>
        </div>
      </div>
    </div>
  );
}
