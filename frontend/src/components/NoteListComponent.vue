<template>
  <div class="">
    <h1>
      Список заметок ({{notesCount}})
      <b-button @click="editNote(null)"><b-icon icon="plus"></b-icon></b-button>
    </h1>
    <noteEditComponent></noteEditComponent>
    <b-table striped hover
             td="text-left"
             @sort-changed="sortingChanged"
             @filtered="filterChange"
             :items="notes"
             :fields="fields"
             :current-page="currentPage"
             :no-local-sorting="true"
             :no-provider-paging="false"
             :per-page="perPage">
      <template v-slot:thead-top="data">
        <b-tr>
          <b-th>
            <b-form-input v-model="filters.title__contains" placeholder="Фильтр по заголовку"  @keyup.enter="filterTitle"></b-form-input>
          </b-th>
          <b-th></b-th>
          <b-th>
            <date-range-picker
                    ref="picker"
                    :ranges="false"
                    :locale-data="localDate"
                    v-model="dateRange"
                    @update="filterCreatedAt">
              <template v-slot:input="picker" style="min-width: 350px;">
                {{ picker.startDate | date}} - {{ picker.endDate | date }}
              </template>
            </date-range-picker>
          </b-th>
          <b-th>
            <b-form-select id="select-category"
                           @change="categoryChange"
                           v-model="filters.category"
                           :options="categoryList"
                           value-field="id"
                           text-field="name">
              <template v-slot:first>
                <b-form-select-option :value="null">-- Все --</b-form-select-option>
              </template>
            </b-form-select>
          </b-th>
          <b-th>
            <b-form-group label="">
              <b-form-radio-group
                      id="btn-radios-3"
                      v-model="filters.is_favorite"
                      :options="isFavoriteChoice"
                      buttons
                      stacked
                      @change="filterFavorite"
                      name="radio-btn-stacked">

              </b-form-radio-group>
            </b-form-group>
          </b-th>
          <b-th>1</b-th>
        </b-tr>
      </template>

      <template v-slot:cell(created_at)="data">
        {{data.value | date }}
      </template>

      <template v-slot:cell(is_favorite)="data">
        <b-button v-b-tooltip.hover title="Сделать избранной" @click="toggleFavorite(data.item)"><b-icon-check></b-icon-check></b-button>
        <b-icon-check v-if="data.value"></b-icon-check>
      </template>

      <template v-slot:cell(uuid)="data" class="text-left">
        <template v-if="data.value === ''">
          <b-button @click="toggleUUID(data.item)">Получить ссылку</b-button>
        </template>
        <template v-else>
          <a :href="'/note/' + data.value" target="_blank">Ссылка</a>
          <b-button @click="toggleUUID(data.item)"><b-icon-x-circle></b-icon-x-circle></b-button>
        </template>
      </template>

      <template v-slot:cell(action)="data">
        <b-button @click="editNote(data)">
          <b-icon-pencil></b-icon-pencil>
        </b-button>
      </template>
    </b-table>
    <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            @change="getPage"
    ></b-pagination>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import noteEditComponent from './NoteEditComponent'
import DateRangePicker from 'vue2-daterange-picker'
import moment from 'moment'

export default {
  name: 'NoteListComponent',
  components: {
    noteEditComponent,
    DateRangePicker,
  },
  data() {
    return {
      localDate:{
        direction: 'ltr',
        format: 'dd.mm.yyyy',
        separator: ' - ',
        applyLabel: 'Применить',
        cancelLabel: 'Отмена',
        weekLabel: 'W',
        customRangeLabel: 'Промежуток',
        daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        firstDay: 0
      },
      dateRange:{
        startDate: null,
        endDate: null
      },
      isFavoriteChoice: [
        {text: 'Все', value: 'Unknown'},
        {text: 'Избранные', value: 'true'},
        {text: 'Не избранные', value: 'false'},
      ],
      filters: {
        title__contains: "",
        created_at_after: null,
        created_at_before: null,
        category: "",
        is_favorite: null,
      },
      fields: [
        {key: 'title', label: 'Заголовок',},
        {key: 'content', label: 'Содержимое заметки',},
        {key: 'created_at', label: 'Дата создания', sortable: true},
        {key: 'category_name', label: 'Категория заметок', sortable: true},
        {key: 'is_favorite', label: 'Избранное', sortable: true},
        {key: 'uuid', label: 'Ссылка',},
        {key: 'action', label: 'Действия',},
  ]
    }
  },
  created() {
    this.$store.dispatch('getNotes', {});
    this.$store.dispatch('getCategory');
  },
  mounted() {
  },
  computed: {
    ...mapGetters({
      categoryList: "categoryList",
      notesCount: 'notesCount',
      notes: 'notesList',
      totalRows: 'totalRows',
      currentNote: 'currentNote',
      perPage: 'perPage',
      numberOfPages: 'numberOfPages',
    }),
    currentPage: {

      get: function () {
        return this.$store.state.currentPage
      },
      set: function (newValue) {

      }
    }
  },
  filters: {
    date(value) {
      moment.locale('ru')
      return value ? moment(value).format('LL') : "";
    }
  },
  methods: {
    getPage(page) {
      this.$store.dispatch('getNotes', {page: page})
    },
    toggleUUID(note) {
      this.$store.dispatch('toggleUUID', note)
    },
    toggleFavorite(note) {
      this.$store.dispatch('toggleFavorite', note)
    },
    editNote(note) {
      if (note) {
        this.$store.dispatch('getNote', note.item.id).then(
                data => {
                  this.$bvModal.show('modal-note-edit')
                }
        )
      } else {
        this.$store.dispatch('setEmptyNote')
        this.$bvModal.show('modal-note-edit')
      }
    },
    sortingChanged(ctx) {
      let params = {}
      params['ordering'] = ctx['sortDesc'] ? "" : "-"
      let sortBy = ctx['sortBy'] === 'category_name' ? 'category' : ctx['sortBy']
      params['ordering'] += sortBy
      this.$store.dispatch('getNotes', params)
    },
    filterChange(ctx) {
    },
    categoryChange(param) {
      this.$store.dispatch('getNotes', this.filters);
    },
    filterTitle() {
      this.$store.dispatch('getNotes', this.filters);
    },
    filterCreatedAt(params) {
      this.filters.created_at_before = moment(params.endDate).format('YYYY-MM-DD')
      this.filters.created_at_after = moment(params.startDate).format('YYYY-MM-DD')

      this.$store.dispatch('getNotes', this.filters)
    },
    filterFavorite(params) {
      this.filters.is_favorite = params
      this.$store.dispatch('getNotes', this.filters)
    }
  },
 }
</script>

<style scoped>
  .text-left {
    text-align: left;
  }
</style>
