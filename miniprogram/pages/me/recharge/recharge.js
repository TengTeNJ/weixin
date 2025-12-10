import recharge from '../../../api/recharge'
import account from '../../../api/account'
Page({
    data: {
      balance: 0,
      plans: [
        { id: 1, amount: 500, bonus: 300 },
        { id: 2, amount: 1000, bonus: 800 },
        { id: 3, amount: 3000, bonus: 3000 }
      ],
      list:[
          {
            confId: 1,
            confName: "满100送20",
            confRemark: "满100送20",
            giftMoney: 20,
            rechargeMoney: 100
          }
      ],

      customAmount: ''
    },

    async onLoad(options){
        this.getConfigList();
        // await account.getAccountData();
    },

   async getConfigList(){
    let _data = await recharge.getList(1);
     this.setData({
         list:_data.data
     })
    },
  
    // 优惠列表充值
    async selectPlan(e) {
      const _this = this;
      const id = e.currentTarget.dataset.id;
      const plan = this.data.list.find(p => p.confId === id);
      if (!plan) return;
      let _result = await recharge.prepayForRecharge(plan.confId,plan.rechargeMoney)
      wx.requestPayment({
        ..._result.data,
        success(res) {
            console.log('支付成功',res)
            const eventChannel = _this.getOpenerEventChannel();
            eventChannel.emit('refreshPage');
            wx.navigateBack();
        },
        fail(error) {
        }
    })
      //this.pay(plan.amount, plan.bonus);
    },
  
    onCustomInput(e) {
      this.setData({ customAmount: e.detail.value });
    },
  
    // 自定义充值
   async payCustom() {
      const amount = parseFloat(this.data.customAmount);
      if (!amount || amount <= 0) {
        wx.showToast({ title: '请输入有效金额', icon: 'none' });
        return;
      }
      let _result = await recharge.prepayForRecharge(null,amount)
      wx.requestPayment({
        ..._result.data,
        success(res) {
            console.log('支付成功',res)
            wx.navigateBack();
            const eventChannel = this.getOpenerEventChannel();
            eventChannel.emit('refreshPage');
        },
        fail(error) {
        }
    })
      // this.pay(amount, 0);
    },
  
    pay(amount, bonus) {
      wx.showLoading({ title: '支付中...' });
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: '充值成功',
          icon:'success'
        })
        wx.navigateBack();
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('refreshPage');
      }, 800);
    }
  });
  