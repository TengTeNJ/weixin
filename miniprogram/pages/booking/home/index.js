import fieldApi from '../../../api/field';
Page({
    data: {
        // 场地列表数据
        fieldList: [],
        // 加载状态
        loading: false,
        selectedDateIndex: 0,
        selectedVenueIndex: 1,
        totalPrice: 0,
        dateList: [], // 7天
        venueList: ['训练场'],
        timeList: [], // 每半小时一个
        /**
         *[
             [ {
                    "priceId": 6,
                    "fieldId": 1,
                    "startTime": "09:00",
                    "endTime": "09:30",
                    "periodPrice": 50.00
                }],
                [],
                []
         ],
         */
        datasList: [], // 所有的时间段数据 按照左侧的场地区分
    },

    onLoad() {
        const today = new Date()
        const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const dateList = []
        for (let i = 0; i < 7; i++) {
            const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
            const label = i === 0 ? '今天' : i === 1 ? '明天' : i === 2 ? '后天' : weekMap[d.getDay()]
            dateList.push({
                week: label,
                day: d.getDate()
            })
        }

       
        this.setData({
            dateList,        })
        // 页面加载时获取场地列表
        this.loadFieldData();
    },

    onDateSelect(e) {
        this.setData({
            selectedDateIndex: e.currentTarget.dataset.index
        })
    },

    onVenueSelect(e) {
        const index = e.currentTarget.dataset.index
        if (index == 0) {
            return;
        }
        this.setData({
            selectedVenueIndex: e.currentTarget.dataset.index
        })
    },

    toggleSlot(e) {
        const {
            selectedVenueIndex
        } = this.data;
        const index = e.currentTarget.dataset.index
        const timeList = this.data.datasList[this.data.selectedVenueIndex]
        timeList[index].selected = !timeList[index].selected
        console.error('selected', timeList[index])
        // ✅ 正确方式：通过 setData 触发视图更新
        // ✅ 正确写法：使用 setData 更新
        const key = `datasList[${selectedVenueIndex}][${index}].selected`;
        console.error('key',key)
        this.setData({
            [key]: timeList[index].selected
        },() => {
            // ✅ setData 回调中确认数据已更新
            console.log('数据已更新:', timeList[index].selected);
          });
        const total = timeList.filter(i => i.selected).reduce((sum, item) => sum + item.periodPrice, 0)
        this.setData({
            timeList,
            totalPrice: total
        })
    },

    onNoticeTap() {
        wx.showModal({
            title: '预订须知',
            content: '请提前5分钟到场签到...',
            showCancel: false
        })
    },

    onBookNow() {
        if (this.data.totalPrice === 0) {
            wx.showToast({
                title: '请选择时间段',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({
            url: '/pages/booking/order/sendorder'
        })
    },
    /**
     * 加载场地数据
     */
    async loadFieldData() {
        try {
            this.setData({
                loading: true
            });

            // 调用API获取数据
            const result = await fieldApi.getFieldPriceList();

            // 处理返回的场地数据
            this.setData({
                fieldList: result.data || [],
                loading: false
            });
            console.error(this.data.fieldList)
            // 打印第一个场地的信息（如果有）
            let fieldNames = ['训练场'];
            let datas = [
                []
            ];

            if (result.data && result.data.length > 0) {
                // 获取场地数据
                result.data.forEach(function (currentValue, index, array) {
                    currentValue.fieldPriceList.forEach(function (element, index) {
                        element.selected = false
                    });
                    // 执行操作
                    fieldNames.push(currentValue.fieldName)
                    datas.push(currentValue.fieldPriceList)
                });
                const firstField = result.data[0];
                console.log('第一个场地名称:', firstField.fieldName);
                // 打印第一个价格时段（如果有）
                if (firstField.fieldPriceList && firstField.fieldPriceList.length > 0) {
                    const firstPrice = firstField.fieldPriceList[0];
                    console.log('第一个时段:', firstPrice.startTime, '-', firstPrice.endTime, '价格:', firstPrice.periodPrice);
                }
            }
            this.setData({
                venueList: fieldNames,
                datasList: datas
            })

            console.error('123', this.data.datasList)
        } catch (error) {
            console.error('加载场地数据失败:', error);
            this.setData({
                loading: false
            });
        }
    },
})