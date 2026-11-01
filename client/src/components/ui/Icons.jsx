// Íconos de trazo simple (24×24), todos decorativos: el texto que los
// acompaña es lo que se anuncia, por eso aria-hidden.
function Icon({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const TruckIcon = () => (
  <Icon>
    <path d="M2 6h11v10H2zM13 9h4l3 3v4h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </Icon>
);
export const LeafIcon = () => (
  <Icon>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
    <path d="M5 19c2-4 5-7 9-9" />
  </Icon>
);
export const ShieldCheckIcon = () => (
  <Icon>
    <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);
export const ReturnIcon = () => (
  <Icon>
    <path d="M4 12a8 8 0 1 0 3-6.2" />
    <path d="M4 4v4h4" />
  </Icon>
);
export const LockIcon = () => (
  <Icon>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);
export const CartIcon = () => (
  <Icon>
    <path d="M3 4h2l2.4 11h10.2L20 7H6.2" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="17" cy="19" r="1.4" />
  </Icon>
);
export const HeartIcon = ({ filled = false }) => (
  <Icon fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </Icon>
);
export const CheckIcon = () => (
  <Icon>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
export const ExpandIcon = () => (
  <Icon>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Icon>
);
export const ChevronIcon = ({ direction = 'right' }) => (
  <Icon
    style={{
      transform:
        direction === 'left'
          ? 'rotate(180deg)'
          : direction === 'down'
            ? 'rotate(90deg)'
            : undefined,
    }}
  >
    <path d="M9 5l7 7-7 7" />
  </Icon>
);
