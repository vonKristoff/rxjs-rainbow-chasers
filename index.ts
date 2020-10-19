import './style.css';

import { of, fromEvent, merge, combineLatest } from "rxjs"
import { debounceTime, distinctUntilChanged, distinctUntilKeyChanged,  filter,  map, mergeMap,  tap } from "rxjs/operators"


import { click$ } from './buttons'
import { deckController, deck$, card$, uiShowCard$ } from './deck'
import { player$, playerController } from './players'

const reveal$ = click$.pipe(
  tap(e => deckController.next({ type: 'reveal', id: e.id }))
)

const chaseCard$ = card$.pipe(
  distinctUntilKeyChanged('colour'),
  tap(e => playerController.next({ type: 'GET_OPTIONS', colour: e.colour, player: 'player-1' })),
)

const matches$ = combineLatest(player$, deck$)
  .pipe(
    map(([turn, card]) => { 
      return { options: turn.options, colour: card.colour } 
    }),
    distinctUntilKeyChanged('colour'),
    filter(({options, colour}) => options.includes(colour)),
    tap(({ colour }) => playerController.next({ type: 'ADD_TO_BAG', colour }))
  )

const game = merge(reveal$, deck$, card$, uiShowCard$, chaseCard$, player$, matches$)

// start
game.subscribe()
