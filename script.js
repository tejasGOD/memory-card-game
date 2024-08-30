document.addEventListener("DOMContentLoaded", () => {
  let cardArray = [];
  const gameBoard = document.getElementById("gameBoard");
  const restartButton = document.getElementById("restartButton");
  const levelDisplay = document.getElementById("level");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let level = 1;
  let score = 0;
  let canPlay = false;

  function createCardArray(numPairs) {
    let array = [];
    for (let i = 1; i <= numPairs; i++) {
      array.push({ name: i.toString(), img: i.toString() });
      array.push({ name: i.toString(), img: i.toString() });
    }
    return array.sort(() => 0.5 - Math.random());
  }

  function createBoard() {
    console.log(`Creating board for level ${level}`);
    cardArray = createCardArray(level + 1);
    gameBoard.innerHTML = "";
    gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(
      Math.sqrt(cardArray.length)
    )}, 100px)`;
    for (let i = 0; i < cardArray.length; i++) {
      const card = document.createElement("div");
      card.setAttribute("class", "card show");
      card.setAttribute("data-id", i);
      card.innerHTML = cardArray[i].img;
      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
    }

    startCountdown(level);
  }

  function startCountdown(seconds) {
    canPlay = false;
    timerDisplay.textContent = `Memorize the cards... ${seconds}`;
    let countdown = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        timerDisplay.textContent = `Memorize the cards... ${seconds}`;
      } else {
        clearInterval(countdown);
        timerDisplay.textContent = "Go!";
        hideCards();
        canPlay = true;
      }
    }, 1000);
  }

  function hideCards() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      if (!card.classList.contains("matched")) {
        card.classList.remove("show");
        card.innerHTML = "";
      }
    });
  }

  function flipCard() {
    if (!canPlay) return;

    const cardId = this.getAttribute("data-id");
    if (
      cardsChosen.length < 2 &&
      !cardsChosenId.includes(cardId) &&
      !this.classList.contains("flipped")
    ) {
      cardsChosen.push(cardArray[cardId].name);
      cardsChosenId.push(cardId);
      this.classList.add("flipped");
      this.innerHTML = cardArray[cardId].img;
      if (cardsChosen.length === 2) {
        setTimeout(checkForMatch, 500);
      }
    }
  }

  function checkForMatch() {
    const cards = document.querySelectorAll(".card");
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (cardsChosen[0] === cardsChosen[1]) {
      cards[optionOneId].classList.add("matched");
      cards[optionTwoId].classList.add("matched");
      cardsWon.push(cardsChosen);
      score += 10;
    } else {
      cards[optionOneId].classList.remove("flipped");
      cards[optionTwoId].classList.remove("flipped");
      cards[optionOneId].innerHTML = "";
      cards[optionTwoId].innerHTML = "";
      score -= 10;
    }

    cardsChosen = [];
    cardsChosenId = [];
    scoreDisplay.textContent = `Score: ${score}`;

    if (score <= 0) {
      alert("Game over! Restarting...");
      restartGame();
    } else if (cardsWon.length === cardArray.length / 2) {
      setTimeout(levelUp, 500);
    }
  }

  function levelUp() {
    console.log("Level up!");
    level++;
    levelDisplay.textContent = `Level: ${level}`;
    cardsWon = [];
    createBoard();
  }

  function restartGame() {
    console.log("Restarting game...");
    level = 1;
    score = 0;
    levelDisplay.textContent = `Level: ${level}`;
    scoreDisplay.textContent = `Score: ${score}`;
    cardsWon = [];
    createBoard();
  }

  restartButton.addEventListener("click", restartGame);

  createBoard();
});
