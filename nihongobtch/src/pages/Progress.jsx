const Progress = () => {
  // Mock data for demonstration
  // In a real app, this would come from localStorage
  const progressData = {
    totalStudied: 156,
    correctAnswers: 134,
    streakDays: 7,
    lastStudied: new Date().toLocaleDateString(),
    byLevel: {
      n3: { studied: 89, correct: 76, total: 500 },
      n2: { studied: 45, correct: 38, total: 500 },
      n1: { studied: 22, correct: 20, total: 500 },
    },
  };

  const accuracy = Math.round((progressData.correctAnswers / progressData.totalStudied) * 100) || 0;

  return (
    <div className="progress-page">
      <h1>📊 Your Progress</h1>

      <div className="progress-grid">
        <div className="progress-card">
          <h3>Total Studied</h3>
          <div className="value">{progressData.totalStudied}</div>
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
          <div className="value">🔥 {progressData.streakDays} days</div>
        </div>
      </div>

      <div className="level-progress">
        <h3>Progress by Level</h3>
        <div className="level-progress-grid">
          <div className="level-item n3">
            <div className="label">N3</div>
            <div className="count">
              {progressData.byLevel.n3.studied} / {progressData.byLevel.n3.total} words
            </div>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(progressData.byLevel.n3.studied / progressData.byLevel.n3.total) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="level-item n2">
            <div className="label">N2</div>
            <div className="count">
              {progressData.byLevel.n2.studied} / {progressData.byLevel.n2.total} words
            </div>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(progressData.byLevel.n2.studied / progressData.byLevel.n2.total) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="level-item n1">
            <div className="label">N1</div>
            <div className="count">
              {progressData.byLevel.n1.studied} / {progressData.byLevel.n1.total} words
            </div>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(progressData.byLevel.n1.studied / progressData.byLevel.n1.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-card">
        <h3>Recent Activity</h3>
        <p style={{ color: '#757575', marginTop: '8px' }}>
          Last studied: {progressData.lastStudied}
        </p>
      </div>
    </div>
  );
};

export default Progress;