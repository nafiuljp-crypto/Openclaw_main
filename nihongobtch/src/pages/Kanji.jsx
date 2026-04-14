import { useState, useEffect } from 'react';
import { kanjiN3 } from '../data/kanji-n3';
import { kanjiN2 } from '../data/kanji-n2';
import { kanjiN1 } from '../data/kanji-n1';

const Kanji = () => {
  const [level, setLevel] = useState('n3');
  const [kanji, setKanji] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const kanjiData = {
    n3: kanjiN3,
    n2: kanjiN2,
    n1: kanjiN1,
  };

  useEffect(() => {
    const data = kanjiData[level] || kanjiN3;
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setKanji(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setUserInput('');
    setFeedback(null);
  }, [level]);

  const current = kanji[currentIndex];

  const checkAnswer = () => {
    if (!current) return;
    
    const correct = current.kunyomi.split('、')[0];
    const input = userInput.trim().toLowerCase();
    
    if (input === correct.toLowerCase() || input === current.onyomi.split('、')[0].toLowerCase()) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNext = () => {
    if (currentIndex < kanji.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setUserInput('');
      setFeedback(null);
    } else {
      // Reset
      const shuffled = [...kanji].sort(() => Math.random() - 0.5);
      setKanji(shuffled);
      setCurrentIndex(0);
      setShowAnswer(false);
      setUserInput('');
      setFeedback(null);
    }
  };

  const handleReveal = () => {
    setShowAnswer(true);
    setFeedback('revealed');
  };

  return (
    <div className="kanji-page">
      <div className="kanji-header">
        <h1>✏️ Kanji Practice</h1>
        <select 
          className="level-select" 
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="n3">JLPT N3</option>
          <option value="n2">JLPT N2</option>
          <option value="n1">JLPT N1</option>
        </select>
      </div>

      <p className="progress-info">
        Kanji {currentIndex + 1} of {kanji.length}
      </p>

      {current && (
        <>
          <div className="kanji-card">
            <div className="kanji-character">{current.character}</div>
            
            <div className="kanji-info">
              <div className="kanji-info-item">
                <div className="kanji-info-label">On'yomi</div>
                <div className="kanji-info-value">{current.onyomi}</div>
              </div>
              <div className="kanji-info-item">
                <div className="kanji-info-label">Kun'yomi</div>
                <div className="kanji-info-value">{current.kunyomi}</div>
              </div>
              <div className="kanji-info-item">
                <div className="kanji-info-label">Strokes</div>
                <div className="kanji-info-value">{current.strokeCount}</div>
              </div>
            </div>

            <div className="kanji-meaning">{current.meaning}</div>

            {current.exampleJa && (
              <div className="kanji-example">
                <div className="kanji-example-jp">{current.exampleJa}</div>
                <div className="kanji-example-en">{current.exampleEn}</div>
              </div>
            )}

            {!showAnswer && (
              <>
                <input
                  type="text"
                  className="kanji-input"
                  placeholder="Type the kun'yomi reading..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                />
                <p className="kanji-hint">Type the reading in hiragana (hint: kun'yomi)</p>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={handleReveal}>
                    Show Answer
                  </button>
                  <button className="btn btn-primary" onClick={checkAnswer}>
                    Check
                  </button>
                </div>
              </>
            )}

            {showAnswer && (
              <div className="quiz-next">
                <button className="btn btn-primary" onClick={handleNext}>
                  {currentIndex < kanji.length - 1 ? 'Next Kanji →' : 'Restart'}
                </button>
              </div>
            )}

            {feedback && (
              <div className={`quiz-feedback ${feedback}`} style={{ marginTop: '16px' }}>
                {feedback === 'correct' && '✅ Correct!'}
                {feedback === 'incorrect' && `❌ Answer: ${current.kunyomi.split('、')[0]}`}
                {feedback === 'revealed' && `Reading: ${current.kunyomi}`}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Kanji;