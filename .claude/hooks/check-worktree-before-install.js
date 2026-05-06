const { execSync } = require('child_process');

// Claude Code sends the tool event as JSON via stdin
let inputData = '';
process.stdin.on('data', chunk => { inputData += chunk; });
process.stdin.on('end', () => {
  const event = JSON.parse(inputData);
  const command = event.tool_input?.command || '';

  // Only intercept npm install / npm i commands
  if (!/npm\s+(install|i)\b/.test(command)) {
    process.exit(0);
  }

  // TODO(human): detect if we're in a worktree, then block if so
  // Step 1 — run: execSync('git rev-parse --git-dir', { encoding: 'utf8' }).trim()
  // Step 2 — in a normal checkout, the result is exactly ".git"
  //           in a worktree, it's an absolute path containing "worktrees"
  // Step 3 — if it's a worktree: print a clear error message to stderr, then process.exit(2)
  // Step 4 — otherwise: process.exit(0)
});
