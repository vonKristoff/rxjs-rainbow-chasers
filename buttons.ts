// PLAYER UI INTERACTIONS
import { of, fromEvent, merge } from "rxjs";
import { map, tap } from "rxjs/operators";

const buttons = [...document.querySelectorAll(".btn")];
const clicks = [];

buttons.forEach(el => {
  clicks.push(
    fromEvent(el, "click").pipe(
      map(e => {
        return {
          dom: el,
          id: el.dataset.card,
          content: el.innerHTML
        }
      }),
    )
  );
});

const click$ = merge(...clicks)

export { click$ }
