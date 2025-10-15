export function BTMTravelLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f5576c', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Globe Circle */}
      <circle cx="50" cy="50" r="45" fill="url(#logoGradient1)" opacity="0.2" />
      <circle cx="50" cy="50" r="38" stroke="url(#logoGradient1)" strokeWidth="3" fill="none" />
      
      {/* Latitude Lines */}
      <ellipse cx="50" cy="50" rx="38" ry="15" stroke="url(#logoGradient1)" strokeWidth="1.5" fill="none" opacity="0.6" />
      <ellipse cx="50" cy="50" rx="38" ry="25" stroke="url(#logoGradient1)" strokeWidth="1.5" fill="none" opacity="0.4" />
      
      {/* Longitude Line */}
      <ellipse cx="50" cy="50" rx="15" ry="38" stroke="url(#logoGradient1)" strokeWidth="1.5" fill="none" opacity="0.6" />
      
      {/* Airplane */}
      <g transform="translate(35, 25) rotate(45 15 15)">
        <path
          d="M15 5 L15 20 M15 5 L25 10 L15 12 L5 10 Z M15 20 L18 25 L15 24 L12 25 Z"
          stroke="url(#logoGradient2)"
          strokeWidth="2.5"
          fill="url(#logoGradient2)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Airplane trail */}
        <circle cx="10" cy="2" r="1.5" fill="url(#logoGradient2)" opacity="0.6" />
        <circle cx="7" cy="0" r="1" fill="url(#logoGradient2)" opacity="0.4" />
      </g>
      
      {/* BTM Letters (stylized) */}
      <text
        x="50"
        y="72"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        fill="url(#logoGradient1)"
      >
        BTM
      </text>
    </svg>
  );
}
