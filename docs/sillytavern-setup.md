# SillyTavern setup

## Get a key

Sign in to [Teasa](https://teasa.ai) and open **Account → Use Teasa in SillyTavern**. Create a key with a name you will recognize. The secret is shown once. Keep it private; do not paste it into a character card, prompt, screenshot or issue.

The first eligible activation grants a one-time $1 promotional balance per account. Activation is subject to availability and abuse limits. Extra or replacement keys share the same account balance and do not reset it. If you received a key from Teasa, it is ready to use without creating another account.

## Models in this experiment

**Chai:** Warm and light conversations with a touch of spice. Select `chai` as the API model ID.

**Matcha:** Deep and rich conversations with a touch of bittersweet. Matcha is not included in this experiment. Trial keys are restricted to Chai, and requesting Matcha is rejected before inference or credit usage.

Chai was previously called Teasa. Existing API keys remain valid with the same balance. For older client configurations, `teasa-roleplay` remains a compatibility alias for Chai. Model discovery lists only `chai`.

## Configure your connection

1. Open **API Connections** in SillyTavern.
2. Set the API type to **Chat Completion**.
3. Set the source to **Custom (OpenAI-compatible)**.
4. Set the server URL to `https://teasa.ai/model-api/v1`.
5. Paste your key into the Custom API key field and connect.
6. Select `chai` from the model list, or enter that exact model ID manually.
7. Set context size to **32,256** and response length to **1,500** initially. Streaming is optional.
8. Choose a character and send a short greeting to test the connection. A test message consumes a small amount of credit.

Keep tool calling, image attachments and JSON/structured-output modes disabled. The API accepts text messages with `system`, `user` and `assistant` roles. It supports temperature, top-p, frequency/presence penalties and up to four stop sequences. It does not offer legacy Text Completion or multiple candidates per request.

No additional formatting extension is needed. Avoid regex rules that also transform speaker labels unless you want those additional changes. The connection steps follow [SillyTavern’s Custom endpoint guide](https://docs.sillytavern.app/usage/api-connections/openai/).

## Characters

Use your existing SillyTavern characters, or export a standalone Character Card V2 PNG/JSON from Teasa’s web Creator Studio and import it into SillyTavern. The model follows the character, world information and history supplied by your client. The API does not automatically load your Teasa Stories, memories, relationships or quests.

## Context and long chats

The model window is **32,768 tokens for input plus output**. The suggested 32,256 setting leaves 512 tokens for Teasa’s formatting instruction. SillyTavern budgets the reply and selects history that fits its configured context; Teasa adds no summarization call and does not silently truncate history. Tokenizer estimates can differ, so reduce context further if the provider rejects a request.

Replies default to 1,500 tokens and can be configured up to 6,000. Larger reply budgets leave less room for history. Requests also have limits of 200 messages, 256 KiB aggregate input and 512 KiB encoded body size.

## Credit and records

Trial debit rates are **$0.05 per million input tokens** and **$0.22 per million output tokens** as of 22 September 2026. They are trial rates, not a paid subscription or a guarantee of future pricing. There are no automatic payments or top-ups. Usage counts include the formatting instruction and any hidden plan tokens.

The service reserves a maximum charge before generation and settles using provider usage when available. Interrupted, cancelled or usage-less requests can be charged at their reserved maximum and appear as **Estimated**. Each account permits one active generation at a time and up to 12 admissions per rolling minute. Client retries are new requests.

Prompts and replies are processed by Teasa and its inference provider. API conversation records follow your Teasa account’s retention setting. Account settings let you view usage, revoke keys and delete API conversation records. Deleting transcripts does not reset credit. SillyTavern retains its own local chats and credentials separately.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Cannot connect | Use Chat Completion and the exact base URL. Do not append `/chat/completions`. |
| Unauthorized | Use a model API key, not your password or a browser session. Check that the key is still active. |
| Model not listed | Reconnect, or enter `chai` manually. Matcha is not available in this trial. |
| Context length error | Lower context or reply length; remove unusually large required prompts. |
| Unsupported request | Disable tool calls, images, JSON output and multiple candidates. |
| HTTP 429 | Check the error: wait for an active request/rate limit, or inspect remaining credit for `insufficient_quota`. |
| Trial activation unavailable | New account credit is subject to activation limits; contact Teasa if you were invited and cannot activate. |
| Unexpected Markdown | Turn off extra output regex rules. Hosted replies already pass through the adapter. |
| Lost key | Revoke it and create another from Account. This preserves the remaining balance. |

When reporting a problem, include the HTTP status, error code and request ID if available. Remove your key and private conversation text.
