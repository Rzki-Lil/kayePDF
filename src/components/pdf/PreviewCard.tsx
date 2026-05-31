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
      className={`relative flex flex-col bg-bg-surface border-2 transition-all p-3 rounded-[10px] cursor-grab active:cursor-grabbing group ${isDragging ? 'opacity-0' : 'border-transparent shadow-sm hover:border-brand-primary/30'}`}
      {...(listeners as any)}
      {...(attributes as any)}
    >
      <div className="flex justify-between items-center mb-2.5">
        <div className="w-7 h-7 rounded-full bg-bg-main flex items-center justify-center text-[10px] font-black text-text-muted group-hover:bg-brand-surface group-hover:text-brand-primary transition-colors">
          {index + 1}
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'var(--color-brand-error-surface)', color: 'var(--color-brand-error)' }}
          whileTap={{ scale: 0.9 }}
          onClick={(e: any) => { 
            e.stopPropagation(); 
            onRemove(id); 
          }} 
          className="p-2 rounded-xl text-text-muted opacity-50 hover:opacity-100 transition-all"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>

      <div className="aspect-3/4 bg-bg-main rounded-[5px] overflow-hidden border border-border-main shadow-inner flex items-center justify-center mb-2.5 pointer-events-none">
        <PdfCanvas path={path} pageNumber={1} scale={0.4} />
      </div>

      <div className="px-1 text-center pointer-events-none">
        <div className="flex items-center justify-center gap-2">
          <FileText size={12} className="text-brand-primary shrink-0" />
          <span className="text-[11px] font-bold text-text-main truncate uppercase tracking-widest">{name}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function FileItemOverlay({ name, path, index }: { name: string, path: string, index: number }) {
  return (
    <div className="flex flex-col bg-bg-surface border-2 border-brand-primary p-3 rounded-[10px] shadow-2xl scale-102 rotate-1">
      <div className="flex justify-between items-center mb-2.5">
        <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-[10px] font-black text-text-inverse">
          {index + 1}
        </div>
        <div className="p-2 text-text-inverse">
          <Trash2 size={16} />
        </div>
      </div>
      <div className="aspect-3/4 bg-bg-main rounded-[5px] overflow-hidden border border-border-main flex items-center justify-center mb-2.5">
        <PdfCanvas path={path} pageNumber={1} scale={0.4} />
      </div>
      <div className="px-1 text-center">
        <div className="flex items-center justify-center gap-2">
          <FileText size={12} className="text-brand-primary shrink-0" />
          <span className="text-[11px] font-bold text-text-main truncate uppercase tracking-widest">{name}</span>
        </div>
      </div>
    </div>
  );
}
