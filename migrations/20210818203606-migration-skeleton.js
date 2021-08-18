'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('Usuarios', 'petName', {
                    type: Sequelize.DataTypes.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Usuarios', 'favoriteColor', {
                    type: Sequelize.DataTypes.STRING,
                }, { transaction: t })
            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Usuarios', 'petName', { transaction: t }),
                queryInterface.removeColumn('Usuarios', 'favoriteColor', { transaction: t })
            ]);
        });
    }
};