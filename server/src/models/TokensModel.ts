import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import User from "./UserModel.js";

const Tokens = sequelize.define("Tokens", {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokenType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokenValue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Tokens.belongsTo(User, { foreignKey: "user", onDelete: "CASCADE" });
Tokens.sync({ alter: true });

export default Tokens;
