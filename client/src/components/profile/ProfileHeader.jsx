// TODO: Implement ProfileHeader
export default function ProfileHeader({ user }) {
  return <div className="profile-header">{user?.username || 'User'}</div>;
}
