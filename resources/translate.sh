#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR/../src"
POT="$SCRIPT_DIR/../po/otoyeet.pot"

# xgettext handles .ts files fine with -L JavaScript
# Run from repo root so source references are relative paths
cd "$SCRIPT_DIR/.."
xgettext -L JavaScript \
    --from-code=UTF-8 \
    --package-name=otoyeet \
    --copyright-holder="otoyeet contributors" \
    --output="$POT" \
    src/*.ts \
    src/lib/*.ts \
    src/ui/*.ts

echo "Translation template written to po/otoyeet.pot"
