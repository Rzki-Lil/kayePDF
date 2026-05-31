use std::path::PathBuf;
use crate::pdf::merge::merge_documents;
use lopdf::Document;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct PdfMetadata {
    pub page_count: usize,
    pub version: String,
}

#[tauri::command]
pub async fn merge_pdfs(paths: Vec<String>, output_path: String) -> Result<(), String> {
    let path_bufs: Vec<PathBuf> = paths.into_iter().map(PathBuf::from).collect();
    let mut merged_doc = merge_documents(path_bufs).map_err(|e| e.to_string())?;
    merged_doc.save(output_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_pdf_metadata(path: String) -> Result<PdfMetadata, String> {
    let doc = Document::load(path).map_err(|e| e.to_string())?;
    Ok(PdfMetadata {
        page_count: doc.get_pages().len(),
        version: doc.version.clone(),
    })
}
