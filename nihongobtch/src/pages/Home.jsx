import { Link } from 'react-router-dom';
import { vocabN3 } from '../data/vocab-n3';
import { vocabN2 } from '../data/vocab-n2';
import { vocabN1 } from '../data/vocab-n1';

const Home = () => {
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

  const stats = {
    totalVocab: vocabN3.length + vocabN2.length + vocabN1.length,
    totalKanji: 800,
    levelsCompleted: 0
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>日本語を勉強しよう</h1>
        <p>Master Japanese vocabulary and kanji from N3 to N1</p>
        <div className="hero-buttons">
          <Link to="/flashcards" className="btn btn-primary">Start Learning</Link>
          <Link to="/quiz" className="btn btn-secondary">Take a Quiz</Link>
        </div>
      </div>

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
          <div className="value">{stats.totalVocab}+</div>
        </div>
        <div className="progress-card">
          <h3>Total Kanji</h3>
          <div className="value">{stats.totalKanji}+</div>
        </div>
        <div className="progress-card">
          <h3>Levels</h3>
          <div className="value">3</div>
        </div>
      </div>
    </div>
  );
};

export default Home;