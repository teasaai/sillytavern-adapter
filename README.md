# Teasa for SillyTavern

Use Teasa’s roleplay model with your characters and conversations in SillyTavern. Start with a one-time **$1 trial per eligible Teasa account**. No card charges or automatic top-ups.

## Connect in SillyTavern

1. Sign in at [teasa.ai](https://teasa.ai). Open **Account → Use Teasa in SillyTavern**, create a named API key and save it. If Teasa gave you a trial key, use that key directly.
2. In SillyTavern, open **API Connections**. Choose **Chat Completion**, then **Custom (OpenAI-compatible)**.
3. Enter these settings and connect:

| Setting | Value |
| --- | --- |
| Server URL | `https://teasa.ai/model-api/v1` |
| Custom API key | Your Teasa API key |
| Model | `teasa-roleplay` |
| Context size | `32256` tokens, including the reply |
| Response length | Start with `1500` tokens |
| Streaming | Supported |

4. Select a character and send a message. You can also import a Character Card V2 PNG or JSON exported from Teasa’s web Creator Studio.

Use the base URL above without adding `/chat/completions`. Leave tool calling, image input and structured JSON output off. [Full setup, credit details and troubleshooting](docs/sillytavern-setup.md).

**No extension or local proxy is needed.** Teasa’s hosted endpoint already converts its replies to SillyTavern Markdown. Do not apply the adapter again to hosted API replies.

## Standalone adapter

This repository also contains the streaming formatter used by Teasa. It converts raw speaker blocks into one Markdown assistant message: narrator paragraphs become emphasis, character names become bold, and character actions keep their Markdown. SillyTavern renders the resulting text.

The formatter runs locally with no network calls or runtime dependencies. It is useful when integrating a raw Teasa-format stream into another client. It does not include model weights, inference hosting, billing or account services.

```sh
git clone https://github.com/teasaai/sillytavern-adapter.git
cd sillytavern-adapter
npm ci
npm test
npm run demo
```

Requires Node.js 20 or later. The build emits JavaScript and TypeScript declarations in `dist/`.

```js
import { SillyTavernAdapter } from './dist/index.js';

const adapter = new SillyTavernAdapter();
let markdown = adapter.push('Narrator: Rain taps the glass.\n\n');
markdown += adapter.push('Mira: *She lowers her voice.* Stay.');
markdown += adapter.push('', true); // Flush once when the reply ends.
console.log(markdown);
```

[Streaming integration and format contract](docs/adapter.md). [Hosted API example](examples/completion.mjs).

## Compatibility

The formatter was extracted from Teasa’s 22 September 2026 production implementation without changing its behavior. The hosted API was tested with SillyTavern 1.19.0 for model discovery, JSON/SSE completions and Markdown rendering. Other versions and custom regex extensions may behave differently.

This project is maintained by **Teasa <hello@teasa.ai>**. SillyTavern is a separate project. For its connection controls, see the [official SillyTavern documentation](https://docs.sillytavern.app/usage/api-connections/openai/).
