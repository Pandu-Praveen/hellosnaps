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
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    }
});

WorkSpaceModel.sync({ alter: true });

export default WorkSpaceModel;