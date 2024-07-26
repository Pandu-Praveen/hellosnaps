import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import WorkSpaceModel from "./WorkSpaceModel.js";
import User from "./UserModel.js";
import { pySnap } from "../utils/pysnap.js";

const QueueModel = sequelize.define("Queue", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  workspace: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: WorkSpaceModel,
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("queued", "running", "failed", "completed"),
    allowNull: false,
  },
  user: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: "id",
    },
    allowNull: true,
    onDelete: "SET NULL",
  },
});

QueueModel.sync({ alter: true });

QueueModel.afterCreate(pySnap);
QueueModel.afterUpdate(pySnap);

WorkSpaceModel.hasMany(QueueModel, { foreignKey: "workspace" });

export default QueueModel;
