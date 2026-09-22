# SillyTavern setup

## Install SillyTavern, not an extra adapter

If you already use SillyTavern, skip straight to the connection settings below. Otherwise, follow the [official installation instructions](https://docs.sillytavern.app/installation/) for your operating system and launch SillyTavern.

Teasa applies its formatting adapter on the hosted API. You do not need to clone this repository, run npm, install a proxy, or add an extension. Do not paste this repository URL into **Extensions → Install extension**. Developers integrating raw model output can use the [standalone formatter](../README.md#for-developers-standalone-formatter).

## Get a key

Sign in to [Teasa](https://teasa.ai) and open **Account → Use Teasa in SillyTavern**. Create a key with a name you will recognize. The secret is shown once. Keep it private; do not paste it into a character card, prompt, screenshot or issue.

The first eligible activation grants a one-time $1 promotional balance per account. Activation is subject to availability and abuse limits. Extra or replacement keys share the same account balance and do not reset it. If you received a key from Teasa, it is ready to use without creating another account.

## Models in this experiment

**Chai:** Warm and light conversations with a touch of spice. Select `chai` as the API model ID.

**Matcha:** Deep and rich conversations with a touch of bittersweet. Matcha is not included in this experiment. Trial keys are restricted to Chai, and requesting Matcha is rejected before inference or credit usage.

Chai was previously called Teasa. Existing API keys remain valid with the same balance. For older client configurations, `teasa-roleplay` remains a compatibility alias for Chai. Model discovery lists only `chai`.

## Configure your connection

1. Open **API Connections** with the **plug icon** in SillyTavern’s top toolbar.
2. Set **API** to **Chat Completion**.
3. Set **Chat Completion Source** to **Custom (OpenAI-compatible)**.
4. Set **Custom Endpoint (Base URL)** to `https://teasa.ai/model-api/v1`. Do not append `/chat/completions`.
5. Paste your key into **Custom API Key**. Teasa requires a key even though SillyTavern labels this generic field “Optional.”
6. Set **Enter a Model ID** to `chai`. Leave **Prompt Post-Processing** on **None** and click **Connect**. You can also select `chai` from **Available Models** after connecting.

![API Connections filled in for Teasa, before connecting](images/sillytavern-connection.png)

`YOUR_TEASA_API_KEY` is a placeholder, not a working key. This screenshot shows the form before connecting; it is not a successful connection receipt.

## Configure context and streaming

Open **AI Response Configuration** with the **sliders icon** in the top toolbar.

| Field | Starting value |
| --- | --- |
| Context Size (tokens) | `32256` |
| Max Response Length (tokens) | `1500` |
| Multiple swipes per generation | `1` |
| Streaming | Enabled |

If the context control will not accept `32256`, enable **Unlocked Context Size**, then click the number beside the slider and type the value. Unlocking the control does not increase the model’s actual context window.

![Response configuration with the recommended context, reply budget, and streaming settings](images/sillytavern-generation-settings.png)

Captured in SillyTavern 1.19.0. Your theme or version may place the controls differently. Other sampling settings shown are defaults, not required Teasa settings.

Choose a character and send a short greeting, or use **Test Message** in API Connections. A test message consumes a small amount of credit. A successful reply confirms the connection; a generic status such as “Status check bypassed” on a Custom endpoint does not by itself verify your key.

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
