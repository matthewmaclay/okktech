#!/bin/bash
# Hook: PostToolUse for Write/Edit in docs/changes/
# Enhanced stage gate with design stage support
# Validates change package conventions and stage gate transitions
#
# Input: JSON on stdin with tool_input
# Exit 0 = ok, Exit 2 = block with message

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check docs/changes files
if [[ ! "$FILE_PATH" == *"docs/changes/"* ]]; then
  exit 0
fi

# Skip templates, examples, and golden
if [[ "$FILE_PATH" == *"_template/"* ]] || [[ "$FILE_PATH" == *"_example/"* ]] || [[ "$FILE_PATH" == *"_golden/"* ]]; then
  exit 0
fi

CHANGE_DIR=$(dirname "$FILE_PATH")
FILE_NAME=$(basename "$FILE_PATH")

# If metadata.yaml doesn't exist yet, skip (being created)
if [[ ! -f "$CHANGE_DIR/metadata.yaml" ]]; then
  exit 0
fi

# --- Basic metadata validation ---
if ! grep -q "^id:" "$CHANGE_DIR/metadata.yaml"; then
  echo "metadata.yaml missing 'id' field" >&2
  exit 2
fi
if ! grep -q "^status:" "$CHANGE_DIR/metadata.yaml"; then
  echo "metadata.yaml missing 'status' field" >&2
  exit 2
fi

# --- Placeholder detection for any written file ---
PLACEHOLDER_PATTERNS=(
  "CHG-XXXX"
  "YYYY-MM-DD"
  "\[Feature name\]"
  "\[Flow name\]"
  "\[Aggregate name\]"
  "\[Decision title\]"
  "\[Surface name\]"
)

if [[ "$FILE_NAME" != "metadata.yaml" ]] && [[ -f "$FILE_PATH" ]]; then
  for pattern in "${PLACEHOLDER_PATTERNS[@]}"; do
    if grep -q "$pattern" "$FILE_PATH"; then
      echo "WARNING: '$FILE_PATH' contains placeholder '$pattern'. Replace before advancing stage." >&2
      # Warning only, don't block
      break
    fi
  done
fi

