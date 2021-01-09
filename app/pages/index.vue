<template>
  <v-dialog v-model="dialog" width="100%" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="12">      
          <div v-for="(matchList, date) in matches" :key="`date__${date}`" class="dateRow">
            <v-banner single-line class="banner">
              {{ date }}
            </v-banner>
            <div class="cardList">
              <v-card
                outlined
                v-for="(match, key) in matchList"
                :key="`match_${match.title}_${key}`"
                v-bind="attrs"
                v-on:click="link = match.id"
                v-on="on"
              >
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="headline mb-1">
                      {{ match.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ match.league }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </template>

    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="dialog = false; link = false"
        >
          關閉
        </v-btn>
      </v-card-actions>

      <v-card-text v-if="link"> 
        <iframe width="100%" :height="height" :src="link" />
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import reduce from 'lodash/reduce'

export default {
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    try {
      await store.dispatch('matches/fetchMatches')
     } catch (err) {
       console.log(err)
       return
     }
  },
  data () {
    return {
      dialog: false,
      link: false,
      width: 0,
      height: 0,
    }
  },
  computed: {
    ...mapGetters({
      getMatches: 'matches/getMatches',
    }),
    matches () {
      const matches = this.getMatches()
      return reduce(matches, (obj, match) => {
        if (obj[match.start]) {
          obj[match.start].push(match)
        } else {
          obj[match.start] = [match]
        }
        return obj
      }, {})
    }
  },
  components: {
  },
  watch: {
    dialog (v) {
      if (!v) {
        this.link = false
      } else {
        this.height = window.innerHeight - 82
        this.width = window.screen.width
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.dateRow
  > div.v-banner
    background-color rgb(128 128 128 / 31%)
    font-size 1.3rem
    text-align center
.cardList
  display flex
  justify-content flex-start
  flex-wrap wrap
  > div
    margin 15px
</style>