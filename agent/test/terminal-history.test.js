import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'fs';
import { sanitizeTerminalHistory } from '../src/terminalHistory.js';

test('captured terminal history requests ANSI attributes from tmux', () => {
  const source = readFileSync(new URL('../services/tmux.js', import.meta.url), 'utf8');
  const captureHistory = source.slice(
    source.indexOf('async captureHistory'),
    source.indexOf('async resizeTerminal'),
  );

  assert.match(captureHistory, /capture-pane -e /);
});

test('history cleanup preserves SGR colours and text attributes', () => {
  const history = '\x1b[31mred\x1b[0m \x1b[1;36mbold cyan\x1b[0m\n';

  assert.equal(sanitizeTerminalHistory(history), history.replace('\n', '\r\n'));
});

test('history cleanup removes cursor, screen, OSC and DCS controls', () => {
  const history = [
    '\x1b[2;3H',
    '\x1b[?25l',
    '\x1b[2J',
    '\x1b]0;title\x07',
    '\x1bPtmux-control\x1b\\',
    '\x1b[32mkept\x1b[0m\n',
  ].join('');

  assert.equal(sanitizeTerminalHistory(history), '\x1b[32mkept\x1b[0m\r\n');
});
