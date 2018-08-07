import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

const store = new Vuex.Store({
    state: {
        dragTreeData: [],
        dragTreeNodeHeight: 0,
        dragTreeOffsetX: 0,
        unread: 0,
        qxArray: [0, 1, 2,
            3, 4, 5, 6, 7, 8, 9,
            10, 11, 12, 13, 14,
            15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
        ],
        qxLevelNum: 2,
        params: {},
        monitorSystemInfo: {},
        mapInfo: { isShow: false, dataPath: '' }
    },
    mutations: {
        setDragTreeNodeHeight(state, value) {
            state.dragTreeNodeHeight = value
        },
        setDragTreeData(state, value) {
            state.dragTreeData = value
        },
        setDragTreeOffsetX(state, value) {
            state.dragTreeOffsetX = value
        },
        setUnread(state, value) {
            state.unread = value
        },
        setQxArray(state, value) {
            state.qxArray = value
        },
        setQxLevel(state, value) {
            state.qxLevelNum = value
        },
        setParams(state, obj) {
            state.params = obj
        },
        setMonitorSystemInfo(state, obj) {
            state.monitorSystemInfo = obj
        },
        setMapInfo(state, obj) {
            state.mapInfo.isShow = obj.isShow
            state.mapInfo.dataPath = obj.datapath
        }
    },
    getters: {
        dragTreeData: state => {
            return state.dragTreeData
        },
        mapInfo: state => {
            return state.mapInfo
        }
    },
    plugins: [vuexLocal.plugin]
})

export default store