---
name: pull-request
description: Führt die Tests aus, committet bei Erfolg alle Änderungen mit deutscher Nachricht, pusht den Branch und legt bei Bedarf einen Pull Request auf GitHub an. Bricht ab, wenn ein Test fehlschlägt.
disable-model-invocation: true
allowed-tools:
  - Bash(node --test:*)
  - Bash(git status:*)
  - Bash(git diff:*)
  - Bash(git log:*)
  - Bash(git branch --show-current)
  - Bash(git add:*)
  - Bash(git commit:*)
  - Bash(git push -u origin:*)
  - Bash("/c/Program Files/GitHub CLI/gh.exe" pr view:*)
  - Bash("/c/Program Files/GitHub CLI/gh.exe" pr create:*)
  - Read
  - Grep
  - Glob
---

# Pull Request vorbereiten

Antworte auf Deutsch und so, dass ein Anfänger es versteht. Arbeite die Schritte der Reihe nach ab und hör sofort auf, wenn ein Schritt scheitert.

Niemals `git push --force` (oder `-f`) verwenden. Scheitert ein Push, abbrechen und erklären, statt ihn zu erzwingen.

Die GitHub CLI liegt nicht im PATH. Rufe sie über den vollen Pfad auf: im Bash-Tool `"/c/Program Files/GitHub CLI/gh.exe"`, in PowerShell `& "C:\Program Files\GitHub CLI\gh.exe"`.

## 1. Branch prüfen

- `git branch --show-current`
- Ist es `main`: abbrechen. Laut Projektregeln wird nie direkt auf `main` committet. Schlag vor, zuerst einen Branch mit sprechendem Namen anzulegen.

## 2. Tests ausführen

- `node --test` im Projektordner ausführen.
- **Schlägt ein Test fehl:** sofort abbrechen. Nichts committen, nichts pushen. Nenne den Namen des fehlgeschlagenen Tests und die Fehlermeldung (erwartet / tatsächlich) und erkläre kurz, was sie bedeutet. Ändere keine Tests, nur damit sie bestehen.
- Bestehen alle: kurz melden, wie viele Tests bestanden haben.

## 3. Committen

- `git status` und `git diff` anschauen, um zu sehen, was sich geändert hat.
- Gibt es keine offenen Änderungen, diesen Schritt überspringen und das sagen.
- Achte darauf, keine Dateien zu committen, die nicht ins Projekt gehören (z. B. temporäre Dateien oder Zugangsdaten). Bist du unsicher, frag nach.
- Dateien mit `git add` hinzufügen und mit einer deutschen Commit-Nachricht committen: eine kurze Zusammenfassung in der ersten Zeile (Befehlsform, z. B. „Kategorie-Filter in der Monatsansicht ergänzen“), bei Bedarf darunter eine Leerzeile und ein paar erklärende Sätze. Stil an `git log --oneline -10` orientieren.

## 4. Pushen

- `git push -u origin <branch>`
- Scheitert der Push, abbrechen und die Fehlermeldung erklären.

## 5. Pull Request

- Prüfen, ob es für den Branch schon einen Pull Request gibt: `gh pr view --json url,state`.
- **Meldet `gh pr view` „no pull requests found“, ist das kein Fehler**, sondern heißt nur: Es gibt noch keinen. Nicht abbrechen, sondern einen anlegen (siehe unten).
- **Gibt es schon einen offenen:** keinen neuen anlegen, nur den Link nennen und sagen, dass der Push ihn aktualisiert hat.
- **Gibt es keinen (oder nur einen geschlossenen/gemergten):** neu anlegen. Titel und Beschreibung auf Deutsch. Die Beschreibung fasst alle Commits des Branches zusammen (`git log main..HEAD`) und sagt, wie man die Änderung im Browser prüfen kann. Übergib die Beschreibung per Heredoc über `--body-file -`, damit Backticks, `$` und Anführungszeichen nicht von der Shell umgedeutet werden:

  ```bash
  "/c/Program Files/GitHub CLI/gh.exe" pr create --base main --head <branch> --title "<Titel>" --body-file - <<'EOF'
  <Beschreibung, mehrzeilig>
  EOF
  ```

## Ausgabe

Zum Schluss kurz zusammenfassen:
- Testergebnis
- Commit (Nachricht) oder „nichts zu committen“
- Link zum Pull Request
