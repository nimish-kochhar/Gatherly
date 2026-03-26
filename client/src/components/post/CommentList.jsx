// TODO: Implement CommentList with nested replies
export default function CommentList({ comments }) {
  return <div className="comment-list">{comments?.length || 0} comments</div>;
}
