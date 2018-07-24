const store = new Vuex.Store({
  state: {
    dragTreeData: [],
    dragTreeNodeHeight: 0,
    dragTreeOffsetX: 0,
    unread: 0
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
    }
  },
  getters: {
    dragTreeData: state => {
      return state.dragTreeData
    }
  }
})

export default store
