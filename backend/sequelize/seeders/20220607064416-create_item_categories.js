'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Budget_Item_Categories', [
      {
        id: '54f6e8d0-1c8f-45f3-a314-872edcbeccc7',
        name: 'Operating Cost',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '2678124f-90bd-4a44-9d2b-76f8749e211a',
        name: 'Supplies',
        created_at: new Date(),
        updated_at: new Date()
      },{
        id: '8348c3f5-5e3d-4c8b-9f9d-20e919653597',
        name: 'Communication',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '8f368664-990e-4fcb-a8a6-cc13e0373bf2',
        name: 'Documentation',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '8f35531c-cf00-4081-bf95-c3d41f9417b0',
        name: 'Travel Cost',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'd02b4435-0670-42a1-b01b-cb6b689b8b2d',
        name: 'Food Expenses',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ffbbd59f-c6c3-4d3f-9a62-2050708f27b6',
        name: 'Others',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Budget_Item_Categories', null, {})
  }
};
