use lopdf::{Document, Object, ObjectId};
use std::collections::BTreeMap;
use std::path::PathBuf;
use anyhow::{Result, anyhow};

pub fn merge_documents(files: Vec<PathBuf>) -> Result<Document> {
    if files.is_empty() {
        return Err(anyhow!("No files provided for merging"));
    }

    let mut max_id = 1;
    let mut documents_pages = BTreeMap::new();
    let mut documents_objects = BTreeMap::new();
    let mut document = Document::with_version("1.5");

    for path in files {
        let mut doc = Document::load(path)?;
        doc.renumber_objects_with(max_id);
        max_id = doc.max_id + 1;

        documents_pages.extend(
            doc.get_pages()
                .into_iter()
                .map(|(_, object_id)| {
                    (object_id, doc.get_object(object_id).unwrap().to_owned())
                })
                .collect::<BTreeMap<ObjectId, Object>>(),
        );
        documents_objects.extend(doc.objects);
    }

    let mut catalog_object: Option<(ObjectId, Object)> = None;
    let mut pages_object: Option<(ObjectId, Object)> = None;

    for (object_id, object) in documents_objects.iter() {
        match object.type_name().unwrap_or("") {
            "Catalog" => {
                if catalog_object.is_none() {
                    catalog_object = Some((*object_id, object.clone()));
                }
            }
            "Pages" => {
                if let Ok(dictionary) = object.as_dict() {
                    let mut dictionary = dictionary.clone();
                    if let Some((_, ref obj)) = pages_object {
                        if let Ok(old_dict) = obj.as_dict() {
                            dictionary.extend(old_dict);
                        }
                    }
                    pages_object = Some((
                        pages_object.map(|(id, _)| id).unwrap_or(*object_id),
                        Object::Dictionary(dictionary),
                    ));
                }
            }
            "Page" | "Outlines" | "Outline" => {}
            _ => {
                document.objects.insert(*object_id, object.clone());
            }
        }
    }

    let (catalog_id, catalog_obj) = catalog_object.ok_or_else(|| anyhow!("Missing Catalog object"))?;
    let (pages_id, pages_obj) = pages_object.ok_or_else(|| anyhow!("Missing Pages object"))?;

    let mut pages_dict = pages_obj.as_dict()?.clone();
    pages_dict.set("Count", documents_pages.len() as u32);
    pages_dict.set(
        "Kids",
        documents_pages
            .keys()
            .map(|&id| Object::Reference(id))
            .collect::<Vec<_>>(),
    );
    document.objects.insert(pages_id, Object::Dictionary(pages_dict));

    for (object_id, object) in documents_pages {
        if let Ok(dictionary) = object.as_dict() {
            let mut dictionary = dictionary.clone();
            dictionary.set("Parent", pages_id);
            document.objects.insert(object_id, Object::Dictionary(dictionary));
        }
    }

    let mut catalog_dict = catalog_obj.as_dict()?.clone();
    catalog_dict.set("Pages", pages_id);
    catalog_dict.remove(b"Outlines"); 
    document.objects.insert(catalog_id, Object::Dictionary(catalog_dict));

    document.trailer.set("Root", catalog_id);
    document.max_id = document.objects.keys().max().map(|id| id.0).unwrap_or(0);
    document.renumber_objects();
    document.adjust_zero_pages();
    document.compress();

    Ok(document)
}
