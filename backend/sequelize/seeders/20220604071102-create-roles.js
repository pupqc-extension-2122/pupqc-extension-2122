'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Roles', [
      {
        id: '07e382e1-bb61-492f-acb1-8063a579dc09',
        name: 'Chief',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'a0105852-7486-4265-b83c-1e01e8be3f66',
        name: 'Extensionist',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ea53d71f-5df2-4af2-bc79-46ae03dab450',
        name: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      },{
        id: 'f026e1a8-5fe3-479f-bf40-4775c81828c0',
        name: 'Director',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles', null, {})
  }
};
