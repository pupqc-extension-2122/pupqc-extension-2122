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
    await queryInterface.bulkInsert('Users', [
      {
        id: 'cefb6c7c-f65b-4555-9a52-e3bcc406ba33',
        first_name: 'Super',
        last_name: 'User',
        email: 'extension.pupqc@gmail.com',
        password: '$2a$10$pW828vH7NtyyzjLpBfTHAeJpMF9p.ev7.lnGF6lmccbn7Vu4DZUgi',
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
    await queryInterface.bulkDelete('Users', null, {})
  }
};
