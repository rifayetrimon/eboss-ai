'use client';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import IconArrowLf from '@/components/icon/icon-arrow-lf';
import IconArrowRt from '@/components/icon/icon-arrow-rg';
import IconSend from '@/components/icon/icon-send';
import IconPrinter from '@/components/icon/icon-printer';
import { ChevronDown, Mail, MessageSquare, Printer } from 'lucide-react';
import Dropdown from '@/components/dropdown';
import { useSelector } from 'react-redux';
import type { IRootState } from '@/store';
import IconExcel from '@/components/icon/icon-excel';
import Tippy from '@tippyjs/react';

type Staff = {
    id: number;
    name: string;
    staffId: string;
    email: string;
    phone: string;
    position: string;
    status: 'active' | 'inactive';
    division: string;
    avatar: string;
};

const staffData: Staff[] = [
    {
        id: 1,
        name: 'Caroline Jensen',
        staffId: 'STF001',
        email: 'carolinejensen@zidant.com',
        phone: '+1 (821) 447-3782',
        position: 'Manager',
        status: 'active',
        division: 'Finance',
        avatar: '/assets/images/profile-1.jpeg',
    },
    {
        id: 2,
        name: 'Celeste Grant',
        staffId: 'STF002',
        email: 'celestegrant@polarax.com',
        phone: '+1 (838) 515-3408',
        position: 'Executive',
        status: 'inactive',
        division: 'HR',
        avatar: '/assets/images/profile-2.jpeg',
    },
    {
        id: 3,
        name: 'Lucas Ramirez',
        staffId: 'STF003',
        email: 'lucasramirez@orbalix.com',
        phone: '+1 (925) 611-2890',
        position: 'Analyst',
        status: 'active',
        division: 'IT',
        avatar: '/assets/images/profile-3.jpeg',
    },
    {
        id: 4,
        name: 'Sophie Chen',
        staffId: 'STF004',
        email: 'sophiechen@cygnix.com',
        phone: '+1 (743) 812-9043',
        position: 'Assistant',
        status: 'inactive',
        division: 'Admin',
        avatar: '/assets/images/profile-4.jpeg',
    },
    {
        id: 5,
        name: 'Michael Brown',
        staffId: 'STF005',
        email: 'michaelbrown@zentix.com',
        phone: '+1 (632) 559-1820',
        position: 'Manager',
        status: 'active',
        division: 'Operations',
        avatar: '/assets/images/profile-5.jpeg',
    },
    {
        id: 6,
        name: 'Amelia Wilson',
        staffId: 'STF006',
        email: 'ameliawilson@voltrix.com',
        phone: '+1 (931) 702-4478',
        position: 'Executive',
        status: 'inactive',
        division: 'Marketing',
        avatar: '/assets/images/profile-6.jpeg',
    },
    {
        id: 7,
        name: 'Ethan Miller',
        staffId: 'STF007',
        email: 'ethanmiller@aerovia.com',
        phone: '+1 (854) 390-1185',
        position: 'Supervisor',
        status: 'active',
        division: 'Production',
        avatar: '/assets/images/profile-7.jpeg',
    },
    {
        id: 8,
        name: 'Olivia Davis',
        staffId: 'STF008',
        email: 'oliviadavis@nebula.com',
        phone: '+1 (762) 211-4459',
        position: 'Executive',
        status: 'inactive',
        division: 'Finance',
        avatar: '/assets/images/profile-8.jpeg',
    },
    {
        id: 9,
        name: 'William Johnson',
        staffId: 'STF009',
        email: 'williamjohnson@krypton.com',
        phone: '+1 (803) 917-2753',
        position: 'Analyst',
        status: 'active',
        division: 'R&D',
        avatar: '/assets/images/profile-9.jpeg',
    },
    {
        id: 10,
        name: 'Emma Martinez',
        staffId: 'STF010',
        email: 'emmamartinez@hybridex.com',
        phone: '+1 (710) 441-3852',
        position: 'Coordinator',
        status: 'active',
        division: 'HR',
        avatar: '/assets/images/profile-10.jpeg',
    },
    {
        id: 11,
        name: 'James Anderson',
        staffId: 'STF011',
        email: 'jamesanderson@orbitex.com',
        phone: '+1 (932) 819-4720',
        position: 'Executive',
        status: 'inactive',
        division: 'Finance',
        avatar: '/assets/images/profile-11.jpeg',
    },
    {
        id: 12,
        name: 'Mia Thompson',
        staffId: 'STF012',
        email: 'miathompson@quantum.com',
        phone: '+1 (746) 288-5092',
        position: 'Supervisor',
        status: 'active',
        division: 'Operations',
        avatar: '/assets/images/profile-12.jpeg',
    },
    {
        id: 13,
        name: 'Benjamin White',
        staffId: 'STF013',
        email: 'benjaminwhite@astralis.com',
        phone: '+1 (867) 902-3729',
        position: 'Manager',
        status: 'active',
        division: 'Sales',
        avatar: '/assets/images/profile-13.jpeg',
    },
    {
        id: 14,
        name: 'Isabella Garcia',
        staffId: 'STF014',
        email: 'isabellagarcia@optivex.com',
        phone: '+1 (933) 622-8170',
        position: 'Analyst',
        status: 'inactive',
        division: 'Finance',
        avatar: '/assets/images/profile-14.jpeg',
    },
    {
        id: 15,
        name: 'Daniel Martinez',
        staffId: 'STF015',
        email: 'danielmartinez@ventrix.com',
        phone: '+1 (801) 379-1840',
        position: 'Executive',
        status: 'active',
        division: 'IT',
        avatar: '/assets/images/profile-15.jpeg',
    },
    {
        id: 16,
        name: 'Charlotte Taylor',
        staffId: 'STF016',
        email: 'charlottetaylor@ultrax.com',
        phone: '+1 (844) 216-7945',
        position: 'Coordinator',
        status: 'active',
        division: 'Admin',
        avatar: '/assets/images/profile-16.jpeg',
    },
    {
        id: 17,
        name: 'Henry Clark',
        staffId: 'STF017',
        email: 'henryclark@xenova.com',
        phone: '+1 (923) 521-9082',
        position: 'Supervisor',
        status: 'inactive',
        division: 'Production',
        avatar: '/assets/images/profile-17.jpeg',
    },
    {
        id: 18,
        name: 'Grace Lewis',
        staffId: 'STF018',
        email: 'gracelewis@omnix.com',
        phone: '+1 (865) 497-6201',
        position: 'Executive',
        status: 'active',
        division: 'Marketing',
        avatar: '/assets/images/profile-18.jpeg',
    },
    {
        id: 19,
        name: 'Alexander Walker',
        staffId: 'STF019',
        email: 'alexanderwalker@aether.com',
        phone: '+1 (955) 773-1320',
        position: 'Manager',
        status: 'inactive',
        division: 'Finance',
        avatar: '/assets/images/profile-19.jpeg',
    },
    {
        id: 20,
        name: 'Harper Young',
        staffId: 'STF020',
        email: 'harperyoung@velora.com',
        phone: '+1 (722) 134-2841',
        position: 'Analyst',
        status: 'active',
        division: 'HR',
        avatar: '/assets/images/profile-20.jpeg',
    },
];

