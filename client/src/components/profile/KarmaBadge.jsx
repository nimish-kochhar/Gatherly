import { formatKarma } from '../../utils/formatKarma.js';

/**
 * Karma tier definitions — each tier has a threshold, label, icon, and Tailwind color classes.
 */
const KARMA_TIERS = [
  {
    min: 5000,
    label: 'Legend',
    icon: '👑',
    bg: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500',
    border: 'border-yellow-400/30',
    text: 'text-white',
    glow: 'shadow-lg shadow-yellow-500/25',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]',
  },
  {
    min: 1000,
    label: 'Veteran',
    icon: '💎',
    bg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    border: 'border-amber-400/30',
    text: 'text-white',
    glow: 'shadow-md shadow-amber-500/20',
    iconGlow: 'drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]',
  },
  {
    min: 500,
    label: 'Rising Star',
    icon: '🔥',
    bg: 'bg-gradient-to-r from-purple-500 to-violet-500',
    border: 'border-purple-400/30',
    text: 'text-white',
    glow: 'shadow-md shadow-purple-500/20',
    iconGlow: 'drop-shadow-[0_0_4px_rgba(168,85,247,0.5)]',
  },
  {
    min: 100,
    label: 'Contributor',
    icon: '⭐',
    bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    border: 'border-blue-400/30',
    text: 'text-white',
    glow: 'shadow-md shadow-blue-500/15',
    iconGlow: 'drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]',
  },
  {
    min: 0,
    label: 'Newcomer',
    icon: '🌱',
    bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
    border: 'border-green-400/30',
    text: 'text-white',
    glow: 'shadow-md shadow-green-500/15',
    iconGlow: 'drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]',
  },
];

/**
 * Resolve the tier config for a given karma value.
 */
function getTier(karma) {
  return KARMA_TIERS.find((t) => karma >= t.min) || KARMA_TIERS[KARMA_TIERS.length - 1];
}

/**
 * KarmaBadge — Premium tiered karma badge component.
 *
 * Displays a visually rich pill/badge showing the user's karma tier,
 * tier icon, formatted karma count, and tier label. Optionally renders
 * a compact breakdown of post karma, comment karma, and creation bonuses.
 *
 * @param {{ karma: number, showBreakdown?: boolean, breakdown?: object }} props
 */
export default function KarmaBadge({ karma = 0, showBreakdown = false, breakdown = null }) {
  const tier = getTier(karma);

  return (
    <div className="mt-4 inline-block">
      {/* Main badge pill */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${tier.bg} ${tier.border} ${tier.glow} border transition-all duration-300`}
      >
        {/* Animated tier icon */}
        <span className={`text-base animate-pulse ${tier.iconGlow}`}>
          {tier.icon}
        </span>

        {/* Karma count */}
        <span className={`text-sm font-bold ${tier.text} tracking-wide`}>
          {formatKarma(karma)}
        </span>

        {/* Divider dot */}
        <span className={`${tier.text} opacity-50`}>·</span>

        {/* Tier label */}
        <span className={`text-xs font-semibold ${tier.text} opacity-90 uppercase tracking-wider`}>
          {tier.label}
        </span>
      </div>

      {/* Breakdown section */}
      {showBreakdown && breakdown && (
        <div className="flex items-center gap-4 mt-2.5 ml-1">
          <BreakdownItem label="Post Karma" value={breakdown.postKarma ?? 0} />
          <BreakdownItem label="Comment Karma" value={breakdown.commentKarma ?? 0} />
          <BreakdownItem label="Bonuses" value={breakdown.creationBonus ?? 0} />
        </div>
      )}
    </div>
  );
}

/**
 * BreakdownItem — Small labeled value used in the karma breakdown row.
 */
function BreakdownItem({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-sm font-bold text-surface-800 dark:text-surface-200">
        {formatKarma(value)}
      </p>
      <p className="text-[10px] text-surface-500 uppercase tracking-wide leading-tight">
        {label}
      </p>
    </div>
  );
}
