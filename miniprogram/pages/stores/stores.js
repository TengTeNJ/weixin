Page({
    data: {
      cities: ['上海', '南京', '苏州', '杭州'],
      selectedCity: '上海',
      sortOrder: 'asc', // asc: 由近到远, desc: 由远到近
      venueList: [
        {
          name: '腾特AR训练馆南通店',
          address: '南通市崇川区体育中心A区2009-1',
          distance: 3.1,
          imageUrl: '/images/home/banner2.png'
        },
        {
          name: '腾特AR训练馆静安店',
          address: '上海市静安区延平路88号',
          distance: 12.9,
          imageUrl: '/images/home/banner2.png'
        }
      ]
    },
  
    onCityChange(e) {
      const index = e.detail.value
      this.setData({
        selectedCity: this.data.cities[index]
      })
    },
  
    toggleSort() {
      const newOrder = this.data.sortOrder === 'asc' ? 'desc' : 'asc'
      const sortedList = [...this.data.venueList].sort((a, b) =>
        newOrder === 'asc' ? a.distance - b.distance : b.distance - a.distance
      )
      this.setData({
        sortOrder: newOrder,
        venueList: sortedList
      })
    }
  })
  