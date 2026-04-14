import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vocabN3 } from '../data/vocab-n3';
import { vocabN2 } from '../data/vocab-n2';
import { vocabN1 } from '../data/vocab-n1';

const Flashcards = () => {
  const [searchParams] = useSearchParams();
  const initialLevel = searchParams.get('level') || 'n3';
  
  const [level, setLevel] = useState(initialLevel);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studied, setStudied] = useState([]);

  useEffect(() => {
    const vocabData = {
      n3: vocabN3,
      n2: vocabN2,
      n1: vocabN1,
    };
    const shuffled = [...(vocabData[level] || vocabN3)].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [level]);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (quality) => {
    setStudied(prev => [...prev, { card: currentCard, quality, level }]);
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Reset when done
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="flashcards-page">
      <div className="flashcards-header">
        <h1>📚 Flashcards</h1>
        <div className="header-controls">
          <select 
            className="level-select" 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="n3">JLPT N3</option>
            <option value="n2">JLPT N2</option>
            <option value="n1">JLPT N1</option>
          </select>
          <button className="btn btn-secondary" onClick={handleShuffle}>🔀 Shuffle</button>
        </div>
      </div>

      <p className="progress-info">
        Card {currentIndex + 1} of {cards.length} • Studied: {studied.length}
      </p>

      {currentCard && (
        <>
          <div className="flashcard-container" onClick={handleFlip}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
              <div className="flashcard-face flashcard-front">
                <div className="flashcard-kanji">{currentCard.kanji}</div>
                <div className="flashcard-kana">{currentCard.kana}</div>
                <p className="flashcard-hint">Click to reveal</p>
              </div>
              <div className="flashcard-face flashcard-back">
                <div className="flashcard-meaning">{currentCard.meaning}</div>
                <div className="flashcard-reading">{currentCard.romaji}</div>
                <span className="flashcard-pos">{currentCard.pos}</span>
              </div>
            </div>
          </div>

          <div className="flashcard-actions">
            <button className="action-btn wrong" onClick={() => handleNext(0)} title="Wrong">
              ❌
            </button>
            <button className="action-btn hard" onClick={() => handleNext(1)} title="Hard">
              😐
            </button>
            <button className="action-btn good" onClick={() => handleNext(2)} title="Good">
              😊
            </button>
            <button className="action-btn easy" onClick={() => handleNext(3)} title="Easy">
              😎
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Flashcards;