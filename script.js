// Name, unter dem die Daten im Browser (localStorage) gespeichert werden
const SPEICHER_SCHLUESSEL = "haushaltsbuch-ausgaben";

// Elemente aus der HTML-Seite holen
const formular = document.getElementById("ausgabe-formular");
const betragFeld = document.getElementById("betrag");
const kategorieFeld = document.getElementById("kategorie");
const datumFeld = document.getElementById("datum");
const beschreibungFeld = document.getElementById("beschreibung");
const liste = document.getElementById("ausgaben-liste");
const tabelle = document.getElementById("ausgaben-tabelle");
const leerHinweis = document.getElementById("leer-hinweis");
const gesamtsummeAnzeige = document.getElementById("gesamtsumme");
const kategorieSummenListe = document.getElementById("kategorie-summen");
const monatAnzeige = document.getElementById("monat-anzeige");
const exportKnopf = document.getElementById("export-knopf");

// Alle Ausgaben werden in diesem Array gehalten
let ausgaben = laden();

// ID der Ausgabe, die gerade bearbeitet wird (null = keine)
let bearbeitungsId = null;

// Monat, der gerade angezeigt wird, z. B. "2026-10" – beim Start der aktuelle Monat
let gewaehlterMonat = alsIsoDatum(new Date()).slice(0, 7);

// Gespeicherte Ausgaben aus dem Browser laden
function laden() {
  const text = localStorage.getItem(SPEICHER_SCHLUESSEL);
  return text ? JSON.parse(text) : [];
}

// Aktuelle Ausgaben im Browser speichern
function speichern() {
  localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(ausgaben));
}

