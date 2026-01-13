import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connections = {
  mainDatabase: mongoose.createConnection(process.env.MAIN_DB_URL),
};

for (const [name, conn] of Object.entries(connections)) {
  conn.on("connected", () => {});

  conn.on("error", (err) => {
    console.error(`${name} failed to connect:`, err.message);
  });

  conn.on("disconnected", () => {
    console.warn(`${name} disconnected`);
  });
}

export const { mainDatabase } = connections;
