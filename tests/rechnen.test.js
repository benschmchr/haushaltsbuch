// Automatische Tests für die Rechenlogik in rechnen.js.
// Starten im Projektordner mit:  node --test

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const {
  summeBerechnen,
  nachMonatFiltern,
  kategorieSummen,
  budgetAuswerten,
  eingabeGueltig,
} = require("../rechnen.js");

// Kleine Hilfe, um schnell eine Test-Ausgabe zu bauen
function ausgabe(betrag, kategorie = "Sonstiges", datum = "2026-10-10") {
  return { id: 1, betrag, kategorie, datum, beschreibung: "" };
}

describe("Gesamtsumme", () => {
  test("leere Liste ergibt 0", () => {
    assert.equal(summeBerechnen([]), 0);
  });

  test("zählt alle Beträge zusammen", () => {
    assert.equal(summeBerechnen([ausgabe(12.5), ausgabe(7.5), ausgabe(30)]), 50);
  });

  test("0,10 + 0,20 ergibt genau 0,30 (auf Cent gerundet)", () => {
    assert.equal(summeBerechnen([ausgabe(0.1), ausgabe(0.2)]), 0.3);
  });

  test("Beispiel aus TESTS.md ergibt genau 100", () => {
    const betraege = [20.12, 30.92, 23.19, 1.58, 5.95, 2.93, 15.31];
    assert.equal(summeBerechnen(betraege.map((b) => ausgabe(b))), 100);
  });
});

describe("Summen pro Kategorie", () => {
  test("leere Liste ergibt keine Kategorien", () => {
    assert.deepEqual(kategorieSummen([]), []);
  });

  test("zählt pro Kategorie zusammen, höchste zuerst", () => {
    const liste = [
      ausgabe(20, "Freizeit"),
      ausgabe(30, "Lebensmittel"),
      ausgabe(5, "Mobilität"),
      ausgabe(24.2, "Lebensmittel"),
    ];
    assert.deepEqual(kategorieSummen(liste), [
      ["Lebensmittel", 54.2],
      ["Freizeit", 20],
      ["Mobilität", 5],
    ]);
  });

  test("rundet jede Kategorie auf Cent", () => {
    const liste = [ausgabe(0.1, "Freizeit"), ausgabe(0.2, "Freizeit")];
    assert.deepEqual(kategorieSummen(liste), [["Freizeit", 0.3]]);
  });
});

describe("Monatsfilter", () => {
  const liste = [
    ausgabe(1, "Sonstiges", "2026-09-30"),
    ausgabe(2, "Sonstiges", "2026-10-01"),
    ausgabe(3, "Sonstiges", "2026-10-31"),
    ausgabe(4, "Sonstiges", "2026-11-01"),
    ausgabe(5, "Sonstiges", "2025-10-15"),
  ];

  test("liefert nur Ausgaben des gewählten Monats, inklusive erstem und letztem Tag", () => {
    const ergebnis = nachMonatFiltern(liste, "2026-10");
    assert.deepEqual(ergebnis.map((a) => a.betrag), [2, 3]);
  });

  test("gleicher Monat in einem anderen Jahr zählt nicht mit", () => {
    const ergebnis = nachMonatFiltern(liste, "2025-10");
    assert.deepEqual(ergebnis.map((a) => a.betrag), [5]);
  });

  test("Monat ohne Ausgaben ergibt eine leere Liste", () => {
    assert.deepEqual(nachMonatFiltern(liste, "2026-12"), []);
  });

  test("leere Liste ergibt eine leere Liste", () => {
    assert.deepEqual(nachMonatFiltern([], "2026-10"), []);
  });
});

describe("Budgetverbrauch in Prozent", () => {
  test("ohne Budget (0) gibt es keine Auswertung", () => {
    assert.equal(budgetAuswerten(50, 0), null);
  });

  test("50 von 100 € sind 50 % und normal (blau)", () => {
    assert.deepEqual(budgetAuswerten(50, 100), { anteil: 0.5, prozent: 50, stufe: "normal" });
  });

  test("79 % ist noch normal", () => {
    assert.equal(budgetAuswerten(79, 100).stufe, "normal");
  });

  test("genau 80 % ist eine Warnung (orange)", () => {
    assert.equal(budgetAuswerten(80, 100).stufe, "warnung");
  });

  test("genau 100 % ist eine Warnung, aber noch nicht überschritten", () => {
    const auswertung = budgetAuswerten(100, 100);
    assert.equal(auswertung.prozent, 100);
    assert.equal(auswertung.stufe, "warnung");
  });

  test("120 % ist überschritten (rot)", () => {
    const auswertung = budgetAuswerten(120, 100);
    assert.equal(auswertung.prozent, 120);
    assert.equal(auswertung.stufe, "ueberschritten");
  });

  test("ohne Ausgaben sind 0 % verbraucht", () => {
    assert.equal(budgetAuswerten(0, 100).prozent, 0);
  });

  test("Prozent werden auf ganze Zahlen gerundet", () => {
    assert.equal(budgetAuswerten(33.333, 100).prozent, 33);
  });
});

describe("Prüfung von Fehleingaben", () => {
  const datum = "2026-10-10";

  test("normale Beträge sind gültig", () => {
    assert.equal(eingabeGueltig(12.5, datum), true);
    assert.equal(eingabeGueltig(0.01, datum), true);
    assert.equal(eingabeGueltig(0.29, datum), true); // 0,29 * 100 ist in JavaScript nicht genau 29
  });

  test("Betrag 0 oder negativ ist ungültig", () => {
    assert.equal(eingabeGueltig(0, datum), false);
    assert.equal(eingabeGueltig(-5, datum), false);
  });

  test("leeres Betragsfeld (NaN) und unendlich sind ungültig", () => {
    assert.equal(eingabeGueltig(parseFloat(""), datum), false);
    assert.equal(eingabeGueltig(Infinity, datum), false);
  });

  test("mehr als zwei Nachkommastellen sind ungültig", () => {
    assert.equal(eingabeGueltig(1.234, datum), false);
  });

  test("leeres oder falsch geschriebenes Datum ist ungültig", () => {
    assert.equal(eingabeGueltig(10, ""), false);
    assert.equal(eingabeGueltig(10, "10.10.2026"), false);
  });

  test("Tage, die es nicht gibt, sind ungültig", () => {
    assert.equal(eingabeGueltig(10, "2026-02-30"), false);
    assert.equal(eingabeGueltig(10, "2026-13-01"), false);
  });

  test("29. Februar im Schaltjahr ist gültig, sonst nicht", () => {
    assert.equal(eingabeGueltig(10, "2024-02-29"), true);
    assert.equal(eingabeGueltig(10, "2026-02-29"), false);
  });
});
