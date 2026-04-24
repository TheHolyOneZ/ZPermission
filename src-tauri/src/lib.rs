pub mod commands;
pub mod permissions;

use commands::{
    get_common_dirs, get_current_user, get_file_permissions, get_home_dir, list_directory,
    open_url, set_file_permissions,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_file_permissions,
            set_file_permissions,
            list_directory,
            get_home_dir,
            get_current_user,
            open_url,
            get_common_dirs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
