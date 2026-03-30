import { useState } from 'react';
import { Button, Avatar } from '../components/common';
import useAuth from '../hooks/useAuth.js';

/**
 * Settings — User settings page at /settings.
 *
 * Sections:
 *   1. Profile info (avatar, username, email, bio)
 *   2. Account preferences (theme, email notifications, privacy)
 *   3. Danger zone (delete account)
 *
 * All saves are mock (no API yet). Shows success toast on save.
 */
export default function Settings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    privateProfile: false,
    showOnlineStatus: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const inputClass = `w-full px-4 py-2.5 text-sm rounded-xl
    bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-700
    text-surface-900 dark:text-surface-100 placeholder:text-surface-400
    focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
    transition-all duration-200`;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-secondary text-sm mb-6">
        Manage your account and preferences
      </p>

      {/* Success toast */}
      {saved && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-success-500/15 border border-success-500/20 text-success-500 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Section 1: Profile ── */}
        <div className="card p-6">
          <h2 className="text-base font-semibold mb-4">Profile Information</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5">
            <Avatar name={profile.username} size="lg" />
            <div>
              <button
                type="button"
                className="text-sm text-primary-500 hover:text-primary-400 font-medium"
              >
                Change avatar
              </button>
              <p className="text-xs text-surface-500 mt-0.5">JPG, PNG. Max 2MB.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Bio</label>
              <textarea
                rows={3}
                maxLength={200}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs text-surface-500 mt-1 text-right">
                {profile.bio.length}/200
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 2: Preferences ── */}
        <div className="card p-6">
          <h2 className="text-base font-semibold mb-4">Preferences</h2>

          <div className="space-y-4">
            {[
              {
                key: 'emailNotifications',
                label: 'Email Notifications',
                desc: 'Receive email notifications for replies, mentions, and community updates',
              },
              {
                key: 'privateProfile',
                label: 'Private Profile',
                desc: 'Only approved followers can see your posts and comment history',
              },
              {
                key: 'showOnlineStatus',
                label: 'Show Online Status',
                desc: 'Let others see when you are active on Gatherly',
              },
            ].map((pref) => (
              <div key={pref.key} className="flex items-start justify-between gap-4 py-2">
                <div>
                  <p className="text-sm font-medium">{pref.label}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{pref.desc}</p>
                </div>
                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setPrefs({ ...prefs, [pref.key]: !prefs[pref.key] })}
                  className={`relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200 ${
                    prefs[pref.key] ? 'bg-primary-500' : 'bg-gray-300 dark:bg-surface-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      prefs[pref.key] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Danger Zone ── */}
        <div className="card p-6 border-danger-500/30">
          <h2 className="text-base font-semibold text-danger-500 mb-2">Danger Zone</h2>
          <p className="text-sm text-surface-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-danger-500/50 text-sm font-medium text-danger-500 hover:bg-danger-500/10 transition-colors"
          >
            Delete Account
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" loading={isLoading} size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
