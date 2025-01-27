import postgres from 'postgres'
import dotenv from "dotenv";

dotenv.config();

const sql = postgres({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
});

export default sql;