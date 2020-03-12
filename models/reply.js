module.exports = function(sequelize, DataTypes) {
  const Reply = sequelize.define("Reply", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 500]
      }
    }
  });

  Reply.associate = function(models) {
    Reply.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false
      }
    });
    Reply.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Reply;
};
