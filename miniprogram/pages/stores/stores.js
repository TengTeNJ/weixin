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
        selectedCity: '南通市',
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

    // 切换门店
    selectStore(e) {
        const _this = this;
        const {
            item
        } = e.currentTarget.dataset
        // 在页面B的代码中
        const eventChannel = this.getOpenerEventChannel(); // 获取事件通道
        eventChannel.emit('item', item); // 发送数据给页面A
        wx.navigateBack();
    },

    // 请求城市列表
    async getStoreCode() {
        const res = await stores.getCityList();
        this.setData({
            cities: res
        });
        if (Array.isArray(res) && res.length > 0) {
            const city = res[0];
            this.setData({
                selectedCity: city.name
            });
            // 请求门店列表
            this.getStoreList(city.code);
        }
    },

    // 请求门店列表
    async getStoreList(cityCode, sortOrder) {
        const _this = this;
        wx.getFuzzyLocation({
            type: 'wgs84',
            async success(res) {
                const storesData = await stores.getStoreList(res.longitude, res.latitude, sortOrder, cityCode);
                if (Array.isArray(storesData) && storesData.length > 0)
                    _this.setData({
                        venueList: storesData,
                    })
            },
            fail(err) {
            }
        })
    },
    // 城市切换
    onCityChange(e) {
        const index = e.detail.value
        this.setData({
            selectedCity: this.data.cities[index].name
        });
        const city = this.data.cities[index];
        const asc = this.data.sortOrder == 'asc' ? 1 : 2;
        this.getStoreList(city.code, asc);
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