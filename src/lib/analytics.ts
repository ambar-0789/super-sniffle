import type { ParsedConversation, AnalyticsData, ParticipantStats, Achievement } from '../types';

// ── Stop Words (English + Hindi/Urdu) ────────────────────────────────────────
const STOP_WORDS = new Set([
  // English
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall','can',
  'and','or','but','if','in','on','at','to','for','of','with','by','from','up',
  'about','into','through','during','before','after','above','below','between',
  'out','off','over','under','again','then','once','here','there','when','where',
  'all','both','each','few','more','most','other','some','such','no','nor','not',
  'only','same','so','than','too','very','just','that','this','these','those',
  'i','me','my','we','our','you','your','he','him','his','she','her','they',
  'them','their','it','its','what','which','who','whom','am','get','got','go',
  'ok','okay','yeah','yes','haha','hey','hi','hello','bye','like','just','idk','yup','ll',
  'im','ive','dont','cant','wont','didnt','wasnt','isnt','arent','havent','thats',
  'ill','id','hes','shes','theyre','weve','youre','youve','youll','its',
  'also','really','much','well','know','think','want','need','make','look','tu',
  'come','going','good','time','way','day','now','back','one','even','still',
  'oh','ah','uh','um','hmm','hm','oh','ya','yea','nah','gonna','gotta','wanna',
  'ur','r','u','k','bc','cuz','cause','tho','though','rn','tbh','imo','omg','sent','msg','msgs','message','messages','chat','chats','convo','convos','conversation',
  'attachment','nice','cool','how','who','where','when','why','which','whatsup','sup','wazzup','brb','bbl','gtg','g2g','afk','ily','ily2','yolo',
  // Hindi/Urdu fillers
  'aur','hai','hain','tha','thi','the','ko','ka','ki','ke','se','me','mein',
  'par','pe','ek','yeh','ye','woh','wo','toh','to','bhi','hi','na','nahi','nhi',
  'kya','kuch','koi','sab','ab','phir','fir','haa','haan','nai','acha','accha',
  'thik','theek','bas','mat','mujhe','mujhko','mera','meri','mere','tera','teri',
  'tere','apna','apni','apne','unka','unki','unke','uska','uski','uske','iska',
  'iski','iske','hum','tumhara','tumhari','tumhare','aap','apko','tumhe','tujhe',
  'iss','us','jo','jab','kab','kyun','kyon','kyunki','isliye','lekin','magar',
  'zaroor','shayad','bilkul','bohot','bahut','thoda','sirf','baat','baar','dono',
  'sabka','kaise','kaisa','kaisi','kitna','kitni','kitne','wala','wali','wale',
  'raha','rahi','rahe','gaya','gayi','gaye','karo','kar','karta','karti','karte',
  'hua','hui','hue','sath','saath','liye','kyoki','matlab','phle','pehle',
  'baad','pata','pta','lag','laga','lagi','lage','le','lo','lena','dena','de',
  'upar','neeche','idhar','udhar','yahan','wahan','tum','main','mujh',
  'kr','ho','hu','hoga','hogi','honge','kahan','kaun','karna','main','ap','nhi','nahi','nhi','nahi','nhi','nahi','kuch','koi','sab','sabhi',
  'reh','rha','rhi','rhe','aa','aaja','aja','aya','aayi','aye','nothing','something','everything','anything','kuch','koi','sab','sabhi',
  'hy','hai','hei','hay','hn','hna','han','nhn','nhn','nhii','call','achha','sahi','sahi','galat','galt','saccha','jhootha','sach','jhoot',
  'bro','yar','yaar','yrr','bhai','bhen','dost','reacted','reaction','reactions','reply','replies','forward','forwards','fwd','group','groups','admin','admins','member','members',
]);

// ── Regexes ───────────────────────────────────────────────────────────────────
const EMOJI_RE = /\p{Extended_Pictographic}/gu;
const LINK_RE = /https?:\/\/[^\s]+/gi;
const WORD_RE = /[a-zA-Z\u0900-\u097F\u0600-\u06FF]{2,}/g;

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractEmojis(text: string): string[] {
  return [...(text.match(EMOJI_RE) ?? [])];
}
function extractLinks(text: string): string[] {
  return [...(text.match(LINK_RE) ?? [])];
}
function extractWords(text: string): string[] {
  const raw = text.toLowerCase().match(WORD_RE) ?? [];
  return raw.filter(w => !STOP_WORDS.has(w) && !/^\d+$/.test(w));
}
function topN(map: Map<string, number>, n: number): [string, number][] {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}
function dateStr(ts: number) { return new Date(ts).toISOString().slice(0, 10); }
function monthStr(ts: number) { return new Date(ts).toISOString().slice(0, 7); }

