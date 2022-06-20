const { Op, where, col, fn } = require('sequelize')

async function datatable(model, config, options = {}) {
  let columns = []
  let types = []
  let searchables = []
  let search = []
  let order = []
  let start = 0
  let length = 10

  table_name = model.getTableName()
  config.columns.forEach((el, index) => {

    if (el.data.indexOf('.') > -1)
      columns.push(`$${el.data}$`)
    else
      columns.push(el.data)

    if (el.searchable)
      searchables.push(columns[index])

    types.push(config.types[el.data])

  })
  // * IF SEARCH
  if (config.search.value) {
    searchables.forEach((el, index) => {
      if (types[index] == 'number')
        search.push({ [el]: { [Op.like]: Number(config.search.value) } })
      if (types[index] == 'date' && config.search.value.length == 10 && config.search.value[4] == '-' && config.search.value[7] == '-')
        search.push({ [el]: config.search.value })
      else if (types[index] == 'date') {
        if (el[0] != '$')
          search.push(where(fn('DATE_FORMAT', col(`${table_name}.${el}`), '%M %e %Y'), { [Op.like]: `%${config.search.value}%` }))
        else
          search.push(where(fn('DATE_FORMAT', col(config.columns[index].data), '%M %e %Y'), { [Op.like]: `%${config.search.value}%` }))
      }
      if (types[index] == 'string')
        search.push({ [el]: { [Op.like]: `%${config.search.value}%` } })
    })
  }
  order = [columns[config.order[0].column], config.order[0].dir]
  start = config.start
  length = config.length

  // * SET ATTRIBUTES
  // options.attributes = columns.filter(el => el[0] != '$')

  // * IF SEARCH
  if (config.search.value)
    options.where = { [Op.and]: [{ ...options.where }, { [Op.or]: search }] }
  options.order = [order]
  options.offset = parseInt(start)
  options.limit = parseInt(length)

  let data = await model.findAndCountAll(options)
  let count = await model.count({})

  let result = {
    draw: config.draw,
    data: data.rows.map(el => el.toJSON()),
    recordsFiltered: data.count,
    recordsTotal: count
  }

  return result

}

module.exports = datatable