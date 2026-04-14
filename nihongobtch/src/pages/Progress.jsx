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
  const [showAllTime, setShowAllTime] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nihongo_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStats(prev => ({
        ...prev,
        ...parsed,
        bestStreak: parsed.bestStreak || prev.bestStreak
      }));
    }
  }, []);

  const accuracy = stats.totalStudied > 0 
    ? Math.round((stats.correctAnswers / stats.totalStudied) * 100) 
    : 0;

  const getLevelProgress = (level) => {
    const data = stats.byLevel?.[level] || { studied: 0, correct: 0 };
    return {
      ...data,
      accuracy: data.studied > 0 ? Math.round((data.correct / data.studied) * 100) : 0
    };
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('nihongo_progress');
      setStats({
        totalStudied: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        streakDays: 0,
        lastStudied: null,
        bestStreak: stats.bestStreak,
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
          <small style={{ opacity: 0.7 }}>cards answered</small>
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
          {['n3', 'n2', 'n1'].map(level => {
            const data = getLevelProgress(level);
            return (
              <div key={level} className={`level-item ${level}`}>
                <div className="label">JLPT {level.toUpperCase()}</div>
                <div className="count">
                  {data.studied} / {data.total} words
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
                  {data.accuracy}% accuracy
                </div>
                <div className="progress-bar" style={{ marginTop: '8px' }}>
                  <div 
                    className={`progress-bar-fill ${level}`} 
                    style={{ width: `${(data.studied / data.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="progress-card">
        <h3>Recent Activity</h3>
        <p style={{ color: '#757575', marginTop: '8px' }}>
          {stats.lastStudied ? `Last studied: ${stats.lastStudied}` : 'No study sessions yet'}
        </p>
        {stats.totalStudied > 0 && (
          <p style={{ color: '#757575', marginTop: '4px', fontSize: '0.9rem' }}>
            {stats.correctAnswers} correct out of {stats.totalStudied} total
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-secondary" 
          onClick={resetProgress}
        >
          🗑️ Reset Progress
        </button>
      </div>
    </div>
  );
};

export default Progress;
