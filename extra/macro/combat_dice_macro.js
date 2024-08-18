const player = game.users.current.character;

let data = await Dialog.wait({
    title: 'Rolling dices',
    content: `
        <form>
            <div class="form-group">
                <label for="numberD6">Number of D6</label>
                <div class="form-fields">
                    <input type="number" name="numberD6" placeholder="0">
                </div>
            </div>
            <div class="form-group">
                <label for="fixe">Bonus fixe</label>
                <div class="form-fields">
                    <input type="number" name="fixe" placeholder="0">
                </div>
            </div>
			<div class="form-group">
				<label for="vicious">Vicious ?</label>
				<div class="form-fields">
					<input type="number" name="vicious" placeholder="0">
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

let nd6 = data.numberD6?data.numberD6:0;
let nfixe = data.fixe?data.fixe:0;
let nvic = data.vicious?data.vicious:0;

/**
 * defining a new Roll
 */
const roll = new Roll(nd6+"d6");

await roll.evaluate();

let chatContent = `<p>Rolling <b>${nfixe}+${nd6}[N]</b> </p>`;

const promise = roll.getTooltip();

promise.then(function (result) {

  let total = nfixe;
  let effects = 0;
  for (let i = 0; i < roll.terms[0].results.length; i++) {
	if (roll.terms[0].results[i].result === 1) {
      total += 1;
    }
	if (roll.terms[0].results[i].result === 2) {
      total += 2;
    }
	if (roll.terms[0].results[i].result === 6) {
      effects += 1;
	  total += nvic;
    }
  }

  chatContent += `<p><b>Total:</b> ${total}, <b>Effects:</b> ${effects}</p>`;

  if (nvic>0) {
    chatContent += `<p><i>with ${effects} Vicious(${nvic}) included</i></p>`;
  }
  
  let resultDiceText = `<div class="dice-tooltip">`;
  resultDiceText += `<section class="tooltip-part">`;
  resultDiceText += `<div class="dice">`;
  resultDiceText += `<header class="part-header flexrow">`;
  resultDiceText += `<span class="part-formula">${nfixe}+${nd6}[N]</span>`;
  resultDiceText += `<span class="part-total">${total}</span>`;
  resultDiceText += `</header>`;
  resultDiceText += `<ol class="dice-rolls">`;
  for (let i = 0; i < roll.terms[0].results.length; i++) {
    resultDiceText += `<li class="roll die d6`;
	if (roll.terms[0].results[i].result <= 2) {
		resultDiceText += ` max`;
	}
	if (roll.terms[0].results[i].result == 6) {
		resultDiceText += ` min`;
	}
	resultDiceText += `">${roll.terms[0].results[i].result}</li>`;
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