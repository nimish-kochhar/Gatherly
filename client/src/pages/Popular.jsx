import { useState, useEffect } from 'react';
import CommunityCard from '../components/CommunityCard.jsx';
import { communityService } from '../services/community.service.js';

/**
 * Popular — Shows communities ranked by member count.
 *
 * Layout:
 *   - Page header
 *   - Ranked grid of CommunityCards with position badges (#1, #2, etc.)
 *   - Communities sorted by memberCount (descending)
 */
export default function Popular() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopular();
  }, []);

  async function fetchPopular() {
    setLoading(true);
    try {
      const { data } = await communityService.list({ limit: 50, offset: 0 });
      const sorted = (data.communities || []).sort(
        (a, b) => (b.memberCount || 0) - (a.memberCount || 0),
      );
      setCommunities(sorted);
    } catch (err) {
      console.error('Failed to fetch popular communities:', err);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">🏆 Popular Communities</h1>
        <p className="text-secondary text-sm">
          The most active communities on Gatherly, ranked by members
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card p-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-surface-500">Loading communities...</p>
        </div>
      )}

      {/* Ranked grid */}
      {!loading && communities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {communities.map((community, i) => (
            <CommunityCard key={community.id} community={community} rank={i + 1} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && communities.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-surface-500 text-sm">No communities yet. Be the first to create one!</p>
        </div>
      )}
    </div>
  );
}
