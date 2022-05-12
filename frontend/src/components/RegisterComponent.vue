<template>
  <div>
    <h4>Регистрация</h4>
    <b-form @submit.prevent="register" class="register-form">
      <b-form-group
              id="input-group-username"
              label="Имя пользователя:"
              label-for="input-username">
        <b-form-input
                id="input-username"
                v-model="form.username"
                type="text"
                required
                placeholder="Имя пользователя">
        </b-form-input>
      </b-form-group>
      <b-form-group
              id="input-group-email"
              label="Email:"
              label-for="input-email">
        <b-form-input
                id="input-email"
                v-model="form.email"
                type="text"
                required
                placeholder="email">
        </b-form-input>
      </b-form-group>
      <b-form-group
              id="input-group-password"
              label="Пароль:"
              label-for="input-password">
        <b-form-input
                id="input-password"
                v-model.trim="$v.form.password.$model"
                type="password"
                required
                placeholder="Пароль">
        </b-form-input>
      </b-form-group>
      <b-form-group
              id="input-group-password_confirmation"
              label="Повтор пароля:"
              :state="!$v.form.password.$error"
              label-for="input-password_confirmation">
        <b-form-input
                id="input-password_confirmation"
                v-model.trim="$v.form.password_confirmation.$model"
                type="password"
                :state="!$v.form.$error"
                required
                placeholder="Повтор пароля">
        </b-form-input>
      </b-form-group>
      <div class="error" v-if="$v.form.$error">Пароли не совпадают.</div>
      <b-button type="submit" variant="primary">Зарегестрироваться</b-button>
    </b-form>
  </div>
</template>

<script>
import { required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'RegisterComponent',
  data(){
    return {
      form: {
        username : "",
        email : "",
        password : "",
        password_confirmation : "",
      }
    }
  },
  validations: {
    form: {
      password: {
        minLength: minLength(2),
        required,
      },
      password_confirmation: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    register: function () {
      this.$store.dispatch('register', this.form)
    }
  }
};
</script>
<style scoped>
  .register-form {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
  }
  .error {
    color: red;
  }
</style>
