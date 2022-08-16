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

      var date = new Date()
      await queryInterface.bulkInsert('Project_Histories', [
        {
          id: '3a2786cb-fb42-4d59-8b19-eaea5c3b39df',
          project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
          previous_value: null,
          current_value: 'Created',
          created_at: new Date(date.setDate(date.getDate() - 5)),
          updated_at: new Date(date),
        },
        {
          id: '36b31c3f-c55b-4e81-b22a-70ca87d29aee',
          project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
          previous_value: 'Created',
          current_value: 'For Review',
          created_at: new Date(date.setDate(date.getDate() + 1)),
          updated_at: new Date(date),
        },
        {
          id: '0d62aa3d-6db1-410c-ba59-3dd7f6369a31',
          project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
          previous_value: 'For Review',
          current_value: 'For Evaluation',
          created_at: new Date(date.setDate(date.getDate() + 1)),
          updated_at: new Date(date),
        },
        {
          id: '72d2e50c-cdaa-418f-a348-4c9cf6472e58',
          project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
          previous_value: 'For Evaluation',
          current_value: 'Pending',
          created_at: new Date(date.setDate(date.getDate() + 1)),
          updated_at: new Date(date),
        },
        {
          id: '1eec3f85-7a4e-4f7a-b93a-d3b24092223a',
          project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
          previous_value: 'Pending',
          current_value: 'Approved',
          created_at: new Date(date.setDate(date.getDate() + 1)),
          updated_at: new Date(date),
        },
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
    await queryInterface.bulkDelete('Project_Histories', null, {})
  }
};
