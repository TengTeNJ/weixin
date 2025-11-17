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
                lineColor: '#E8C8AA'
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
        terms: [],
        filteredCards: [],
        isOnlyTerm: false, // 仅仅卡券 体验券
    },

    async onLoad(options) {
        if(options && options.isTerm){
            this.setData({
                types: ['期限卡'],
                selectedType: '期限卡',
            })
        }
        this.filterCards();
    },

    // 获取类型列表
    async getConfigList() {
        let _data = await recharge.getList(1);
        console.error('_data=', _data);
        // 对返回的数组做处理
        let list = _data.data.map(item => {
            // 根据返回数据计算颜色或其他属性
            let bgStart = '#B16922';
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
                title: '储值卡',
                range: '预约场地', // 固定值
                expire: '不限期', // 固定值
                bgStart, // 计算出的颜色
                bgEnd, // 计算出的颜色
                lineColor,
                isTerm: false // 是否是期限卡
            };
        });
        this.setData({
            cards: list
        })
    },

    // 获取期限卡列表
    async getTermCardlList() {
        let _data = await recharge.getMemberList(1);
        // 对返回的数组做处理
        let list = _data.data.map(item => {
            // 根据返回数据计算颜色或其他属性
            let bgStart = '#0A811E';
            let bgEnd = '#8AE8A0';
            let lineColor = '#8DDC82';
            // 给每一条数据加上新的属性
            return {
                ...item, // 原有数据保留
                title: item.cardName,
                range: '预约场地', // 固定值
                expire: '不限期', // 固定值
                bgStart, // 计算出的颜色
                bgEnd, // 计算出的颜色
                lineColor,
                isTerm: true // 是否是期限卡
            };
        });
        this.setData({
            terms: list
        });
    },

    // 类型弹窗
    showTypePopup() {
        this.setData({
            showPopup: true
        });
    },
    // 隐藏类型弹窗
    hideTypePopup() {
        this.setData({
            showPopup: false
        });
    },
    // 选择类型弹窗
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
        const id = e.currentTarget.dataset.id;
        console.error('e.currentTarget.dataset',e.currentTarget.dataset)
        if(e.currentTarget.dataset.item.isTerm){
            // 体验券
            let content = '请到店联系前台进行核销'
            if((e.currentTarget.dataset.item.cardTotalCount - e.currentTarget.dataset.item.cardUsedCount) <= 0){
                content = '体验卡已用完';
            }
            wx.showModal({
                title: '提示',
                content: content,
                showCancel: false
            })
            return;
        }
        const plan = this.data.filteredCards.find(p => p.confId === id);
        console.error('id=', id)
        wx.navigateTo({
            url: `/pages/coupons/buy?data=${encodeURIComponent(JSON.stringify(plan))}`,
            complete() {}
        })
        //this.pay(plan.amount, plan.bonus);
    },

    async filterCards() {
        // 刷新数据
        const {
            selectedType,
        } = this.data;
        if ((selectedType === '储值卡')) {
            await this.getConfigList();
            this.setData({
                filteredCards: [...this.data.cards]
            });
        } else if (selectedType === '全部') {
            await this.getConfigList();
            await this.getTermCardlList();
            this.setData({
                filteredCards: [...this.data.cards, ...this.data.terms]
            });
        } else if (selectedType === '期限卡') {
            await this.getTermCardlList();
            this.setData({
                filteredCards: [...this.data.terms]
            });
        } else {
            this.setData({
                filteredCards: []
            });
        }

    }
});