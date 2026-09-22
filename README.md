# Teasa for SillyTavern

Use [Chai by Teasa](https://teasa.ai) with your characters and conversations in SillyTavern. Start with a one-time **$1 trial per eligible Teasa account**. No card charges or automatic top-ups.

## Meet the models

| Model | Conversation style | This API trial |
| --- | --- | --- |
| **Chai** | Warm and light conversations with a touch of spice. | Available as `chai` |
| **Matcha** | Deep and rich conversations with a touch of bittersweet. | Not included |

**This experiment is Chai-only.** Trial keys cannot access Matcha. Chai is the new name for the default model previously called Teasa. Existing keys keep their remaining credit; there is no need to replace them.

## Connect in SillyTavern

1. Sign in at [teasa.ai](https://teasa.ai). Open **Account → Use Teasa in SillyTavern**, create a named API key and save it. If Teasa gave you a trial key, use that key directly.
2. In SillyTavern, open **API Connections**. Choose **Chat Completion**, then **Custom (OpenAI-compatible)**.
3. Enter these settings and connect:

| Setting | Value |
| --- | --- |
| Server URL | `https://teasa.ai/model-api/v1` |
| Custom API key | Your Teasa API key |
| Model | `chai` |
| Context size | `32256` tokens, including the reply |
| Response length | Start with `1500` tokens |
| Streaming | Supported |

4. Select a character and send a message. You can also import a Character Card V2 PNG or JSON exported from Teasa’s web Creator Studio.

Use the base URL above without adding `/chat/completions`. Leave tool calling, image input and structured JSON output off. [Full setup, credit details and troubleshooting](docs/sillytavern-setup.md).

If you previously selected `teasa-roleplay`, reconnect and choose `chai`. The old ID remains an alias for Chai; it does not unlock another model.

**No extension or local proxy is needed.** Teasa’s hosted endpoint already converts its replies to SillyTavern Markdown. Do not apply the adapter again to hosted API replies.

## See it in SillyTavern

A live reply from the model now named Chai in SillyTavern 1.19.0 using its standard chat display. The example uses a fictional cartographer, Mira Vale: actions appear in italics, dialogue stays upright, and the character header shows who is speaking.

![A conversation with Mira Vale in SillyTavern, generated through the Teasa API](docs/images/sillytavern-desktop.png)

[View the mobile-width screenshot](docs/images/sillytavern-mobile.png). Captured on 22 September 2026 from a real streamed reply through the previous `teasa-roleplay` model ID (now `chai`); the sample conversation is synthetic. Your theme and formatting extensions can change its appearance.

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
