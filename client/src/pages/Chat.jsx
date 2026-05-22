import { useState, useRef, useEffect, useContext } from 'react';
import { Avatar } from '../components/common';
import { chatService } from '../services/chat.service.js';
import { useSocket } from '../context/SocketContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

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
  const { user: currentUser } = useContext(AuthContext);
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [messages, setMessages] = useState({}); // { [convoId]: [message1, message2] }
  
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messageInputRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    async function loadConversations() {
      try {
        const convos = await chatService.getConversations();
        setConversations(convos);
        if (convos.length > 0) {
          setActiveConvoId(convos[0].id);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    }
    loadConversations();
  }, []);

  // When active convo changes, load its messages and join the room
  useEffect(() => {
    if (!activeConvoId) return;

    async function loadMessages() {
      try {
        const msgs = await chatService.getMessages(activeConvoId);
        setMessages((prev) => ({ ...prev, [activeConvoId]: msgs }));
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    }

    if (!messages[activeConvoId]) {
      loadMessages();
    }

    if (socket) {
      socket.emit('join_conversation', activeConvoId);
    }
  }, [activeConvoId, socket]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      // Add message to the correct conversation
      setMessages((prev) => {
        const convoMessages = prev[message.conversationId] || [];
        return {
          ...prev,
          [message.conversationId]: [...convoMessages, message]
        };
      });

      // Update the latest message in the conversations list
      setConversations((prev) => {
        const idx = prev.findIndex(c => c.id === message.conversationId);
        if (idx === -1) return prev; // or fetch new conversation list
        const newConvos = [...prev];
        newConvos[idx] = {
          ...newConvos[idx],
          Messages: [message] // Update latest message
        };
        // Move to top
        const [movedConvo] = newConvos.splice(idx, 1);
        newConvos.unshift(movedConvo);
        return newConvos;
      });
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  // Auto-scroll to bottom when messages change
  const currentMessages = messages[activeConvoId] || [];
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeConvoId]);

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConvoId || !socket) return;

    const text = messageText.trim();
    
    // Server saves message to MySQL BEFORE broadcasting
    socket.emit('send_message', { conversationId: activeConvoId, text });
    
    setMessageText('');
  };

  const handleEmojiClick = (emoji) => {
    setMessageText((prev) => prev + emoji);
    messageInputRef.current?.focus();
  };

  // Find the active conversation to display header info
  const activeConvo = conversations.find((c) => c.id === activeConvoId);
  const otherParticipant = activeConvo?.Users?.find(u => u.id !== currentUser?.id);

  // formatting time for messages
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] -my-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-900">
      {/* ── Conversation list ── */}
      <div className="w-72 shrink-0 border-r border-gray-200 dark:border-surface-700 flex flex-col bg-gray-50 dark:bg-surface-850">
        <div className="p-4 border-b border-gray-200 dark:border-surface-700">
          <h2 className="text-base font-bold">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
             <div className="p-4 text-sm text-surface-500 text-center">No conversations yet.</div>
          ) : conversations.map((convo) => {
            const partner = convo.Users?.find(u => u.id !== currentUser?.id);
            const latestMsg = convo.Messages?.[0];
            const partnerName = partner?.username || 'Unknown User';

            return (
              <button
                key={convo.id}
                onClick={() => setActiveConvoId(convo.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeConvoId === convo.id
                    ? 'bg-primary-600/10 border-r-2 border-primary-500'
                    : 'hover:bg-gray-100 dark:hover:bg-surface-800'
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar name={partnerName} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                      {partnerName}
                    </span>
                    {latestMsg && (
                      <span className="text-xs text-surface-400 shrink-0 ml-2">
                        {formatTime(latestMsg.createdAt)}
                      </span>
                    )}
                  </div>
                  {latestMsg && (
                    <p className="text-xs text-surface-500 truncate mt-0.5">
                      {latestMsg.senderId === currentUser?.id ? 'You: ' : ''}
                      {latestMsg.body}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat window ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeConvoId ? (
          <>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-surface-700 flex items-center gap-3 bg-white dark:bg-surface-900">
              <Avatar name={otherParticipant?.username || 'Unknown'} size="sm" />
              <div>
                <p className="text-sm font-semibold">{otherParticipant?.username}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {currentMessages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                        isMine
                          ? 'bg-primary-600 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.body}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-200' : 'text-surface-400'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-900">
              <div className="flex items-center gap-2">
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
                  disabled={!messageText.trim()}
                  className="p-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-surface-850">
            <div className="text-center text-surface-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
