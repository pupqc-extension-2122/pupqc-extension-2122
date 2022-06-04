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
      ResponseBody: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            description: 'Describes whether there is an error or not.',
            example: false
          },
          message: {
            type: 'string',
            description: 'Describes the details of the response.',
            example: 'Transaction Successful!'
          }
        }
      }
    }
  }
}