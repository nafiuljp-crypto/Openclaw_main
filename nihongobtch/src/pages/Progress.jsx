import { useState, useEffect } from 'react';

const Progress = () => {
  const [stats, setStats] = useState({
    totalStudied: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    streakDays: 0,
    lastStudied: null,
    bestStreak: 0,
    byLevel: {
      n3: { studied: 0, correct: 0, total: 500 },
      n2: { studied: 0, correct: 0, total: 500 },
      n1: { studied: 0, correct: 0, total: 500 },
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem('nihongo_progress');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const accuracy = stats.totalStudied > 0 
    ? Math.round((stats.correctAnswers / stats.totalStudied) * 100) 
    : 0;

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('nihongo_progress');
      setStats({
        totalStudied: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        streakDays: 0,
        lastStudied: null,
        bestStreak: 0,
        byLevel: {
          n3: { studied: 0, correct: 0, total: 500 },
          n2: { studied: 0, correct: 0, total: 500 },
          n1: { studied: 0, correct: 0, total: 500 },
        },
      });
    }
  };

  return (
    <div className="progress-page">
      <h1>📊 Your Progress</h1>

      <div className="progress-grid">
        <div className="progress-card">
          <h3>Total Studied</h3>
          <div className="value">{stats.totalStudied}</div>
        </div>
        <div className="progress-card">
          <h3>Accuracy</h3>
          <div className="value">{accuracy}%</div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${accuracy}%` }}></div>
          </div>
        </div>
        <div className="progress-card">
          <h3>Current Streak</h3>
          <div className="value">🔥 {stats.streakDays} days</div>
        </div>
        <div className="progress-card">
          <h3>Best Streak</h3>
          <div className="value">🏆 {stats.bestStreak} days</div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-correct">✅ {stats.correctAnswers} Correct</div>
        <div className="stat-wrong">❌ {stats.wrongAnswers} Wrong</div>
      </div>

      <div className="level-progress">
        <h3>Progress by Level</h3>
        <div className="level-progress-grid">
          <div className="level-item n3">
            <div className="label">N3</div>
            <div className="count">
              {stats.byLevel.n3.studied} / {stats.byLevel.n3.total} words
            </div>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div 
                className="progress-bar-fill n3" 
                style={{ width: `${(stats.byLevel.n3.studied / stats.byLevel.n3.total) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="level-item n2">
            <div className="label">N2</div>
            <div className="count">
              {stats.byLevel.n2.studied} / {stats.byLevel.n2.total} words
            </div>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div 
                className="progress-bar-fill n2" 
                style={{ width: `${(stats.byLevel.n2.studied / stats.byLevel.n2.total) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="level-item n1">
            <div className="label">N1</div>
            <div className="count">
              {stats.byLevel.n1.studied} / {stats.byLevel.n1.total} words
            </div>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div 
                className="progress-bar-fill n1" 
                style={{ width: `${(stats.byLevel.n1.studied / stats.byLevel.n1.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-card">
        <h3>Recent Activity</h3>
        <p style={{ color: '#757575', marginTop: '8px' }}>
          {stats.lastStudied ? `Last studied: ${stats.lastStudied}` : 'No study sessions yet'}
        </p>
      </div>

      <button 
        className="btn btn-secondary" 
        style={{ marginTop: '24px', background: '#E53935' }}
        onClick={resetProgress}
      >
        🗑️ Reset Progress
      </button>
    </div>
  );
};

export default Progress;
