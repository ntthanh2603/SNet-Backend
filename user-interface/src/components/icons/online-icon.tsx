const OnlineIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <g filter="url(#filter0_b_12308_97777)">
        <g filter="url(#filter1_bi_12308_97777)">
          <circle cx="6" cy="6" r="6" fill="url(#paint0_linear_12308_97777)" />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_b_12308_97777"
          x="-32"
          y="-32"
          width="76"
          height="76"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="16" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_12308_97777"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_12308_97777"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_bi_12308_97777"
          x="-100"
          y="-100"
          width="212"
          height="212"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="50" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_12308_97777"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_12308_97777"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="4" />
          <feGaussianBlur stdDeviation="8" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.972549 0 0 0 0 0.972549 0 0 0 0 0.972549 0 0 0 0.06 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_12308_97777"
          />
        </filter>
        <linearGradient
          id="paint0_linear_12308_97777"
          x1="6"
          y1="0"
          x2="6"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F8F8F8" stopOpacity="0.9" />
          <stop offset="1" stop-color="#F8F8F8" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default OnlineIcon;
