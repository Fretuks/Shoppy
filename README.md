# Shoppy

Smart Shopping Companion

## App-Idee

Shoppy ist eine mobile Einkaufshilfe für den Supermarkt. Nutzerinnen und Nutzer scannen Produkte per Smartphone-Kamera oder Barcode, erhalten direkt eine persönliche Einschätzung und treffen dadurch bessere Kaufentscheidungen.

Die Bewertung berücksichtigt Zutaten, Preis, Nachhaltigkeitsmerkmale und individuelle Ziele wie Allergien, Ernährung, Budget und Nachhaltigkeit.

## Zielgruppe

Die App richtet sich an Privatpersonen, die im Supermarkt schnell bessere Kaufentscheidungen treffen möchten. Besonders relevant ist Shoppy für Menschen mit Allergien oder Unverträglichkeiten, ernährungsbewusste Käuferinnen und Käufer, Studierende und Familien mit Budgetfokus sowie Konsumentinnen und Konsumenten mit Nachhaltigkeitsanspruch.

## Wichtigste Funktionen

- Produkte per Barcode-Scan erfassen
- Produktdaten direkt im Laden auswerten
- Persönliche Empfehlung anzeigen: kaufen, prüfen oder meiden
- Nutzerprofil mit Allergien, Ernährungszielen, Budget und Nachhaltigkeitspräferenzen
- Kurze Begründung zur Bewertung und mögliche Alternativhinweise
- Später geplant: erweiterte Profile, Budgettracking, Nachhaltigkeitsfilter und Rezeptvorschläge

## One-Pager

Der One-Pager aus Aufgabe 6.1 beschreibt das Go-to-Market-Konzept:

- Projekt: Smart Shopping Companion - Mobile App mit React Native
- Kernidee: Produkte im Supermarkt per Smartphone scannen, direkt bewerten und bessere Kaufentscheidungen treffen
- Unique Value Proposition: Produktdaten werden direkt am Regal in eine klare persönliche Empfehlung übersetzt
- Preisstrategie: Freemium mit kostenlosen Basisfunktionen und optionalen Premium-Funktionen
- Distribution: Apple App Store, Google Play Store und zusätzliche Sichtbarkeit über QR-Codes, Hochschulen, Fitnessstudios, Nachhaltigkeits-Communities und lokale Supermärkte

## Geplanter Tech-Stack

- Expo
- React Native
- JavaScript
- Smartphone-Kamera und Barcode-Scanner
- Lokale Speicherung persönlicher Präferenzen
- GitHub oder GitLab für Versionsverwaltung und Abgabe

## Ordnerstruktur

```text
Shoppy/
|-- assets/
|-- src/
|   |-- assets/
|   |-- components/
|   |   `-- PrimaryButton.js
|   `-- screens/
|       `-- HomeScreen.js
|-- App.js
|-- app.json
|-- babel.config.js
|-- package.json
`-- README.md
```

## Beispiel-Screen

Die App enthält aktuell einen einfachen Startbildschirm mit Titel, kurzem App-Versprechen, Button und Status-Text. Der Screen dient als Grundlage für die spätere Scanner- und Bewertungsfunktion.

## Runbook

Projekt installieren:

```bash
npm install
```

Projekt starten:

```bash
npm start
```

Alternativ direkt mit Expo:

```bash
npx expo start
```

Danach kann die App mit Expo Go auf einem Smartphone oder in einem Emulator gestartet werden.

## Repository teilen

Repository-Link für den Kursleiter:

```text
https://github.com/Fretuks/Shoppy
```
