import CommunityCard from '../components/CommunityCard.jsx';
import { MOCK_COMMUNITIES } from '../data/mockData.js';

/**
 * Popular — Shows communities ranked by member count.
 *
 * Layout:
 *   - Page header
 *   - Ranked grid of CommunityCards with position badges (#1, #2, etc.)
 *   - Communities are sorted by memberCount (descending)
 */
export default function Popular() {
  const sorted = [...MOCK_COMMUNITIES].sort(
    (a, b) => b.memberCount - a.memberCount
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">🏆 Popular Communities</h1>
        <p className="text-secondary text-sm">
          The most active communities on Gatherly, ranked by members
        </p>
      </div>

      {/* Ranked grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((community, i) => (
          <CommunityCard key={community.id} community={community} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
