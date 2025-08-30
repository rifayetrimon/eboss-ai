import ComponentStaffDetails from '@/components/staff/details/component-staff-details';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Account Setting',
};

export default function StaffDetails() {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/staff/staff-list" className="before:content-['/'] ltr:before:mr-2 text-primary hover:underline">
                        staff
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Staff Details</span>
                </li>
            </ul>
            <ComponentStaffDetails />
        </div>
    );
}