// Zahl als Euro-Betrag formatieren, z. B. 12.5 -> "12,50 €"
function alsEuro(zahl) {
  return zahl.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

// Datum von "2026-10-10" in "10.10.2026" umwandeln
function alsDeutschesDatum(isoDatum) {
  const [jahr, monat, tag] = isoDatum.split("-");
  return `${tag}.${monat}.${jahr}`;
}

// Datum (Date-Objekt) in "2026-10-10" umwandeln
function alsIsoDatum(datum) {
  return [
    datum.getFullYear(),
    String(datum.getMonth() + 1).padStart(2, "0"),
    String(datum.getDate()).padStart(2, "0"),
  ].join("-");
}

// Nur die Ausgaben des gewählten Monats ("2026-10-..." beginnt mit "2026-10")
function ausgabenImMonat() {
  return ausgaben.filter((a) => a.datum.startsWith(gewaehlterMonat));
}

// Einen Monat vor (schritt = 1) oder zurück (schritt = -1) blättern
function monatWechseln(schritt) {
  const [jahr, monat] = gewaehlterMonat.split("-").map(Number);
  // Date rechnet den Jahreswechsel selbst aus, z. B. Monat 13 -> Januar im nächsten Jahr
  const neu = new Date(jahr, monat - 1 + schritt, 1);
  gewaehlterMonat = alsIsoDatum(neu).slice(0, 7);
  anzeigen();
}

// Liste und Gesamtsumme neu auf die Seite zeichnen
function anzeigen() {
  liste.innerHTML = "";

  // Monatsnamen anzeigen, z. B. "Oktober 2026"
  const [jahr, monat] = gewaehlterMonat.split("-").map(Number);
  monatAnzeige.textContent = new Date(jahr, monat - 1, 1).toLocaleString("de-DE", {
    month: "long",
    year: "numeric",
  });

  const monatsAusgaben = ausgabenImMonat();

  // Neueste Ausgaben zuerst anzeigen
  const sortiert = [...monatsAusgaben].sort((a, b) => b.datum.localeCompare(a.datum));

  for (const ausgabe of sortiert) {
    // Die Ausgabe, die gerade bearbeitet wird, bekommt Eingabefelder statt Text
    if (ausgabe.id === bearbeitungsId) {
      liste.appendChild(bearbeitungsZeile(ausgabe));
      continue;
    }

    const zeile = document.createElement("tr");

    // textContent statt innerHTML, damit eingegebener Text nie als HTML ausgeführt wird
    const zellen = [
      alsDeutschesDatum(ausgabe.datum),
      ausgabe.kategorie,
      ausgabe.beschreibung,
      alsEuro(ausgabe.betrag),
    ];
    zellen.forEach((inhalt, index) => {
      const zelle = document.createElement("td");
      zelle.textContent = inhalt;
      if (index === 3) zelle.className = "rechts";
      zeile.appendChild(zelle);
    });

    // Bearbeiten- und Löschen-Knopf
    const knopfZelle = document.createElement("td");
    knopfZelle.className = "knoepfe";
    knopfZelle.appendChild(
      kleinerKnopf("✎", "Ausgabe bearbeiten", "bearbeiten", () => bearbeiten(ausgabe.id))
    );
    knopfZelle.appendChild(
      kleinerKnopf("✕", "Ausgabe löschen", "loeschen", () => loeschen(ausgabe.id))
    );
    zeile.appendChild(knopfZelle);

    liste.appendChild(zeile);
  }

  // Tabelle nur zeigen, wenn es Einträge gibt
  const keineEintraege = monatsAusgaben.length === 0;
  tabelle.hidden = keineEintraege;
  leerHinweis.hidden = !keineEintraege;
  exportKnopf.disabled = keineEintraege; // ohne Ausgaben gibt es nichts zu exportieren

  // Gesamtsumme des Monats berechnen
  const summe = monatsAusgaben.reduce((gesamt, a) => gesamt + a.betrag, 0);
  gesamtsummeAnzeige.textContent = alsEuro(summe);

  kategorieSummenAnzeigen(monatsAusgaben);
}

// Summe pro Kategorie berechnen und mit Balken unter der Gesamtsumme anzeigen
function kategorieSummenAnzeigen(monatsAusgaben) {
  // Beträge pro Kategorie zusammenzählen, z. B. { Lebensmittel: 54.2, Freizeit: 20 }
  const summen = {};
  for (const ausgabe of monatsAusgaben) {
    summen[ausgabe.kategorie] = (summen[ausgabe.kategorie] || 0) + ausgabe.betrag;
  }

  kategorieSummenListe.innerHTML = "";

  // Kategorien mit den höchsten Ausgaben zuerst
  const sortiert = Object.entries(summen).sort((a, b) => b[1] - a[1]);

  // Die größte Kategorie steht zuerst – ihr Balken ist 100 % breit
  const groessterBetrag = sortiert.length > 0 ? sortiert[0][1] : 0;

  for (const [kategorie, betrag] of sortiert) {
    const eintrag = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = kategorie;

    const wert = document.createElement("span");
    wert.textContent = alsEuro(betrag);

    // Balken: Breite im Verhältnis zur größten Kategorie
    const spur = document.createElement("div");
    spur.className = "balken-spur";
    const balken = document.createElement("div");
    balken.className = "balken";
    balken.style.width = (betrag / groessterBetrag) * 100 + "%";
    spur.appendChild(balken);

    eintrag.appendChild(name);
    eintrag.appendChild(wert);
    eintrag.appendChild(spur);
    kategorieSummenListe.appendChild(eintrag);
  }
}

// Ausgaben des gewählten Monats als Excel-Datei (.xlsx) herunterladen – mit der Bibliothek SheetJS (XLSX)
function alsExcelHerunterladen() {
  // Für Excel üblich: älteste Ausgabe zuerst
  const sortiert = [...ausgabenImMonat()].sort((a, b) => a.datum.localeCompare(b.datum));

  // Tabelle als Liste von Zeilen, jede Zeile ist eine Liste von Zellen
  const zeilen = [["Datum", "Kategorie", "Beschreibung", "Betrag"]];
  for (const ausgabe of sortiert) {
    // Echtes Datum statt Text, damit Excel danach sortieren kann
    const [jahr, monat, tag] = ausgabe.datum.split("-").map(Number);
    zeilen.push([new Date(jahr, monat - 1, tag), ausgabe.kategorie, ausgabe.beschreibung, ausgabe.betrag]);
  }

  // Letzte Zeile: Summe als Excel-Formel, z. B. =SUM(D2:D6)
  // (v ist der schon ausgerechnete Wert, den Excel bis zum Neuberechnen zeigt)
  const letzteZeile = sortiert.length + 1;
  const summe = sortiert.reduce((gesamt, a) => gesamt + a.betrag, 0);
  zeilen.push(["Summe", "", "", { t: "n", v: summe, f: `SUM(D2:D${letzteZeile})` }]);

  // Tabellenblatt erstellen, Datum im deutschen Format anzeigen.
  // Die Punkte brauchen ein "\" davor, sonst hält SheetJS sie für Sekundenbruchteile.
  const blatt = XLSX.utils.aoa_to_sheet(zeilen, { dateNF: "dd\\.mm\\.yyyy" });

  // Beträge (Spalte D, ab Zeile 2 bis zur Summe) als Euro anzeigen
  for (let nr = 2; nr <= letzteZeile + 1; nr++) {
    blatt["D" + nr].z = '#,##0.00 "€"';
  }

  // Spaltenbreiten (in Zeichen)
  blatt["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 30 }, { wch: 12 }];

  // Arbeitsmappe mit einem Blatt, das wie der Monat heißt, z. B. "Oktober 2026"
  const mappe = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(mappe, blatt, monatAnzeige.textContent);

  // Datei speichern, z. B. "ausgaben-2026-10.xlsx"
  XLSX.writeFile(mappe, `ausgaben-${gewaehlterMonat}.xlsx`);
}

// Kleinen Knopf mit Symbol erstellen (für Bearbeiten, Löschen, Speichern, Abbrechen)
function kleinerKnopf(symbol, titel, klasse, beiKlick) {
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.textContent = symbol;
  knopf.title = titel;
  knopf.className = "klein " + klasse;
  knopf.addEventListener("click", beiKlick);
  return knopf;
}

// Tabellenzeile mit Eingabefeldern für die Ausgabe bauen, die bearbeitet wird
function bearbeitungsZeile(ausgabe) {
  const zeile = document.createElement("tr");
  zeile.className = "wird-bearbeitet";

  // Datum mit Kalender
  const datum = document.createElement("input");
  datum.type = "date";
  datum.value = ausgabe.datum;

  // Kategorie als Dropdown – die Auswahl wird aus dem Formular oben übernommen
  const kategorie = document.createElement("select");
  for (const option of kategorieFeld.options) {
    kategorie.appendChild(new Option(option.text, option.value));
  }
  kategorie.value = ausgabe.kategorie;

  const beschreibung = document.createElement("input");
  beschreibung.type = "text";
  beschreibung.value = ausgabe.beschreibung;

  const betrag = document.createElement("input");
  betrag.type = "number";
  betrag.step = "0.01";
  betrag.min = "0.01";
  betrag.value = ausgabe.betrag;

  for (const feld of [datum, kategorie, beschreibung, betrag]) {
    const zelle = document.createElement("td");
    zelle.appendChild(feld);
    zeile.appendChild(zelle);
  }

  // Speichern übernimmt die Änderungen, Abbrechen verwirft sie
  const knopfZelle = document.createElement("td");
  knopfZelle.className = "knoepfe";
  knopfZelle.appendChild(
    kleinerKnopf("✓", "Änderungen speichern", "speichern", () => {
      const neuerBetrag = parseFloat(betrag.value);
      if (!datum.value || !(neuerBetrag > 0)) {
        alert("Bitte ein gültiges Datum und einen Betrag größer als 0 eingeben.");
        return;
      }
      ausgabe.datum = datum.value;
      ausgabe.kategorie = kategorie.value;
      ausgabe.beschreibung = beschreibung.value.trim();
      ausgabe.betrag = neuerBetrag;
      bearbeitungsId = null;
      // Zum Monat der Ausgabe springen, falls das Datum in einen anderen Monat geändert wurde
      gewaehlterMonat = ausgabe.datum.slice(0, 7);
      speichern();
      anzeigen();
    })
  );
  knopfZelle.appendChild(
    kleinerKnopf("↺", "Abbrechen", "abbrechen", () => {
      bearbeitungsId = null;
      anzeigen();
    })
  );
  zeile.appendChild(knopfZelle);

  return zeile;
}

// Bearbeitungsmodus für eine Ausgabe einschalten
function bearbeiten(id) {
  bearbeitungsId = id;
  anzeigen();
}

// Eine Ausgabe anhand ihrer ID entfernen
function loeschen(id) {
  if (!confirm("Diese Ausgabe wirklich löschen?")) return;
  ausgaben = ausgaben.filter((a) => a.id !== id);
  speichern();
  anzeigen();
}

// Wird ausgeführt, wenn das Formular abgeschickt wird
formular.addEventListener("submit", (ereignis) => {
  ereignis.preventDefault(); // verhindert, dass die Seite neu lädt

  ausgaben.push({
    id: Date.now(), // einfache eindeutige ID
    betrag: parseFloat(betragFeld.value),
    kategorie: kategorieFeld.value,
    datum: datumFeld.value,
    beschreibung: beschreibungFeld.value.trim(),
  });

  // Zum Monat der neuen Ausgabe springen, damit sie sofort sichtbar ist
  gewaehlterMonat = datumFeld.value.slice(0, 7);

  speichern();
  anzeigen();

  // Felder leeren, Datum und Kategorie bleiben für die nächste Eingabe stehen
  betragFeld.value = "";
  beschreibungFeld.value = "";
  betragFeld.focus();
});

// Pfeile zum Blättern zwischen den Monaten
document.getElementById("monat-zurueck").addEventListener("click", () => monatWechseln(-1));
document.getElementById("monat-vor").addEventListener("click", () => monatWechseln(1));

// Knopf für den Excel-Export
exportKnopf.addEventListener("click", alsExcelHerunterladen);

// Beim Start: heutiges Datum vorausfüllen und Liste anzeigen
datumFeld.value = alsIsoDatum(new Date());
anzeigen();
