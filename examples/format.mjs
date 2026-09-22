import { SillyTavernAdapter } from '../dist/index.js';

const raw = '[plan] Mira asks for help.\n\nNarrator: Rain taps the glass.\n\nMira: *She lowers her voice.* Stay. **Please.**';
const adapter = new SillyTavernAdapter();
for (let offset = 0; offset < raw.length; offset += 7) {
  process.stdout.write(adapter.push(raw.slice(offset, offset + 7)));
}
process.stdout.write(adapter.push('', true) + '\n');
