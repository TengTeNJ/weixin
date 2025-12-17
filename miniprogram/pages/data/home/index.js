import * as echarts from '../../../ec-canvas/echarts';

// pages/data/home/index.js
function initChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width,
        height,
        devicePixelRatio: dpr
    });

    canvas.setChart(chart);

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {d}%'
        },
        series: [{
            type: 'pie',
            radius: ['45%', '75%'],
            center: ['50%', '50%'],
            padAngle: 20, // 👈 关键：扇区之间的间距（角度）
            itemStyle: {
                borderWidth: 0, // 👈 间距粗细（关键） 影响到引线和圆环的距离
                borderColor: '#fff' // 👈 和背景色一致
            },
            // 引线文本
            label: {
                show: true,
                formatter: '{d}%\n{b}',
                fontSize: 10,
                color: '#7B7B7B'
            },
            labelLine: {
                length: 12,
                length2: 8
            },
            alignTo: 'edge', // 👈 关键 1：文字贴边
            position: 'outside',
            data: [{
                    value: 100,
                    name: '标靶',
                    itemStyle: {
                        color: '#2889F9'
                    }
                },
                {
                    value: 200,
                    name: '测试',
                    itemStyle: {
                        color: '#72CF15'
                    }
                },
                {
                    value: 100,
                    name: 'AR场',
                    itemStyle: {
                        color: '#E96415'
                    }
                }
            ]
        }],
        graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
                text: '960拍',
                textAlign: 'center',
                fill: '#333',
                fontSize: 12,
                fontWeight: 'bold'
            }
        }
    };

    chart.setOption(option);
    return chart;
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 顶部时间维度
        ranges: [{
                key: 'today',
                label: '今日'
            },
            {
                key: 'week',
                label: '本周'
            },
            {
                key: 'month',
                label: '本月'
            },
            {
                key: 'year',
                label: '本年'
            }
        ],
        activeRange: 'today',
        // 区域分布数据
        distributions: {
            today: [{
                    name: '标准',
                    percent: 55.5,
                    color: '#4b8fff'
                },
                {
                    name: 'AR场',
                    percent: 18.5,
                    color: '#ff9f3a'
                },
                {
                    name: '测试',
                    percent: 26.0,
                    color: '#41c689'
                }
            ],
            week: [{
                    name: '标准',
                    percent: 40,
                    color: '#4b8fff'
                },
                {
                    name: 'AR场',
                    percent: 30,
                    color: '#ff9f3a'
                },
                {
                    name: '测试',
                    percent: 30,
                    color: '#41c689'
                }
            ],
            month: [{
                    name: '标准',
                    percent: 60,
                    color: '#4b8fff'
                },
                {
                    name: 'AR场',
                    percent: 20,
                    color: '#ff9f3a'
                },
                {
                    name: '测试',
                    percent: 20,
                    color: '#41c689'
                }
            ],
            year: [{
                    name: '标准',
                    percent: 50,
                    color: '#4b8fff'
                },
                {
                    name: 'AR场',
                    percent: 35,
                    color: '#ff9f3a'
                },
                {
                    name: '测试',
                    percent: 15,
                    color: '#41c689'
                }
            ]
        },
        currentDistribution: [],
        donutGradient: '',
        totalShots: 960,
        labelPositions: [],
        ec: {
            onInit: initChart
        }
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.applyRangeData('today')
    },

    // 切换顶部时间维度
    onRangeTap(e) {
        const key = e.currentTarget.dataset.key
        // 如果点击的是当前选中项则不处理，避免无效 setData
        if (key === this.data.activeRange) return

        this.setData({
            activeRange: key
        })

        this.applyRangeData(key)
    },

    // 根据选中的维度应用分布数据并生成渐变和图形
    applyRangeData(key) {
        const list = this.data.distributions[key] || []
        // 生成 conic-gradient 字符串，根据百分比动态调整
        let start = 0
        const segments = list.map(item => {
            const end = start + item.percent * 3.6 // 百分比转角度
            const seg = `${item.color} ${start}deg ${end}deg`
            start = end
            return seg
        })
        const gradient = `conic-gradient(${segments.join(', ')})`

        // 计算每段的中点，用来确定引线的方向与锚点位置（基于 260rpx 直径）
        const cx = 130 // wrapper 半径
        const cy = 130
        const radius = 110 // 锚点落在扇区内侧
        const anchorOffset = 0
        start = 0
        const labels = list.map(item => {
            const end = start + item.percent * 3.6
            const mid = (start + end) / 2
            const rad = (mid * Math.PI) / 180
            const r = radius - anchorOffset
            const x = cx + Math.cos(rad) * r
            const y = cy + Math.sin(rad) * r
            const isRight = Math.cos(rad) >= 0
            start = end
            return {
                name: item.name,
                percent: item.percent,
                left: x.toFixed(1),
                top: y.toFixed(1),
                direction: isRight ? 'right' : 'left'
            }
        })

        this.setData({
            currentDistribution: list,
            donutGradient: gradient,
            labelPositions: labels
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})