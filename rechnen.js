// Rechenlogik des Haushaltsbuchs: nur Berechnungen, keine Anzeige.
// Diese Datei benutzt die Seite (index.html) und die automatischen Tests (tests/rechnen.test.js).

// Summe der Beträge, auf ganze Cent gerundet.
// Ohne Runden rechnet JavaScript z. B. 0,1 + 0,2 = 0,30000000000000004.
function summeBerechnen(liste) {
  const summe = liste.reduce((gesamt, a) => gesamt + a.betrag, 0);
  return Math.round(summe * 100) / 100;
}

// Nur die Ausgaben eines Monats, z. B. monat = "2026-10" ("2026-10-15" gehört dazu)
function nachMonatFiltern(liste, monat) {
  return liste.filter((a) => a.datum.slice(0, 7) === monat);
}

// Summe pro Kategorie, höchste zuerst, z. B. [["Lebensmittel", 54.2], ["Freizeit", 20]]
function kategorieSummen(liste) {
  // Beträge pro Kategorie zusammenzählen, z. B. { Lebensmittel: 54.2, Freizeit: 20 }
  const summen = {};
  for (const ausgabe of liste) {
    summen[ausgabe.kategorie] = (summen[ausgabe.kategorie] || 0) + ausgabe.betrag;
  }

  return Object.entries(summen)
    .map(([kategorie, betrag]) => [kategorie, Math.round(betrag * 100) / 100])
    .sort((a, b) => b[1] - a[1]);
}

// Wie viel vom Budget ist verbraucht? Ohne Budget (0 oder leer) gibt es null zurück.
// stufe: "normal" (blau), "warnung" (orange, ab 80 %) oder "ueberschritten" (rot, über 100 %)
function budgetAuswerten(summe, budget) {
  if (!(budget > 0)) return null;

  // Anteil als Zahl: 0.5 = 50 %, 1 = 100 %, 1.2 = 120 %
  const anteil = summe / budget;
  const prozent = Math.round(anteil * 100);

  let stufe = "normal";
  if (anteil > 1) stufe = "ueberschritten";
  else if (anteil >= 0.8) stufe = "warnung";

  return { anteil, prozent, stufe };
}

// Prüft eine Eingabe: Betrag größer als 0 mit höchstens 2 Nachkommastellen
// und ein echtes Datum im Format "2026-10-10"
function eingabeGueltig(betrag, datum) {
  if (!Number.isFinite(betrag) || betrag <= 0) return false;

  // Höchstens 2 Nachkommastellen: betrag * 100 muss (fast) eine ganze Zahl sein.
  // "Fast", weil z. B. 0,29 * 100 in JavaScript 28,999999999999996 ergibt.
  const cent = betrag * 100;
  if (Math.abs(cent - Math.round(cent)) > 1e-6) return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) return false;

  // Echtes Datum? Date macht aus dem 30.02. den 02.03. – dann stimmt der Tag nicht mehr.
  const [jahr, monat, tag] = datum.split("-").map(Number);
  const probe = new Date(jahr, monat - 1, tag);
  return probe.getFullYear() === jahr && probe.getMonth() === monat - 1 && probe.getDate() === tag;
}

// Nur für die automatischen Tests in Node.js – im Browser gibt es "module" nicht
if (typeof module !== "undefined") {
  module.exports = { summeBerechnen, nachMonatFiltern, kategorieSummen, budgetAuswerten, eingabeGueltig };
}
