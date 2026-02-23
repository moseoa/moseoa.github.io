import React from 'react';
import icons from '../assets/icons/icons.json';

const Icon = ({ name, size = 24, color = 'currentColor', className = '' }) => {
  const icon = icons[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found in icons.json`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
};

export default Icon;
