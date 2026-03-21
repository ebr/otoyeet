// SPDX-License-Identifier: GPL-3.0-or-later

import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class OtoyeetPreferences extends ExtensionPreferences {
    override async fillPreferencesWindow(window: Adw.PreferencesWindow): Promise<void> {
        const _ = this.gettext.bind(this);
        const settings = this.getSettings('org.gnome.shell.extensions.otoyeet');

        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'preferences-system-symbolic',
        });

        // Behavior group
        const behaviorGroup = new Adw.PreferencesGroup({ title: _('Behavior') });
        page.add(behaviorGroup);

        const focusRow = new Adw.SwitchRow({
            title: _('Focus window after moving'),
            subtitle: _('Whether to focus a window after moving it to a new workspace'),
        });
        settings.bind('focus-after-move', focusRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        behaviorGroup.add(focusRow);

        const switchRow = new Adw.SwitchRow({
            title: _('Switch to first workspace'),
            subtitle: _('Switch to the first workspace after spreading windows'),
        });
        settings.bind('switch-to-first', switchRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        behaviorGroup.add(switchRow);

        // Shortcuts group
        const shortcutsGroup = new Adw.PreferencesGroup({ title: _('Shortcuts') });
        page.add(shortcutsGroup);

        const shortcutRow = new Adw.ActionRow({
            title: _('Activation shortcut'),
            subtitle: _('Keyboard shortcut to distribute windows across workspaces'),
        });

        const shortcutLabel = new Gtk.ShortcutLabel({
            accelerator: settings.get_strv('activate-shortcut')[0] ?? '',
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
        });

        settings.connect('changed::activate-shortcut', () => {
            shortcutLabel.set_accelerator(settings.get_strv('activate-shortcut')[0] ?? '');
        });

        shortcutRow.add_suffix(shortcutLabel);
        shortcutsGroup.add(shortcutRow);

        const shortcutButton = new Gtk.Button({
            child: new Gtk.Image({ icon_name: 'input-keyboard-symbolic' }),
            valign: Gtk.Align.CENTER,
            tooltip_text: _('Edit shortcut'),
        });

        shortcutButton.connect('clicked', () => {
            const dialog = new Adw.Dialog({ title: _('Set Shortcut') });

            const toolbarView = new Adw.ToolbarView();
            toolbarView.add_top_bar(new Adw.HeaderBar());
            toolbarView.set_content(new Gtk.Label({
                label: _('Press a key combination, or Escape to clear'),
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
            }));
            dialog.set_child(toolbarView);

            const controller = new Gtk.EventControllerKey();
            dialog.add_controller(controller);

            controller.connect('key-pressed', (_controller: unknown, keyval: number, _keycode: number, state: number) => {
                if (keyval === Gdk.KEY_Escape) {
                    settings.set_strv('activate-shortcut', []);
                    dialog.close();
                    return Gdk.EVENT_STOP;
                }

                // Ignore bare modifier key presses
                if (state === 0 && (
                    keyval === Gdk.KEY_Control_L || keyval === Gdk.KEY_Control_R ||
                    keyval === Gdk.KEY_Shift_L || keyval === Gdk.KEY_Shift_R ||
                    keyval === Gdk.KEY_Alt_L || keyval === Gdk.KEY_Alt_R ||
                    keyval === Gdk.KEY_Super_L || keyval === Gdk.KEY_Super_R
                ))
                    return Gdk.EVENT_PROPAGATE;

                const mask = state & Gtk.accelerator_get_default_mod_mask();
                settings.set_strv('activate-shortcut', [Gtk.accelerator_name(keyval, mask)]);
                dialog.close();
                return Gdk.EVENT_STOP;
            });

            dialog.present(window);
        });

        shortcutRow.add_suffix(shortcutButton);
        window.add(page);
    }
}
