// THE GAME DECK (THE RAINBOW)

import { of, fromEvent, merge, Subject } from "rxjs";
import { map, tap, scan, exhaustMap, delay, filter } from "rxjs/operators";

const ORDER = ['magenta', 'red', 'orange', 'yellow']

const deck = [...document.querySelectorAll(".card")]
const clicks = []

const deckController = new Subject()

const deck$ = deckController.asObservable()
  .pipe(
    scan(dispatcher, {}),
  )

const card$ = deck$.pipe(filter(e => e.type === 'reveal'))

const uiShowCard$ = deck$.pipe(
  tap(putContent),
  delay(2000),
  tap(resetCard),
)



function dispatcher(exec, action) {
  /* scan operators lookup
    | get colour key from deck
    | shuffle deck / start new game etc
  */

  if(action?.type === "reveal") {
    const index = parseInt(action.id) - 1
    exec = { index, colour: ORDER[index], type: action.type }
  }

  return exec
}

function putContent(data) {
  deck[data.index].innerHTML = data.colour
  deck[data.index].classList.add(`active-${data.colour}`)
}

function resetCard(data) {
  const col = deck[data.index].innerHTML.toLowerCase()
  deck[data.index].classList.remove(`active-${col}`)
  deck[data.index].innerHTML = "???"
}

export { deckController, deck$, card$, uiShowCard$ }