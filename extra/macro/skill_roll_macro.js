const player = game.users.current.character;

let data = await Dialog.wait({
    title: 'Rolling dices',
    content: `
        <form>
            <div class="form-group">
                <label for="numberD20">Number of D20</label>
                <div class="form-fields">
                    <input type="number" name="numberD20" placeholder="2">
                </div>
            </div>
            <div class="form-group">
                <label for="tn">TN</label>
                <div class="form-fields">
                    <input type="number" name="tn" placeholder="13">
                </div>
            </div>
            <div class="form-group">
                <label for="focus">Focus</label>
                <div class="form-fields">
                    <input type="number" name="focus" placeholder="0">
                </div>
            </div>
			<div class="form-group">
                <label for="complication">Complication</label>
                <div class="form-fields">
                    <input type="number" name="complication" placeholder="20">
                </div>
            </div>
			<div class="form-group">
				<label for="infinity">Infinity Point</label>
				<div class="form-fields">
					<input type="checkbox" name="infinity">
				</div>
			</div>
      </form>
    `,
    buttons: {
        roll: {
            icon: '<i class="fas fa-check"></i>',
            label: 'Roll',
            callback: (html) => new FormDataExtended(html[0].querySelector("form")).object
        },
    },
    default: 'roll',
    close: () => {
        console.log('Rolling dices Dialog Closed');
    }
});

console.log(data) // data is an object containing keys based on the name attributes of the inputs and selects.

let nd20 = data.numberD20?data.numberD20:2;
let ntn = data.tn?data.tn:13;
let nfoc = data.focus?data.focus:0;
let ncomp = data.complication?data.complication:20;
let binf = data.infinity?true:false;

/**
 * defining a new Roll
 */
const roll = new Roll(nd20+"d20");

await roll.evaluate();

/**
 * defining a new Roll
 */

let chatContent = `<p>Rolling <b>${nd20}d20</b> Vs <b>${ntn} </b>`;

if (nfoc > 0) {
	chatContent += `<i>with focus ${nfoc}</i></p>`
} else {
    chatContent += `</p>`
}

const promise = roll.getTooltip();

promise.then(function (result) {

  let success = 0;
  let extraSuccess = 0;
  let failure = 0;
  let infinitySuccess = (binf)?1+((nfoc>0)?1:0):0;
  
  for (let i = 0; i < roll.terms[0].results.length; i++) {
	  let score = roll.terms[0].results[i].result;
	  if (score <= ntn)
		  success += 1;
	  if (score <= nfoc)
		  extraSuccess += 1;
	  if (score >= ncomp)
		  failure += 1;
  }
  
  chatContent += `<p><i>${success} successes due to normal roll.</i></p>`;
  if (extraSuccess > 0) {
    chatContent += `<p><i>+${extraSuccess} successes due to active focus.</i></p>`
  }
  if (infinitySuccess > 0) {
    chatContent += `<p><i>+${infinitySuccess} successes due to Infinity Point.</i></p>`
  }
  if (failure > 0) {
	chatContent += `<p><i>But ${failure} complication happened.</i></p>`
  }

  let resultDiceText = `<div class="dice-tooltip">`;
  resultDiceText += `<section class="tooltip-part">`;
  resultDiceText += `<div class="dice">`;
  resultDiceText += `<header class="part-header flexrow">`;
  resultDiceText += `<span class="part-formula">${nd20}D20 TN ${ntn}</span>`;
  resultDiceText += `<span class="part-total">${success+extraSuccess+infinitySuccess}</span>`;
  resultDiceText += `</header>`;
  resultDiceText += `<ol class="dice-rolls">`;
  for (let i = 0; i < roll.terms[0].results.length; i++) {
    resultDiceText += `<li class="roll die d20`;
	if (roll.terms[0].results[i].result <= ntn) {
		resultDiceText += ` max`;
	}
	if (roll.terms[0].results[i].result >= ncomp) {
		resultDiceText += ` min`;
	}
	resultDiceText += `">${roll.terms[0].results[i].result}</li>`;
  }
  if (binf) {
	resultDiceText += `<li class="roll die d20 max">[1]</li>`;
  }
  resultDiceText += `</ol>`;
  resultDiceText += `</div>`;
  resultDiceText += `</section>`;
  resultDiceText += `</div>`;

  chatContent += resultDiceText;
  
  const chatData = {
    user: game.userId,
    content: chatContent,
  };
  ChatMessage.create(chatData, {});
});