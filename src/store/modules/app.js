const state = {
  hasJump: false,
  isFixed: false
}

const mutations = {
  JUMP: state => {
    state.hasJump = true
  },
  ISFIXED({ commit }) {
    state.isFixed = commit
  }
}

const actions = {
  jump({ commit }) {
    commit('JUMP')
  },
  isFixed({ commit }) {
    commit('ISFIXED')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
