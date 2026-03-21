// SPDX-License-Identifier: GPL-3.0-or-later

import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { OtoyeetIndicator } from './ui/indicator.js';
import { getFocusedApp, spreadAppWindows } from './lib/windowManager.js';
import type { SpreadResult } from './lib/windowManager.js';

export default class Otoyeet extends Extension {
    private _indicator: OtoyeetIndicator | null = null;
    private _settings: Gio.Settings | null = null;
    private _: (_s: string) => string = _s => _s;
    private _cachedAppInfo: ReturnType<typeof getFocusedApp> = null;
    private _focusSignalId: number | null = null;

    override enable(): void {
        this.initTranslations('otoyeet');
        this._ = this.gettext.bind(this);

        this._settings = this.getSettings('org.gnome.shell.extensions.otoyeet');

        this._focusSignalId = global.display.connect('notify::focus-window', () => {
            const app = getFocusedApp();
            if (app)
                this._cachedAppInfo = app;
        });

        this._indicator = new OtoyeetIndicator(
            this.path,
            this._,
            () => this._spreadCurrentApp(),
            () => this._cachedAppInfo
        );

        Main.panel.addToStatusArea('otoyeet', this._indicator);
        this._setupShortcut();
    }

    override disable(): void {
        this._removeShortcut();
        if (this._focusSignalId !== null) {
            global.display.disconnect(this._focusSignalId);
            this._focusSignalId = null;
        }
        this._cachedAppInfo = null;
        this._indicator?.destroy();
        this._indicator = null;
        this._settings = null;
        this._ = _s => _s;
    }

    private _spreadCurrentApp(): void {
        const appInfo = getFocusedApp() ?? this._cachedAppInfo;
        if (!appInfo || !this._settings) {
            Main.notify('Otoyeet', this._('No focused application detected'));
            return;
        }

        const result = spreadAppWindows(appInfo, this._settings);
        this._handleSpreadResult(result);
    }

    private _handleSpreadResult(result: SpreadResult): void {
        if (result.ok) {
            Main.notify(
                'Otoyeet',
                this._('%s has been yote across %d workspaces')
                    .replace('%s', result.appName)
                    .replace('%d', String(result.windowCount))
            );
        } else if (result.reason === 'single-window') {
            Main.notify(
                'Otoyeet',
                this._('Found only %d window for %s. No yeetage necessary.')
                    .replace('%d', String(result.windowCount ?? 1))
                    .replace('%s', result.appName ?? '')
            );
        }
    }

    private _setupShortcut(): void {
        if (!this._settings)
            return;

        const shortcut = this._settings.get_strv('activate-shortcut');
        if (!shortcut.length || !shortcut[0])
            return;

        Main.wm.addKeybinding(
            'activate-shortcut',
            this._settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this._spreadCurrentApp()
        );
    }

    private _removeShortcut(): void {
        Main.wm.removeKeybinding('activate-shortcut');
    }
}
