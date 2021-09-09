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
                }, { transaction: t }),
                //                 // 1) drop constraint
                // queryInterface.removeConstraint('my_some_table', 'my_constraint');

                // // 2) rename column
                // queryInterface.renameColumn('my_some_table', 'totoId', 'toto_id');

                // // 3) add constraint back
                // queryInterface.addConstraint('my_some_table', ['toto_id'], {
                //     type: 'unique',
                //     name: 'my_constraint'
                // });
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