// TODO: Implement ConversationList
export default function ConversationList({ conversations }) {
  return <div className="conversation-list">{conversations?.length || 0} conversations</div>;
}
