#!/bin/bash
# Studio Conflict Detector
# PostToolUse hook: checks for domain conflicts when metadata.yaml is written
# Exit 0 always (advisory, non-blocking)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check metadata.yaml in change packages
if [[ ! "$FILE_PATH" == *"docs/changes/"*"metadata.yaml" ]]; then
  exit 0
fi

# Skip templates
if [[ "$FILE_PATH" == *"_template/"* ]] || [[ "$FILE_PATH" == *"_example/"* ]] || [[ "$FILE_PATH" == *"_golden/"* ]]; then
  exit 0
fi

# Extract current CHG domains
CURRENT_CHG_DIR=$(dirname "$FILE_PATH")
CURRENT_CHG=$(basename "$CURRENT_CHG_DIR")
CURRENT_DOMAINS=$(grep "^domains:" "$FILE_PATH" 2>/dev/null | sed 's/^domains:[[:space:]]*\[//' | sed 's/\]//' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -v '^$')

if [[ -z "$CURRENT_DOMAINS" ]]; then
  exit 0
fi

# Check other active CHGs
CHANGES_DIR=$(dirname "$CURRENT_CHG_DIR")
CONFLICTS=""

for meta in "$CHANGES_DIR"/CHG-*/metadata.yaml; do
  OTHER_CHG_DIR=$(dirname "$meta")
  OTHER_CHG=$(basename "$OTHER_CHG_DIR")

  # Skip self, templates, done
  [[ "$OTHER_CHG" == "$CURRENT_CHG" ]] && continue
  [[ "$OTHER_CHG" == "_template" ]] && continue
  [[ "$OTHER_CHG" == "_example" ]] && continue
  [[ "$OTHER_CHG" == "_golden" ]] && continue

  OTHER_STATUS=$(grep "^status:" "$meta" 2>/dev/null | head -1 | sed 's/^status:[[:space:]]*//' | sed 's/[[:space:]]*#.*//')
  [[ "$OTHER_STATUS" == "done" ]] && continue

  OTHER_DOMAINS=$(grep "^domains:" "$meta" 2>/dev/null | sed 's/^domains:[[:space:]]*\[//' | sed 's/\]//' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -v '^$')

  for domain in $CURRENT_DOMAINS; do
    if echo "$OTHER_DOMAINS" | grep -q "^${domain}$"; then
      CONFLICTS="$CONFLICTS\n  ⚠️ $CURRENT_CHG and $OTHER_CHG both touch domain '$domain'"
    fi
  done
done

if [[ -n "$CONFLICTS" ]]; then
  echo "DOMAIN CONFLICT DETECTED:$CONFLICTS" >&2
  echo "Recommended: /studio-review to check overlaps" >&2
fi

exit 0
