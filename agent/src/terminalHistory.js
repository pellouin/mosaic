/**
 * Prepare tmux capture-pane output for replay in xterm.js.
 *
 * tmux's -e flag preserves SGR attributes (colours, bold, etc.), which must
 * survive this cleanup. Cursor, screen, OSC and DCS controls are removed
 * because replaying them as scrollback can reposition or erase xterm cells.
 */
export function sanitizeTerminalHistory(history) {
  const stripped = history
    .replace(/\x1b\[\d*;\d*H/g, '')
    .replace(/\x1b\[\d*H/g, '')
    .replace(/\x1b\[\?25[hl]/g, '')
    .replace(/\x1b\[[\d;]*J/g, '')
    .replace(/\x1bP[^\x1b]*\x1b\\/g, '')
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '');

  return stripped.replace(/(?<!\r)\n/g, '\r\n');
}
