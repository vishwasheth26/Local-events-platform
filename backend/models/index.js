import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import process from "process";
import configFile from "../config/config.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const db = {};
let sequelize;

// Use ENV variable or normal connection
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load model files
const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.endsWith(".js") &&
    !file.includes(".test.")
  );
});

// Import all models using ES import()
for (const file of files) {
  const modelFile = path.join(__dirname, file);

  // dynamic import (important!)
  const modelModule = await import(`file://${modelFile}`);
  const model = modelModule.default(sequelize, Sequelize.DataTypes);

  db[model.name] = model;
}

// Run associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
