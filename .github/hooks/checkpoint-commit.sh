#!/bin/bash

# Taken from https://github.com/github/awesome-copilot/blob/main/hooks/session-auto-commit/README.md
# Session Auto-Commit Hook
# Automatically commits and pushes changes when a Copilot session ends

set -euo pipefail

# Delete the next line to turn on checkpoint commits
exit 0

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "⚠️  Not in a git repository"
  exit 0
fi

# Check for uncommitted changes
if [[ -z "$(git status --porcelain)" ]]; then
  echo "✨ No changes to commit"
  exit 0
fi

echo "📦 Auto-committing changes from Copilot session..."

# Stage all changes
git add -A

# Create timestamped commit
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "[Checkpoint-commit] $TIMESTAMP" --no-verify 2>/dev/null || {
  echo "⚠️  Commit failed"
  exit 0
}

exit 0
