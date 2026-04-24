use super::types::{AclEntry, FileEntry, PermissionData};
use std::fs;

pub fn get(path: &str) -> Result<PermissionData, String> {
    let meta = fs::metadata(path).map_err(|e| e.to_string())?;
    let readonly = meta.permissions().readonly();

    #[cfg(windows)]
    let (hidden, system_file) = {
        use std::os::windows::fs::MetadataExt;
        let attrs = meta.file_attributes();
        (attrs & 0x2 != 0, attrs & 0x4 != 0)
    };
    #[cfg(not(windows))]
    let (hidden, system_file) = (false, false);

    let owner = std::env::var("USERNAME").unwrap_or_else(|_| "Unknown".to_string());

    let special = if system_file {
        Some("system".to_string())
    } else if hidden {
        Some("hidden".to_string())
    } else {
        None
    };

    let acl_entries = vec![AclEntry {
        identity: owner.clone(),
        identity_type: "user".to_string(),
        read: true,
        write: !readonly,
        execute: !readonly,
        special,
    }];

    Ok(PermissionData {
        path: path.to_string(),
        owner,
        group: "N/A".to_string(),
        unix_mode: None,
        acl_entries,
        platform: "windows".to_string(),
    })
}

pub fn set(path: &str, entries: Vec<AclEntry>) -> Result<(), String> {
    if let Some(entry) = entries.first() {
        let mut perms = fs::metadata(path).map_err(|e| e.to_string())?.permissions();
        perms.set_readonly(!entry.write);
        fs::set_permissions(path, perms).map_err(|e| e.to_string())?;
    }
    Ok(())
}

pub fn list_dir(path: &str) -> Result<Vec<FileEntry>, String> {
    let read = fs::read_dir(path).map_err(|e| e.to_string())?;
    let mut entries: Vec<FileEntry> = read
        .flatten()
        .filter_map(|e| {
            let meta = e.metadata().ok()?;
            let modified = meta
                .modified()
                .ok()
                .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                .map(|d| d.as_secs())
                .unwrap_or(0);
            Some(FileEntry {
                name: e.file_name().to_string_lossy().into_owned(),
                path: e.path().to_string_lossy().into_owned(),
                is_dir: meta.is_dir(),
                size: meta.len(),
                modified,
            })
        })
        .collect();

    entries.sort_by(|a, b| {
        b.is_dir
            .cmp(&a.is_dir)
            .then(a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });

    Ok(entries)
}

pub fn home_dir() -> Result<String, String> {
    std::env::var("USERPROFILE")
        .or_else(|_| {
            let drive = std::env::var("HOMEDRIVE").unwrap_or_default();
            let path = std::env::var("HOMEPATH")?;
            Ok(format!("{}{}", drive, path))
        })
        .map_err(|e: std::env::VarError| e.to_string())
}
