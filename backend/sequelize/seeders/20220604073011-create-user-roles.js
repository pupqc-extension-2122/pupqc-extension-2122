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
      },
      {
        id: '49a1f94c-98f6-4cfc-9838-fd5ef98c7bc6',
        user_id: 'ea019730-7967-4297-a356-532a581e7c69',
        role_id: 'a0105852-7486-4265-b83c-1e01e8be3f66',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '8d9f7160-e660-4bff-9978-d488cae44f6f',
        user_id: '3d545283-26db-461e-89cd-e6694b65144e',
        role_id: '07e382e1-bb61-492f-acb1-8063a579dc09',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '0c06a7b5-9fe3-4398-ab26-f0a9616f34df',
        user_id: '5ee732ca-a57e-48a0-a0ec-1d6d09b2823f',
        role_id: 'f026e1a8-5fe3-479f-bf40-4775c81828c0',
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
