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
    await queryInterface.bulkInsert('Memos', [
      {
        id: 'f15ed394-c6b5-4d61-bffb-f5269541369c',
        partner_id: 'e6c7d6b8-7a72-4761-b8d1-2a3bc9f95594',
        partner_name: 'MASAGANA MARKETING MGT. & CONSULTANCY, INC.',
        organization_id: 'ce91295e-7364-41d5-a242-fe9f5e160faf',
        duration: '3',
        validity_date: new Date('2022-03-22'),
        end_date: new Date(new Date('2022-03-22').setDate(new Date('2022-03-22').getDate() + 3 * 365.25)),
        representative_pup: 'ANNA RUBY P. GAPASIN',
        representative_partner: 'ROBERTO O. ASUNCION',
        notarized_date: new Date('2022-03-22'),
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
    await queryInterface.bulkDelete('Memos', null, {})
  }
};
