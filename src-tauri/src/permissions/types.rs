use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PermissionData {
    pub path: String,
    pub owner: String,
    pub group: String,
    pub unix_mode: Option<u32>,
    pub acl_entries: Vec<AclEntry>,
    pub platform: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AclEntry {
    pub identity: String,
    pub identity_type: String,
    pub read: bool,
    pub write: bool,
    pub execute: bool,
    pub special: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PermissionChangeset {
    pub unix_mode: Option<u32>,
    pub owner: Option<String>,
    pub acl_entries: Option<Vec<AclEntry>>,
}
