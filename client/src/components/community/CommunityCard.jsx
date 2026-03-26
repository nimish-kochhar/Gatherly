// TODO: Implement CommunityCard
export default function CommunityCard({ community }) {
  return <div className="community-card">{community?.name || 'Community'}</div>;
}
