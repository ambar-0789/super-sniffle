import { useCallback, useState } from 'react';
import { useStore } from '../../store';
import { parseFile } from '../../lib/parser';
import { PixelWindow } from '../ui/PixelWindow';
import { HeartBorder } from '../ui/HeartBorder';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';

export function UploadScreen() {
  const { loadConversation, setError } = useStore();
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const handle = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setError('Only .json files are supported');
      return;
    }
    setLoading(true);
    try {
      const conv = await parseFile(file);
      loadConversation(conv);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Parse error');
    } finally {
      setLoading(false);
    }
  }, [loadConversation, setError]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handle(file);
  }, [handle]);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handle(file);
  };

  return (
    <div className="screen upload-screen">
      <HeartBorder position="top" />
      <div className="upload-center">
        <div className="upload-title">
          <span className="blink-cursor">▶</span> PIXEL CHAT VIEWER
        </div>
        <div className="upload-subtitle">[ LOAD SAVE FILE ]</div>

        <PixelWindow title="FILE SELECT" className="upload-window">
          <label
            className={`drop-zone ${drag ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
          >
            {loading ? (
              <div className="loading-dots">
                <span>LOADING</span>
                <span className="dots">...</span>
              </div>
            ) : (
              <>
                <div className="drop-icon">💾</div>
                <div className="drop-text">DROP JSON FILE HERE</div>
                <div className="drop-sub">or click to browse</div>
              </>
            )}
            <input type="file" accept=".json" onChange={onInput} style={{ display: 'none' }} />
          </label>
        </PixelWindow>

        <ThemeSwitcher />

        <div className="upload-hint">
          Supports Facebook / Instagram Messenger JSON exports
        </div>
      </div>
      <HeartBorder position="bottom" />
    </div>
  );
}
