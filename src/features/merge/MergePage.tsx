import { useState, useEffect } from 'preact/hooks';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { open, save } from '@tauri-apps/plugin-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, FilePlus2, Sparkles } from 'lucide-preact';
import { useMergeState, PdfFile } from './useMergeState';
import { PreviewCard, FileItemOverlay } from '../../components/pdf/PreviewCard';
import { mergePdfs } from '../../services/pdfService';
import { toast } from '../../services/notificationService';
import { SuccessOverlay } from '../../components/common/SuccessOverlay';
import { bus } from '../../services/eventBus';

export function MergePage() {
  const { files, addFiles, removeFile, reorderFiles, resetFiles } = useMergeState();
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeFile, setActiveFile] = useState<PdfFile | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const onEnter = () => setIsDraggingOver(true);
    const onLeave = () => setIsDraggingOver(false);
    const onDrop = (paths: string[]) => {
      setIsDraggingOver(false);
      const newFiles: PdfFile[] = paths.map((path) => ({
        id: Math.random().toString(36).substr(2, 9),
        path,
        name: path.split(/[\\/]/).pop() || path,
      }));
      addFiles(newFiles);
      toast.success(`${newFiles.length} file(s) added`);
    };

    bus.on('native-drag-enter', onEnter);
    bus.on('native-drag-leave', onLeave);
    bus.on('native-drop', onDrop);

    return () => {
      bus.off('native-drag-enter', onEnter);
      bus.off('native-drag-leave', onLeave);
      bus.off('native-drop', onDrop);
    };
  }, [addFiles]);

  const handlePickFiles = async () => {
    try {
      const selected = await open({
        multiple: true,
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      });

      if (Array.isArray(selected)) {
        const newFiles: PdfFile[] = selected.map((path) => ({
          id: Math.random().toString(36).substr(2, 9),
          path,
          name: path.split(/[\\/]/).pop() || path,
        }));
        addFiles(newFiles);
        toast.success(`${newFiles.length} file(s) added`);
      }
    } catch (err) {
      console.error("File picker error:", err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const file = files.find((f) => f.id === event.active.id);
    if (file) setActiveFile(file);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderFiles(active.id as string, over.id as string);
    }
    setActiveFile(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;

    try {
      const outputPath = await save({
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
        defaultPath: 'merged.pdf',
      });

      if (outputPath) {
        await mergePdfs(files.map(f => f.path), outputPath);
        setShowSuccess(true);
        toast.success('Documents merged successfully');
      }
    } catch (error) {
      console.error('Merge failed:', error);
      toast.error('Merge failed: ' + error);
    }
  };

  const handleComplete = () => {
    setShowSuccess(false);
    resetFiles();
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <SuccessOverlay isVisible={showSuccess} onComplete={handleComplete} />
      
      <header className="px-12 py-8 flex justify-between items-center border-b border-border-main backdrop-blur-xl sticky top-0 z-20">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Merge Documents</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${files.length >= 2 ? 'bg-brand-primary animate-pulse' : 'bg-bg-accent'}`} />
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">
              {files.length} {files.length === 1 ? 'file' : 'files'} in queue
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={handlePickFiles} className="btn-secondary">
            <Plus size={18} /> Add More
          </button>
          <AnimatePresence>
            {files.length >= 2 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                onClick={handleMerge} 
                className="btn-primary shadow-xl shadow-brand-primary/20"
              >
                <Sparkles size={18} /> Merge & Save
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar transition-colors duration-300">
        <div className="max-w-6xl mx-auto h-full">
          {files.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={`dropzone h-100 transition-all duration-300 ${isDraggingOver ? 'border-brand-primary scale-[1.01]' : ''}`}
              onClick={handlePickFiles}
            >
              <div className={`w-20 h-20 rounded-4xl transition-colors duration-300 flex items-center justify-center mb-8 ${isDraggingOver ? 'bg-brand-primary text-text-inverse shadow-lg' : 'bg-bg-accent text-brand-primary'}`}>
                <Upload size={32} className={isDraggingOver ? 'animate-bounce' : ''} />
              </div>
              <h3 className={`text-2xl font-black mb-3 transition-colors ${isDraggingOver ? 'text-brand-primary' : ''}`}>
                {isDraggingOver ? 'Drop it here!' : 'Drop files here'}
              </h3>
              <p className="text-text-muted text-center max-w-sm leading-relaxed mb-10 font-medium">
                Combine your PDFs into one seamless document. Fast, offline, and secure.
              </p>
              <button className={`btn-primary px-8 py-4 text-lg rounded-2xl transition-all ${isDraggingOver ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                <FilePlus2 size={22} /> Select PDF Files
              </button>
            </motion.div>
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter} 
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveFile(null)}
            >
              <div className={`transition-all duration-300 rounded-4xl border-2 border-dashed ${isDraggingOver ? 'border-brand-primary scale-[1.01] p-4 -m-4' : 'border-transparent'}`}>
                <SortableContext 
                  items={files.map(f => f.id)} 
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-3 gap-10 pb-32">
                    {files.map((file, index) => (
                      <PreviewCard
                        key={file.id}
                        id={file.id}
                        path={file.path}
                        name={file.name}
                        index={index}
                        onRemove={removeFile}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>

              <DragOverlay adjustCursor={false}>
                {activeFile ? (
                  <FileItemOverlay 
                    name={activeFile.name} 
                    path={activeFile.path} 
                    index={files.findIndex(f => f.id === activeFile.id)} 
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
