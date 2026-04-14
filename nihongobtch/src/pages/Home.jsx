import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vocabN3 } from '../data/vocab-n3';
import { vocabN2 } from '../data/vocab-n2';
import { vocabN1 } from '../data/vocab-n1';

const tips = [
  { jp: "千里の道も一歩から", en: "A journey of a thousand miles begins with a single step" },
  { jp: "継続は力なり", en: "Continuity is power" },
  { jp: "初心忘るべからず", en: "Never forget your beginner's spirit" },
  { jp: "雨にも負けず風にも負けず", en: "Unbowed by rain or wind" },
  { jp: "七転び八起き", en: "Fall seven times, stand up eight" },
];

const Home = () => {
  const [stats, setStats] = useState({ totalStudied: 0, streakDays: 0, accuracy: 0 });
  const [dailyTip] = useState(tips[Math.floor(Math.random() * tips.length)]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nihongo_progress') || '{}');
    setStats({
      totalStudied: saved.totalStudied || 0,
      streakDays: saved.streakDays || 0,
      accuracy: saved.totalStudied > 0 ? Math.round((saved.correctAnswers / saved.totalStudied) * 100) : 0
    });
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('おはようございます');
    else if (hour < 18) setGreeting('こんにちは');
    else setGreeting('こんばんは');
  }, []);

  const levels = [
    { 
      id: 'n3', 
      name: 'JLPT N3', 
      description: 'Intermediate Japanese - Building your foundation',
      vocabCount: vocabN3.length,
      kanjiCount: 300,
      color: '#4CAF50'
    },
    { 
      id: 'n2', 
      name: 'JLPT N2', 
      description: 'Pre-Advanced - Take your skills further',
      vocabCount: vocabN2.length,
      kanjiCount: 300,
      color: '#2196F3'
    },
    { 
      id: 'n1', 
      name: 'JLPT N1', 
      description: 'Advanced Japanese - Master the language',
      vocabCount: vocabN1.length,
      kanjiCount: 200,
      color: '#E91E63'
    },
  ];

  const totalStats = {
    totalVocab: vocabN3.length + vocabN2.length + vocabN1.length,
    totalKanji: 800,
    levelsCompleted: 0
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>日本語を勉強しよう</h1>
        <p className="greeting">{greeting} 🇯🇵</p>
        <p>Master Japanese vocabulary and kanji from N3 to N1</p>
        <div className="hero-buttons">
          <Link to="/flashcards" className="btn btn-primary">Start Learning</Link>
          <Link to="/quiz" className="btn btn-secondary">Take a Quiz</Link>
        </div>
      </div>

      {stats.totalStudied > 0 && (
        <div className="user-stats">
          <div className="user-stat">
            <span className="stat-value">{stats.totalStudied}</span>
            <span className="stat-label">Cards Studied</span>
          </div>
          <div className="user-stat">
            <span className="stat-value">{stats.accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="user-stat">
            <span className="stat-value">🔥 {stats.streakDays}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
      )}

      <div className="level-cards">
        {levels.map((level) => (
          <Link 
            to={`/flashcards?level=${level.id}`} 
            key={level.id} 
            className={`level-card ${level.id}`}
          >
            <h2>{level.name}</h2>
            <p>{level.description}</p>
            <div className="stats">
              <div className="stat">
                <span className="stat-value">{level.vocabCount}+</span>
                <span className="stat-label">Words</span>
              </div>
              <div className="stat">
                <span className="stat-value">{level.kanjiCount}+</span>
                <span className="stat-label">Kanji</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="progress-grid">
        <div className="progress-card">
          <h3>Total Vocabulary</h3>
          <div className="value">{totalStats.totalVocab}+</div>
        </div>
        <div className="progress-card">
          <h3>Total Kanji</h3>
          <div className="value">{totalStats.totalKanji}+</div>
        </div>
        <div className="progress-card">
          <h3>Levels</h3>
          <div className="value">3</div>
        </div>
      </div>

      <div className="daily-tip">
        <div className="tip-label">💡 Daily Japanese Proverb</div>
        <div className="tip-jp">{dailyTip.jp}</div>
        <div className="tip-en">{dailyTip.en}</div>
      </div>
    </div>
  );
};

export default Home;
