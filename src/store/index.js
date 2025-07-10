import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      user: "",
      deliveries: [],
      userDetails: {
        name: "",
        email: '',
        userVerified: true
      },
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setDeliveries(state, deliveries) {
      state.deliveries = deliveries;
    },
    addDelivery(state, delivery) {
      state.deliveries.push(delivery);
    },
    setUserDetails(state, details) {
      state.userDetails.email = details;
      state.userDetails.name = details.split('@')[0];
    },
  },
  actions: {
    fetchUser({ commit }) {
      const mockUser = { id: 1, name: 'Sarah Johnson' };
      commit('setUser', mockUser);
    },
    fetchDeliveries({ commit }) {
      const mockDeliveries = [{ id: 'del-1', status: 'In Transit' }];
      commit('setDeliveries', mockDeliveries);
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    getDeliveryById: (state) => (id) =>
      state.deliveries.find((d) => d.id === id),
    getUser: (state) => {
      if (!state.user) {
        return false;
      }
      return state.userDetails;
    },
  }
});
