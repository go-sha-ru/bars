<template>
  <div>
    <b-form @submit.prevent="login" class="login-form">
      <b-form-group
              id="input-group-username"
              label="Имя пользователя:"
              label-for="input-username">
        <b-form-input
                id="input-1"
                v-model="form.username"
                type="text"
                required
                placeholder="Имя пользователя">
        </b-form-input>
      </b-form-group>
      <b-form-group
              id="input-group-password"
              label="Пароль:"
              label-for="input-password">
        <b-form-input
                id="input-password"
                v-model="form.password"
                type="password"
                required
                placeholder="Пароль">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Войти</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'LoginComponent',
  data(){
    return {
      form: {
        username : "",
        password : ""
      }
    }
  },
  methods: {
    login: function () {
      let username = this.form.username;
      let password = this.form.password;
      this.$store.dispatch('login', { username, password })
              .then(() => this.$router.push('/notes'))
              .catch(err => console.log(err))
    }
  }
};
</script>

<style scoped>
  .login-form {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
  }
</style>
