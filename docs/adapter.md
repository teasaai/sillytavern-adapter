# Adapter integration

`SillyTavernAdapter` consumes decoded raw text chunks and returns Markdown fragments. Create a new instance for each assistant reply, append every returned fragment in order, and call `push("", true)` exactly once at the end. Do not reuse that instance for the next reply.

```js
import { SillyTavernAdapter } from '../dist/index.js';

const adapter = new SillyTavernAdapter();
for await (const text of decodedModelTextChunks) {
  appendToAssistantMessage(adapter.push(text));
}
appendToAssistantMessage(adapter.push('', true));
```

The input is text, not raw network bytes or SSE event frames. Decode UTF-8 incrementally and extract model text deltas before passing them in. For a non-streamed reply, `new SillyTavernAdapter().push(rawReply, true)` is sufficient. On interruption, flush any visible text you intend to keep; do not retry the same content through the same instance.

## Input and output

Raw input:

```text
[plan] A short internal note.

Narrator: Rain taps the glass.

Mira: *She lowers her voice.* Stay. **Please.**
```

Displayed Markdown content:

```markdown
_Rain taps the glass._

**Mira**

*She lowers her voice.* Stay. **Please.**
```

The result is one assistant message, even when several characters speak. It does not create distinct SillyTavern avatars.

`ST_FORMAT_PROMPT` is exported for developers controlling a raw model prompt. It asks for blank-line-separated `Narrator:` or `Character:` paragraphs, plain narration and asterisk-wrapped actions. The hosted Teasa API already adds this instruction and applies the formatter; adding either again is unnecessary.

## Boundaries

- A leading `[plan]` line is suppressed, including an incomplete prefix. A hidden plan longer than 4,096 characters throws; callers should abort formatting rather than expose the raw buffer. This is a format convention, not a general reasoning/redaction filter.
- Narrator paragraphs become underscore emphasis. Trailing narration spaces are removed to keep the emphasis valid. Narration should be plain prose; arbitrary nested Markdown is not normalized.
- Speaker labels are recognized at paragraph starts, with an ASCII colon and a maximum prefix length of 100 characters. Unicode letters/numbers are supported, including CJK names. A plain sentence beginning with `Name:` can be interpreted as a label.
- Existing action and dialogue Markdown is preserved. The formatter is not an HTML sanitizer or full Markdown parser; use the destination renderer’s normal safety controls.
- Only an initial prefix, possible label, whitespace and line separators are buffered. Long narration streams before the paragraph is finished.
- Formatting is independent of token accounting, context compaction, persistence and inference. The standalone module has no network or account access.

## Development

Run `npm ci`, `npm test` and `npm run demo`. Tests exercise every chunk size of a mixed speaker/narrator reply, truncated plans, CJK labels, Markdown preservation, long narration and the hidden-plan limit. CI runs on Node.js 20 and 22.

The initial adapter matches Teasa’s 22 September 2026 hosted formatter. Changes here do not automatically deploy to the hosted API.
