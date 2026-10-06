#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
cat src/01_head.html src/02_body.html src/03_data.js src/04_logic.js src/05_app.js src/06_pdf.js > index.html
echo "Built index.html ($(wc -c < index.html) bytes)"
