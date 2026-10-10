# Prüfliste

Vor dem Test `index.html` im Browser öffnen bzw. mit F5 neu laden.

## Ausgabe hinzufügen
- [ ] Beim Öffnen steht im Feld „Datum“ das heutige Datum.
- [ ] Betrag, Kategorie und Beschreibung ausfüllen und auf „Hinzufügen“ klicken: Die Ausgabe erscheint in der Liste.
- [ ] Nach dem Hinzufügen sind Betrag und Beschreibung leer, Datum und Kategorie bleiben stehen, und der Cursor steht im Feld „Betrag“.
- [ ] Ohne Beschreibung hinzufügen: Das geht, die Spalte bleibt leer.

## Fehleingaben im Formular
- [ ] Betrag leer lassen: Der Browser meldet ein Pflichtfeld, es wird nichts hinzugefügt.
- [ ] Betrag `0` oder `-5`: Der Browser lehnt ab, weil der Betrag mindestens 0,01 sein muss.
- [ ] Betrag `1,234` (mehr als zwei Nachkommastellen): Der Browser lehnt ab.
- [ ] Datum löschen: Der Browser meldet ein Pflichtfeld.
- [ ] Als Beschreibung `<b>Test</b>` eingeben: In der Liste steht der Text genau so, er wird nicht fett. Das ist der Schutz gegen eingeschleusten HTML-Code.

## Liste
- [ ] Die neuesten Ausgaben stehen oben.
- [ ] Datum im Format `TT.MM.JJJJ`, Betrag als `12,50 €`.
- [ ] Ohne Ausgaben im Monat: Statt der Tabelle steht „Keine Ausgaben in diesem Monat.“

## Bearbeiten (✎)
- [ ] Auf ✎ klicken: Die Zeile wird blau und zeigt Eingabefelder mit den bisherigen Werten.
- [ ] Werte ändern und auf ✓ klicken: Die Änderung wird übernommen.
- [ ] Werte ändern und auf ↺ klicken: Die Änderung wird verworfen.
- [ ] Fehleingabe: Betrag `0` oder leer, dann ✓: Es erscheint die Meldung „Bitte ein gültiges Datum und einen Betrag größer als 0 eingeben.“, und nichts wird geändert.
- [ ] Fehleingabe: Datum löschen, dann ✓: Es erscheint dieselbe Meldung.
- [ ] Das Datum in einen anderen Monat ändern, dann ✓: Die Ansicht springt zu diesem Monat.

## Löschen (✕)
- [ ] Auf ✕ klicken, dann „Abbrechen“: Die Ausgabe bleibt.
- [ ] Auf ✕ klicken, dann „OK“: Die Ausgabe verschwindet, und die Summen passen sich an.

## Summen
- [ ] Die Gesamtsumme ist die Summe aller Ausgaben des gewählten Monats.
- [ ] Die Kategoriesummen stimmen, die höchste steht oben.
- [ ] Ohne Ausgaben im Monat: Die Gesamtsumme ist `0,00 €`, und es gibt keine Kategoriesummen.

## Balken
- [ ] Die größte Kategorie hat einen vollen Balken.
- [ ] Beispiel: 50 € Lebensmittel und 20 € Freizeit. Der Freizeit-Balken ist etwa 40 % so lang.

## Monatsansicht
- [ ] Beim Öffnen steht oben der aktuelle Monat, z. B. „Oktober 2026“.
- [ ] Mit ‹ und › blättern: Liste und Summen zeigen nur den gewählten Monat.
- [ ] Von Januar mit ‹ zurückblättern: Es erscheint Dezember des Vorjahres. Von Dezember mit ›: Januar des Folgejahres.
- [ ] Eine Ausgabe mit Datum in einem anderen Monat hinzufügen: Die Ansicht springt dorthin.

## Speichern
- [ ] Die Seite neu laden (F5): Alle Ausgaben sind noch da, auch die aus anderen Monaten.

## Handy-Ansicht
- [ ] Das Browserfenster schmal ziehen, unter 500 px: Das Formular wird einspaltig.
