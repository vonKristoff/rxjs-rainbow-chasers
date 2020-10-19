import { of, fromEvent, merge, Subject } from "rxjs";
import { map, tap, scan, exhaustMap, delay, filter, startWith, shareReplay } from "rxjs/operators";

const players = ['player-1']
const $bag = [...document.querySelectorAll(".points")]

// rearrange to match bag (for player)
const ORDER = ['magenta', 'red', 'orange', 'yellow'] 

const hand = ['orange', 'yellow','magenta', 'red'] 

let offset = 0// (ORDER - hand) * -1

let bag = []

initBag()



const playerController = new Subject()

const defaultAction = { type: 'init' }

const player$ = playerController.asObservable()
  .pipe(
    startWith(defaultAction),
    scan(dispatcher, defaultAction),
    shareReplay(1)
  )

function dispatcher(exec, action) {

  if(action.type === 'init') {
    showBagCards()
    console.log(bag, offset)
  }

  if(action.type === 'ADD_TO_BAG') {

    
    // nicely done mate 🧠

    const i = ORDER.indexOf(action.colour)
    const target = Math.abs(i + offset) % ORDER.length
    bag[target] = action.colour



    showBagCards()

    exec = { complete: true }
  }

  if(action.type === 'GET_OPTIONS') { 
    const options = [...new Set(parseOptions(getRainbowEnds()))]
    exec = { player: action.player, options, type: 'options' }
  }

  return exec
}

function initBag() {
  const start = Math.floor(Math.random()*ORDER.length)
  bag = ORDER.map(e => false)
  const random = ORDER[Math.floor(Math.random()*ORDER.length)]
  bag[start] = random

  offset = (ORDER.indexOf(random) - start) * -1
}

function showBagCards() {
  $bag.forEach(($el, i) => {
    if(bag[i]) $el.classList.add(`active-${bag[i]}`)
  })
}

function splitBag(col) {
  return bag.reduce((accum, val) => {
    if(typeof val != typeof accum.prev) {
      accum.group++
      accum.groups.push([])
      accum.prev = val
    }
    accum.groups[accum.group].push(val)
    return accum
  }, { prev: null, groups: [], group: -1 })
}

function getRainbowEnds() {
   return bag.reduce((accum, val) => {
    
    if(typeof val != typeof accum.prev) {
      const option = val ? val 
        : accum.prev && typeof val === 'boolean' ? accum.prev
        : null

      if(option !== null) accum.options.push(option)
    }
    accum.prev = val
    return accum
  }, { prev: null, options: [] })
}

function parseOptions({ options }) {
  return options.reduce((options, colour) => {
    const i = ORDER.indexOf(colour)
    const prev = (i - 1) < 0 
      ? ORDER[ORDER.length - 1] 
      : ORDER[i - 1]
    const next = (i + 1) === ORDER.length 
      ? ORDER[0] 
      : ORDER[i + 1]
    return [...options, prev, next]
  }, [])
}

export { player$, playerController }