use super::types::{AclEntry, FileEntry, PermissionData};
use nix::unistd::{Group, Gid, Uid, User};
use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::Path;

pub fn get(path: &str) -> Result<PermissionData, String> {
    let meta = fs::metadata(path).map_err(|e| e.to_string())?;
    let st = nix::sys::stat::stat(Path::new(path)).map_err(|e| e.to_string())?;

    let owner = User::from_uid(Uid::from_raw(st.st_uid))
        .ok()
        .flatten()
        .map(|u| u.name)
        .unwrap_or_else(|| st.st_uid.to_string());

    let group = Group::from_gid(Gid::from_raw(st.st_gid))
        .ok()
        .flatten()
        .map(|g| g.name)
        .unwrap_or_else(|| st.st_gid.to_string());

    let mode = meta.permissions().mode();

    Ok(PermissionData {
        path: path.to_string(),
        owner,
        group,
        unix_mode: Some(mode),
        acl_entries: mode_to_acl(mode),
        platform: current_platform(),
    })
}

pub fn set(path: &str, mode: u32) -> Result<(), String> {
    fs::set_permissions(path, fs::Permissions::from_mode(mode)).map_err(|e| e.to_string())
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
    std::env::var("HOME").map_err(|e| e.to_string())
}

fn current_platform() -> String {
    #[cfg(target_os = "macos")]
    return "macos".to_string();
    #[cfg(target_os = "linux")]
    return "linux".to_string();
    #[cfg(not(any(target_os = "macos", target_os = "linux")))]
    return "unix".to_string();
}

fn mode_to_acl(mode: u32) -> Vec<AclEntry> {
    vec![
        AclEntry {
            identity: "owner".to_string(),
            identity_type: "user".to_string(),
            read: mode & 0o400 != 0,
            write: mode & 0o200 != 0,
            execute: mode & 0o100 != 0,
            special: None,
        },
        AclEntry {
            identity: "group".to_string(),
            identity_type: "group".to_string(),
            read: mode & 0o040 != 0,
            write: mode & 0o020 != 0,
            execute: mode & 0o010 != 0,
            special: None,
        },
        AclEntry {
            identity: "others".to_string(),
            identity_type: "group".to_string(),
            read: mode & 0o004 != 0,
            write: mode & 0o002 != 0,
            execute: mode & 0o001 != 0,
            special: None,
        },
    ]
}
