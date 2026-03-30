import { useState, useRef, useEffect } from 'react';
import { Avatar } from '../components/common';

/**
 * Chat — Full chat interface at /chat.
 *
 * Layout:
 *   ┌──────────────┬──────────────────────────┐
 *   │ Conversation │                          │
 *   │ List         │  Chat Window             │
 *   │              │  (messages + input)       │
 *   └──────────────┴──────────────────────────┘
 *
 * Uses mock conversations and messages. When Socket.io is ready,
 * replace the mock data with real-time messaging.
 */

// ── Mock conversations ──
const MOCK_CONVERSATIONS = [
  {
    id: 1, name: 'sarahdev', lastMessage: 'That React 19 tutorial was 🔥', time: '2m ago', unread: 3, online: true,
  },
  {
    id: 2, name: 'coderebel', lastMessage: 'Want to collaborate on a project?', time: '15m ago', unread: 1, online: true,
  },
  {
    id: 3, name: 'pixelperfect', lastMessage: 'Here\'s the Figma link', time: '1h ago', unread: 0, online: false,
  },
  {
    id: 4, name: 'cssmaster', lastMessage: 'Container queries are the future!', time: '3h ago', unread: 0, online: false,
  },
  {
    id: 5, name: 'bossslayer', lastMessage: 'GG! That boss was insane', time: '1d ago', unread: 0, online: true,
  },
];

// ── Mock messages per conversation ──
const MOCK_MESSAGES = {
  1: [
    { id: 1, from: 'sarahdev', text: 'Hey! Did you see the new React 19 release notes?', time: '10:30 AM', mine: false },
    { id: 2, from: 'me', text: 'Yes! Server Components look amazing 🚀', time: '10:32 AM', mine: true },
    { id: 3, from: 'sarahdev', text: 'Right?! I already started migrating my app', time: '10:33 AM', mine: false },
    { id: 4, from: 'me', text: 'Nice! How\'s the migration going? Any gotchas?', time: '10:35 AM', mine: true },
    { id: 5, from: 'sarahdev', text: 'The biggest thing is rethinking data fetching. No more useEffect for API calls!', time: '10:36 AM', mine: false },
    { id: 6, from: 'me', text: 'That\'s actually a relief tbh. useEffect was always tricky for data fetching', time: '10:38 AM', mine: true },
    { id: 7, from: 'sarahdev', text: 'Exactly! And the new form Actions API is so clean. Check this tutorial I wrote about it', time: '10:40 AM', mine: false },
    { id: 8, from: 'sarahdev', text: 'That React 19 tutorial was 🔥', time: '10:41 AM', mine: false },
  ],
  2: [
    { id: 1, from: 'coderebel', text: 'Hey, I saw your post about switching back to JS. Interesting take!', time: '9:00 AM', mine: false },
    { id: 2, from: 'me', text: 'Haha yeah, got a lot of strong opinions on that one 😅', time: '9:05 AM', mine: true },
    { id: 3, from: 'coderebel', text: 'I actually agree for small projects. TS shines in bigger codebases tho', time: '9:06 AM', mine: false },
    { id: 4, from: 'coderebel', text: 'Want to collaborate on a project?', time: '9:10 AM', mine: false },
  ],
  3: [
    { id: 1, from: 'pixelperfect', text: 'Love your glassmorphism post! Want to see the full Figma file?', time: 'Yesterday', mine: false },
    { id: 2, from: 'me', text: 'Absolutely! Would love to study your approach', time: 'Yesterday', mine: true },
    { id: 3, from: 'pixelperfect', text: 'Here\'s the Figma link', time: 'Yesterday', mine: false },
  ],
  4: [
    { id: 1, from: 'me', text: 'Your container queries guide was exactly what I needed. Thanks!', time: '2 days ago', mine: true },
    { id: 2, from: 'cssmaster', text: 'Glad it helped! Container queries are the future!', time: '2 days ago', mine: false },
  ],
  5: [
    { id: 1, from: 'bossslayer', text: 'Bro did you find that secret boss I posted about?', time: '3 days ago', mine: false },
    { id: 2, from: 'me', text: 'YES! Took me 47 attempts but I finally beat it', time: '3 days ago', mine: true },
    { id: 3, from: 'bossslayer', text: 'GG! That boss was insane', time: '3 days ago', mine: false },
  ],
};

// ── Emoji grid for the picker ──
const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    emojis: ['😀', '😂', '🥲', '😊', '😍', '🤩', '😎', '🤔', '😅', '🙄', '😢', '😤', '🥺', '😴', '🤯', '🫡'],
  },
  {
    name: 'Gestures',
    emojis: ['👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '💪', '🫶', '👀', '🧠', '❤️', '🔥', '⭐', '💯', '🚀'],
  },
  {
    name: 'Objects',
    emojis: ['💻', '📱', '🎮', '🎨', '📸', '🎵', '☕', '🍕', '🎉', '💡', '📝', '🔗', '⚡', '✅', '❌', '🏆'],
  },
];

