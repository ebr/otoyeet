// SPDX-License-Identifier: GPL-3.0-or-later

// GJS core ambient types
import '@girs/gjs';
import '@girs/gjs/dom';

// GNOME Shell ambient types (includes all ui/misc modules)
import '@girs/gnome-shell/ambient';
import '@girs/gnome-shell/extensions/global';


declare const global: { // eslint-disable-line no-unused-vars
    display: import('gi://Meta').Meta.Display;
    workspace_manager: import('gi://Meta').Meta.WorkspaceManager;
    get_current_time(): number;
    [key: string]: unknown;
};
