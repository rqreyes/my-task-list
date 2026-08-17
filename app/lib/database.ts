import { Pool } from "pg";

export const pool = new Pool({
  database: process.env.SQL_DATABASE,
  host: process.env.SQL_HOST,
  max: 10, // set maximum number of clients
  password: process.env.SQL_PASSWORD,
  user: process.env.SQL_USER,
});
