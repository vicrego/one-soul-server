const { Pool } = require("pg");
require("dotenv").config();
const { neon } = require('@neondatabase/serverless');
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`);

const pool = new Pool({
  connectionString: sql,
  ssl: {
    rejectUnauthorized: false,
  },
});


async function getCourses() {
    const result = await sql`SELECT * FROM courses`;
    return result;
};

async function getChapters() {
  const result = await sql`SELECT * FROM chapters`;
  return result;
};

async function getTopics() {
  const result = await sql`SELECT * FROM topics`;
  return result;
};

async function getChallengesChapter() {
  const result = await sql`SELECT * FROM challenges_chapter`;
  return result;
};


async function getChallengesFree() {
  const result = await sql`SELECT * FROM challenges_free`;
  return result;
};

async function getChallenges() {
  const result = await sql`SELECT * FROM challenges`;
  return result;
};


/*
const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = request.query.id;
  pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { name, email } = request.body;
  // Descritpion for this syntax below
  pool.query(
    `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id`,
    [name, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = request.query.id;
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = request.query.id;

  pool.query(`DELETE FROM users WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};*/

module.exports = {
  /*getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,*/
  getCourses,
  getChapters,
  getTopics,
  getChallengesChapter,
  getChallengesFree,
  getChallenges
};