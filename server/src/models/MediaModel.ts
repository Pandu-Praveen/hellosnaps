import { DataTypes } from "sequelize";
import { sequelize } from "../config/databaseConfig.js";
import WorkSpaceModel from "./WorkSpaceModel.js";

const MediaModel = sequelize.define("Media", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  isFace: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
});

WorkSpaceModel.hasMany(MediaModel, { foreignKey: "workspace" });

MediaModel.sync({ alter: true });

export default MediaModel;
