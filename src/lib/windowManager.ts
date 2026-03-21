// SPDX-License-Identifier: GPL-3.0-or-later

import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

export interface AppInfo {
    app: Shell.App;
    appId: string;
    appName: string;
    window: Meta.Window;
}

export type SpreadResult =
    | { ok: true; windowCount: number; appName: string }
    | { ok: false; reason: 'no-app' | 'single-window'; windowCount?: number; appName?: string };

export function getFocusedApp(): AppInfo | null {
    const focusedWindow = global.display.get_focus_window();
    if (!focusedWindow)
        return null;

    const windowApp = Shell.WindowTracker.get_default().get_window_app(focusedWindow);
    if (!windowApp)
        return null;

    return {
        app: windowApp,
        appId: windowApp.get_id(),
        appName: windowApp.get_name(),
        window: focusedWindow,
    };
}

export function spreadAppWindows(appInfo: AppInfo, settings: Gio.Settings): SpreadResult {
    const appWindows = appInfo.app.get_windows()
        .filter(w => w.get_window_type() === Meta.WindowType.NORMAL)
        // Keep the focused window first so it stays on the current workspace
        .sort((a, b) => (b === appInfo.window ? 1 : 0) - (a === appInfo.window ? 1 : 0));

    if (appWindows.length <= 1) {
        return {
            ok: false,
            reason: 'single-window',
            windowCount: appWindows.length,
            appName: appInfo.appName,
        };
    }

    const wm = global.workspace_manager;
    const startIndex = wm.get_active_workspace_index();

    // Ensure we have enough workspaces
    while (wm.n_workspaces < startIndex + appWindows.length)
        wm.append_new_workspace(false, global.get_current_time());

    // Move each window to its own workspace
    for (let i = 0; i < appWindows.length; i++) {
        const workspace = wm.get_workspace_by_index(startIndex + i);
        if (!workspace)
            continue;

        appWindows[i].change_workspace(workspace);

        if (appWindows[i].minimized)
            appWindows[i].unminimize();
    }

    // Focus/switch only once, after all windows have moved
    const firstWorkspace = wm.get_workspace_by_index(startIndex);
    if (firstWorkspace) {
        if (settings.get_boolean('focus-after-move'))
            firstWorkspace.activate_with_focus(appWindows[0], global.get_current_time());
        else if (settings.get_boolean('switch-to-first'))
            firstWorkspace.activate(global.get_current_time());
    }

    return { ok: true, windowCount: appWindows.length, appName: appInfo.appName };
}
