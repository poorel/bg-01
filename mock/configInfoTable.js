const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    ip:'@ip',
    cpu_num:'@integer(1, 16)',
    cpu_model:'intel i7 7200',
    harddisks_num: '@integer(1, 10)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/configInfo/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