export default function Chat() {
  const [activeConvo, setActiveConvo] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState(() => {
    const counts = {};
    MOCK_CONVERSATIONS.forEach((c) => { counts[c.id] = c.unread; });
    // Clear unread for the initially active conversation
    counts[1] = 0;
    return counts;
  });
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const currentMessages = messages[activeConvo] || [];
  const activeUser = MOCK_CONVERSATIONS.find((c) => c.id === activeConvo);

  const handleSelectConvo = (id) => {
    setActiveConvo(id);
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeConvo]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    const hasText = messageText.trim();
    const hasFile = attachedFile;
    if (!hasText && !hasFile) return;

    let text = messageText.trim();
    if (hasFile) {
      text = text ? `${text}\n📎 ${attachedFile.name}` : `📎 ${attachedFile.name}`;
    }

    const newMsg = {
      id: currentMessages.length + 1,
      from: 'me',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      mine: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvo]: [...(prev[activeConvo] || []), newMsg],
    }));
    setMessageText('');
    setAttachedFile(null);
  };

  const handleEmojiClick = (emoji) => {
    setMessageText((prev) => prev + emoji);
    messageInputRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] -my-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-900">
      {/* ── Conversation list ── */}
      <div className="w-72 shrink-0 border-r border-gray-200 dark:border-surface-700 flex flex-col bg-gray-50 dark:bg-surface-850">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-surface-700">
          <h2 className="text-base font-bold">Messages</h2>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg
                bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700
                text-surface-900 dark:text-surface-100 placeholder:text-surface-400
                focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONVERSATIONS.map((convo) => (
            <button
              key={convo.id}
              onClick={() => handleSelectConvo(convo.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeConvo === convo.id
                  ? 'bg-primary-600/10 border-r-2 border-primary-500'
                  : 'hover:bg-gray-100 dark:hover:bg-surface-800'
              }`}
            >
              <div className="relative shrink-0">
                <Avatar name={convo.name} size="sm" />
                {convo.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-white dark:border-surface-900" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                    {convo.name}
                  </span>
                  <span className="text-xs text-surface-400 shrink-0 ml-2">{convo.time}</span>
                </div>
                <p className="text-xs text-surface-500 truncate mt-0.5">{convo.lastMessage}</p>
              </div>
              {unreadCounts[convo.id] > 0 && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadCounts[convo.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat window ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-surface-700 flex items-center gap-3 bg-white dark:bg-surface-900">
          <div className="relative">
            <Avatar name={activeUser?.name || ''} size="sm" />
            {activeUser?.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-white dark:border-surface-900" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">{activeUser?.name}</p>
            <p className="text-xs text-surface-500">
              {activeUser?.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.mine
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.mine ? 'text-primary-200' : 'text-surface-400'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Attached file preview */}
        {attachedFile && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-surface-700 bg-gray-50 dark:bg-surface-850">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 w-fit max-w-xs">
              <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
              <span className="text-xs text-surface-700 dark:text-surface-300 truncate">{attachedFile.name}</span>
              <button
                onClick={removeAttachedFile}
                className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 transition-colors shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Message input */}
        <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-900">
          <div className="flex items-center gap-2">
            {/* Attachment button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
              title="Attach file"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />

            <input
              ref={messageInputRef}
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 text-sm rounded-full
                bg-gray-100 dark:bg-surface-800 border border-gray-200 dark:border-surface-700
                text-surface-900 dark:text-surface-100 placeholder:text-surface-400
                focus:outline-none focus:border-primary-500 transition-all"
            />

            {/* Emoji button + picker */}
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className={`p-2 rounded-lg transition-colors ${
                  showEmojiPicker
                    ? 'text-primary-500 bg-primary-600/10'
                    : 'text-surface-400 hover:text-surface-600 hover:bg-gray-100 dark:hover:bg-surface-800'
                }`}
                title="Emoji"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </button>

              {/* Emoji picker popup */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-white dark:bg-surface-850 border border-gray-200 dark:border-surface-700 rounded-xl shadow-xl animate-fade-in-down z-50">
                  <div className="p-3 max-h-64 overflow-y-auto">
                    {EMOJI_CATEGORIES.map((category) => (
                      <div key={category.name} className="mb-3 last:mb-0">
                        <p className="text-xs font-semibold text-surface-500 mb-1.5">{category.name}</p>
                        <div className="grid grid-cols-8 gap-0.5">
                          {category.emojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleEmojiClick(emoji)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!messageText.trim() && !attachedFile}
              className="p-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
