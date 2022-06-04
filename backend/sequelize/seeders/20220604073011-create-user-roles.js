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
    await queryInterface.bulkInsert('User_Roles', [
      {
        id: '967d66b4-1db5-4869-9ca6-9ab6ab1f67a5',
        user_id: 'cefb6c7c-f65b-4555-9a52-e3bcc406ba33',
        role_id: '07e382e1-bb61-492f-acb1-8063a579dc09',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'bf832cd7-8b99-414e-a5eb-491a628a442d',
        user_id: 'cefb6c7c-f65b-4555-9a52-e3bcc406ba33',
        role_id: 'a0105852-7486-4265-b83c-1e01e8be3f66',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '1303b881-daff-419c-91ef-b2a211ce2632',
        user_id: 'cefb6c7c-f65b-4555-9a52-e3bcc406ba33',
        role_id: 'ea53d71f-5df2-4af2-bc79-46ae03dab450',
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
    await queryInterface.bulkDelete('User_Roles', null, {})
  }
};
