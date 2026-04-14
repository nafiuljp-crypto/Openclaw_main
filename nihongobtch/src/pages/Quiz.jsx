import { useState, useEffect } from 'react';
import { vocabN3 } from '../data/vocab-n3';
import { vocabN2 } from '../data/vocab-n2';
import { vocabN1 } from '../data/vocab-n1';

const Quiz = () => {
  const [level, setLevel] = useState('n3');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const allVocab = {
    n3: vocabN3,
    n2: vocabN2,
    n1: vocabN1,
  };

  const generateQuestions = () => {
    const vocab = allVocab[level];
    const shuffled = [...vocab].sort(() => Math.random() - 0.5).slice(0, 10);
    
    return shuffled.map((word) => {
      const otherWords = vocab.filter(w => w.id !== word.id);
      const wrongOptions = [...otherWords]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning);
      
      const options = [word.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      return {
        kanji: word.kanji,
        kana: word.kana,
        correct: word.meaning,
        options,
        romaji: word.romaji,
      };
    });
  };

  const startQuiz = () => {
    setQuestions(generateQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setWrong(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setQuizStarted(true);
  };

  const handleOptionClick = (option) => {
    if (showFeedback) return;
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    if (option === questions[currentQuestion].correct) {
      setScore(score + 1);
    } else {
      setWrong(wrong + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizStarted(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <h1>📝 Quiz Mode</h1>
        </div>
        
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '24px' }}>Test Your Knowledge</h2>
          <p style={{ color: '#757575', marginBottom: '32px' }}>
            10 questions • Multiple choice • Instant feedback
          </p>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Select Level:
            </label>
            <select 
              className="level-select" 
              value={level} 
              onChange={(e) => setLevel(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="n3">JLPT N3</option>
              <option value="n2">JLPT N2</option>
              <option value="n1">JLPT N1</option>
            </select>
          </div>
          
          <button className="btn btn-primary" onClick={startQuiz}>
            Start Quiz 🚀
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1>📝 {level.toUpperCase()} Quiz</h1>
        <div className="quiz-stats">
          <div className="quiz-stat">
            <div className="quiz-stat-value" style={{ color: '#43A047' }}>{score}</div>
            <div className="quiz-stat-label">Correct</div>
          </div>
          <div className="quiz-stat">
            <div className="quiz-stat-value" style={{ color: '#E53935' }}>{wrong}</div>
            <div className="quiz-stat-label">Wrong</div>
          </div>
        </div>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="quiz-card">
        <div className="quiz-question">
          <div className="quiz-kana">{q.kana}</div>
          <div className="quiz-kanji">{q.kanji}</div>
        </div>

        <div className="quiz-options">
          {q.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${selectedOption === option ? (option === q.correct ? 'correct' : 'incorrect') : ''} ${showFeedback && option === q.correct ? 'correct' : ''} ${showFeedback ? 'disabled' : ''}`}
              onClick={() => handleOptionClick(option)}
              disabled={showFeedback}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`quiz-feedback ${selectedOption === q.correct ? 'correct' : 'incorrect'}`}>
            {selectedOption === q.correct ? '✅ Correct!' : `❌ The answer is: ${q.correct}`}
            <div style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.8 }}>
              {q.romaji}
            </div>
          </div>
        )}

        {showFeedback && (
          <div className="quiz-next">
            <button className="btn btn-primary" onClick={handleNext}>
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
            </button>
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', color: '#757575' }}>
        Question {currentQuestion + 1} of {questions.length}
      </p>
    </div>
  );
};

export default Quiz;