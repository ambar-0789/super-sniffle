import { useEffect } from 'react';
import { useStore } from './store';
import { UploadScreen } from './components/upload/UploadScreen';
import { ChatView } from './components/chat/ChatView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { THEMES, applyTheme } from './themes';

export default function App() {
  const { conversation, activeView, error, setError } = useStore();

  useEffect(() => {
    applyTheme(THEMES[0]);
  }, []);

  return (
    <div className="app">
      {error && (
        <div className="error-toast" onClick={() => setError(null)}>
          ⚠ {error} [CLICK TO DISMISS]
        </div>
      )}
      {!conversation && <UploadScreen />}
      {conversation && activeView === 'chat' && <ChatView />}
      {conversation && activeView === 'analytics' && <AnalyticsView />}
    </div>
  );
}
