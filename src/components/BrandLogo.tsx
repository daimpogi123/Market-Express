interface BrandLogoProps {
  theme?: 'light' | 'dark';
}

export function BrandLogo({ theme = 'light' }: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0">
      <svg
        viewBox="0 0 46 36"
        className="w-10 h-8 sm:w-11 sm:h-9 shrink-0"
        role="img"
        aria-label="MEO logo"
      >
        <rect
          x="1"
          y="1"
          width="44"
          height="34"
          rx="8"
          fill="#166534"
          stroke={theme === 'dark' ? '#22C55E' : '#14532D'}
          strokeOpacity={theme === 'dark' ? 0.45 : 0.2}
          strokeWidth="1.2"
        />
        <path
          d="M36.5 4.5C38.8 4.5 40.5 6.2 40.5 8.5C38.2 8.5 36.5 6.8 36.5 4.5Z"
          fill="#86EFAC"
        />
        <text
          x="22.5"
          y="23"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="'Bricolage Grotesque', 'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="700"
          fontSize="13.5"
          letterSpacing="0.8"
        >
          MEO
        </text>
      </svg>

      <span
        className={`font-display text-[15px] sm:text-lg xl:text-xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-[#1A241B]'
        }`}
      >
        Market Express Online
      </span>
    </span>
  );
}
