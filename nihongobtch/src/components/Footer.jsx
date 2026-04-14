import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '24px',
      marginTop: '48px',
      borderTop: '1px solid var(--border)',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <p>🇯🇵 Nihongo BTCH - JLPT Japanese Learning</p>
      <p style={{ marginTop: '8px', opacity: 0.7 }}>
        日本語を勉強しよう • Master Japanese from N3 to N1
      </p>
      <p style={{ marginTop: '16px', fontSize: '0.8rem', opacity: 0.5 }}>
        Built with ❤️ using React + Vite
      </p>
    </footer>
  );
};

export default Footer;
