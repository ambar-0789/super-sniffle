import type { ParsedConversation, ParsedMessage, RawMessage } from '../types';

let msgCounter = 0;

function msgType(raw: RawMessage): ParsedMessage['type'] {
  if (raw.is_unsent) return 'unsent';
  if (raw.photos?.length) return 'photo';
  if (raw.videos?.length) return 'video';
  if (raw.audio_files?.length) return 'audio';
  if (raw.gifs?.length) return 'gif';
  if (raw.sticker) return 'sticker';
  if (raw.share) return 'share';
  return 'text';
}

function toMsg(raw: RawMessage): ParsedMessage {
  const type = msgType(raw);
  let mediaUri: string | undefined;
  if (type === 'photo') mediaUri = raw.photos![0].uri;
  else if (type === 'video') mediaUri = raw.videos![0].uri;
  else if (type === 'audio') mediaUri = raw.audio_files![0].uri;
  else if (type === 'gif') mediaUri = raw.gifs![0].uri;
  else if (type === 'sticker') mediaUri = raw.sticker!.uri;

  return {
    id: `msg_${++msgCounter}_${raw.timestamp_ms}`,
    sender: raw.sender_name,
    timestamp: raw.timestamp_ms,
    content: raw.content ?? (type === 'unsent' ? '[ Message removed ]' : `[ ${type} ]`),
    type,
    mediaUri,
    reactions: raw.reactions,
  };
}

export function parseConversation(json: unknown): ParsedConversation {
  if (typeof json !== 'object' || json === null) throw new Error('Invalid JSON structure');
  const data = json as Record<string, unknown>;

  const rawMessages = Array.isArray(data.messages) ? (data.messages as RawMessage[]) : [];
  const messages = rawMessages.map(toMsg).sort((a, b) => a.timestamp - b.timestamp);

  const participantSet = new Set<string>();
  if (Array.isArray(data.participants)) {
    (data.participants as { name: string }[]).forEach(p => participantSet.add(p.name));
  }
  messages.forEach(m => participantSet.add(m.sender));

  return {
    title: typeof data.title === 'string' ? data.title : undefined,
    threadType: typeof data.thread_type === 'string' ? data.thread_type : undefined,
    participants: Array.from(participantSet),
    messages,
  };
}

export async function parseFile(file: File): Promise<ParsedConversation> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target!.result as string);
        resolve(parseConversation(json));
      } catch {
        reject(new Error('Malformed JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'utf-8');
  });
}
