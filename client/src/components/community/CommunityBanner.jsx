// TODO: Implement CommunityBanner
export default function CommunityBanner({ community }) {
  return <div className="community-banner">{community?.name || 'Community'}</div>;
}
