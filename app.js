/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
const PlayerCtrl = (function() {
  const data = {
    scores: [0, 0],
    roundScore: 0,
    activePlayer: 0,
    gamePlaying: true
  };

  return {
    init: () => {
      data.gamePlaying = true;
      data.scores = [0, 0];
      data.roundScore = 0;
      data.activePlayer = 0;
    },
    getScore: activePlayer => data.scores[activePlayer],
    getRoudScore: () => data.roundScore,
    getActivePlayer: () => data.activePlayer,
    getGamePlaying: () => data.gamePlaying,
    addRoundScore: dice => (data.roundScore += dice),
    addScore: (score, activePlayer) => (data.scores[activePlayer] += score),
    updateGamePlaying: bool => (data.gamePlaying = bool),
    nextPlayer: () => {
      data.activePlayer === 0
        ? (data.activePlayer = 1)
        : (data.activePlayer = 0);
      data.roundScore = 0;
    }
  };
})();

const UICtrl = (function() {
  const UISelectors = {
    dice: ".dice",
    btnHold: ".btn-hold",
    btnRoll: ".btn-roll",
    newBtn: ".btn-new",
    currentScore: ".player-current-score",
    playerPanel: ".player-panel",
    playerScore: ".player-score",
    playerName: ".player-name"
  };
  const UIDoms = {
    diceDOM: document.querySelector(UISelectors.dice),
    scoreAllDOM: document.querySelectorAll(UISelectors.playerScore),
    currentAllDOM: document.querySelectorAll(UISelectors.currentScore),
    nameAllDOM: document.querySelectorAll(UISelectors.playerName),
    panelAllDOM: document.querySelectorAll(UISelectors.playerPanel)
  };

  return {
    init: () => {
      UIDoms.diceDOM.style.display = "none";
      UIDoms.scoreAllDOM.forEach(scoreDOM => (scoreDOM.textContent = "0"));
      UIDoms.currentAllDOM.forEach(currDOM => (currDOM.textContent = "0"));
      UIDoms.nameAllDOM.forEach(
        (nameDOM, index) => (nameDOM.textContent = `Player ${index + 1}`)
      );
      UIDoms.panelAllDOM.forEach(panelDOM => {
        panelDOM.classList.remove("winner");
        panelDOM.classList.remove("active");
      });

      UIDoms.panelAllDOM.forEach((panelDOM, index) => {
        if (index === 0) panelDOM.classList.add("active");
      });
    },
    getSelectors: () => UISelectors,
    displayDice: dice => {
      UIDoms.diceDOM.style.display = "block";
      UIDoms.diceDOM.src = `dice-${dice}.png`;
    },
    displayCurrentScore: (score, activePlayer) =>
      (UIDoms.currentAllDOM[activePlayer].textContent = score),
    displayScore: (scores, activePlayer) =>
      (UIDoms.scoreAllDOM[activePlayer].textContent = scores),
    displayWonPlayer: activePlayer => {
      UIDoms.nameAllDOM[activePlayer].textContent = "Winner!";
      UIDoms.diceDOM.style.display = "none";
      UIDoms.panelAllDOM[activePlayer].classList.add("winner");
      UIDoms.panelAllDOM[activePlayer].classList.remove("active");
    },
    nextPlayer: () => {
      UIDoms.currentAllDOM.forEach(currDOM => (currDOM.textContent = "0"));
      UIDoms.panelAllDOM.forEach(panelDOM =>
        panelDOM.classList.toggle("active")
      );

      UIDoms.diceDOM.style.display = "none";
    }
  };
})();

const App = (function(PlayerCtrl, UICtrl) {
  const loadEventListeners = () => {
    const UISelectors = UICtrl.getSelectors();
    // roll dice event
    document
      .querySelector(UISelectors.btnRoll)
      .addEventListener("click", rollDice);
    // hold score event
    document
      .querySelector(UISelectors.btnHold)
      .addEventListener("click", holdScore);
    // new game event
    document.querySelector(UISelectors.newBtn).addEventListener("click", init);
  };

  const rollDice = () => {
    if (PlayerCtrl.getGamePlaying()) {
      // Random number(1 ~ 6)
      let dice = Math.floor(Math.random() * 6) + 1;
      // Display the result
      UICtrl.displayDice(dice);
      // Update the round score if the rolled number was not a 1
      if (dice !== 1) {
        // Add score
        const roundScore = PlayerCtrl.addRoundScore(dice);
        UICtrl.displayCurrentScore(roundScore, PlayerCtrl.getActivePlayer());
      } else {
        // Next player
        PlayerCtrl.nextPlayer();
        UICtrl.nextPlayer();
      }
    }
  };

  const holdScore = () => {
    const activePlayer = PlayerCtrl.getActivePlayer();

    if (PlayerCtrl.getGamePlaying()) {
      // Add current score to global score
      PlayerCtrl.addScore(PlayerCtrl.getRoudScore(), activePlayer);
      const playerScore = PlayerCtrl.getScore(activePlayer);
      // update the UI
      UICtrl.displayScore(playerScore, activePlayer);
      // check if player won the game
      if (playerScore >= 20) {
        UICtrl.displayWonPlayer(activePlayer);
        PlayerCtrl.updateGamePlaying(false);
      } else {
        // Next player
        PlayerCtrl.nextPlayer();
        UICtrl.nextPlayer();
      }
    }
  };

  const init = () => {
    PlayerCtrl.init();
    UICtrl.init();
  };

  return {
    init: () => {
      loadEventListeners();
      init();
    }
  };
})(PlayerCtrl, UICtrl);

App.init();
