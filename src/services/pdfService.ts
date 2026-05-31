import { readFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';

export interface PdfMetadata {
  page_count: number;
  version: string;
}

export async function loadPdfBytes(path: string): Promise<Uint8Array> {
  return await readFile(path);
}

export async function getMetadata(path: string): Promise<PdfMetadata> {
  return await invoke('get_pdf_metadata', { path });
}

export async function mergePdfs(paths: string[], outputPath: string): Promise<void> {
  return await invoke('merge_pdfs', { paths, outputPath });
}

export async function rotatePage(path: string, pageNum: number, degrees: number, outputPath: string): Promise<void> {
  return await invoke('rotate_pdf_page', { path, pageNum, degrees, outputPath });
}

export async function deletePages(path: string, pages: number[], outputPath: string): Promise<void> {
  return await invoke('delete_pdf_pages', { path, pages, outputPath });
}
