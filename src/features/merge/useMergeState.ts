import { useState } from 'preact/hooks';

export interface PdfFile {
  id: string;
  path: string;
  name: string;
}

export function useMergeState() {
  const [files, setFiles] = useState<PdfFile[]>([]);

  const addFiles = (newFiles: PdfFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const reorderFiles = (activeId: string, overId: string) => {
    setFiles((prev) => {
      const oldIndex = prev.findIndex((f) => f.id === activeId);
      const newIndex = prev.findIndex((f) => f.id === overId);

      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  };

  const resetFiles = () => {
    setFiles([]);
  };

  return { files, addFiles, removeFile, reorderFiles, resetFiles };
}
