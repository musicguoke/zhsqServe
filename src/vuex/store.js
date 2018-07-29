const store = new Vuex.Store({
  state: {
    dragTreeData: [],
    dragTreeNodeHeight: 0,
    dragTreeOffsetX: 0,
    unread: 0,
    qxArray: [0, 1, 2,
      3, 4, 5, 6, 7, 8, 9,
       10,11, 12, 13, 14, 
       15, 16, 17, 18, 19,
        20,21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    qxLevelNum: 2
  },
  mutations: {
    setDragTreeNodeHeight (state, value) {
      state.dragTreeNodeHeight = value
    },
    setDragTreeData (state, value) {
      state.dragTreeData = value
    },
    setDragTreeOffsetX (state, value) {
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
    }
  },
  getters: {
    dragTreeData: state => {
      return state.dragTreeData
    }
  }
})

export default store
