/**
 * Notifications — Displays user notifications at /notifications.
 *
 * Currently shows an empty state since no backend is connected.
 * When the API is ready, replace MOCK_NOTIFICATIONS with real data.
 */

const MOCK_NOTIFICATIONS = [];

export default function Notifications() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Notifications</h1>
        <p className="text-sm text-surface-500 mt-1">Stay updated with your activity</p>
      </div>

      {MOCK_NOTIFICATIONS.length === 0 ? (
        /* Empty state */
        <div className="card flex flex-col items-center justify-center py-16 px-4 text-center">
          {/* Bell icon */}
          <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
            No notifications
          </h2>
          <p className="text-sm text-surface-500 max-w-sm">
            When someone interacts with your posts, comments, or communities, you&apos;ll see notifications here.
          </p>
        </div>
      ) : (
        /* Notification list — ready for future implementation */
        <div className="space-y-2">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <div key={notification.id} className="card p-4">
              {notification.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
