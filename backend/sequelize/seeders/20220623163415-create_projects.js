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
    await queryInterface.bulkInsert('Projects', [
      {
        id: '05b02fae-98bc-445b-895f-2164bc9a20ec',
        title: 'New Project',
        implementer: 'Grace Lopez',
        target_groups: ['Project 1', 'Group 2'].join(';'),
        team_members: ['New 1', 'Member 2'].join(';'),
        start_date: '2022-05-01',
        end_date: '2022-05-30',
        impact_statement: 'Reformation of New',
        summary: 'Introducing New',
        status: 'Approved',
        financial_requirements: JSON.stringify([
          {
            category: 'Operational Cost',
            items: [
              {
                'budget_item': 'Venue',
                'particulars': 'Place',
                'quantity': 1,
                'estimated_cost': 2300
              }
            ]
          }
        ]),
        evaluation_plans: JSON.stringify([
          {
            outcome: 'Was it good',
            collector: 'Junnie Hoya',
            data_collection_method: 'Online Survey',
            frequency: '3 days'
          }
        ]),
        created_by: 'ea019730-7967-4297-a356-532a581e7c69',
        created_at: new Date('2022-05-01'),
        updated_at: new Date('2022-05-30')
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
    await queryInterface.bulkDelete('Projects', null, {})
  }
};
