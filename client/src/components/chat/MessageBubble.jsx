// TODO: Implement MessageBubble
export default function MessageBubble({ message, isOwn }) {
  return <div className={`message-bubble ${isOwn ? 'own' : ''}`}>{message?.text}</div>;
}
