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
    await queryInterface.bulkInsert('Project_Activities', [
      {
        id: '8a716dcf-3863-4544-8258-60759048bc83',
        project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
        activity_name: 'Act 1',
        topics: ['topic 1', 'topic 2'].join(';'),
        outcomes: ['outcome 1', 'outcome 2', 'outcome 3'].join(';'),
        start_date: '2022-05-01',
        end_date: '2022-05-30',
        details: 'Summarized Details',
        status: 'Active',
        created_at: new Date('2022-05-01'),
        updated_at: new Date('2022-05-01')
      },
      {
        id: '1fdc0e67-e8bd-4b6d-94c9-bc5e8444f57a',
        project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
        activity_name: 'Act 2',
        topics: ['topic 3', 'topic 4'].join(';'),
        outcomes: ['outcome 1', 'outcome 2', 'outcome 3'].join(';'),
        start_date: '2022-05-05',
        end_date: '2022-05-18',
        details: 'Summarized Details',
        status: 'Active',
        created_at: new Date('2022-05-01'),
        updated_at: new Date('2022-05-01')
      },
      {
        id: 'a8580c61-c450-4a38-8590-7a59b9e2cbb7',
        project_id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
        activity_name: 'Act 3',
        topics: ['topic 5', 'topic 6'].join(';'),
        outcomes: ['outcome 1', 'outcome 2', 'outcome 3'].join(';'),
        start_date: '2022-05-12',
        end_date: '2022-05-27',
        details: 'Summarized Details',
        status: 'Active',
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
    await queryInterface.bulkDelete('Project_Activities', null, {})
  }
};
