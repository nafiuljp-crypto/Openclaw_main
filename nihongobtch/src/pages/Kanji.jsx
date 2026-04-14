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
  const [studied, setStudied] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [mode, setMode] = useState('practice'); // 'practice' or 'review'

  const kanjiData = {
    n3: kanjiN3,
    n2: kanjiN2,
    n1: kanjiN1,
  };

  useEffect(() => {
    let data = kanjiData[level] || kanjiN3;
    if (searchTerm) {
      data = data.filter(k => 
        k.character.includes(searchTerm) || 
        k.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.onyomi.includes(searchTerm) ||
        k.kunyomi.includes(searchTerm)
      );
    }
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setKanji(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setUserInput('');
    setFeedback(null);
  }, [level, searchTerm]);

  const current = kanji[currentIndex];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.6;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getHint = () => {
    if (!current) return '';
    const kunyomi = current.kunyomi.split('、')[0];
    const firstReading = kunyomi.charAt(0);
    return `Starts with "${firstReading}" sound`;
  };

  const checkAnswer = () => {
    if (!current) return;
    
    const correct = current.kunyomi.split('、')[0];
    const input = userInput.trim().toLowerCase();
    const onyomiCorrect = current.onyomi.split('、')[0].toLowerCase();
    
    if (input === correct.toLowerCase() || input === onyomiCorrect) {
      setFeedback('correct');
      setStudied(s => s + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNext = () => {
    if (currentIndex < kanji.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setUserInput('');
      setFeedback(null);
      setShowHint(false);
    } else {
      const shuffled = [...kanji].sort(() => Math.random() - 0.5);
      setKanji(shuffled);
      setCurrentIndex(0);
      setShowAnswer(false);
      setUserInput('');
      setFeedback(null);
      setShowHint(false);
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search kanji..."
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
        </div>
      </div>

      <p className="progress-info">
        Kanji {currentIndex + 1} of {kanji.length} • Studied: {studied}
        <br />
        <small style={{ opacity: 0.7 }}>💡 Use hints if you're stuck!</small>
      </p>

      {current ? (
        <>
          <div className="kanji-card">
            <div className="kanji-character">
              {current.character}
              <button 
                className="audio-btn" 
                onClick={() => speak(current.kunyomi.split('、')[0])}
                title="Listen"
              >
                🔊
              </button>
            </div>
            
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

            {showHint && !showAnswer && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                background: '#FFF3E0',
                borderRadius: '8px',
                color: '#E65100',
                textAlign: 'center'
              }}>
                💡 Hint: {getHint()}
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
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" onClick={() => setShowHint(!showHint)}>
                    💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
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
      ) : (
        <div className="quiz-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No kanji found</h3>
          <p style={{ color: '#757575' }}>Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default Kanji;
