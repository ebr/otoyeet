# Otoyeet

A GNOME Shell extension that distributes windows of the current application across workspaces, one window per workspace.

## Why Otoyeet?

When using GNOME Shell in tiling window manager mode, applications that open multiple windows after a restart (like Firefox) often end up overlapping and being squeezed into tiny spaces. This creates a cluttered workspace that's difficult to manage.

Otoyeet solves this problem by automatically yeeting these windows across different workspaces, creating them as needed and allowing for later rearrangement. With a single click or keyboard shortcut, you can instantly organize your workspace and improve your productivity. Woot.

## Features

- Distribute all windows of the current application across workspaces
- Automatically create additional workspaces as needed
- Behaviour is configurable through preferences dialog
- Assign keyboard shortcuts for quick activation
- Works with all standard GNOME applications

## Prerequisites

- GNOME Shell 45 or later
- Node.js 18+ and [Yarn](https://yarnpkg.com/)
- `glib-compile-schemas` (provided by `libglib2.0-bin` on Debian/Ubuntu)

## Installation

### Quick Install (recommended)

```bash
git clone https://github.com/ebr/otoyeet.git
cd otoyeet
yarn install
make install
```

Then restart GNOME Shell:

- **X11:** Press `Alt+F2`, type `r`, press Enter
- **Wayland:** Log out and back in

Finally, enable the extension:

```bash
gnome-extensions enable otoyeet@goodbot.dev
```

Or use the GNOME Extensions app or GNOME Tweaks.

### Uninstall

```bash
make uninstall
```

## Usage

1. Open multiple windows of an application (e.g., Firefox, Terminal)
2. Either:
   - Click the Otoyeet icon in the top panel and select the (only, for now) option
   - Use the keyboard shortcut (default: `Super+=`)

The extension distributes all windows of the focused application across workspaces, one per workspace, creating new workspaces as needed.

## Configuration

Open GNOME Extensions app, find "Otoyeet", and click the settings icon:

- **Focus window after moving:** Focuses the last window after moving it to its new workspace
- **Switch to first workspace:** Automatically switch to the first workspace after spreading
- **Activation shortcut:** Customize the keyboard shortcut

## Troubleshooting

If the extension isn't working:

1. Check it is enabled in the GNOME Extensions app
2. Ensure you have multiple windows of the same application open
3. Check the logs:

   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell
   ```

## Development

```bash
yarn install        # Install dependencies
yarn build          # Compile TypeScript + copy resources → dist/
make install        # Deploy dist/ to GNOME extensions directory
yarn lint           # Run ESLint
yarn lint:md        # Run markdownlint
yarn typecheck      # Type-check without emitting
yarn translate      # Extract translatable strings → po/otoyeet.pot
yarn package        # Build distributable .zip via gnome-extensions pack
```

| Command | Description |
|---|---|
| `make install` | Build and install to `~/.local/share/gnome-shell/extensions/` |
| `make uninstall` | Remove the installed extension |
| `make package` | Build distributable `.zip` via `gnome-extensions pack` |
| `make clean` | Remove `dist/` |

After changes, run `make install` then restart GNOME Shell. Watch for errors with:

```bash
journalctl -f -o cat /usr/bin/gnome-shell
```

## License

GPL v3.0 — Copyright (C) 2026 Eugene Brodsky
