use crate::permissions::types::{FileEntry, PermissionChangeset, PermissionData};
use std::process::Command;

#[derive(serde::Serialize)]
pub struct CommonDir {
    pub name: String,
    pub path: String,
}

#[tauri::command]
pub fn get_common_dirs() -> Vec<CommonDir> {
    #[cfg(unix)]
    {
        let home = std::env::var("HOME").unwrap_or_else(|_| "/".to_string());
        let mut dirs = vec![
            CommonDir { name: "Home".to_string(), path: home.clone() },
            CommonDir { name: "Desktop".to_string(), path: format!("{}/Desktop", home) },
            CommonDir { name: "Documents".to_string(), path: format!("{}/Documents", home) },
            CommonDir { name: "Downloads".to_string(), path: format!("{}/Downloads", home) },
            CommonDir { name: "Root".to_string(), path: "/".to_string() },
        ];
        dirs.retain(|d| std::path::Path::new(&d.path).exists());
        dirs
    }
    #[cfg(windows)]
    {
        let home = std::env::var("USERPROFILE").unwrap_or_else(|_| "C:\\".to_string());
        let mut dirs = vec![
            CommonDir { name: "Home".to_string(), path: home.clone() },
            CommonDir { name: "Desktop".to_string(), path: format!("{}\\Desktop", home) },
            CommonDir { name: "Documents".to_string(), path: format!("{}\\Documents", home) },
            CommonDir { name: "Downloads".to_string(), path: format!("{}\\Downloads", home) },
            CommonDir { name: "System".to_string(), path: "C:\\".to_string() },
        ];
        dirs.retain(|d| std::path::Path::new(&d.path).exists());
        dirs
    }
    #[cfg(not(any(unix, windows)))]
    { vec![] }
}

const PROTECTED_LINUX: &[&str] = &["/proc", "/sys", "/dev", "/run", "/boot"];

#[cfg_attr(not(target_os = "macos"), allow(dead_code))]
const PROTECTED_MACOS: &[&str] = &[
    "/System",
    "/System/Library",
    "/usr/bin",
    "/usr/sbin",
    "/sbin",
    "/bin",
    "/private/etc",
    "/private/var",
];

#[cfg(windows)]
const PROTECTED_WIN: &[&str] = &[
    "C:\\Windows\\System32",
    "C:\\Windows\\SysWOW64",
    "C:\\Windows\\WinSxS",
];

fn is_protected(path: &str) -> bool {
    #[cfg(target_os = "linux")]
    for p in PROTECTED_LINUX {
        if path == *p || path.starts_with(&format!("{}/", p)) {
            return true;
        }
    }
    #[cfg(target_os = "macos")]
    for p in PROTECTED_MACOS {
        if path == *p || path.starts_with(&format!("{}/", p)) {
            return true;
        }
    }
    #[cfg(windows)]
    for p in PROTECTED_WIN {
        if path.to_lowercase().starts_with(&p.to_lowercase()) {
            return true;
        }
    }
    false
}

#[tauri::command]
pub fn get_file_permissions(path: String) -> Result<PermissionData, String> {
    #[cfg(unix)]
    { return crate::permissions::unix::get(&path); }
    #[cfg(windows)]
    { return crate::permissions::windows::get(&path); }
    #[cfg(not(any(unix, windows)))]
    { Err("Unsupported platform".to_string()) }
}

#[tauri::command]
pub fn set_file_permissions(path: String, changes: PermissionChangeset) -> Result<(), String> {
    if is_protected(&path) {
        return Err(format!("'{}' is a protected system path.", path));
    }
    #[cfg(unix)]
    {
        return match changes.unix_mode {
            Some(mode) => crate::permissions::unix::set(&path, mode),
            None => Err("unix_mode required on Unix".to_string()),
        };
    }
    #[cfg(windows)]
    {
        return match changes.acl_entries {
            Some(entries) => crate::permissions::windows::set(&path, entries),
            None => Err("acl_entries required on Windows".to_string()),
        };
    }
    #[cfg(not(any(unix, windows)))]
    { Err("Unsupported platform".to_string()) }
}

#[tauri::command]
pub fn list_directory(path: String) -> Result<Vec<FileEntry>, String> {
    #[cfg(unix)]
    { return crate::permissions::unix::list_dir(&path); }
    #[cfg(windows)]
    { return crate::permissions::windows::list_dir(&path); }
    #[cfg(not(any(unix, windows)))]
    { Err("Unsupported platform".to_string()) }
}

#[tauri::command]
pub fn get_home_dir() -> Result<String, String> {
    #[cfg(unix)]
    { return crate::permissions::unix::home_dir(); }
    #[cfg(windows)]
    { return crate::permissions::windows::home_dir(); }
    #[cfg(not(any(unix, windows)))]
    { Err("Unsupported platform".to_string()) }
}

#[tauri::command]
pub fn open_url(url: String) -> Result<(), String> {
    if !url.starts_with("https://") && !url.starts_with("http://") {
        return Err("Only http/https URLs are supported".to_string());
    }

    #[cfg(target_os = "linux")]
    {
        // Try xdg-open, then gio open, then check $BROWSER, then common browsers
        let openers = ["xdg-open", "gio open", "kde-open5", "gnome-open"];
        for opener in &openers {
            let parts: Vec<&str> = opener.split_whitespace().collect();
            let mut cmd = Command::new(parts[0]);
            for arg in &parts[1..] {
                cmd.arg(arg);
            }
            if cmd.arg(&url).spawn().is_ok() {
                return Ok(());
            }
        }
        // Last resort: check $BROWSER env var
        if let Ok(browser) = std::env::var("BROWSER") {
            if Command::new(&browser).arg(&url).spawn().is_ok() {
                return Ok(());
            }
        }
        return Err("Could not open URL: install xdg-utils or set $BROWSER".to_string());
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&url)
            .spawn()
            .map_err(|e| e.to_string())?;
        return Ok(());
    }

    #[cfg(windows)]
    {
        // `start` is a cmd built-in; first arg after start is the window title
        Command::new("cmd")
            .args(["/c", "start", "", url.as_str()])
            .spawn()
            .map_err(|e| e.to_string())?;
        return Ok(());
    }

    #[cfg(not(any(target_os = "linux", target_os = "macos", windows)))]
    Err("Unsupported platform".to_string())
}

#[tauri::command]
pub fn get_current_user() -> Result<String, String> {
    #[cfg(unix)]
    {
        use nix::unistd::{User, getuid};
        return User::from_uid(getuid())
            .map_err(|e| e.to_string())?
            .map(|u| u.name)
            .ok_or_else(|| "Current user not found".to_string());
    }
    #[cfg(windows)]
    { return std::env::var("USERNAME").map_err(|e| e.to_string()); }
    #[cfg(not(any(unix, windows)))]
    { Err("Unsupported platform".to_string()) }
}
