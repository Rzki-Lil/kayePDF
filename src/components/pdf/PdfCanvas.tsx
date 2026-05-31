import { useEffect, useRef, useState } from 'preact/hooks';
import * as pdfjs from 'pdfjs-dist';
import { loadPdfBytes } from '../../services/pdfService';
import { Loader2 } from 'lucide-preact';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface Props {
  path: string;
  pageNumber: number;
  scale?: number;
  rotation?: number;
}

export function PdfCanvas({ path, pageNumber, scale = 1, rotation = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function renderPage() {
      if (!canvasRef.current) return;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      try {
        const bytes = await loadPdfBytes(path);
        if (!isMounted) return;

        const loadingTask = pdfjs.getDocument({ 
          data: bytes,
          verbosity: 0 
        });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context || !isMounted) return;

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          transform: transform,
          canvas: canvas
        };

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
      } catch (error: any) {
        if (error.name !== 'RenderingCancelledException' && isMounted) {
          console.error('Error rendering PDF:', error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    renderPage();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [path, pageNumber, scale, rotation]);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#121212]/50 backdrop-blur-sm z-10">
          <Loader2 className="animate-spin text-sage-600" size={24} />
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className={`shadow-md rounded-md transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`} 
      />
    </div>
  );
}
