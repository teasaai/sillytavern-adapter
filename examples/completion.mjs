// Hosted output is already adapted: do not run SillyTavernAdapter on it again.
// Supply TEASA_API_KEY through your local environment; never commit it.
const key = process.env.TEASA_API_KEY;
if (!key) throw new Error('Set TEASA_API_KEY in your environment first.');
const response = await fetch('https://teasa.ai/model-api/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'chai',
    messages: [
      { role: 'system', content: 'You are Mira, an adult cartographer. Reply in English.' },
      { role: 'user', content: 'Hello, Mira. Is the map ready?' },
    ],
    max_tokens: 300,
    stream: false,
  }),
  signal: AbortSignal.timeout(150_000),
});
const result = await response.json();
if (!response.ok) throw new Error(`HTTP ${response.status}: ${result.error?.code ?? 'request_failed'}`);
console.log(result.choices[0].message.content);
