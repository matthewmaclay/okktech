#!/bin/bash
# Hook: PostToolUse for Write/Edit in docs/domains/
# Validates domain doc conventions
#
# Input: JSON on stdin with tool_input
# Exit 0 = ok, Exit 2 = block with message

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check docs/domains files
if [[ ! "$FILE_PATH" == *"docs/domains/"* ]]; then
  exit 0
fi

# Skip templates
if [[ "$FILE_PATH" == *"_template/"* ]]; then
  exit 0
fi

DOMAIN_DIR=$(dirname "$FILE_PATH")
DOMAIN_NAME=$(basename "$DOMAIN_DIR")

# Check that all required files exist in domain
REQUIRED_FILES=("README.md" "ubiquitous-language.md" "aggregates.md" "business-rules.md" "events.md" "invariants.md" "integrations.md" "ownership.md")

MISSING=""
for f in "${REQUIRED_FILES[@]}"; do
  if [[ ! -f "$DOMAIN_DIR/$f" ]]; then
    MISSING="$MISSING $f"
  fi
done

if [[ -n "$MISSING" ]]; then
  echo "Domain '$DOMAIN_NAME' missing files:$MISSING" >&2
  # Don't block — just warn (exit 0 with stderr output shown to Claude)
  exit 0
fi

exit 0
