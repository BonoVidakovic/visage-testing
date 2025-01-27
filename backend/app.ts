import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from 'dotenv';

import authRouter from "./routes/auth";
import moviesRouter from "./routes/movies";

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: process.env.DOMAIN}))

app.use('/auth', authRouter);
app.use('/movies', moviesRouter);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