export default function StaffTableTwo() {
    const PAGE_SIZES = [5, 10, 20];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
    const [records, setRecords] = useState<Staff[]>([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<keyof Staff>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [showMore, setShowMore] = useState(false);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    useEffect(() => {
        const filtered = staffData.filter(
            (s) =>
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.email.toLowerCase().includes(search.toLowerCase()) ||
                s.staffId.toLowerCase().includes(search.toLowerCase()) ||
                s.position.toLowerCase().includes(search.toLowerCase()) ||
                s.division.toLowerCase().includes(search.toLowerCase()),
        );

        let sorted = sortBy(filtered, sortKey);
        if (sortDir === 'desc') sorted = sorted.reverse();

        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(sorted.slice(from, to));
    }, [page, pageSize, search, sortKey, sortDir]);

    const toggleSort = (key: keyof Staff) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
        setPage(1);
    };

    const handlePrint = () => {
        const columns: (keyof Staff)[] = ['name', 'email', 'phone', 'position', 'status', 'division'];

        let rowhtml = '<p>Staff Listing</p>';
        rowhtml +=
            '<table style="width: 100%;" cellpadding="0" cellspacing="0">' + '<thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact;">';

        columns.forEach((col) => {
            const header = col.charAt(0).toUpperCase() + col.slice(1);
            rowhtml += `<th>${header}</th>`;
        });

        rowhtml += '</tr></thead><tbody>';

        records.forEach((item) => {
            rowhtml += '<tr>';
            columns.forEach((col) => {
                let val: any = item[col];
                if (col === 'status') {
                    val = item.status === 'active' ? `<span style="color:green;font-weight:600;">Active</span>` : `<span style="color:red;font-weight:600;">Inactive</span>`;
                }
                rowhtml += `<td>${val ?? ''}</td>`;
            });
            rowhtml += '</tr>';
        });

        rowhtml +=
            '<style>body{font-family:Arial;color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{border-collapse:collapse;border-spacing:0;width:100%;}th,td{font-size:12px;text-align:left;padding:4px;border:1px solid #ddd;}th{padding:8px 4px;}td{padding:4px;}tr:nth-child(2n-1){background:#f7f7f7;}</style>';
        rowhtml += '</tbody></table>';

        const winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
        winPrint.document.write('<title>Staff Listing</title>' + rowhtml);
        winPrint.document.close();
        winPrint.focus();
        winPrint.print();
    };

    return (
        <div className="panel mt-6">
            {/* Header */}
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <input type="text" className="form-input w-full sm:w-[300px] max-w-full" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

                    <div className="dropdown">
                        <Dropdown
                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                            btnClassName="flex items-center justify-between gap-2 rounded-lg bg-white-light/40 px-3 py-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 w-full sm:w-[180px]"
                            button={
                                <div className="flex items-center justify-between w-full">
                                    <span>All</span>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            }
                        >
                            <ul className="!min-w-[180px]">
                                <li>
                                    <button type="button" onClick={() => console.log('Awfatech')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Awfatech
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('HQ')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        HQ
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('School Awfa')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        School Awfa
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>

                    <div className="dropdown">
                        <Dropdown
                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                            btnClassName="flex items-center justify-between gap-2 rounded-lg bg-white-light/40 px-3 py-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 w-full sm:w-[180px]"
                            button={
                                <div className="flex items-center justify-between w-full">
                                    <span>All Division</span>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            }
                        >
                            <ul className="!min-w-[180px]">
                                <li>
                                    <button type="button" onClick={() => console.log('Finance')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Finance
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('HR')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        HR
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('IT')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        IT
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('Operations')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Operations
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>

                    <button type="button" onClick={() => setShowMore(!showMore)} className="text-blue-600 font-semibold hover:underline w-full sm:w-auto text-center sm:text-left">
                        {showMore ? 'Less' : 'More'}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:ml-auto">
                    <Tippy content="Register new staff" theme="white-light">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New
                        </button>
                    </Tippy>

                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <Tippy content="Download Excel" theme="white-light">
                            <button className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                                <IconExcel className="w-4 h-4" />
                            </button>
                        </Tippy>

                        {/* Print dropdown */}
                        <Tippy content="Print Data" theme="white-light">
                            <div className="dropdown">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                                    button={<IconPrinter className="w-4 h-4" />}
                                >
                                    <ul className="!min-w-[170px]">
                                        <li>
                                            <button type="button" onClick={handlePrint} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark/60">
                                                <Printer className="w-4 h-4 text-gray-600" />
                                                <span>Normal</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => console.log('Print Landscape')}
                                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark/60"
                                            >
                                                <Printer className="w-4 h-4 text-gray-600" />
                                                <span>Landscape</span>
                                            </button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </Tippy>

                        {/* Send dropdown */}
                        <Tippy content="Send Messages" theme="white-light">
                            <div className="dropdown">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                                    button={<IconSend className="w-4 h-4" />}
                                >
                                    <ul className="!min-w-[170px]">
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => console.log('Send Email')}
                                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark/60"
                                            >
                                                <Mail className="w-4 h-4 text-blue-600" />
                                                <span>Email</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" onClick={() => console.log('Send SMS')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark/60">
                                                <MessageSquare className="w-4 h-4 text-green-600" />
                                                <span>SMS</span>
                                            </button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </Tippy>
                    </div>
                </div>
            </div>

            {/* content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out mt-4 relative z-10 ${showMore ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mb-5 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-wrap">
                    {/* All Position Dropdown */}
                    <div className="dropdown relative z-20">
                        <Dropdown
                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                            btnClassName="flex items-center justify-between gap-2 rounded-lg bg-white-light/40 px-3 py-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 w-full sm:w-[180px]"
                            button={
                                <div className="flex items-center justify-between w-full">
                                    <span>All Position</span>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            }
                        >
                            <ul className="!min-w-[180px]">
                                <li>
                                    <button type="button" onClick={() => console.log('Manager')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Manager
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('Executive')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Executive
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('Analyst')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Analyst
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('Supervisor')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Supervisor
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>

                    {/* All Status Dropdown */}
                    <div className="dropdown relative z-20">
                        <Dropdown
                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                            btnClassName="flex items-center justify-between gap-2 rounded-lg bg-white-light/40 px-3 py-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 w-full sm:w-[180px]"
                            button={
                                <div className="flex items-center justify-between w-full">
                                    <span>All Status</span>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            }
                        >
                            <ul className="!min-w-[180px]">
                                <li>
                                    <button type="button" onClick={() => console.log('Active')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Active
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('Inactive')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Inactive
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>

                    {/* Gender Dropdown */}
                    <div className="dropdown relative z-20">
                        <Dropdown
                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                            btnClassName="flex items-center justify-between gap-2 rounded-lg bg-white-light/40 px-3 py-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 w-full sm:w-[180px]"
                            button={
                                <div className="flex items-center justify-between w-full">
                                    <span>Gender</span>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            }
                        >
                            <ul className="!min-w-[180px]">
                                <li>
                                    <button type="button" onClick={() => console.log('Male')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Male
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => console.log('Female')} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark/60">
                                        Female
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox text-primary" />
                            <span className="text-sm">Show inactive</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox text-primary" />
                            <span className="text-sm">Show Deleted</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox text-primary" />
                            <span className="text-sm">Search All</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            {/* User column */}
                            <th className="px-2 sm:px-4 py-2 text-left cursor-pointer w-[25%]" onClick={() => toggleSort('name')}>
                                User
                            </th>

                            {/* Contact column (Email + H/P combined on mobile, split on desktop) */}
                            <th className="px-2 sm:px-4 py-2 cursor-pointer w-[25%] sm:hidden" onClick={() => toggleSort('email')}>
                                Contact
                            </th>
                            <th className="px-2 sm:px-4 py-2 cursor-pointer w-[25%] hidden sm:table-cell" onClick={() => toggleSort('email')}>
                                Email
                            </th>
                            <th className="px-2 sm:px-4 py-2 cursor-pointer w-[20%] hidden sm:table-cell" onClick={() => toggleSort('phone')}>
                                H/P
                            </th>

                            {/* Department (Position + Division on mobile) */}
                            <th className="px-2 sm:px-4 py-2 cursor-pointer w-[20%] sm:hidden" onClick={() => toggleSort('position')}>
                                Department
                            </th>
                            <th className="px-2 sm:px-4 py-2 cursor-pointer w-[12%] hidden sm:table-cell" onClick={() => toggleSort('position')}>
                                Position
                            </th>
                            <th className="px-2 sm:px-4 py-2 cursor-pointer w-[13%] hidden md:table-cell" onClick={() => toggleSort('division')}>
                                Division
                            </th>

                            {/* Status (hidden on mobile, since it’s inside User column there) */}
                            <th className="px-2 sm:px-4 py-2 cursor-pointer w-[10%] hidden sm:table-cell" onClick={() => toggleSort('status')}>
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {records.map((s) => (
                            <tr key={s.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                {/* User column with status on mobile */}
                                <td className="px-2 sm:px-4 py-3 align-top">
                                    <div className="flex items-center">
                                        <img src={s.avatar || '/placeholder.svg'} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover mr-2 sm:mr-3 flex-shrink-0" alt={s.name} />
                                        <div className="min-w-0">
                                            <div className="font-medium text-sm sm:text-base truncate">{s.name}</div>

                                            <div className="text-xs text-gray-500 truncate">{s.staffId}</div>

                                            {/* Status only shown in mobile under User */}
                                            <div className="text-xs mt-1 sm:hidden">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${s.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact (mobile) */}
                                <td className="px-2 sm:px-4 py-3 sm:hidden">
                                    <div className="text-xs truncate">{s.email}</div>
                                    <div className="text-xs text-gray-500 truncate">{s.phone}</div>
                                </td>

                                {/* Email (desktop) */}
                                <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                                    <div className="truncate">{s.email}</div>
                                </td>

                                {/* Phone (desktop) */}
                                <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                                    <div className="text-sm truncate">{s.phone}</div>
                                </td>

                                {/* Department (mobile combines position + division) */}
                                <td className="px-2 sm:px-4 py-3 sm:hidden">
                                    <div className="text-xs truncate">{s.position}</div>
                                    <div className="text-xs text-gray-500 truncate">{s.division}</div>
                                </td>

                                {/* Position (desktop) */}
                                <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                                    <div className="text-sm truncate">{s.position}</div>
                                </td>

                                {/* Division (desktop only) */}
                                <td className="px-2 sm:px-4 py-3 hidden md:table-cell">
                                    <div className="truncate">{s.division}</div>
                                </td>

                                {/* Status (desktop only) */}
                                <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${s.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {s.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-600 dark:text-gray-400 order-2 lg:order-1">
                    <span className="text-center sm:text-left">
                        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, staffData.length)} of {staffData.length} entries
                    </span>
                    <select
                        className="border rounded px-2 py-1 text-sm text-center min-w-[60px]"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        {[5, 10, 20, 30, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 order-1 lg:order-2">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full border disabled:opacity-50 flex-shrink-0" disabled={page === 1} onClick={() => setPage(page - 1)}>
                        <IconArrowLf className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                        {Array.from({ length: Math.ceil(staffData.length / pageSize) }, (_, i) => i + 1)
                            .filter((p) => {
                                // Show first, last, current, and adjacent pages
                                const totalPages = Math.ceil(staffData.length / pageSize);
                                if (totalPages <= 7) return true;
                                return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                            })
                            .map((p, index, array) => {
                                // Add ellipsis
                                const prevPage = array[index - 1];
                                const showEllipsis = prevPage && p - prevPage > 1;

                                return (
                                    <div key={p} className="flex items-center gap-1">
                                        {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                                        <button
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                                                p === page ? 'bg-blue-500 text-white' : 'border text-gray-700 dark:text-gray-300'
                                            }`}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </button>
                                    </div>
                                );
                            })}
                    </div>

                    <button
                        className="flex items-center justify-center w-8 h-8 rounded-full border disabled:opacity-50 flex-shrink-0"
                        disabled={page * pageSize >= staffData.length}
                        onClick={() => setPage(page + 1)}
                    >
                        <IconArrowRt className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
