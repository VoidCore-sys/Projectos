'use strict';
/** Borra la base de datos local para volver a cargar los datos iniciales. */
const fs = require('fs');
const path = require('path');
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'biblioteca.db');
for (const f of [DB_PATH, DB_PATH + '-wal', DB_PATH + '-shm']) if (fs.existsSync(f)) fs.unlinkSync(f);
console.log('Base de datos eliminada. Ejecutá "npm start" para crearla de nuevo.');
