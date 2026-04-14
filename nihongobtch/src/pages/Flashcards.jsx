import { useState, useEffect, useCallback } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const vocabData = {
      n3: vocabN3,
      n2: vocabN2,
      n1: vocabN1,
    };
    let data = vocabData[level] || vocabN3;
    if (searchTerm) {
      data = data.filter(c => 
        c.kanji.includes(searchTerm) || 
        c.kana.includes(searchTerm) || 
        c.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [level, searchTerm]);

  const saveProgress = (studiedCards) => {
    const saved = JSON.parse(localStorage.getItem('nihongo_progress') || '{}');
    studiedCards.forEach(({ card, quality, level: cardLevel }) => {
      if (!saved.byLevel) saved.byLevel = { n3: { studied: 0, correct: 0 }, n2: { studied: 0, correct: 0 }, n1: { studied: 0, correct: 0 } };
      saved.byLevel[cardLevel].studied++;
      if (quality >= 2) saved.byLevel[cardLevel].correct++;
      saved.totalStudied = (saved.totalStudied || 0) + 1;
      saved.correctAnswers = (saved.correctAnswers || 0) + (quality >= 2 ? 1 : 0);
      saved.wrongAnswers = (saved.wrongAnswers || 0) + (quality < 2 ? 1 : 0);
    });
    saved.lastStudied = new Date().toLocaleDateString();
    localStorage.setItem('nihongo_progress', JSON.stringify(saved));
  };

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (!isFlipped) handleFlip();
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      handleNext(2);
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      handleNext(0);
    }
  }, [isFlipped, currentCard, currentIndex, cards]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = (quality) => {
    const newStudied = [...studied, { card: currentCard, quality, level }];
    setStudied(newStudied);
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      saveProgress(newStudied);
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStudied([]);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flashcards-page">
      <div className="flashcards-header">
        <h1>📚 Flashcards</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
          />
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
        <br />
        <small style={{ opacity: 0.7 }}>Space to flip • Arrow keys to navigate • D = good • A = wrong</small>
      </p>

      {currentCard ? (
        <>
          <div className="flashcard-container" onClick={handleFlip}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
              <div className="flashcard-face flashcard-front">
                <div className="flashcard-kanji">{currentCard.kanji}</div>
                <div className="flashcard-kana">{currentCard.kana}</div>
                <button 
                  className="audio-btn" 
                  onClick={(e) => { e.stopPropagation(); speak(currentCard.kana); }}
                  title="Listen"
                >
                  🔊
                </button>
                <p className="flashcard-hint">Click to reveal</p>
              </div>
              <div className="flashcard-face flashcard-back">
                <div className="flashcard-meaning">{currentCard.meaning}</div>
                <div className="flashcard-reading">{currentCard.romaji}</div>
                <span className="flashcard-pos">{currentCard.pos}</span>
                {currentCard.exampleJa && (
                  <div className="flashcard-example">
                    <div className="flashcard-example-jp">{currentCard.exampleJa}</div>
                    <div className="flashcard-example-en">{currentCard.exampleEn}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flashcard-actions">
            <button className="action-btn wrong" onClick={() => handleNext(0)} title="Wrong (A)">
              ❌
            </button>
            <button className="action-btn hard" onClick={() => handleNext(1)} title="Hard">
              😐
            </button>
            <button className="action-btn good" onClick={() => handleNext(2)} title="Good (D)">
              😊
            </button>
            <button className="action-btn easy" onClick={() => handleNext(3)} title="Easy">
              😎
            </button>
          </div>
        </>
      ) : (
        <div className="quiz-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No cards found</h3>
          <p style={{ color: '#757575' }}>Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
