import { useRef } from 'react';
import { useStore } from '../../store';

interface Props {
  participants: string[];
}

export function SearchBar({ participants }: Props) {
  const { searchQuery, searchSender, setSearch } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        ref={inputRef}
        className="search-input"
        placeholder="SEARCH MESSAGES..."
        value={searchQuery}
        onChange={e => setSearch(e.target.value, searchSender)}
      />
      <select
        className="search-sender"
        value={searchSender}
        onChange={e => setSearch(searchQuery, e.target.value)}
      >
        <option value="">ALL</option>
        {participants.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
      </select>
      {(searchQuery || searchSender) && (
        <button className="search-clear" onClick={() => setSearch('', '')}>✕</button>
      )}
    </div>
  );
}
