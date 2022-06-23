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
    await queryInterface.bulkInsert('Project_Partners', [
      {
        id: '61cab9aa-f9f7-41f4-9c47-14f6f0d70fc0',
        project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
        partner_id: 'e6c7d6b8-7a72-4761-b8d1-2a3bc9f95594',
        memo_id: 'f15ed394-c6b5-4d61-bffb-f5269541369c',
        created_at: new Date('2022-05-01'),
        updated_at: new Date('2022-05-01')
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
    await queryInterface.bulkDelete('Project_Partners', null, {})
  }
};
