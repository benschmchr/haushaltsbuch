# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Haushaltsbuch is a German-language expense tracker built with plain HTML, CSS and vanilla JavaScript: `index.html`, `style.css`, `rechnen.js`, `script.js`. There is no build step, package manager or linter. To run it, open `index.html` in a browser (double-click / `file://` must keep working). Automated tests: run `node --test` in the project folder (Node's built-in runner, no dependencies); they live in `tests/*.test.js`. The only library is SheetJS 0.20.3 (`lib/xlsx.full.min.js`, global `XLSX`), stored locally and used for the Excel export.

## Architecture

- **Rechenlogik (`rechnen.js`):** Pure functions without DOM or `localStorage` (`summeBerechnen`, `nachMonatFiltern`, `kategorieSummen`, `budgetAuswerten`, `eingabeGueltig`). It is a classic script loaded before `script.js`, not an ES module, because modules don't load under `file://`. A `typeof module` guard at the end exports the functions for Node. Put new calculations here and test them in `tests/rechnen.test.js`.

- **State and persistence:** All expenses live in the global `ausgaben` array in `script.js`. Each expense is `{ id, betrag, kategorie, datum, beschreibung }`, where `id` is `Date.now()` and `datum` is an ISO `YYYY-MM-DD` string. `speichern()` writes the array to `localStorage` under the key `haushaltsbuch-ausgaben`, and `laden()` reads it back. There is no backend.
- **Render loop:** Every change follows the same pattern: mutate `ausgaben`, call `speichern()`, then call `anzeigen()`. `anzeigen()` rebuilds the whole table and the totals from scratch, and calls `kategorieSummenAnzeigen()` for the per-category totals. No DOM is updated incrementally.
- **Month view:** `gewaehlterMonat` (`"YYYY-MM"`) filters what `anzeigen()` shows via `ausgabenImMonat()`. All expenses are still stored. Adding or editing an expense jumps the view to that expense's month.
- **Inline editing:** `bearbeitungsId` holds the id of the row being edited. When `anzeigen()` reaches that row, it renders `bearbeitungsZeile()` (input fields) in place of the normal row.
- **Excel export:** `alsExcelHerunterladen()` builds an `.xlsx` from `ausgabenImMonat()` with SheetJS: real date cells, amounts as numbers in euro format, and a closing `SUM` formula row. The button `#export-knopf` is disabled when the month is empty.
- **Mobile layout:** Below 500px the table turns into one card per expense via CSS grid areas. The cells get their classes from `ZELLEN_KLASSEN` in `script.js`; normal and edit rows both use it.
- **Web app (PWA):** `manifest.webmanifest`, icons in `icons/`, and the service worker `sw.js` (network first, cache as offline fallback). When adding a file the app needs, add it to `DATEIEN` in `sw.js` and bump `CACHE_NAME`. The service worker only runs over http(s), not `file://`.
- **Categories:** The categories are defined only once, as `<option>`s of `#kategorie` in `index.html`. The edit row copies its options from that select. To add or rename a category, change only the HTML.

## Regeln

- Antworte auf Deutsch und erkläre für einen Anfänger.
- Commit-Nachrichten auf Deutsch.
- Für jede Aufgabe einen eigenen Branch mit sprechendem Namen anlegen (z. B. `kategorie-filter`), nie direkt auf `main` committen.
- Nur HTML, CSS und JavaScript, keine Frameworks. Externe Bibliotheken nur nach Rückfrage und nur als lokale Datei im Ordner `lib/`, nie aus dem Internet laden.
- Kleine Schritte: Nach jeder Änderung sagen, wie man sie im Browser prüfen kann.
- Bei jeder neuen oder geänderten Funktion die `TESTS.md` mit aktualisieren.

## Conventions

- All identifiers, comments and UI text are in German, e.g. `betragFeld`, `alsEuro`, `.karte`. Write ASCII in identifiers (`loeschen`, `knoepfe`) and real umlauts in UI text.
- Comments are short German explanations aimed at beginners. Keep that style.
- Set user-entered text with `textContent`, never `innerHTML`, to prevent XSS.
- Format amounts with `alsEuro()` (`de-DE`/EUR) and dates with `alsDeutschesDatum()`.
