#!/bin/bash
# Studio Session State
# PostToolUse hook: updates .planning/STATE.md after significant writes
# Exit 0 always (non-blocking)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only track docs/ writes
if [[ ! "$FILE_PATH" == *"docs/"* ]]; then
  exit 0
fi

# Skip templates
if [[ "$FILE_PATH" == *"_template/"* ]] || [[ "$FILE_PATH" == *"_example/"* ]] || [[ "$FILE_PATH" == *"_golden/"* ]]; then
  exit 0
fi

STATE_FILE=".planning/STATE.md"

# Create .planning/ if needed
mkdir -p .planning 2>/dev/null

# Determine what was written
if [[ "$FILE_PATH" == *"docs/changes/"* ]]; then
  CHG_DIR=$(echo "$FILE_PATH" | grep -oE "CHG-[0-9]+")
  if [[ -n "$CHG_DIR" ]] && [[ -f "docs/changes/$CHG_DIR/metadata.yaml" ]]; then
    STATUS=$(grep "^status:" "docs/changes/$CHG_DIR/metadata.yaml" | head -1 | sed 's/^status:[[:space:]]*//' | sed 's/[[:space:]]*#.*//')

    # Update STATE.md
    cat > "$STATE_FILE" << EOF
# Studio State

## Status: active
## Current CHG: $CHG_DIR
## Current Phase: $STATUS
## Last Activity: $(date +%Y-%m-%dT%H:%M:%S)
## Last File: $(basename "$FILE_PATH")

## Session Continuity
- Last stopped: $(date +%Y-%m-%dT%H:%M:%S)
- Resume point: /studio-resume $CHG_DIR
EOF
  fi
elif [[ "$FILE_PATH" == *"docs/domains/"* ]]; then
  DOMAIN=$(echo "$FILE_PATH" | sed 's|.*/docs/domains/||' | cut -d/ -f1)
  if [[ -n "$DOMAIN" ]] && [[ "$DOMAIN" != "_template" ]]; then
    # Append domain activity to STATE.md if exists
    if [[ -f "$STATE_FILE" ]]; then
      echo "## Last Domain Activity: $DOMAIN ($(basename "$FILE_PATH")) at $(date +%H:%M)" >> "$STATE_FILE"
    fi
  fi
fi

exit 0
