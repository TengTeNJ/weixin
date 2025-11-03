import stores from '../../api/stores'
Page({
    data: {
        cities: [{
            id: 79,
            code: '320600',
            name: '南通市',
            latitude: 32,
            longitude: 121,
            provinceCode: "320000"
        }],
        selectedCity: '南通',
        sortOrder: 'asc', // asc: 由近到远, desc: 由远到近
        venueList: [
            // {
            //     id: 79,
            //     name: item.storeName,
            //     contact: item.storeContact,
            //     tel: item.contactTel,
            //     latitude: item.storeLat,
            //     longitude: item.storeLng,
            //     address: item.totalAddress,
            //     image: item.storeImage,
            //     distance: item.distanceStr,
            //     distanceValue: item.distanceBd,
            //     remark: item.storeRemark,
            // }
        ]
    },

    onLoad() {
        this.getStoreCode();
    },

    // 请求城市列表
    async getStoreCode() {
        const res = await stores.getCityList();
        console.error('res111=', res);
        this.setData({
            cities:res
        });
        this.getStoreList();
    },

    // 请求门店列表
    async getStoreList(cityCode,sortOrder){
        const _this = this;
        wx.getLocation({
            type: 'gcj02', // 返回可以用于wx.openLocation的坐标
            async success(res) {
                const storesData = await stores.getStoreList(res.longitude, res.latitude,sortOrder,cityCode);
                if (Array.isArray(storesData) && storesData.length > 0)
                _this.setData({
                    venueList: storesData,
                    })
                console.error('cities=', storesData)
            },
            fail(err) {
                console.error("获取位置失败：", err)
            }
        })
    },

    onCityChange(e) {
        const index = e.detail.value
        this.setData({
            selectedCity: this.data.cities[index]
        });
        const city = thi.data.cities[index];
        const asc = this.data.sortOrder == 'asc' ? 1 : 2;
        this.getStoreList(city.code,asc);
    },

    toggleSort() {
        const newOrder = this.data.sortOrder === 'asc' ? 'desc' : 'asc'
        const sortedList = [...this.data.venueList].sort((a, b) =>
            newOrder === 'asc' ? a.distanceValue - b.distanceValue : b.distanceValue - a.distanceValue
        )
        this.setData({
            sortOrder: newOrder,
            venueList: sortedList
        })
    }
})