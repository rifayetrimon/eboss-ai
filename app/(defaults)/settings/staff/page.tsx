import ComponentStaffSetting from '@/components/settings/component-staff-setting';
import Link from 'next/link';

export default function StaffSetting() {
    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Staff Setting</span>
                </li>
            </ul>

            <div>
                <h2 className="text-md mt-2 font-bold">Staff Form Setting</h2>
                <ComponentStaffSetting />
            </div>
        </>
    );
}
