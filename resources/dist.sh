#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST="$SCRIPT_DIR/../dist"

cp "$SCRIPT_DIR/metadata.json" "$DIST/"
cp "$SCRIPT_DIR/stylesheet.css" "$DIST/"
cp -r "$SCRIPT_DIR/icons" "$DIST/"
cp -r "$SCRIPT_DIR/schemas" "$DIST/"
glib-compile-schemas "$DIST/schemas"

# Compile any .po translation files into .mo binaries
for po in "$SCRIPT_DIR/../po"/*.po; do
    [ -f "$po" ] || continue
    lang=$(basename "$po" .po)
    mkdir -p "$DIST/locale/$lang/LC_MESSAGES"
    msgfmt -o "$DIST/locale/$lang/LC_MESSAGES/otoyeet.mo" "$po"
done

echo "Resources copied to dist/"
