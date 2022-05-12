<template>
  <b-modal id="modal-note-edit" title="" @ok="handleOk" ref="modal">
    <b-form @submit.prevent="editNote" class="edit-note-form">
      <b-form-group
              id="input-group-title"
              label="Заголовок:"
              label-for="input-title">
        <b-form-input
                id="input-title"
                v-model="form.title"
                type="text"
                required
                placeholder="Заголовок">
        </b-form-input>
      </b-form-group>
      <b-form-group
              id="input-group-content"
              label="Содержимое заметки"
              label-for="input-content">
        <b-form-textarea
                id="textarea"
                v-model="form.content"
                placeholder="Заметка"
                rows="3"
                max-rows="6"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
              id="select-group-category"
              label="Категория:"
              label-for="select-category">
        <b-form-select id="select-category"
                       v-model="form.category"
                       :options="categoryList"
                       value-field="id"
                       text-field="name">
          <template v-slot:first>
            <b-form-select-option :value="null" disabled>-- Выберите категорию --</b-form-select-option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group
              id="checkbox-group-is_favorite"
              label=""
              label-for="checkbox-is_favorite">
        <b-form-checkbox
                id="checkbox-is_favorite"
                v-model="form.is_favorite"
                name="checkbox-is_favorite"
                unchecked-value="false">Избранное</b-form-checkbox>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'noteEditComponent',
  data() {
    return {
    }
  },
  created() {
    this.$store.dispatch('getCategory');
  },
  computed: {
    ...mapGetters({
      categoryList: 'categoryList',
    }),
    form: {
      get: function () {
        return Object.assign({}, this.$store.state.currentNote)
      },
      set: function (newValue) {

      }
    }
  },
  methods: {
    editNote: function () {
      const action = this.form.id ? 'editNote' : 'addNote'
      this.$store.dispatch(action, this.form)
              .then(data =>
                this.$nextTick(() => {
                  this.$refs.modal.hide()
                }
              ))
              .catch(err => {})
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.editNote()
    },
  },
 }
</script>

<style scoped>
  .add-note {
    width: 100%;
    max-width: 430px;
    padding: 15px;
    margin: auto;
  }
</style>
