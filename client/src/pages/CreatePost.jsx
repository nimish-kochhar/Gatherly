import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';
import { communityService } from '../services/community.service.js';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * CreatePost — Post creation page at /create.
 *
 * Features:
 *   - Community selector dropdown (fetched from API)
 *   - Title input
 *   - Content type tabs: Text / Image / Link
 *   - Content editor (textarea or URL input)
 *   - Character counters
 *   - Mock submit → redirect to /home
 */
export default function CreatePost() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState('text');
  const [communities, setCommunities] = useState([]);
  const [form, setForm] = useState({
    community: '',
    title: '',
    content: '',
    url: '',
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  async function fetchCommunities() {
    try {
      const { data } = await communityService.list({ limit: 100, offset: 0 });
      setCommunities(data.communities || []);
    } catch (err) {
      console.error('Failed to fetch communities:', err);
      setCommunities([]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/home');
    }, 1000);
  };

  const inputClass = `w-full px-4 py-2.5 text-sm rounded-xl
    bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
    text-surface-900 dark:text-surface-100 placeholder:text-surface-400
    focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
    transition-all duration-200`;

  const contentTabs = [
    { key: 'text', label: 'Text', icon: '📝' },
    { key: 'image', label: 'Image', icon: '🖼️' },
    { key: 'link', label: 'Link', icon: '🔗' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Create a Post</h1>
      <p className="text-secondary text-sm mb-6">
        Share something with the community
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Community selector */}
        <div className="card p-4">
          <label className="block text-sm font-medium mb-1.5">
            Community <span className="text-danger-500">*</span>
          </label>
          <select
            required
            value={form.community}
            onChange={(e) => setForm({ ...form, community: e.target.value })}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Choose a community</option>
            {communities.map((c) => (
              <option key={c.id} value={c.slug}>
                g/{c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Post content card */}
        <div className="card p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Title <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={300}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="An interesting title"
              className={inputClass}
            />
            <p className="text-xs text-surface-500 mt-1 text-right">
              {form.title.length}/300
            </p>
          </div>

          {/* Content type tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-surface-800">
            {contentTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setContentType(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  contentType === tab.key
                    ? 'bg-white dark:bg-surface-700 shadow-sm text-surface-900 dark:text-surface-100'
                    : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Text content */}
          {contentType === 'text' && (
            <div>
              <textarea
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="What's on your mind? (supports markdown)"
                className={`${inputClass} resize-none`}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-surface-500">
                  Markdown supported: **bold**, *italic*, `code`
                </p>
                <p className="text-xs text-surface-500">
                  {form.content.length} characters
                </p>
              </div>
            </div>
          )}

          {/* Image upload */}
          {contentType === 'image' && (
            <div className="border-2 border-dashed border-gray-300 dark:border-surface-600 rounded-xl p-8 text-center">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-sm font-medium mb-1">Drag and drop an image</p>
              <p className="text-xs text-surface-500 mb-3">or click to browse (PNG, JPG, GIF up to 10MB)</p>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-gray-200 dark:hover:bg-surface-600 transition-colors"
              >
                Choose File
              </button>
            </div>
          )}

          {/* Link */}
          {contentType === 'link' && (
            <div>
              <label className="block text-sm font-medium mb-1.5">URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
                className={inputClass}
              />
              {form.url && (
                <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-surface-800 border border-gray-200 dark:border-surface-700">
                  <p className="text-xs text-surface-500 mb-1">Link Preview</p>
                  <p className="text-sm text-primary-500 truncate">{form.url}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-surface-500">
            Posting as <span className="font-semibold text-surface-700 dark:text-surface-300">{auth?.user?.username || 'user'}</span>
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={!form.community || !form.title}
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
