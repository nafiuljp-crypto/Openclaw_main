import { useState, useEffect, useCallback } from 'react';
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
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [quizCount, setQuizCount] = useState(0);

  const allVocab = {
    n3: vocabN3,
    n2: vocabN2,
    n1: vocabN1,
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nihongo_progress') || '{}');
    setBestStreak(saved.bestStreak || 0);
  }, []);

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
        exampleJa: word.exampleJa,
        exampleEn: word.exampleEn,
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
    setStreak(0);
    setQuizCount(c => c + 1);
  };

  const handleOptionClick = (option) => {
    if (showFeedback) return;
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    if (option === questions[currentQuestion].correct) {
      setScore(s => s + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
          const saved = JSON.parse(localStorage.getItem('nihongo_progress') || '{}');
          saved.bestStreak = newStreak;
          localStorage.setItem('nihongo_progress', JSON.stringify(saved));
        }
        return newStreak;
      });
    } else {
      setWrong(w => w + 1);
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizStarted(false);
      saveQuizResult();
    }
  };

  const saveQuizResult = () => {
    const saved = JSON.parse(localStorage.getItem('nihongo_progress') || '{}');
    saved.totalStudied = (saved.totalStudied || 0) + score + wrong;
    saved.correctAnswers = (saved.correctAnswers || 0) + score;
    saved.wrongAnswers = (saved.wrongAnswers || 0) + wrong;
    saved.lastStudied = new Date().toLocaleDateString();
    localStorage.setItem('nihongo_progress', JSON.stringify(saved));
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const accuracy = score + wrong > 0 ? Math.round((score / (score + wrong)) * 100) : 0;

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <h1>📝 Quiz Mode</h1>
        </div>
        
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          {quizCount > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3>Last Quiz</h3>
              <p style={{ fontSize: '1.25rem' }}>
                Score: {score}/{questions.length} ({accuracy}%)
              </p>
            </div>
          )}
          
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
          <div className="quiz-stat">
            <div className="quiz-stat-value" style={{ color: '#FF9800' }}>🔥 {streak}</div>
            <div className="quiz-stat-label">Streak</div>
          </div>
        </div>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="quiz-card">
        <div className="quiz-question">
          <div className="quiz-kana">
            {q.kana}
            <button 
              className="audio-btn" 
              onClick={() => speak(q.kana)}
              style={{ marginLeft: '12px', fontSize: '1rem' }}
            >
              🔊
            </button>
          </div>
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
            {q.exampleJa && (
              <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'left' }}>
                <div style={{ fontSize: '1rem', marginBottom: '4px' }}>{q.exampleJa}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{q.exampleEn}</div>
              </div>
            )}
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
