import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';

/**
 * CreateCommunity — Form page to create a new community at /create-community.
 *
 * Fields:
 *   - Community name (becomes the slug)
 *   - Description (textarea)
 *   - Visibility (public / private)
 *
 * On submit (mock): navigates to /c/:slug after 1s delay.
 * When the API exists, this will POST to /communities.
 */
export default function CreateCommunity() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    visibility: 'public',
  });

  const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/c/${slug}`);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Create a Community</h1>
      <p className="text-secondary text-sm mb-6">
        Build a space for people who share your interests
      </p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Community Name <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400 font-medium">g/</span>
            <input
              type="text"
              required
              maxLength={30}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="communityname"
              className="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl
                bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
                text-surface-900 dark:text-surface-100 placeholder:text-surface-400
                focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                transition-all duration-200"
            />
          </div>
          {form.name && (
            <p className="text-xs text-surface-500 mt-1">
              URL: gatherly.io/c/<span className="text-primary-500">{slug || '...'}</span>
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Description <span className="text-danger-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            maxLength={300}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What is your community about?"
            className="w-full px-4 py-2.5 text-sm rounded-xl resize-none
              bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
              text-surface-900 dark:text-surface-100 placeholder:text-surface-400
              focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
              transition-all duration-200"
          />
          <p className="text-xs text-surface-500 mt-1 text-right">
            {form.description.length}/300
          </p>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'public', label: 'Public', desc: 'Anyone can view and join', icon: '🌍' },
              { key: 'private', label: 'Private', desc: 'Invite-only membership', icon: '🔒' },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setForm({ ...form, visibility: opt.key })}
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  form.visibility === opt.key
                    ? 'border-primary-500 bg-primary-600/10'
                    : 'border-gray-200 dark:border-surface-700 hover:border-surface-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{opt.icon}</span>
                  <span className="text-sm font-semibold">{opt.label}</span>
                </div>
                <p className="text-xs text-surface-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
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
            disabled={!form.name || !form.description}
          >
            Create Community
          </Button>
        </div>
      </form>
    </div>
  );
}
