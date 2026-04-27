'use client';

import { useRef } from 'react';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  className?: string;
}


export default function DateInput({ value, onChange, min, className }: DateInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    try {
      ref.current?.showPicker();
    } catch {

    }
  };

  return (
    <input
      ref={ref}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      onClick={handleClick}
      className={className}
    />
  );
}
