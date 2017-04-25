'use strict';


module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn(
        'users',
        'role',
        {
          TYPE: Sequelize.INTEGER,
          allowNull: true
        }
      ).then(function(tableNames) {
        console.log(tableNames);
      }).catch(function(err){
        console.log(err);
      })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
}