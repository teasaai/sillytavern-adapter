import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SillyTavernAdapter, ST_FORMAT_PROMPT } from '../dist/index.js';

const source = '[plan] Mira risks asking for help.\n\nNarrator: Rain taps the glass.\n\nMira: *She lowers her voice.* Stay. **Please.**\n\nNarrator: The room falls quiet.';
const expected = '\n_Rain taps the glass._\n\n**Mira**\n\n*She lowers her voice.* Stay. **Please.**\n\n_The room falls quiet._';
const format = (text) => new SillyTavernAdapter().push(text, true);

test('produces identical Markdown for every chunk size and split point', () => {
  for (let size = 1; size <= source.length; size++) {
    const adapter = new SillyTavernAdapter();
    let result = '';
    for (let offset = 0; offset < source.length; offset += size) result += adapter.push(source.slice(offset, offset + size));
    assert.equal(result + adapter.push('', true), expected);
  }
  for (let split = 0; split <= source.length; split++) {
    const adapter = new SillyTavernAdapter();
    assert.equal(adapter.push(source.slice(0, split)) + adapter.push(source.slice(split), true), expected);
  }
});

test('suppresses truncated leading plans without suppressing ordinary Markdown', () => {
  for (const input of ['[pl', '[plan] private', ' \n[plan]\n']) assert.doesNotMatch(format(input), /plan|private|\[pl/);
  for (const input of ['Hello there', '*She waves.* Hello **friend**.', '### A heading\nA paragraph']) assert.equal(format(input), input);
});

test('recognizes CJK character names', () => {
  assert.equal(format('美咲: *微笑む* おかえり。'), '**美咲**\n\n*微笑む* おかえり。');
});

test('streams narration before the paragraph ends', () => {
  const adapter = new SillyTavernAdapter();
  assert.equal(adapter.push('Narrator: The rain falls '), '_The rain falls');
  assert.equal(adapter.push('softly.'), ' softly.');
  assert.equal(adapter.push('', true), '_');
});

test('trims narration whitespace before closing emphasis', () => {
  assert.equal(format('Narrator: Rain falls.  \n\nMira: Hello.'), '_Rain falls._\n\n**Mira**\n\nHello.');
});

test('fails closed on a hidden plan beyond the supported length', () => {
  assert.throws(() => format('[plan]' + 'x'.repeat(4097)), /Hidden plan exceeded limit/);
});

test('handles empty replies and independent consecutive replies', () => {
  assert.equal(format(''), '');
  assert.equal(format('Mira: Hello.'), '**Mira**\n\nHello.');
  assert.equal(format('Narrator: Goodbye.'), '_Goodbye._');
});

test('exports the generation format instruction', () => {
  assert.match(ST_FORMAT_PROMPT, /Narrator:/);
  assert.match(ST_FORMAT_PROMPT, /Do not decide the user's actions/);
});
