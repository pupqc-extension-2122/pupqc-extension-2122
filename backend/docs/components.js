module.exports = {
  components: {
    schemas: {
      id: {
        type: 'string',
        description: 'ID of a record',
        example: 'b69475de-abac-41f5-aef1-96cf730f2070'
      },
      Login: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'The email used to log into the system.',
            example: 'extension.pupqc@gmail.com'
          },
          password: {
            type: 'string',
            description: 'The password to authenticate the user.',
            example: 'P@ssw0rd!'
          }
        }
      },
      CreateProjectBody: {
        type: 'object',
        properties: {
          partner_id: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          title: {
            type: 'string',
            description: 'The Title of the Project',
          },
          target_groups: {
            type: 'array',
            items: {
              type: 'string',
            }
          },
          team_members: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          start_date: {
            type: 'string',
            format: 'date',
            description: 'First Date of the Project'
          },
          end_date: {
            type: 'string',
            format: 'date',
            description: 'Last Date of the Project'
          },
          status: {
            type: 'string',
            description: 'The State of the Project'
          },
          impact_statement: {
            type: 'string',
            description: 'The Impact Statement of the Project'
          },
          summary: {
            type: 'string',
            description: 'The Summary of the Project'
          },
          financial_requirements: {
            type: 'array',
            description: 'The Financial Requirements for the Project',
            items: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'The category of financial requirement'
                },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      budget_item: {
                        type: 'string',
                        description: 'The Item for the budget'
                      },
                      particulars: {
                        type: 'string',
                        description: 'The specific item'
                      },
                      quantity: {
                        type: 'integer',
                        description: 'The number of items'
                      },
                      estimated_cost: {
                        type: 'integer',
                        description: 'The total cost of the items'
                      }
                    }
                  }
                }
              }
            }
          },
          evaluation_plans: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                outcome: {
                  type: 'string',
                  description: 'Expected outcome'
                },
                collector: {
                  type: 'string',
                  description: 'The person to collect the evaluation'
                },
                data_collection_method: {
                  type: 'string',
                  description: 'The method for data collection'
                },
                frequency: {
                  type: 'string',
                  description: 'The frequency of data collection'
                }
              }
            }
          }
        }
      },
      ResponseBody: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            required: true,
            description: 'Describes whether there is an error or not.',
            example: false
          },
          message: {
            type: 'string',
            description: 'Describes the details of the response.',
            example: 'Transaction Successful!'
          },
          data: {
            type: 'object',
            description: 'The requested resource/s from API',
          }
        }
      }
    }
  }
}