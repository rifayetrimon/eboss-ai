import ComponentsStaffDatatable from '@/components/staff/datatable/component-staff-datatable';
import IconBell from '@/components/icon/icon-bell';
import React from 'react';
import Link from 'next/link';

export default function StaffDataTable() {
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
                <div className="mb-5 mt-2 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Staff Listing</h5>
                </div>
                <ComponentsStaffDatatable />
            </div>
        </>
    );
}
