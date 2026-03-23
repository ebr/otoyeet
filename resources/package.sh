#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

yarn build
gnome-extensions pack dist/ \
    --extra-source=locale \
    --out-dir=. \
    --force

echo "Extension packaged."
