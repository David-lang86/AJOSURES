import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyEncoding: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 700, color: '#0F6E56', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#333', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#888', marginBottom: '2rem' }}>The page you are looking for does not exist or has been moved.</p>
      <button onClick={() => navigate('/')}
        style={{ padding: '0.8rem 2rem', background: '#0F6E56', color: '#fff',
          border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '15px', transition: 'background 0.2s' }}>
        Go Home
      </button>
    </div>
  );
}
