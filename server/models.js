const sequelize = require("./db")
const {DataTypes} = require("sequelize")

const Text = sequelize.define("text", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    theme: {type: DataTypes.STRING, allowNull: false},
    size: {type: DataTypes.STRING, allowNull: false},
    language: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.TEXT("long"), allowNull: false}
})

const Questions = sequelize.define("questions", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    questions: {type: DataTypes.JSON, allowNull: false}
})

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    uid: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const UserStats = sequelize.define("userStats", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    wpm: {type: DataTypes.INTEGER, allowNull: false},
    comprehension: {type: DataTypes.INTEGER, allowNull: false},
    textId: {type: DataTypes.INTEGER, allowNull: false}
})

Text.hasOne(Questions)
Questions.belongsTo(Text)

User.hasMany(UserStats)
UserStats.belongsTo(User)

Text.hasMany(UserStats)
UserStats.belongsTo(Text)

module.exports = {
    Text,
    Questions,
    User,
    UserStats
}