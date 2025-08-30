import React from 'react';
import Link from 'next/link';
import StaffTableTwo from '@/components/staff/datatable/component-staff-datatable-two';

export default function StaffDataTableTwo() {
    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Staff</span>
                </li>
            </ul>

            <div>
                {/* <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                    <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                        <IconBell />
                    </div>
                </div> */}
                <h2 className="text-md mt-2 font-bold">Staff Listing</h2>
                <StaffTableTwo />
            </div>
        </>
    );
}