function fmtMs(ms: number): string {
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return `${Math.round(ms / 3600000)}h`;
}
export { fmtMs };

// ── Main Engine ───────────────────────────────────────────────────────────────
export function computeFullAnalytics(conv: ParsedConversation, excludedPhrases: string[] = ['added collection','added collection edits','set nickname','vedant added collection','collection edits']): AnalyticsData {
  const { messages, participants } = conv;
  const excludedPhraseSet = new Set(
    excludedPhrases.map(p => p.toLowerCase().trim()).filter(Boolean)
  );

  // Per-sender maps
  const pCounts    = new Map<string, number>();
  const pLenSum    = new Map<string, number>();
  const pLongest   = new Map<string, { content: string; len: number }>();
  const pWordCount = new Map<string, number>();
  const pWordMaps  = new Map<string, Map<string, number>>();
  const pEmojiMaps = new Map<string, Map<string, number>>();
  const pLinks     = new Map<string, number>();
  const pPhotos    = new Map<string, number>();
  const pVideos    = new Map<string, number>();
  const pGifs      = new Map<string, number>();
  const pHourMaps  = new Map<string, Map<number, number>>();
  const pFirst     = new Map<string, number>();
  const pLast      = new Map<string, number>();
  const pNight     = new Map<string, number>();
  const pRespTimes = new Map<string, number[]>();

  // Global maps
  const dayMap     = new Map<string, number>();
  const hourMap    = new Map<number, number>();
  const weekMap    = new Map<string, number>();
  const monthMap   = new Map<string, number>();
  const wordMap    = new Map<string, number>();
  const bigramMap  = new Map<string, number>();
  const trigramMap = new Map<string, number>();

  let globalLongest = { sender: '', content: '', length: 0 };
  let totalWordCount = 0;
  let totalSentenceWordSum = 0;
  let totalSentences = 0;
  let lastSender = '';
  let lastTs = 0;

  const allSenders = new Set<string>(participants);

  for (const msg of messages) {
    const { sender, timestamp, content, type } = msg;
    allSenders.add(sender);

    const d     = new Date(timestamp);
    const hour  = d.getHours();
    const dow   = d.getDay();
    const day   = dateStr(timestamp);
    const month = monthStr(timestamp);

    // Init sender structures
    if (!pCounts.has(sender))    pCounts.set(sender, 0);
    if (!pWordMaps.has(sender))  pWordMaps.set(sender, new Map());
    if (!pEmojiMaps.has(sender)) pEmojiMaps.set(sender, new Map());
    if (!pHourMaps.has(sender))  pHourMaps.set(sender, new Map());
    if (!pRespTimes.has(sender)) pRespTimes.set(sender, []);

    // Counts & timestamps
    pCounts.set(sender, (pCounts.get(sender) ?? 0) + 1);
    if (!pFirst.has(sender) || timestamp < pFirst.get(sender)!) pFirst.set(sender, timestamp);
    if (!pLast.has(sender)  || timestamp > pLast.get(sender)!)  pLast.set(sender, timestamp);

    // Media
    if (type === 'photo') pPhotos.set(sender, (pPhotos.get(sender) ?? 0) + 1);
    if (type === 'video') pVideos.set(sender, (pVideos.get(sender) ?? 0) + 1);
    if (type === 'gif')   pGifs.set(sender, (pGifs.get(sender) ?? 0) + 1);

    // Night messages (22:00 – 04:00)
    if (hour >= 22 || hour < 4) pNight.set(sender, (pNight.get(sender) ?? 0) + 1);

    // Response time (only if different sender, within 24h)
    if (lastSender && lastSender !== sender && timestamp - lastTs < 86400000) {
      pRespTimes.get(sender)!.push(timestamp - lastTs);
    }
    lastSender = sender;
    lastTs = timestamp;

    // Activity maps
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
    hourMap.set(hour, (hourMap.get(hour) ?? 0) + 1);
    weekMap.set(`${dow}_${hour}`, (weekMap.get(`${dow}_${hour}`) ?? 0) + 1);
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);

    const hm = pHourMaps.get(sender)!;
    hm.set(hour, (hm.get(hour) ?? 0) + 1);

    // Text analysis
    if (type === 'text' || type === 'share') {
      const len = content.length;
      pLenSum.set(sender, (pLenSum.get(sender) ?? 0) + len);
      if (len > (pLongest.get(sender)?.len ?? 0)) pLongest.set(sender, { content, len });
      if (len > globalLongest.length) globalLongest = { sender, content, length: len };

      // Links
      const links = extractLinks(content);
      if (links.length) pLinks.set(sender, (pLinks.get(sender) ?? 0) + links.length);

      // Emojis
      const emojis = extractEmojis(content);
      const em = pEmojiMaps.get(sender)!;
      for (const e of emojis) em.set(e, (em.get(e) ?? 0) + 1);

      // Words
      const words = extractWords(content);
      pWordCount.set(sender, (pWordCount.get(sender) ?? 0) + words.length);
      totalWordCount += words.length;
      const wm = pWordMaps.get(sender)!;
      for (const w of words) {
        wm.set(w, (wm.get(w) ?? 0) + 1);
        wordMap.set(w, (wordMap.get(w) ?? 0) + 1);
      }

      // Bigrams + trigrams
      for (let i = 0; i < words.length - 1; i++) {
        const bi = `${words[i]} ${words[i + 1]}`;
        bigramMap.set(bi, (bigramMap.get(bi) ?? 0) + 1);
        if (i < words.length - 2) {
          const tri = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
          trigramMap.set(tri, (trigramMap.get(tri) ?? 0) + 1);
        }
      }

      // Sentence length
      const sentences = content.split(/[.!?।]+/).filter(s => s.trim().length > 2);
      totalSentences += sentences.length;
      for (const s of sentences) totalSentenceWordSum += s.trim().split(/\s+/).length;
    }
  }

  // ── Build participant stats ───────────────────────────────────────────────
  const total = messages.length;
  const allParticipantsList = [...allSenders];

  const participantStats: ParticipantStats[] = allParticipantsList.map(name => {
    const count      = pCounts.get(name) ?? 0;
    const lenSum     = pLenSum.get(name) ?? 0;
    const longest    = pLongest.get(name) ?? { content: '', len: 0 };
    const emojiMap   = pEmojiMaps.get(name) ?? new Map<string, number>();
    const topEmojis  = topN(emojiMap, 5) as [string, number][];
    const wm         = pWordMaps.get(name) ?? new Map<string, number>();
    const topWords   = topN(wm, 10) as [string, number][];
    const hm         = pHourMaps.get(name) ?? new Map<number, number>();
    const mostActiveHour = [...hm.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
    const respArr    = pRespTimes.get(name) ?? [];
    const avgResp    = respArr.length ? Math.round(respArr.reduce((a, b) => a + b, 0) / respArr.length) : 0;
    const totalEmojis = [...emojiMap.values()].reduce((a, b) => a + b, 0);

    return {
      name,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
      avgMessageLength: count ? Math.round(lenSum / count) : 0,
      longestMessage: longest.content,
      longestMessageLength: longest.len,
      totalWords: pWordCount.get(name) ?? 0,
      totalEmojis,
      topEmojis,
      totalLinks: pLinks.get(name) ?? 0,
      totalPhotos: pPhotos.get(name) ?? 0,
      totalVideos: pVideos.get(name) ?? 0,
      totalGifs: pGifs.get(name) ?? 0,
      mostActiveHour,
      topWords,
      firstMessage: pFirst.get(name) ?? 0,
      lastMessage: pLast.get(name) ?? 0,
      avgResponseTimeMs: avgResp,
      nightMessages: pNight.get(name) ?? 0,
    };
  }).sort((a, b) => b.count - a.count);

  // ── Activity series ───────────────────────────────────────────────────────
  const dailyActivity = [...dayMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const hourlyActivity = Array.from({ length: 24 }, (_, h) => ({
    hour: h, count: hourMap.get(h) ?? 0,
  }));

  const weeklyHeatmap: { dow: number; hour: number; count: number }[] = [];
  for (let dow = 0; dow < 7; dow++)
    for (let h = 0; h < 24; h++)
      weeklyHeatmap.push({ dow, hour: h, count: weekMap.get(`${dow}_${h}`) ?? 0 });

  const monthlyActivity = [...monthMap.entries()]
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // ── Peak day / hour ───────────────────────────────────────────────────────
  const peakDayEntry   = [...dayMap.entries()].sort((a, b) => b[1] - a[1])[0]  ?? ['', 0];
  const peakHourEntry  = [...hourMap.entries()].sort((a, b) => b[1] - a[1])[0] ?? [0, 0];

  // ── Streaks & gaps ────────────────────────────────────────────────────────
  const sortedDays = [...dayMap.keys()].sort();
  let longestStreak = { days: 1, start: sortedDays[0] ?? '', end: sortedDays[0] ?? '' };
  let longestGap    = { days: 0, start: '', end: '' };
  let curStreakLen = 1;
  let curStreakStart = sortedDays[0] ?? '';

  for (let i = 1; i < sortedDays.length; i++) {
    const diff = Math.round(
      (new Date(sortedDays[i]).getTime() - new Date(sortedDays[i - 1]).getTime()) / 86400000
    );
    if (diff === 1) {
      curStreakLen++;
      if (curStreakLen > longestStreak.days)
        longestStreak = { days: curStreakLen, start: curStreakStart, end: sortedDays[i] };
    } else {
      if (diff - 1 > longestGap.days)
        longestGap = { days: diff - 1, start: sortedDays[i - 1], end: sortedDays[i] };
      curStreakLen = 1;
      curStreakStart = sortedDays[i];
    }
  }

  // ── Rankings ──────────────────────────────────────────────────────────────
  const byCount   = [...participantStats].sort((a, b) => b.count - a.count);
  const byAvgLen  = [...participantStats].sort((a, b) => b.avgMessageLength - a.avgMessageLength);
  const byMedia   = [...participantStats].sort((a, b) =>
    (b.totalPhotos + b.totalVideos + b.totalGifs) - (a.totalPhotos + a.totalVideos + a.totalGifs));
  const byLinks   = [...participantStats].sort((a, b) => b.totalLinks - a.totalLinks);
  const byNight   = [...participantStats].sort((a, b) => b.nightMessages - a.nightMessages);
  const byResp    = participantStats.filter(p => p.avgResponseTimeMs > 0)
    .sort((a, b) => a.avgResponseTimeMs - b.avgResponseTimeMs);
  const bySpam    = [...participantStats].filter(p => p.avgMessageLength > 0)
    .sort((a, b) => a.avgMessageLength - b.avgMessageLength);

  const rankings = {
    mostActive:       byCount[0]?.name ?? '',
    biggestSpammer:   bySpam[0]?.name ?? '',
    longestTexter:    byAvgLen[0]?.name ?? '',
    mostMediaShared:  byMedia[0]?.name ?? '',
    mostLinksShared:  byLinks[0]?.name ?? '',
    nightOwl:         byNight[0]?.name ?? '',
    fastestResponder: byResp[0]?.name ?? '',
  };

  // ── Achievements ──────────────────────────────────────────────────────────
  const byGifs   = [...participantStats].sort((a, b) => b.totalGifs - a.totalGifs);
  const byPhotos = [...participantStats].sort((a, b) => b.totalPhotos - a.totalPhotos);
  const byGhost  = [...participantStats].sort((a, b) => a.count - b.count);

  const achievements: Achievement[] = [
    { id: 'NIGHT_OWL',    label: 'NIGHT OWL',     icon: '🦉', desc: 'Most msgs sent 10pm–4am',         winner: byNight[0]?.name ?? '' },
    { id: 'WALL_OF_TEXT', label: 'WALL OF TEXT',   icon: '📜', desc: 'Highest avg message length',       winner: byAvgLen[0]?.name ?? '' },
    { id: 'MEME_LORD',    label: 'MEME LORD',      icon: '🐸', desc: 'Most GIFs sent',                   winner: byGifs[0]?.name ?? '' },
    { id: 'PHOTO_SPAM',   label: 'PHOTO SPAMMER',  icon: '📸', desc: 'Most photos sent',                 winner: byPhotos[0]?.name ?? '' },
    { id: 'FAST_REPLY',   label: 'FAST REPLIER',   icon: '⚡', desc: 'Fastest average response time',    winner: byResp[0]?.name ?? '' },
    { id: 'GHOST_MODE',   label: 'GHOST MODE',     icon: '👻', desc: 'Fewest messages sent',             winner: byGhost[0]?.name ?? '' },
    { id: 'LINK_DROPPER', label: 'LINK DROPPER',   icon: '🔗', desc: 'Most links shared',                winner: byLinks[0]?.name ?? '' },
  ].filter(a => a.winner !== '');

  // ── Top phrases (trigrams + bigrams combined) ─────────────────────────────
  const topPhrases = [...topN(trigramMap, 10), ...topN(bigramMap, 10)]
    .filter(([phrase]) => !excludedPhraseSet.has(phrase.toLowerCase()))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15) as [string, number][];

  return {
    totalMessages: total,
    totalParticipants: allParticipantsList.length,
    firstDate:  messages[0]?.timestamp ?? 0,
    lastDate:   messages[messages.length - 1]?.timestamp ?? 0,
    activeDays: dayMap.size,
    avgPerDay:  dayMap.size ? Math.round(total / dayMap.size) : 0,
    peakDay:      peakDayEntry[0] as string,
    peakDayCount: peakDayEntry[1] as number,
    peakHour:      peakHourEntry[0] as number,
    peakHourCount: peakHourEntry[1] as number,
    participantStats,
    dailyActivity,
    hourlyActivity,
    weeklyHeatmap,
    monthlyActivity,
    topWords: topN(wordMap, 30) as [string, number][],
    topPhrases,
    avgSentenceLength: totalSentences ? Math.round(totalSentenceWordSum / totalSentences) : 0,
    longestMessage: globalLongest,
    rankings,
    achievements,
    longestStreak,
    longestGap,
  };
}
