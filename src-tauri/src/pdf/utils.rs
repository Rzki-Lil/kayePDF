use lopdf::Document;
use anyhow::Result;

pub fn document_to_bytes(doc: &mut Document) -> Result<Vec<u8>> {
    let mut buffer = Vec::new();
    doc.save_to(&mut buffer)?;
    Ok(buffer)
}
