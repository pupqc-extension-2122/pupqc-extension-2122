'use strict';
require('dotenv').config()

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
    if (process.env.NODE_ENV != 'production') {
      await queryInterface.bulkInsert('Partners', [
        {
          id: 'e6c7d6b8-7a72-4761-b8d1-2a3bc9f95594',
          name: 'MASAGANA MARKETING MGT. & CONSULTANCY, INC.',
          address: '152-C West Ave., Brgy. Philam, Quezon City',
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Partners', null, {})
  }
};
