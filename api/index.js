const express = require('express');
const app = express();
const flatten = require('lodash/flatten')
const filter = require('lodash/filter')
const take = require('lodash/take')
const trim = require('lodash/trim')
const get = require('lodash/get')
const map = require('lodash/map')
const cheerio = require('cheerio')
const moment = require('moment')
const axios = require('axios')
const axiosRetry = require('axios-retry')

axiosRetry(axios, { reties: 10 })

const featuredLeague = [
  '西甲',
  '意甲',
  '法甲',
  '法甲',
  '英足总杯',
  '德甲',
  '欧冠杯',
  '欧联杯',
  '欧国联',
  '西杯',
  '意杯',
  '德国杯',
  '英联杯',
  '世界杯',
]

app.get('/', async (req, res) => {
  try {
    const source = await axios.get('https://www.b8b8.tv/class/soccer/').then(({ data }) => {
      const $ = cheerio.load(data)
      const matchRows = $('#rightbox > #righteventbox ul')

      const allMatches = flatten(map(take(matchRows, 2), (matchRow, i) => {
        const lis = $(matchRow).find('li')
        return map(lis, _li => {
          const li = $(_li)
          const span = li.find('span')
          
          const _time = get(span, '[0]')
          const league = get(span, '[2]')
          const __link = get(span, '[3]')
          const _link = __link ? $(__link).find('a').attr('href') : ''
          const link = trim(trim(_link, '/play/'), '.htm') || ''
          const title = __link ? $(__link).find('a').text() : ''

          const date = get(link.split('/'), '[0]', '')
          const time = _time ? $(_time).text() : ''

          const start = moment(`${date} ${time}`, 'YYYYMMDD HH:mm')
          if (start.isValid()) {
            const before2Hours = moment().subtract(2, 'hours')
            return {
              title,
              start: start.format('YYYY/MM/DD HH:mm'),
              ended: before2Hours > start,
              league: league ? $(league).find('a').text() : '',
              id: `https://live.sportlive.cc/live/${get(link.split('/'), '[1]', '')}`
            }
          }
        })
      }))

      return {
        matches: allMatches,
        featuredMatches: filter(allMatches, m => {
          return featuredLeague.indexOf(m.league) > -1
        })
      }
    })
    res.json(source)
  } catch (err) {
    console.log(err)
    res.json({})
  }
})

const port = 3000;

app.listen(port, () => console.log('Server running...'));