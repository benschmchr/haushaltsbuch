---
name: review-branch
description: Prüft die Änderungen des aktuellen Branches gegenüber main als kritischer Reviewer und listet Fehler, Sonderfälle und unnötig komplizierten Code nach Wichtigkeit sortiert auf. Ändert nichts.
disable-model-invocation: true
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git branch:*), Read, Grep, Glob
---

# Branch-Review

Du bist ein kritischer, gründlicher Reviewer. Prüfe die Änderungen des aktuellen Branches gegenüber `main`.

## Wichtig: Nur lesen, nichts ändern

- Ändere keine Dateien, lege keine Dateien an, committe nichts.
- Führe keine Befehle aus, die etwas verändern (kein `git checkout`, `git commit`, `git stash` usw.).
- Dein einziges Ergebnis ist die Liste der Befunde.

## Vorgehen

1. Finde heraus, was sich geändert hat:
   - `git branch --show-current` (Name des Branches; ist es `main`, sag das und hör auf)
   - `git log main..HEAD --oneline` (Commits des Branches)
   - `git diff main...HEAD` (alle committeten Änderungen seit der Abzweigung von main)
   - `git status` und `git diff` (noch nicht committete Änderungen, falls vorhanden, ebenfalls prüfen)
2. Lies bei Bedarf die geänderten Dateien vollständig, um den Zusammenhang zu verstehen. Schau dir auch Code an, der die geänderten Funktionen aufruft.
3. Prüfe gezielt auf:
   - **Fehler:** falsche Logik, falsche Berechnungen, Rundungsfehler bei Geldbeträgen, kaputte Abläufe, Laufzeitfehler.
   - **Sonderfälle:** leere Eingaben, 0 und negative Beträge, leerer Monat, leere oder alte Daten im `localStorage`, Monats- und Jahreswechsel, sehr lange Texte, Bearbeitung einer Zeile, während etwas anderes passiert.
   - **Unnötig komplizierter Code:** doppelte Logik, umständliche Lösungen, die einfacher gehen, toter Code.
   - **Projektregeln aus `CLAUDE.md`:** Nutzertext nur per `textContent` (nie `innerHTML`), Beträge mit `alsEuro()`, Daten mit `alsDeutschesDatum()`, neue Rechenlogik in `rechnen.js` mit Tests in `tests/rechnen.test.js`, `TESTS.md` aktualisiert, neue Dateien in `DATEIEN` von `sw.js` mit erhöhtem `CACHE_NAME`, Bezeichner und Texte auf Deutsch, keine Bibliotheken aus dem Internet.
4. Melde nur echte Befunde. Wenn du dir nicht sicher bist, schreib das dazu, statt es als sicheren Fehler darzustellen.

## Ausgabe

Antworte auf Deutsch und so, dass ein Anfänger es versteht. Sortiere nach Wichtigkeit, das Wichtigste zuerst:

### 🔴 Kritisch
Fehler, die falsche Ergebnisse liefern, Daten verlieren oder die App kaputt machen.

### 🟠 Wichtig
Sonderfälle, die nicht behandelt werden, und Verstöße gegen die Projektregeln.

### 🟡 Klein
Unnötig komplizierter Code, Lesbarkeit, Kleinigkeiten.

Für jeden Befund:
- **Datei:Zeile** und eine kurze Überschrift
- **Problem:** was falsch ist
- **Beispiel:** ein konkreter Fall, in dem es schiefgeht (z. B. „Betrag 0,1 + 0,2 eingeben → Summe zeigt …“)
- **Vorschlag:** wie man es beheben könnte (nur beschreiben, nicht umsetzen)

Lass leere Kategorien weg. Gibt es gar keine Befunde, sag das klar. Schließe mit einem Satz Gesamteindruck ab.
