#!/usr/bin/env bash
# Installs a check that stops you saving (committing) anything that looks like
# a password or API key. Runs automatically when the Codespace is created.
set -euo pipefail
VERSION=8.21.2
BIN="$HOME/.local/bin"

if ! command -v gitleaks >/dev/null 2>&1; then
  mkdir -p "$BIN"
  arch=$(uname -m); case "$arch" in x86_64) arch=x64 ;; aarch64|arm64) arch=arm64 ;; esac
  if curl -fsSL "https://github.com/gitleaks/gitleaks/releases/download/v${VERSION}/gitleaks_${VERSION}_linux_${arch}.tar.gz" \
      | tar -xz -C "$BIN" gitleaks; then
    echo "Installed the secret checker."
  else
    echo "Could not install the secret checker; GitHub will still check when you publish." >&2
    exit 0
  fi
fi

hook=.git/hooks/pre-commit
[ -d .git ] || exit 0
cat > "$hook" <<'HOOK'
#!/usr/bin/env bash
export PATH="$HOME/.local/bin:$PATH"
command -v gitleaks >/dev/null 2>&1 || exit 0
if ! gitleaks protect --staged --redact --no-banner; then
  echo "Stopped: this change looks like it contains a password or API key."
  echo "Remove it from the file and add it as a GitHub secret instead."
  exit 1
fi
HOOK
chmod +x "$hook"
