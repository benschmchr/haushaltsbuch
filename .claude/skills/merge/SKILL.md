---
name: merge
description: Zeigt Titel und Änderungsumfang des Pull Requests des aktuellen Branches, fragt nach Bestätigung, merged ihn dann, löscht den Branch auf GitHub und lokal und holt den aktuellen Stand von main.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git fetch:*), Read
---

# Pull Request mergen

Antworte auf Deutsch und so, dass ein Anfänger es versteht. Arbeite die Schritte der Reihe nach ab und hör sofort auf, wenn ein Schritt scheitert.

Die GitHub CLI liegt nicht im PATH. Rufe sie über den vollen Pfad auf: im Bash-Tool `"/c/Program Files/GitHub CLI/gh.exe"`, in PowerShell `& "C:\Program Files\GitHub CLI\gh.exe"`.

## 1. Vorher prüfen

- `git branch --show-current`. Ist es `main`, abbrechen: Es gibt keinen Branch, dessen Pull Request man mergen könnte.
- `git status`. Gibt es noch nicht committete Änderungen, abbrechen und auf `/pull-request` hinweisen. Sonst gingen sie beim Löschen des Branches verloren.
- `git fetch origin` und prüfen, ob lokale Commits noch nicht gepusht sind (`git log origin/<branch>..HEAD --oneline`). Falls ja, abbrechen und auf `/pull-request` hinweisen.

## 2. Pull Request anzeigen

- `gh pr view --json number,title,url,state,mergeable,additions,deletions,changedFiles,files,commits`
- Gibt es keinen Pull Request oder ist er nicht offen (`state` ≠ `OPEN`), abbrechen und das sagen.
- Zeige übersichtlich:
  - Nummer, Titel und Link
  - Änderungsumfang: Anzahl geänderter Dateien, Zeilen hinzugefügt (+) und entfernt (−)
  - Liste der geänderten Dateien mit ihren +/−-Zeilen
  - Anzahl der Commits
- Ist `mergeable` `CONFLICTING`, sag das: Es gibt Konflikte mit `main`, die zuerst gelöst werden müssen. Dann abbrechen.

## 3. Bestätigung einholen

- Frage mit dem AskUserQuestion-Tool, ob der Pull Request jetzt gemergt werden soll (Optionen: „Ja, mergen“ / „Nein, abbrechen“).
- **Ohne ausdrückliches „Ja“ nichts weiter tun.** Bei „Nein“ oder einer anderen Antwort abbrechen.

## 4. Mergen und aufräumen

1. `gh pr merge <nummer> --merge --delete-branch`
   (`--merge` erzeugt einen Merge-Commit wie bei den bisherigen Pull Requests; `--delete-branch` löscht den Branch auf GitHub und lokal und wechselt zu `main`.)
2. `git checkout main` (falls noch nicht auf `main`)
3. `git pull` (aktuellen Stand von GitHub holen)
4. Prüfen, ob der Branch weg ist:
   - lokal: `git branch --list <branch>`. Existiert er noch, mit `git branch -d <branch>` löschen.
   - auf GitHub: `git fetch --prune` und `git branch -r --list origin/<branch>`. Existiert er noch, mit `git push origin --delete <branch>` löschen.

## Ausgabe

Zum Schluss kurz zusammenfassen:
- welcher Pull Request gemergt wurde (Nummer, Titel)
- dass der Branch auf GitHub und lokal gelöscht ist
- dass du jetzt auf `main` mit dem aktuellen Stand bist (letzter Commit aus `git log --oneline -1`)
