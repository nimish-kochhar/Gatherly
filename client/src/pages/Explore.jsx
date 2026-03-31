import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard.jsx';
import { communityService } from '../services/community.service.js';

/**
 * Explore — Browse all communities with search filter.
 *
 * Layout:
 *   - Page header with description
 *   - Search bar to filter communities by name
 *   - Grid of CommunityCards (responsive: 1→2→3 columns)
 *
 * Fetches communities from the API with optional search.
 */
export default function Explore() {
  const [search, setSearch] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommunities = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 50, offset: 0 };
      if (searchTerm) params.search = searchTerm;
      const { data } = await communityService.list(params);
      setCommunities(data.communities || []);
    } catch (err) {
      console.error('Failed to fetch communities:', err);
      setError('Could not load communities. The server may be unavailable.');
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCommunities('');
  }, [fetchCommunities]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCommunities(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCommunities]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Explore Communities</h1>
        <p className="text-secondary text-sm">
          Discover communities that match your interests
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search communities..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
            bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
            text-surface-900 dark:text-surface-100 placeholder:text-surface-400
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            transition-all duration-200"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card p-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-surface-500">Loading communities...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="card p-6 text-center">
          <p className="text-sm text-surface-500 mb-3">{error}</p>
          <button
            onClick={() => fetchCommunities(search)}
            className="text-sm text-primary-500 hover:text-primary-400 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Community grid */}
      {!loading && !error && communities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && communities.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-surface-500 text-sm">
            {search
              ? <>No communities found matching &ldquo;{search}&rdquo;</>
              : 'No communities yet. Be the first to create one!'}
          </p>
          <Link
            to="/create-community"
            className="inline-block mt-3 text-sm text-primary-500 hover:text-primary-400 no-underline font-medium"
          >
            Create a new community →
          </Link>
        </div>
      )}
    </div>
  );
}
