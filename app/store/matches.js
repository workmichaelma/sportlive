import axios from 'axios'

import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import set from 'lodash/set'
import find from 'lodash/find'

export const state = () => { }

export const getters = {
  getMatches: (state, getters, rootState, rootGetters) => (featured = true) => {
    return featured ? state.featuredMatches : state.matches
  },
}

export const actions = {
  async fetchMatches({ getters, rootGetters, commit }) {
    try {
      await axios.get('http://api:3000/').then(({ data }) => {
        commit('saveMatches', data)
      }).catch(err => {
        console.log('catch1', err)
      })
    } catch (err) {
      console.log('catch 2', err)
    }
  },
}

export const mutations = {
  saveMatches(state, data) {
    set(state, 'featuredMatches', get(data, 'featuredMatches'))
    set(state, 'matches', get(data, 'matches'))
  }
}
