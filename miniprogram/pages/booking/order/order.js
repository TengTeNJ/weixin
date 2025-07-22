Page({
    data: {
      currentTab: 'placed', // 默认显示“已下单”
      placedOrders: [
        {
          orderId: '1',
          title: '2025-07-30 星期一',
          location: 'Potent 智能网球训练馆',
          fields: [
            { fieldId: '1-1', fieldName: '草地训练场', time: '9:00 - 9:30', price: 40 },
            { fieldId: '1-2', fieldName: '草地训练场', time: '9:30 - 10:00', price: 40 }
          ],
          totalAmount: 80
        },
        {
          orderId: '2',
          title: '2025-08-05 星期二',
          location: '星光羽毛球馆',
          fields: [
            { fieldId: '2-1', fieldName: 'A区3号场', time: '15:00 - 17:00', price: 120 }
          ],
          totalAmount: 120
        }
      ],
      cancelledOrders: [
        {
          orderId: '3',
          title: '2025-07-29 星期日',
          location: 'XX 运动馆',
          fields: [
            { fieldId: '3-1', fieldName: '室内球场', time: '14:00 - 15:00', price: 50 }
          ],
          totalAmount: 50
        }
      ]
    },
  
    // Tab 切换事件
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({ currentTab: tab });
    },
  
    // 取消预约事件
    handleCancel(e) {
      const orderId = e.currentTarget.dataset.orderid;
      wx.showModal({
        cancelText:'否',
        confirmText:'是',
        title: '',
        content: '取消后场地将被释放给其他预约，您的预定金将原路返回，是否确定继续取消',
        success: (res) => {
          if (res.confirm) {
            // 查找要取消的订单
            const cancelledItem = this.data.placedOrders.find(item => item.orderId === orderId);
            if (cancelledItem) {
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
  