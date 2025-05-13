import { languages } from "./languages";
import { getFarewellText, getRandomWord } from "./utils";
import React from "react";
import clsx from "clsx";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

/*
1 -> farewell messages in status section
  2 - Fix ally issues
  3 -> make the new button work
  4 -> choose a random word from a list of words
  5 -> drop when the user wins 
  */

export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = React.useState(getRandomWord());
  const [guessedLetters, setGuessedLetters] = React.useState([]);
  const [correctLetters, setCorrectLetters] = React.useState([]);
  const [incorrectLetters, setIncorrectLetters] = React.useState([]);

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];

  /*number of guessed letters se niklsakte hain ..ki kitne guess kiye hain ..agr 1 kiya to left hai ..languages.length -1 -guessedLteers,.length */
  const numGuessesLeft = languages.length - 1 - guessedLetters.length;

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
    setCorrectLetters([]);
    setIncorrectLetters([]);
  }

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
    if (currentWord.toUpperCase().split("").includes(letter)) {
      setCorrectLetters((prevLetters) =>
        prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
      );
    } else {
      setIncorrectLetters((prevLetters) =>
        prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
      );
    }
  }

  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.toUpperCase().split("").includes(letter)
  ).length;

  var goneLanguages = "";
  if (wrongGuessCount > 0) {
    let i = 0;
    while (i < wrongGuessCount) {
      goneLanguages = languages[i].name;
      console.log(goneLanguages);
      i++;
    }
  }

  const isGameWon = currentWord
    .toUpperCase()
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const isGameLost = wrongGuessCount === languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const alphabetsArray = alphabet
    .toUpperCase()
    .split("")
    .map((letter) => {
      return (
        <button
          disabled={isGameOver}
          aria-disabled={isGameOver}
          key={nanoid()}
          onClick={() => addGuessedLetter(letter)}
          className={clsx(
            "alphabet",
            correctLetters.includes(letter) && "right-letter",
            incorrectLetters.includes(letter) && "wrong-letter"
          )}
        >
          {letter}
        </button>
      );
    });

  const wordArray = Array.from(currentWord.toUpperCase()).map((letter) => {
    return (
      <span
        key={nanoid()}
        className={clsx(
          "letter",
          isGameLost && !guessedLetters.includes(letter) && "displayRemaining"
        )}
      >
        {isGameLost ? letter : correctLetters.includes(letter) && letter}
      </span>
    );
  });
  const langGroup = languages.map((ele, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const className = clsx("container", isLanguageLost && "lost");
    return (
      <div
        className={className}
        key={ele.name}
        style={{ backgroundColor: ele.backgroundColor, color: ele.color }}
      >
        {ele.name}
      </div>
    );
  });
  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={800} />}
      <header>
        <div className="heading">Assembly: Endgame</div>
        <div className="description">
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </div>
      </header>
      {isGameWon && (
        <div className="game-status win" aria-live="polite">
          <span className="gs-first">You win!</span>
          <p className="gs-second">Well done! 🎉</p>
        </div>
      )}
      {isGameLost && (
        <div className="game-status lose" aria-live="polite">
          <span className="gs-first">Gameover!</span>
          <p className="gs-second">
            You Lose Better start learning Assembly 😭
          </p>
        </div>
      )}
      {isGameOver === false && (
        <div
          aria-live="polite"
          className={clsx("game-status", goneLanguages && "farewell-msg")}
        >
          <span>{goneLanguages && getFarewellText(goneLanguages)}</span>
        </div>
      )}

      <div className="language-containers">{langGroup}</div>
      <section className="word-box">{wordArray}</section>

      {/*This is a combined visually hidden aria live region */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is present`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          Current Word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank"
            )}
        </p>
      </section>
      <section className="keyboard">{alphabetsArray}</section>
      {isGameOver && (
        <button onClick={startNewGame} className="newgame-btn">
          New Game
        </button>
      )}
    </main>
  );
}