# --- Stage gate validation on status transition ---
if [[ "$FILE_NAME" == "metadata.yaml" ]]; then
  NEW_STATUS=$(grep "^status:" "$FILE_PATH" | head -1 | sed 's/^status:[[:space:]]*//' | sed 's/[[:space:]]*#.*//')

  # Helper: check file has content beyond template
  has_content() {
    local file="$CHANGE_DIR/$1"
    if [[ ! -f "$file" ]]; then
      return 1
    fi
    # File exists and has more than just frontmatter + headings
    local content_lines
    content_lines=$(grep -v "^---$" "$file" | grep -v "^#" | grep -v "^$" | grep -v "^<!--" | grep -v "^-$" | grep -v "^|---|" | wc -l | tr -d ' ')
    [[ "$content_lines" -gt 3 ]]
  }

  # Helper: count table data rows (rows with |, excluding header separator)
  table_row_count() {
    local file="$CHANGE_DIR/$1"
    if [[ ! -f "$file" ]]; then
      echo 0
      return
    fi
    grep -c "^|[^-]" "$file" | tr -d ' '
  }

  # Helper: count list items in a section
  list_items_in_section() {
    local file="$CHANGE_DIR/$1"
    local section="$2"
    if [[ ! -f "$file" ]]; then
      echo 0
      return
    fi
    # Extract section content until next heading, count non-empty list items
    awk "/^###? $section/{found=1;next} /^##/{if(found)exit} found" "$file" | grep -cE "^[0-9]+\.|^- \S" | tr -d ' '
  }

  # Helper: count checklist items
  checklist_count() {
    local file="$CHANGE_DIR/$1"
    local section="$2"
    if [[ ! -f "$file" ]]; then
      echo 0
      return
    fi
    awk "/^###? $section/{found=1;next} /^##/{if(found)exit} found" "$file" | grep -cE "^- \[" | tr -d ' '
  }

  # Helper: check YAML field is not empty
  field_not_empty() {
    local field="$1"
    local val
    val=$(grep "^[[:space:]]*$field:" "$CHANGE_DIR/metadata.yaml" | head -1 | sed "s/^[[:space:]]*$field:[[:space:]]*//" | sed 's/[[:space:]]*#.*//' | sed 's/"//g')
    [[ -n "$val" ]] && [[ "$val" != "\"\"" ]] && [[ "$val" != "''" ]]
  }

  # Helper: check YAML array field is not empty
  array_not_empty() {
    local field="$1"
    local val
    val=$(grep "^$field:" "$CHANGE_DIR/metadata.yaml" | head -1 | sed "s/^$field:[[:space:]]*//" | sed 's/[[:space:]]*#.*//')
    [[ "$val" != "[]" ]] && [[ -n "$val" ]]
  }

  # Helper: check no blocking questions
  no_blocking_questions() {
    local file="$CHANGE_DIR/10-open-questions.md"
    if [[ ! -f "$file" ]]; then
      return 0
    fi
    ! grep -qi "\[BLOCKING\].*open" "$file"
  }

  # Helper: count HTML files in mockups/ directory
  mockup_html_count() {
    local mockups_dir="$CHANGE_DIR/mockups"
    if [[ ! -d "$mockups_dir" ]]; then
      echo 0
      return
    fi
    find "$mockups_dir" -maxdepth 1 -name "*.html" | wc -l | tr -d ' '
  }

  ERRORS=""

  case "$NEW_STATUS" in
    discovery)
      # Exit criteria for draft stage
      has_content "change-draft.md" || ERRORS="$ERRORS\n  - change-draft.md not filled"
      field_not_empty "title" || ERRORS="$ERRORS\n  - metadata.yaml: title is empty"
      field_not_empty "product" || ERRORS="$ERRORS\n  - metadata.yaml: product owner not set"
      ;;

    spec)
      # Exit criteria for discovery stage
      has_content "01-discovery.md" || ERRORS="$ERRORS\n  - 01-discovery.md not filled"
      local actors
      actors=$(table_row_count "01-discovery.md")
      [[ "$actors" -gt 1 ]] || ERRORS="$ERRORS\n  - 01-discovery.md: Actors table is empty"
      local happy
      happy=$(list_items_in_section "01-discovery.md" "Happy path")
      [[ "$happy" -ge 3 ]] || ERRORS="$ERRORS\n  - 01-discovery.md: Happy path < 3 steps (found: $happy)"
      local edges
      edges=$(list_items_in_section "01-discovery.md" "Edge cases")
      [[ "$edges" -ge 3 ]] || ERRORS="$ERRORS\n  - 01-discovery.md: Edge cases < 3 (found: $edges)"
      ;;

    analysis)
      # Exit criteria for spec stage
      has_content "02-product-spec.md" || ERRORS="$ERRORS\n  - 02-product-spec.md not filled"
      local ac_count
      ac_count=$(checklist_count "02-product-spec.md" "Acceptance criteria")
      [[ "$ac_count" -ge 5 ]] || ERRORS="$ERRORS\n  - 02-product-spec.md: Acceptance criteria < 5 (found: $ac_count)"
      ;;

    design)
      # Exit criteria for analysis stage: analysis → design
      has_content "03-domain-impact.md" || ERRORS="$ERRORS\n  - 03-domain-impact.md not filled"
      array_not_empty "domains" || ERRORS="$ERRORS\n  - metadata.yaml: domains is empty"
      ;;

    in-progress)
      # Exit criteria for design stage: design → in-progress
      has_content "03-domain-impact.md" || ERRORS="$ERRORS\n  - 03-domain-impact.md not filled"
      has_content "03.5-design-mockups.md" || ERRORS="$ERRORS\n  - 03.5-design-mockups.md not filled"
      has_content "04-system-analysis.md" || ERRORS="$ERRORS\n  - 04-system-analysis.md not filled"
      has_content "05-backend-proposal.md" || ERRORS="$ERRORS\n  - 05-backend-proposal.md not filled"
      array_not_empty "domains" || ERRORS="$ERRORS\n  - metadata.yaml: domains is empty"
      local html_count
      html_count=$(mockup_html_count)
      [[ "$html_count" -ge 1 ]] || ERRORS="$ERRORS\n  - mockups/: no HTML files found (need at least 1)"
      ;;

    done)
      # Exit criteria for in-progress stage
      has_content "06-frontend-proposal.md" || ERRORS="$ERRORS\n  - 06-frontend-proposal.md not filled"
      has_content "07-test-plan.md" || ERRORS="$ERRORS\n  - 07-test-plan.md not filled"
      has_content "08-rollout.md" || ERRORS="$ERRORS\n  - 08-rollout.md not filled"
      has_content "release-notes.md" || ERRORS="$ERRORS\n  - release-notes.md not filled"
      no_blocking_questions || ERRORS="$ERRORS\n  - 10-open-questions.md: unresolved [BLOCKING] questions exist"
      ;;
  esac

  if [[ -n "$ERRORS" ]]; then
    echo "Stage gate BLOCKED: transition to '$NEW_STATUS' not possible:$ERRORS" >&2
    exit 2
  fi
fi

exit 0
