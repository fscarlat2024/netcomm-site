-- cererile si intrebarile trimise de asistentii de oferta (Pilot etc.), ca sa le poata evalua NCS
CREATE TABLE IF NOT EXISTS cereri (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  oferta TEXT NOT NULL,
  sid TEXT,
  tip TEXT,
  rezumat TEXT,
  detalii TEXT,
  contact TEXT,
  intrebare TEXT,
  raspuns TEXT
);
