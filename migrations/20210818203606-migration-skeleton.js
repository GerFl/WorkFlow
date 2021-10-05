'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                // queryInterface.addColumn('Usuarios', 'petName', {
                //     type: Sequelize.DataTypes.STRING
                // }, { transaction: t }),
                queryInterface.addColumn('proyectos-compartidos', 'rol', {
                    type: Sequelize.DataTypes.STRING(11)
                }, { transaction: t }),
                queryInterface.addColumn('proyectos-compartidos', 'area', {
                    type: Sequelize.DataTypes.STRING
                }, { transaction: t }),
            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('proyectos-compartidos', 'rol', { transaction: t })
            ]);
        });
    }
};