import fieldApi from '../../../api/field';
import utils from '../../../utils/util'
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
        selectDataList: [], // 选中的场地列表
    },

    async onLoad(options) {
        const today = new Date()
        const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const dateList = []
        for (let i = 0; i < 7; i++) {
            const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
            const label = i === 0 ? '今天' : i === 1 ? '明天' : i === 2 ? '后天' : weekMap[d.getDay()]
            dateList.push({
                week: label,
                day: d.getDate(),
                date: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
            })
        }
        this.setData({
            dateList,
        })

        const fieldIndex = options.fieldIndex;
        const storeId = options.storeId;// 商铺id
        this.storeId = storeId;

        if (fieldIndex != undefined) {
            // 传递过来的参数是字符串类型，所以必须要转换成fieldIndex，要不然类型不一样可能会有问题，比如我们发现不刷新页面
            // 因为wxml中用了精准比较selectedDateIndex === index，所以类型不一样就不认为一样了
            this.setData({
                selectedDateIndex: parseInt(fieldIndex)
            })
        }
    },

    onShow() {
        // 页面加载时获取场地列表
         this.loadFieldData();
    },

    /**
     * 顶部的日期选择
     * @param {*} e 
     */
    onDateSelect(e) {
        if (this.data.selectedDateIndex == e.currentTarget.dataset.index) {
            return;
        }
        // 把所有的数据选中状态清空
        this.data.datasList.forEach(subArr => {
            subArr.forEach(item => {
                item.selected = false;
            });
        });
        // 清空选中的时间段列表
        this.data.selectDataList.length = 0;
        // 刷新页面
        this.setData({
            selectedDateIndex: e.currentTarget.dataset.index,
            datasList: this.data.datasList,
            totalPrice: 0
        })
        this.loadFieldData();
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

    /**
     * 选中/反选时间段
     */
    toggleSlot(e) {
        const {
            selectedVenueIndex
        } = this.data;
        const index = e.currentTarget.dataset.index
        const timeList = this.data.datasList[this.data.selectedVenueIndex]
        if (timeList[index].bookFlag) {
            console.warn('已经被预定,不可使用')
            return;
        }
        timeList[index].selected = !timeList[index].selected
        // 把选中的加入
        console.warn('timeList[index].selected ', timeList[index].selected)
        if (timeList[index].selected == true) {
            // 场地名称
            timeList[index]['fieldName'] = this.data.venueList[selectedVenueIndex];
            // 场地日期
            timeList[index]['date'] = this.data.dateList[this.data.selectedDateIndex]['date']
            this.data.selectDataList.push(timeList[index]);
            this.data.totalPrice += timeList[index].periodPrice;
        } else {
            // 反选的需要移除
            //const index = this.data.selectDataList.indexOf(timeList[index]); // 找到值为3的索引
            console.warn('index', index)
            const deletedIndex = this.data.selectDataList.findIndex(item => (item.priceId === timeList[index].priceId && item.fieldId === timeList[index].fieldId));
            if (index !== -1) {
                this.data.selectDataList.splice(deletedIndex, 1); // 从该索引位置移除一个元素
                this.data.totalPrice -= timeList[index].periodPrice;
            }
        }
        // ✅ 正确方式：通过 setData 触发视图更新
        const key = `datasList[${selectedVenueIndex}][${index}].selected`;
        this.setData({
            [key]: timeList[index].selected
        }, () => {
            // ✅ setData 回调中确认数据已更新
            console.log('数据已更新:', timeList[index].selected);
        });
        // const total = timeList.filter(i => i.selected).reduce((sum, item) => sum + item.periodPrice, 0)
        this.data.totalPrice = parseFloat(this.data.totalPrice.toFixed(2));
        this.setData({
            timeList,
            totalPrice: this.data.totalPrice
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
        if (this.data.selectDataList.length === 0) {
            wx.showToast({
                title: '请选择时间段',
                icon: 'none'
            })
            return
        }
        // 序列化选中的数据 传输到下一个页面
        const encoded = encodeURIComponent(JSON.stringify(this.data.selectDataList));

        wx.redirectTo({
            url: `/pages/booking/order/sendorder?data=${encoded}`
        })
    },
    /**
     * 加载场地数据
     */
    async loadFieldData() {
        const _this = this;
        try {
            this.setData({
                loading: true
            });
            // 当前选中的日期
            const dateObject = this.data.dateList[this.data.selectedDateIndex];
            const bookDate = dateObject.date;
            // 调用API获取数据
            const result = await fieldApi.getFieldPriceList(bookDate,this.storeId);
            // 处理返回的场地数据
            this.setData({
                fieldList: result.data || [],
                loading: false
            });
            //await fieldApi.getFieldDetail(1,bookDate)
            // 打印第一个场地的信息（如果有）
            let fieldNames = ['训练场'];
            let datas = [
                []
            ];

            if (result.data && result.data.length > 0) {
                // 获取场地数据
                result.data.forEach(function (currentValue) {
                    currentValue.fieldPriceList.forEach(function (element, index) {
                        // 如果当前的时间（肯定是今天的）已经晚于时间段的开始时间，则不可用 
                        if (_this.data.selectedDateIndex == 0 && !element.bookFlag) {
                            const beforeStart = utils.isBeforeStartTime(element.startTime);
                            if (!beforeStart) {
                                element.bookFlag = true;
                            }
                        }
                        element.selected = false
                    });
                    // 执行操作
                  let _name = utils.handleWhiteSpace(currentValue.fieldName);
                  console.warn('_name',_name)
                    fieldNames.push(_name);
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

        } catch (error) {
            this.setData({
                loading: false
            });
        }
    },
})