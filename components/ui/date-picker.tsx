'use client';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import '@/styles/flatpickr.css';

interface DatePickerProps {
    value: Date[] | null;
    onChange: (date: Date[]) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
    const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD

    return (
        <div className="mb-5">
            <Flatpickr
                value={value || []}
                options={{ dateFormat: 'Y-m-d' }}
                placeholder={today}   // ✅ show current date as placeholder
                className="form-input border px-3 py-2 rounded-md"
                onChange={onChange}
            />
        </div>
    );
}
