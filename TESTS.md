# Prüfliste

## Automatische Tests
Die Rechenlogik in `rechnen.js` (Gesamtsumme, Summen pro Kategorie, Monatsfilter, Budget in Prozent, Prüfung von Fehleingaben) wird automatisch getestet. Die Tests stehen in `tests/rechnen.test.js`.
- [ ] Ein Terminal im Projektordner öffnen und `node --test` eingeben. Am Ende steht `pass 26` und `fail 0`.
- [ ] Wenn ein Test fehlschlägt, steht dort ✖ mit dem Namen des Tests sowie dem erwarteten Wert (`expected`) und dem tatsächlichen Wert (`actual`).
- [ ] Nach jeder Änderung an `rechnen.js` die Tests erneut starten.

## Prüfung im Browser
Vor dem Test `index.html` im Browser öffnen (Doppelklick genügt) bzw. mit F5 neu laden.
- [ ] F12 → Reiter „Konsole“: Es stehen keine roten Fehlermeldungen dort.

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
- [ ] Fehleingabe: Betrag `1,234` (mehr als zwei Nachkommastellen), dann ✓: Es erscheint dieselbe Meldung.
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

## Monatsbudget
- [ ] Feld „Monatsbudget“ leer: Unter dem Feld steht kein Text und kein Balken.
- [ ] Budget `100` eintragen, im Monat 50 € Ausgaben: Text „50,00 € von 100,00 € verbraucht (50 %) – noch 50,00 € übrig“, blauer Balken halb voll.
- [ ] Ausgaben auf 80 € erhöhen: Text und Balken werden orange.
- [ ] Ausgaben auf 120 € erhöhen: Balken voll und rot, Text „… (120 %) – 20,00 € über dem Budget“ in Rot.
- [ ] Eine Ausgabe löschen oder bearbeiten: Text, Balken und Farbe passen sich sofort an.
- [ ] Mit ‹ und › blättern: Das Budget bleibt gleich, der verbrauchte Anteil gilt jeweils für den angezeigten Monat.
- [ ] Monat ohne Ausgaben: „0,00 € von 100,00 € verbraucht (0 %)“, leerer Balken.
- [ ] Ausgaben ergeben genau das Budget (z. B. 20,12 + 30,92 + 23,19 + 1,58 + 5,95 + 2,93 + 15,31 = 100 €): Text „… (100 %) – noch 0,00 € übrig“ in Orange, nicht rot.
- [ ] Eine Ausgabe mit ✎ bearbeiten, Betrag ändern, aber nicht speichern. Dann das Budget ändern: Die Bearbeitungszeile bleibt offen, der geänderte Betrag steht noch drin.
- [ ] Seite neu laden (F5): Das Budget steht noch im Feld.
- [ ] Feld leeren: Text und Balken verschwinden, auch nach F5.
- [ ] Handy-Ansicht: Feld und Text passen in den weißen Kasten.

## Monatsansicht
- [ ] Beim Öffnen steht oben der aktuelle Monat, z. B. „Oktober 2026“.
- [ ] Mit ‹ und › blättern: Liste und Summen zeigen nur den gewählten Monat.
- [ ] Von Januar mit ‹ zurückblättern: Es erscheint Dezember des Vorjahres. Von Dezember mit ›: Januar des Folgejahres.
- [ ] Eine Ausgabe mit Datum in einem anderen Monat hinzufügen: Die Ansicht springt dorthin.

## Excel-Export
- [ ] Auf „Als Excel-Datei herunterladen“ klicken: Die Datei `ausgaben-JJJJ-MM.xlsx` landet im Download-Ordner.
- [ ] Excel öffnet die Datei ohne Warnung. Das Blatt heißt wie der Monat, z. B. „Oktober 2026“.
- [ ] Es stehen nur die Ausgaben des gewählten Monats drin, die älteste oben.
- [ ] Datum im Format `TT.MM.JJJJ`, genau wie auf der Seite (nicht um einen Tag verschoben).
- [ ] Beträge im Format `12,50 €`. Die Zeile „Summe“ zeigt dieselbe Gesamtsumme wie die Seite.
- [ ] In Excel einen Betrag ändern: Die Summe rechnet sich neu.
- [ ] Umlaute stimmen, z. B. „Mobilität“.
- [ ] Beschreibung `=1+1`: In Excel steht der Text `=1+1`, nicht `2`.
- [ ] Monat ohne Ausgaben: Der Knopf ist grau und lässt sich nicht klicken.
- [ ] Ohne Internet (WLAN aus) funktioniert der Export trotzdem.

## Speichern
- [ ] Die Seite neu laden (F5): Alle Ausgaben sind noch da, auch die aus anderen Monaten.

## Handy-Ansicht
Am PC: F12 drücken, dann das Handy-Symbol (Gerätesymbolleiste) anklicken und z. B. „iPhone SE“ wählen.
- [ ] Unter 500 px Breite: Das Formular wird einspaltig.
- [ ] „Ausgaben im Monat“ zeigt jede Ausgabe als Kärtchen: oben Datum und Betrag, darunter Kategorie und Beschreibung, rechts die Knöpfe ✎ und ✕.
- [ ] Nichts ragt über den weißen Kasten hinaus, man kann die Seite nicht seitwärts schieben.
- [ ] Eine sehr lange Beschreibung ohne Leerzeichen (z. B. `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`) wird umgebrochen.
- [ ] Die Knöpfe ✎ und ✕ sind groß genug, um sie mit dem Finger sicher zu treffen.
- [ ] Auf ✎ tippen: Die Felder stehen untereinander (Datum und Betrag nebeneinander), ✓ und ↺ darunter.
- [ ] Auf dem iPhone: Beim Antippen eines Feldes zoomt die Seite nicht hinein.
- [ ] Am breiten Bildschirm sieht die Tabelle aus wie vorher.

## Web-App (installieren und offline)
Der Service Worker funktioniert nicht beim direkten Öffnen von `index.html` (`file://`). Zum Testen im Projektordner `python -m http.server 8000` starten und `http://localhost:8000` öffnen.
- [ ] F12 → Reiter „Application“ (Anwendung) → „Manifest“: Name „Haushaltsbuch“ und das blaue €-Symbol werden angezeigt, keine Fehler.
- [ ] Unter „Service workers“ steht `sw.js` als „activated and is running“.
- [ ] In der Adressleiste erscheint ein Installieren-Symbol. Nach dem Installieren öffnet sich die App in einem eigenen Fenster ohne Adressleiste, mit dem €-Symbol.
- [ ] Offline: In F12 → „Network“ den Haken „Offline“ setzen und neu laden (F5): Die App startet trotzdem, die Ausgaben sind da.
- [ ] Offline eine Ausgabe hinzufügen und den Excel-Export benutzen: Beides funktioniert.
- [ ] Auf dem Handy (Seite muss über https:// erreichbar sein): Android/Chrome „Zum Startbildschirm hinzufügen“ bzw. „App installieren“, iPhone/Safari „Teilen“ → „Zum Home-Bildschirm“. Das €-Symbol erscheint auf dem Startbildschirm.
- [ ] Im Flugmodus die App vom Startbildschirm öffnen: Sie startet.
