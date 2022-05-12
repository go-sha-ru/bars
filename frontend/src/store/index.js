import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    currentPage: 1,
    numberOfPages: 1,
    perPage: 20,
    status: '',
    token: localStorage.getItem('token') || '',
    user : {},
    emptyNote: {
      id: null,
      title : "",
      content : "",
      category : null,
      is_favorite : false,
      uuid: null
    },
    currentNote : {
      id: null,
      title : "",
      content : "",
      category : null,
      is_favorite : false,
      uuid: null
    },
    category: [],
    notes: {
      count:0,
      next:null,
      previous:null,
      results:[]
    }
  },
  getters : {
    isLoggedIn: state => !!state.token,
    currentNote: state => state.currentNote,
    authStatus: state => state.status,
    notesCount: state => state.notes.count,
    notesList: state => state.notes.results,
    categoryList: state => state.category,
    totalRows: state => state.notes.count,
    currentPage: state => state.currentPage,
    perPage: state => state.perPage,
    numberOfPages: state => state.numberOfPages
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token, user) {
      state.status = 'success';
      state.token = token;
      state.user = user;
    },
    register_success(state, user) {
      state.status = 'success';
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state){
      state.status = '';
      state.token = '';
    },
    get_notes(state){
      state.status = 'loading';
    },
    get_note(state){
      state.status = 'loading';
    },
    get_notes_success(state, notes) {
      state.notes = notes;
      state.status = 'success';
    },
    set_pagination_note(state) {
      state.numberOfPages = Math.ceil(state.notes.count / state.perPage)
    },
    get_note_success(state, note) {
      state.currentNote = note;
      state.status = 'success';
    },
    set_empty_note(state) {
      state.currentNote = state.emptyNote;
    },
    get_notes_error(state) {
      state.status = 'error';
    },
    add_note(state){
      state.status = 'loading';
    },
    add_note_success(state, note) {
      state.status = 'success';
    },
    add_note_error(state){
      state.status = 'loading';
    },
    edit_note(state){
      state.status = 'loading';
    },
    edit_note_success(state, note) {
      state.status = 'success';
    },
    edit_note_error(state){
      state.status = 'error';
    },
    toggle_favorite(state){
      state.status = 'loading';
    },
    toggle_favorite_success(state, note) {
      state.status = 'success';
      state.notes.results.find(x => x.id === note.id).is_favorite = note.is_favorite
    },
    toggle_favorite_error(state){
      state.status = 'error';
    },
    toggle_uuid(state){
      state.status = 'loading';
    },
    toggle_uuid_success(state, note) {
      state.status = 'success';
      state.notes.results.find(x => x.id === note.id).uuid = note.uuid
    },
    toggle_uuid_error(state){
      state.status = 'error';
    },
    get_note_error(state){
      state.status = 'error';
    },
    get_category_success(state, category) {
      state.category = category;
      state.status = 'success';
    },
    get_category(state){
      state.status = 'loading';
    },
    get_category_error(state){
      state.status = 'error';
    },
  },
  actions: {
    login({commit}, user){
      return new Promise((resolve, reject) => {
        commit('auth_request');
        Vue.http.post('/api/rest-auth/login/', user).then(response => {
          console.log(response);
          const token = response.body.key;
          localStorage.setItem('token', token);
          commit('auth_success', token, user);
          resolve(response);

        }, err => {
          commit('auth_error');
          localStorage.removeItem('token');
          reject(err);
        });
      })
    },
    register({commit}, user){
      return new Promise((resolve, reject) => {
        commit('auth_request');
        Vue.http.post('/api/account/', user)
            .then(response => {
              commit('register_success', user)
              router.push('/login');
            })
            .catch(err => {
              commit('auth_error', err);
              localStorage.removeItem('token');
              reject(err)
            })
      })
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        commit('auth_request');
        Vue.http.post('/api/rest-auth/logout/', {}).then(response => {
          console.log(response);
          const token = response.body.key;
          localStorage.removeItem('token');
          commit('auth_success', null, null);
          resolve(response);

        }, err => {
          commit('auth_error');
          localStorage.removeItem('token');
          reject(err);
        });
      })
    },

    getNotes({commit}, params){
      return new Promise((resolve, reject) => {
        commit('get_notes');
        Vue.http.get('/api/notes/', {params: params}).then(response => {
          commit('get_notes_success', response.body);
          commit('set_pagination_note');
          resolve(response);

        }, err => {
          commit('notes_error');
          reject(err);
        });
      })
    },
    addNote({dispatch, commit}, note){
      return new Promise((resolve, reject) => {
        commit('add_note');
        Vue.http.post('/api/notes/', note).then(response => {
          commit('add_note_success', response.body);
          dispatch('getNotes');
          resolve(response);

        }, err => {
          commit('add_note_error');
          reject(err);
        });
      })
    },
    editNote({dispatch, commit}, note){
      return new Promise((resolve, reject) => {
        commit('edit_note');
        Vue.http.put(`/api/notes/${note.id}/`, note).then(response => {
          commit('edit_note_success', response.body);
          dispatch('getNotes');
          resolve(response);

        }, err => {
          commit('edit_note_error');
          reject(err);
        });
      })
    },
    toggleUUID({dispatch, commit}, note){
      return new Promise((resolve, reject) => {
        Vue.http.put(`/api/notes/${note.id}/toggle_uuid/`, note).then(response => {
          commit('toggle_uuid_success', response.body);
          resolve(response);
        }, err => {
          commit('toggle_uuid_error');
          reject(err);
        });
      })
    },
    toggleFavorite({dispatch, commit}, note){
      return new Promise((resolve, reject) => {
        Vue.http.put(`/api/notes/${note.id}/toggle_favorite/`, note).then(response => {
          commit('toggle_favorite_success', response.body);
          resolve(response);
        }, err => {
          commit('toggle_favorite_error');
          reject(err);
        });
      })
    },
    getNote({commit}, id){
      return new Promise((resolve, reject) => {
        commit('get_note');
        Vue.http.get(`/api/notes/${id}/`).then(response => {
          commit('get_note_success', response.body);
          resolve(response);
        }, err => {
          commit('notes_error');
          reject(err);
        });
      })
    },
    setNote({commit, note}) {
      commit('get_note_success', note)
    },
    setEmptyNote({commit}) {
      commit('set_empty_note')
    },
    getCategory({commit}){
      return new Promise((resolve, reject) => {
        commit('get_category');
        Vue.http.get('/api/category/').then(response => {
          commit('get_category_success', response.body);
          resolve(response);

        }, err => {
          commit('category_error');
          reject(err);
        });
      })
    },
  },
  strict: debug
});
