/** Converts Teasa's speaker blocks into one ST Markdown message incrementally.
 * Only a possible speaker label / hidden first line is buffered, not a paragraph.
 */
export class SillyTavernAdapter {
  private prefix = "";
  private initial = true;
  private plan = false;
  private atStart = true;
  private narration = false;
  private newlines = "";
  private planLength = 0;
  private afterLabel = false;
  private narrationSpaces = "";
  push(chunk: string, final = false): string {
    let out = "";
    for (const char of chunk) {
      if (this.initial) {
        this.prefix += char;
        const value = this.prefix.trimStart();
        if (value.toLowerCase() === "[plan]") { this.plan = true; this.initial = false; this.prefix = ""; continue; }
        if ("[plan]".startsWith(value.toLowerCase())) continue;
        if (value.toLowerCase().startsWith("[plan]")) { this.plan = true; this.initial = false; this.prefix = ""; }
        else { this.initial = false; const held = this.prefix; this.prefix = ""; out += this.push(held); }
        continue;
      }
      if (this.plan) {
        if (++this.planLength > 4096) throw new Error("Hidden plan exceeded limit");
        if (char === "\n") { this.plan = false; this.atStart = true; }
        continue;
      }
      if (this.afterLabel && (char === " " || char === "\t")) continue;
      this.afterLabel = false;
      if (this.narration && (char === " " || char === "\t" || char === "\r")) { this.narrationSpaces += char; continue; }
      if (char === "\n") {
        this.narrationSpaces = "";
        if (this.atStart && this.prefix) { out += this.prefix; this.prefix = ""; this.atStart = false; }
        this.newlines += char;
        if (this.newlines.length === 2) {
          if (this.narration) out += "_";
          this.narration = false; this.atStart = true;
        }
        continue;
      }
      if (this.narrationSpaces) { out += this.narrationSpaces; this.narrationSpaces = ""; }
      if (this.newlines) { out += this.newlines; this.newlines = ""; }
      if (this.atStart) {
        this.prefix += char;
        if (char === ":" && this.prefix.length <= 100 && /^[\p{L}\p{N}][\p{L}\p{N} .’'&+()_-]*:$/u.test(this.prefix.trim())) {
          const name = this.prefix.trim().slice(0, -1);
          this.narration = name.toLowerCase() === "narrator";
          out += this.narration ? "_" : `**${name}**\n\n`;
          this.prefix = ""; this.atStart = false; this.afterLabel = true;
        } else if (this.prefix.length >= 100 || /^[*#`_>\[]/.test(this.prefix.trimStart())) {
          out += this.prefix; this.prefix = ""; this.atStart = false;
        }
      } else out += char;
    }
    if (final) {
      // A truncated hidden plan must never become user-visible prose.
      if (!this.plan && !this.initial) out += this.prefix;
      else if (this.initial && !"[plan]".startsWith(this.prefix.trimStart().toLowerCase())) out += this.prefix;
      this.prefix = "";
      if (this.narration) out += "_";
      this.narrationSpaces = "";
      this.narration = false;
      out += this.newlines; this.newlines = "";
    }
    return out;
  }
}
