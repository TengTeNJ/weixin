import orderUtils from '../../../api/order'
Page({
    data: {
        currentTab: 'placed', // 默认显示“已下单”
        placedOrders: [ ],
        cancelledOrders: []
    },

    async onLoad() {
        // 加载已下单列表
        this.refreshOrderListData(1);
    },

    /**
     * 加载订单列表
     * @param {*订单状态} orderStatus 
     */
    async refreshOrderListData(orderStatus) {
        const res = await orderUtils.getOrderList(1, orderStatus)
        console.error('orderStatus',orderStatus)

        if (orderStatus == 1) {
            this.setData({
                placedOrders: res.data
            })
        } else {
            console.error('orderStatus',res.data)
            this.setData({
                cancelledOrders: res.data
            })
        }
    },

    // Tab 切换事件
    switchTab(e) {
        const tab = e.currentTarget.dataset.tab;
        if (tab == this.data.currentTab) return;
        this.setData({
            currentTab: tab
        });
        var orderStatus = 1;
        if (tab != 'placed') {
            orderStatus = 2;
        }
        this.refreshOrderListData(orderStatus);

    },

    // 取消预约事件
    handleCancel(e) {
        const orderId = e.currentTarget.dataset.orderid;
        console.error('prderId', orderId)
        var _this = this;
        wx.showModal({
            cancelText: '否',
            confirmText: '是',
            title: '',
            content: '取消后场地将被释放给其他预约，您的预定金将原路返回，是否确定继续取消',
            success: async (res) => {
                if (res.confirm) {
                    // 查找要取消的订单
                    const cancelledItem = this.data.placedOrders.find(item => item.orderId === orderId);
                    if (cancelledItem) {
                        // 获取订单那编号
                        const orderNo = cancelledItem.orderNo;
                        await orderUtils.cancelOrder(orderNo);
                        // 更新已下单列表（移除取消的订单）
                        const newPlacedOrders = this.data.placedOrders.filter(item => item.orderId !== orderId);

                        // 更新已取消列表（添加取消的订单）
                        const newCancelledOrders = [...this.data.cancelledOrders, cancelledItem];

                        this.setData({
                            placedOrders: newPlacedOrders,
                            cancelledOrders: newCancelledOrders
                        });

                        wx.showToast({
                            title: '取消成功',
                            icon: 'success',
                            duration: 2000
                        });
                    }
                }
            }
        });
    }
});