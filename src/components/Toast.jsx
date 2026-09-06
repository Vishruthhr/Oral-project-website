import React from 'react';
import { useDental } from '../context/DentalContext';

export default function Toast() {
  const { toast } = useDental();
  if (!toast.show) return null;

  return (
    <div className={`toast show ${toast.type}`}>
      {toast.message}
    </div>
  );
}
