import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import User from "./UserModel.js";

const WorkSpaceModel = sequelize.define("WorkSpaces", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shared: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  email: {
    type: DataTypes.ARRAY(DataTypes.STRING(1000)),
    allowNull: true,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "SET NULL",
  },
});

WorkSpaceModel.sync({ alter: true });

export default WorkSpaceModel;
