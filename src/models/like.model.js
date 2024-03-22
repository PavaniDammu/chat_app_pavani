import { DataTypes } from 'sequelize';

const Like = (sequelize, Sequelize) => {
    const Like = sequelize.define('Like', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
    return Like;
}
export default Like;