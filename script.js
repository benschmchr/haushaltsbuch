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

// Alle Ausgaben werden in diesem Array gehalten
let ausgaben = laden();

// ID der Ausgabe, die gerade bearbeitet wird (null = keine)
let bearbeitungsId = null;

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

// Liste und Gesamtsumme neu auf die Seite zeichnen
function anzeigen() {
  liste.innerHTML = "";

  // Neueste Ausgaben zuerst anzeigen
  const sortiert = [...ausgaben].sort((a, b) => b.datum.localeCompare(a.datum));

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
  const keineEintraege = ausgaben.length === 0;
  tabelle.hidden = keineEintraege;
  leerHinweis.hidden = !keineEintraege;

  // Gesamtsumme berechnen
  const summe = ausgaben.reduce((gesamt, a) => gesamt + a.betrag, 0);
  gesamtsummeAnzeige.textContent = alsEuro(summe);

  kategorieSummenAnzeigen();
}

// Summe pro Kategorie berechnen und unter der Gesamtsumme anzeigen
function kategorieSummenAnzeigen() {
  // Beträge pro Kategorie zusammenzählen, z. B. { Lebensmittel: 54.2, Freizeit: 20 }
  const summen = {};
  for (const ausgabe of ausgaben) {
    summen[ausgabe.kategorie] = (summen[ausgabe.kategorie] || 0) + ausgabe.betrag;
  }

  kategorieSummenListe.innerHTML = "";

  // Kategorien mit den höchsten Ausgaben zuerst
  const sortiert = Object.entries(summen).sort((a, b) => b[1] - a[1]);

  for (const [kategorie, betrag] of sortiert) {
    const eintrag = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = kategorie;

    const wert = document.createElement("span");
    wert.textContent = alsEuro(betrag);

    eintrag.appendChild(name);
    eintrag.appendChild(wert);
    kategorieSummenListe.appendChild(eintrag);
  }
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

  speichern();
  anzeigen();

  // Felder leeren, Datum und Kategorie bleiben für die nächste Eingabe stehen
  betragFeld.value = "";
  beschreibungFeld.value = "";
  betragFeld.focus();
});

// Beim Start: heutiges Datum vorausfüllen und Liste anzeigen
const heute = new Date();
datumFeld.value = [
  heute.getFullYear(),
  String(heute.getMonth() + 1).padStart(2, "0"),
  String(heute.getDate()).padStart(2, "0"),
].join("-");
anzeigen();
