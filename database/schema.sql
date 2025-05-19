-- File: database/schema.sql

-- Estensione per generare UUID (opzionale, se si preferiscono UUID invece di SERIAL per gli ID)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabella Categorie
CREATE TABLE Categorie (
    id SERIAL PRIMARY KEY,
    nome TEXT UNIQUE NOT NULL,
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aggiornamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Posizioni
CREATE TABLE Posizioni (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria_id INTEGER REFERENCES Categorie(id) ON DELETE SET NULL, -- O ON DELETE CASCADE se si vuole eliminare la posizione quando la categoria viene eliminata
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aggiornamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Articoli
CREATE TABLE Articoli (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    descrizione TEXT,
    categoria_id INTEGER REFERENCES Categorie(id) ON DELETE SET NULL,
    posizione_id INTEGER REFERENCES Posizioni(id) ON DELETE SET NULL,
    quantita INTEGER DEFAULT 1,
    prezzo_acquisto NUMERIC(10, 2),
    data_acquisto DATE,
    valore_stimato NUMERIC(10, 2),
    luogo_acquisto TEXT,
    garanzia_scadenza DATE,
    note TEXT,
    codice_barre TEXT, -- Campo per codice a barre/QR
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aggiornamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella di Giunzione per Immagini degli Articoli (Articolo_Immagini)
CREATE TABLE Articolo_Immagini (
    id SERIAL PRIMARY KEY,
    articolo_id INTEGER NOT NULL REFERENCES Articoli(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL, -- Percorso o URL dell'immagine
    descrizione_immagine TEXT,
    data_caricamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella di Giunzione per Documenti degli Articoli (Articolo_Documenti)
CREATE TABLE Articolo_Documenti (
    id SERIAL PRIMARY KEY,
    articolo_id INTEGER NOT NULL REFERENCES Articoli(id) ON DELETE CASCADE,
    document_url TEXT NOT NULL, -- Percorso o URL del documento
    nome_file TEXT NOT NULL,
    tipo_file TEXT, -- Es. 'pdf', 'doc', 'txt'
    dimensione_file INTEGER, -- In bytes
    data_caricamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger per aggiornare 'data_aggiornamento' automaticamente
-- Per Categorie
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_aggiornamento = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categorie_updated_at
BEFORE UPDATE ON Categorie
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Per Posizioni
CREATE TRIGGER update_posizioni_updated_at
BEFORE UPDATE ON Posizioni
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Per Articoli
CREATE TRIGGER update_articoli_updated_at
BEFORE UPDATE ON Articoli
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indici per miglioramento performance (esempi)
CREATE INDEX idx_articoli_nome ON Articoli(nome);
CREATE INDEX idx_articoli_categoria_id ON Articoli(categoria_id);
CREATE INDEX idx_articoli_posizione_id ON Articoli(posizione_id);
CREATE INDEX idx_posizioni_categoria_id ON Posizioni(categoria_id);

-- Inserimento di alcune categorie e posizioni di esempio (opzionale)
INSERT INTO Categorie (nome) VALUES
('Elettronica'),
('Libri'),
('Abbigliamento'),
('Cucina'),
('Attrezzi');

INSERT INTO Posizioni (nome, categoria_id) VALUES
('Salotto - Mobile TV', (SELECT id FROM Categorie WHERE nome = 'Elettronica')),
('Studio - Scaffale A', (SELECT id FROM Categorie WHERE nome = 'Libri')),
('Camera - Armadio', (SELECT id FROM Categorie WHERE nome = 'Abbigliamento')),
('Garage - Scaffale B', (SELECT id FROM Categorie WHERE nome = 'Attrezzi'));

-- Nota: Per `ON DELETE SET NULL` nelle chiavi esterne: se una Categoria o Posizione viene cancellata,
-- il campo corrispondente in Articoli diventerà NULL. Considerare `ON DELETE CASCADE` se si desidera
-- che anche gli articoli collegati vengano eliminati, o `ON DELETE RESTRICT` per impedire l'eliminazione
-- della categoria/posizione se ci sono articoli collegati. `SET NULL` è una scelta comune per
-- non perdere i dati dell'articolo ma solo il riferimento.
