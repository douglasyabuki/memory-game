import { type Component } from "solid-js";

interface HeartProps {
  broken?: boolean;
  disabled?: boolean;
}

export const HeartIcon: Component<HeartProps> = (props) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill={props.disabled ? "#444" : props.broken ? "gray" : "red"}
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: props.disabled ? 0.4 : 1 }}
    >
      {props.broken ? (
        // Broken Heart Path
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z M11 11l2 2m-2-2l2-2" />
      ) : (
        // Full Heart Path
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      )}

      {/* Disabled overlay: strike-through line and lock icon */}
      {props.disabled && (
        <>
          {/* Diagonal strike-through */}
          <line x1="4" y1="4" x2="20" y2="20" stroke="#888" stroke-width="2" />

          {/* Small lock icon in center */}
          <g transform="translate(9, 9)">
            <rect x="1" y="2.5" width="4" height="3" rx="0.5" fill="#888" />
            <path
              d="M2 2.5 C2 1.5 2.5 1 3 1 C3.5 1 4 1.5 4 2.5"
              stroke="#888"
              stroke-width="0.8"
              fill="none"
            />
          </g>
        </>
      )}
    </svg>
  );
};
