// TODO: Implement PostCard
export default function PostCard({ post }) {
  return <article className="post-card">{post?.title || 'Post'}</article>;
}
