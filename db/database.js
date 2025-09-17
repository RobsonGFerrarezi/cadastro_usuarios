// db/database.js

// Importa a biblioteca do SQLite, usando a nova API assíncrona.
import * as SQLite from 'expo-sqlite';

/**
 * Inicializa o banco de dados.
 * Cria a tabela 'users' com as colunas necessárias se ela ainda não existir.
 * @returns {Promise<SQLite.SQLiteDatabase>} - Uma promessa que resolve com a instância do banco de dados pronta para uso.
 */
export async function initDb() {
  const db = await SQLite.openDatabaseAsync('users.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nome TEXT NOT NULL, 
      email TEXT UNIQUE, 
      telefone TEXT, 
      password TEXT NOT NULL
    );
  `);
  return db;
}

/**
 * Insere um novo usuário na tabela.
 * @param {SQLite.SQLiteDatabase} db - A instância do banco.
 * @returns {Promise<SQLite.SQLiteRunResult>}
 */
export async function addUser(db, nome, email, telefone, password) {
  return await db.runAsync(
    'INSERT INTO users (nome, email, telefone, password) VALUES (?, ?, ?, ?);',
    [nome, email, telefone, password]
  );
}

/**
 * Busca todos os usuários da tabela.
 * @param {SQLite.SQLiteDatabase} db - A instância do banco.
 * @returns {Promise<Array<object>>} - Uma promessa que resolve com um array de objetos de usuário.
 */
export async function fetchAllUsers(db) {
  return await db.getAllAsync('SELECT * FROM users;');
}

/**
 * Busca um único usuário pelo ID.
 * @param {SQLite.SQLiteDatabase} db - A instância do banco.
 * @param {number} id - O ID do usuário a ser buscado.
 * @returns {Promise<object>} - Uma promessa que resolve com o objeto do usuário encontrado.
 */
export async function fetchUserById(db, id) {
  return await db.getFirstAsync('SELECT * FROM users WHERE id = ?;', [id]);
}

/**
 * Atualiza os dados de um usuário (nome, email, telefone).
 * @param {SQLite.SQLiteDatabase} db - A instância do banco.
 */
export async function updateUser(db, id, nome, email, telefone) {
  return await db.runAsync(
    'UPDATE users SET nome = ?, email = ?, telefone = ? WHERE id = ?;',
    [nome, email, telefone, id]
  );
}

/**
 * Atualiza a senha de um usuário.
 * @param {SQLite.SQLiteDatabase} db - A instância do banco.
 */
export async function updateUserPassword(db, id, password) {
  return await db.runAsync('UPDATE users SET password = ? WHERE id = ?;', [password, id]);
}

/**
 * Deleta um usuário da tabela.
 * @param {SQLite.SQLiteDatabase} db - A instância do banco.
 */
export async function deleteUser(db, id) {
  return await db.runAsync('DELETE FROM users WHERE id = ?;', [id]);
}