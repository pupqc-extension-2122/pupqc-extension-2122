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
        updated_at: new Date(),
        verified: true
      },
      {
        id: 'ea019730-7967-4297-a356-532a581e7c69',
        first_name: 'Alma',
        last_name: 'Fernandez',
        email: 'extensionist@pupqc.com',
        password: '$2a$10$pW828vH7NtyyzjLpBfTHAeJpMF9p.ev7.lnGF6lmccbn7Vu4DZUgi',
        created_at: new Date(),
        updated_at: new Date(),
        verified: true
      },
      {
        id: '3d545283-26db-461e-89cd-e6694b65144e',
        first_name: 'Edgardo',
        last_name: 'Delmo',
        email: 'chief@pupqc.com',
        password: '$2a$10$pW828vH7NtyyzjLpBfTHAeJpMF9p.ev7.lnGF6lmccbn7Vu4DZUgi',
        created_at: new Date(),
        updated_at: new Date(),
        verified: true
      },
      {
        id: '5ee732ca-a57e-48a0-a0ec-1d6d09b2823f',
        first_name: 'School',
        last_name: 'Director',
        email: 'director@pupqc.com',
        password: '$2a$10$pW828vH7NtyyzjLpBfTHAeJpMF9p.ev7.lnGF6lmccbn7Vu4DZUgi',
        created_at: new Date(),
        updated_at: new Date(),
        verified: true
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
