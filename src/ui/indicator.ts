// SPDX-License-Identifier: GPL-3.0-or-later

import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

// PanelMenu.Button.menu is typed as PopupMenu | PopupDummyMenu; since we pass
// noMenu=false, we always get a real PopupMenu. Cast once here for convenience.
type RealMenu = InstanceType<typeof PopupMenu.PopupMenu>;

export const OtoyeetIndicator = GObject.registerClass(
    class OtoyeetIndicator extends PanelMenu.Button {
        private _menuItem: InstanceType<typeof PopupMenu.PopupMenuItem>;
        private _menuSignalId: number | null = null;
        private _defaultLabel: string;

        constructor(
            extensionPath: string,
            gettext: (_s: string) => string,
            onActivate: () => void,
            onMenuOpen: () => { appName: string } | null
        ) {
            super(0.0, 'Otoyeet', false);

            this._defaultLabel = gettext('Yeet focused application across workspaces');

            const icon = new St.Icon({
                gicon: Gio.icon_new_for_string(`${extensionPath}/icons/otoyeet-symbolic.svg`),
                style_class: 'system-status-icon',
            });
            this.add_child(icon);

            this._menuItem = new PopupMenu.PopupMenuItem(this._defaultLabel);

            const menu = this.menu as RealMenu;

            // Update label with focused app name when menu opens
            this._menuSignalId = menu.connect('open-state-changed', (_menu: unknown, ...args: unknown[]): boolean | undefined => {
                const open = args[0] as boolean;
                if (!open)
                    return undefined;
                const appInfo = onMenuOpen();
                if (appInfo)
                    this._menuItem.label.text = gettext('Yeet %s across workspaces').replace('%s', appInfo.appName);
                else
                    this._menuItem.label.text = this._defaultLabel;
                return undefined;
            });

            this._menuItem.connect('activate', onActivate);
            menu.addMenuItem(this._menuItem);
        }

        override destroy(): void {
            if (this._menuSignalId !== null) {
                (this.menu as RealMenu).disconnect(this._menuSignalId);
                this._menuSignalId = null;
            }
            super.destroy();
        }
    }
);

// eslint-disable-next-line no-redeclare
export type OtoyeetIndicator = InstanceType<typeof OtoyeetIndicator>;
