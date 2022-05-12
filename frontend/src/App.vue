<template>
  <div id="app">
    <div id="nav">
      <span v-if="!isLoggedIn"><router-link to="/login">Вход</router-link> | </span>
      <span v-if="!isLoggedIn"><router-link to="/register">Регистрация</router-link> | </span>
      <span v-if="isLoggedIn"><router-link to="/notes">Заметки</router-link> | </span>
      <span v-if="isLoggedIn"><a @click="logout" class="link">Выход</a></span>
    </div>
    <router-view/>
  </div>
</template>
<script>
  export default {
    computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
                .then(() => {
                  this.$router.push('/login')
                })
      }
    },
  }
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
