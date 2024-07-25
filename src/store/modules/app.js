const state = {
  hasJump: false
}

const mutations = {
  JUMP: state => {
    state.hasJump = true
  }
}

const actions = {
  jump({ commit }) {
    commit('JUMP')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
