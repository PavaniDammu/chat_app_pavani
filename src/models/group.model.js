import { DataTypes } from 'sequelize';

const Group = (sequelize, Sequelize) => {
    const Group = sequelize.define('Group', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Group;
}

export default Group;