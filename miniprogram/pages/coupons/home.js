import recharge from '../../api/recharge'

Page({
    data: {
        showPopup: false,
        types: ['全部', '储值卡', '期限卡'],
        selectedType: '全部',
        cards: [{
                id: 1,
                title: '5000储值卡',
                type: '储值卡',
                value: 1200,
                price: 1000,
                originPrice: 1200,
                range: '预约场地',
                expire: '不限期',
                bgStart: '#444444',
                bgEnd: '#888888',
                lineColor:'#E8C8AA'
            },
            {
                id: 2,
                title: '2000储值卡',
                type: '储值卡',
                value: 1200,
                price: 1000,
                originPrice: 1200,
                range: '球场结缘',
                expire: '不限期',
                bgStart: '#0055FF',
                bgEnd: '#00AAFF'
            },
            {
                id: 3,
                title: '1000期限卡',
                type: '期限卡',
                value: 1200,
                price: 1000,
                originPrice: 1200,
                range: '球场结缘',
                expire: '不限期',
                bgStart: '#CC6600',
                bgEnd: '#FF9900'
            }
        ],
        filteredCards: []
    },

   async onLoad() {
        this.filterCards();
        this.getConfigList();
    },

    // 获取类型列表
    async getConfigList() {
        let _data = await recharge.getList(1);
        console.error('_data=',_data);
        // 对返回的数组做处理
        let list = _data.data.map(item => {
            // 根据返回数据计算颜色或其他属性
            let bgStart   = '#B16922';
            let bgEnd = '#EBC09B';
            let lineColor = '#E8C8AA';
            if (item.rechargeMoney >= 1000) {
                if (item.rechargeMoney < 3000) {
                    bgEnd = '#4BACDF';
                    bgStart = '#0F2C9F';
                    lineColor = '#2491CB';
                } else {
                    bgEnd = '#9B9B9B';
                    bgStart = '#0C0702';
                    lineColor = '#7A7A7A';
                }
            }
            // 给每一条数据加上新的属性
            return {
                ...item, // 原有数据保留
                title:'储值卡',
                range: '预约场地', // 固定值
                expire: '不限期', // 固定值
                bgStart, // 计算出的颜色
                bgEnd, // 计算出的颜色
                lineColor
            };
        });

        console.error('list=',list);

        this.setData({
            filteredCards: list
        })
    },

    showTypePopup() {
        this.setData({
            showPopup: true
        });
    },

    hideTypePopup() {
        this.setData({
            showPopup: false
        });
    },

    selectTypeFromPopup(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({
            selectedType: type,
            showPopup: false
        });
        this.filterCards();
    },

    onTypeSelect(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({
            selectedType: type
        });
        this.filterCards();
    },

      // 充值
      async selectPlan(e) {
        const _this = this;
        const id = e.currentTarget.dataset.id;
        const plan = this.data.filteredCards.find(p => p.confId === id);
        console.error('id=',id)
        wx.redirectTo({
            url: `/pages/coupons/buy?data=${encodeURIComponent(JSON.stringify(plan))}`,
            complete() {}
        })
        //this.pay(plan.amount, plan.bonus);
      },

    filterCards() {
        const {
            selectedType,
            cards
        } = this.data;
        const filtered = selectedType === '全部' ? cards : cards.filter(item => item.type === selectedType);
        this.setData({
            filteredCards: filtered
        });
    }
});