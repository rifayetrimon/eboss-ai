'use client';
import { useState, useEffect } from 'react';
import IconFacebook from '@/components/icon/icon-facebook';
import IconGithub from '@/components/icon/icon-github';
import IconHome from '@/components/icon/icon-home';
import IconLinkedin from '@/components/icon/icon-linkedin';
import IconPhone from '@/components/icon/icon-phone';
import IconTwitter from '@/components/icon/icon-twitter';
import IconUser from '@/components/icon/icon-user';
import DatePicker from '@/components/ui/date-picker';
import { staffFormConfig, type SectionConfig, type FieldConfig } from '@/lib/staffFormConfig';
import Image from 'next/image';
import { basePath } from '@/lib/basePath';

type Experience = {
    position: string;
    grade: string;
    division: string;
    employer: string;
    startDate: Date | null;
    endDate: Date | null;
};

type Child = {
    name: string;
    icNumber: string;
    maritalStatus: string;
    occupation: string;
    birthDate: Date | null;
};

export default function ComponentStaffDetails() {
    const [tabs, setTabs] = useState<string>('');
    const [config, setConfig] = useState<SectionConfig[]>([]);
    const [date, setDate] = useState<Date[] | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('staffFormConfig');
        if (saved) {
            setConfig(JSON.parse(saved));
        } else {
            setConfig(staffFormConfig);
        }
    }, []);

    useEffect(() => {
        if (config.length > 0 && !tabs) {
            const firstEnabled = config.find((s) => s.enabled);
            if (firstEnabled) setTabs(firstEnabled.section);
        }
    }, [config, tabs]);

    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const [experiences, setExperiences] = useState<Experience[]>([{ position: '', grade: '', division: '', employer: '', startDate: null, endDate: null }]);

    const addExperience = () => {
        setExperiences([...experiences, { position: '', grade: '', division: '', employer: '', startDate: null, endDate: null }]);
    };

    const [children, setChildren] = useState<Child[]>([{ name: '', icNumber: '', maritalStatus: '', occupation: '', birthDate: null }]);

    const handleChange = <K extends keyof Experience>(index: number, field: K, value: Experience[K]) => {
        const updated = [...experiences];
        updated[index][field] = value;
        setExperiences(updated);
    };

    const handleChildChange = (index: number, field: keyof Child, value: any) => {
        const newChildren = [...children];
        newChildren[index][field] = value;
        setChildren(newChildren);
    };

    const addChild = () => {
        setChildren([...children, { name: '', icNumber: '', maritalStatus: '', occupation: '', birthDate: null }]);
    };

    const renderField = (field: FieldConfig) => {
        if (!field.visible && !field.mandatory) return null;

        const colSpan = field.span === 2 ? 'sm:col-span-2' : field.span === 4 ? 'sm:col-span-4' : '';

        switch (field.type) {
            case 'text':
                return (
                    <div key={field.key} className={colSpan}>
                        <label htmlFor={field.key}>{field.label}</label>
                        <input id={field.key} type="text" placeholder={field.placeholder || ''} className="form-input" />
                    </div>
                );
            case 'select':
                return (
                    <div key={field.key} className={colSpan}>
                        <label htmlFor={field.key}>{field.label}</label>
                        <select id={field.key} className="form-select text-white-dark" defaultValue="Select">
                            <option value="Select" disabled>
                                Select
                            </option>
                            {field.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            case 'date':
                return (
                    <div key={field.key} className={colSpan}>
                        <label htmlFor={field.key}>{field.label}</label>
                        <DatePicker value={date} onChange={setDate} />
                    </div>
                );
            case 'textarea':
                return (
                    <div key={field.key} className={colSpan}>
                        <label htmlFor={field.key}>{field.label}</label>
                        <textarea id={field.key} rows={3} className="form-textarea w-full" placeholder={field.placeholder || ''} />
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={field.key} className={colSpan}>
                        <label className="inline-flex items-center cursor-pointer space-x-2">
                            <input type="checkbox" className="form-checkbox" />
                            <span className="text-white-dark">{field.label}</span>
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    if (config.length === 0) return null;

    return (
        <div className="pt-5">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Staff Details</h5>
            </div>

            <div>
                <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
                    {config
                        .filter((section) => section.enabled)
                        .map((section) => (
                            <li key={section.section} className="inline-block">
                                <button
                                    onClick={() => toggleTabs(section.section)}
                                    className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === section.section ? '!border-primary text-primary' : ''}`}
                                >
                                    {section.section === 'system-information' && <IconHome />}
                                    {section.section === 'personal' && <IconUser className="h-5 w-5" />}
                                    {section.section === 'address' && <IconUser className="h-5 w-5" />}
                                    {section.section === 'occupation' && <IconPhone />}
                                    {section.section === 'academic' && <IconPhone />}
                                    {section.section === 'working-experience' && <IconPhone />}
                                    {section.section === 'family-information' && <IconPhone />}
                                    {section.title}
                                </button>
                            </li>
                        ))}
                </ul>
            </div>

            {tabs === 'system-information' && config.find((s) => s.section === 'system-information') && (
                <div>
                    <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-6 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-6 text-lg font-bold">System Information</h6>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                            {/* Profile Image */}
                            <div className="w-full sm:w-2/12 flex justify-center sm:justify-start">
                                <Image src={`${basePath}/assets/images/profile-34.jpeg`} alt="img" width={80} height={80} className="h-20 w-20 rounded-full object-cover md:h-32 md:w-32" />
                            </div>

                            {/* Form Grid */}
                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                                {config.find((s) => s.section === 'system-information')?.fields.map((field) => renderField(field))}

                                {/* Button aligned consistently */}
                                <div className="sm:col-span-2">
                                    <button type="button" className="btn btn-primary w-full sm:w-auto">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <form className="rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">Social</h6>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="flex">
                                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconLinkedin className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconTwitter className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconFacebook className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconGithub />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {tabs === 'personal' && config.find((s) => s.section === 'personal') && (
                <div>
                    <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">Personal Information</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">{config.find((s) => s.section === 'personal')?.fields.map((field) => renderField(field))}</div>
                        </div>
                    </form>
                </div>
            )}

            {tabs === 'address' && config.find((s) => s.section === 'address') && (
                <div>
                    <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">Address Information</h6>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{config.find((s) => s.section === 'address')?.fields.map((field) => renderField(field))}</div>
                    </form>
                </div>
            )}

            {tabs === 'occupation' && config.find((s) => s.section === 'occupation') && (
                <div>
                    <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">Occupation Information</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">{config.find((s) => s.section === 'occupation')?.fields.map((field) => renderField(field))}</div>
                        </div>
                    </form>
                </div>
            )}

            {tabs === 'academic' && config.find((s) => s.section === 'academic') && (
                <div>
                    <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">Academic Degree</h6>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-6">
                            {config
                                .find((s) => s.section === 'academic')
                                ?.fields.map((field) => {
                                    if (!field.visible && !field.mandatory) return null;

                                    let colSpan = 'sm:col-span-1';
                                    if (field.span === 4) colSpan = 'sm:col-span-4';

                                    return (
                                        <div key={field.key} className={colSpan}>
                                            <label htmlFor={field.key}>{field.label}</label>
                                            <input id={field.key} type="text" className="form-input w-full" placeholder={field.placeholder || ''} />
                                        </div>
                                    );
                                })}
                        </div>
                        {/* Additional rows for multiple academic entries */}
                        <div className="grid grid-cols-1 mt-5 gap-5 sm:grid-cols-6">
                            <div className="sm:col-span-1">
                                <input type="text" className="form-input w-full" placeholder="Enter Degree" />
                            </div>
                            <div className="sm:col-span-4">
                                <input type="text" className="form-input w-full" placeholder="Enter Institute Name" />
                            </div>
                            <div className="sm:col-span-1">
                                <input type="text" className="form-input w-full" placeholder="YYYY" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 mt-5 gap-5 sm:grid-cols-6">
                            <div className="sm:col-span-1">
                                <input type="text" className="form-input w-full" placeholder="Enter Degree" />
                            </div>
                            <div className="sm:col-span-4">
                                <input type="text" className="form-input w-full" placeholder="Enter Institute Name" />
                            </div>
                            <div className="sm:col-span-1">
                                <input type="text" className="form-input w-full" placeholder="YYYY" />
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Working Experience section remains dynamic */}
            {tabs === 'working-experience' && config.find((s) => s.section === 'working-experience') && (
                <div>
                    {experiences.map((exp, index) => (
                        <form key={index} className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                            <h6 className="mb-5 text-lg font-bold">Working Experience {index + 1}</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                                    {config
                                        .find((s) => s.section === 'working-experience')
                                        ?.fields.map((field) => {
                                            if (!field.visible && !field.mandatory) return null;

                                            if (field.type === 'date') {
                                                return (
                                                    <div key={field.key}>
                                                        <label>{field.label}</label>
                                                        <DatePicker value={date} onChange={setDate} />
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={field.key}>
                                                    <label>{field.label}</label>
                                                    <input
                                                        type="text"
                                                        placeholder={field.placeholder || ''}
                                                        className="form-input"
                                                        value={
                                                            field.key === 'position'
                                                                ? exp.position
                                                                : field.key === 'grade'
                                                                  ? exp.grade
                                                                  : field.key === 'division'
                                                                    ? exp.division
                                                                    : field.key === 'employer'
                                                                      ? exp.employer
                                                                      : ''
                                                        }
                                                        onChange={(e) => {
                                                            if (field.key === 'position') handleChange(index, 'position', e.target.value);
                                                            if (field.key === 'grade') handleChange(index, 'grade', e.target.value);
                                                            if (field.key === 'division') handleChange(index, 'division', e.target.value);
                                                            if (field.key === 'employer') handleChange(index, 'employer', e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </form>
                    ))}

                    <button type="button" onClick={addExperience} className="btn btn-primary w-full sm:w-auto">
                        + Add More
                    </button>
                </div>
            )}

            {tabs === 'family-information' && config.find((s) => s.section === 'family-information') && (
                <div>
                    <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">Family Information</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">{config.find((s) => s.section === 'family-information')?.fields.map((field) => renderField(field))}</div>
                        </div>

                        <h6 className="mb-5 mt-6 text-lg font-bold">Children Information</h6>
                        {children.map((child, index) => (
                            <div key={index} className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                                <h6 className="mb-4 text-md font-semibold">Child {index + 1}</h6>
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor={`name_child_${index}`}>Child Name</label>
                                        <input
                                            id={`name_child_${index}`}
                                            type="text"
                                            placeholder="Jane Doe"
                                            className="form-input"
                                            value={child.name}
                                            onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`ic_child_${index}`}>IC Number (Child)</label>
                                        <input
                                            id={`ic_child_${index}`}
                                            type="text"
                                            placeholder="319349841"
                                            className="form-input"
                                            value={child.icNumber}
                                            onChange={(e) => handleChildChange(index, 'icNumber', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`status_child_${index}`}>Marital Status</label>
                                        <select
                                            id={`status_child_${index}`}
                                            className="form-select text-white-dark"
                                            value={child.maritalStatus}
                                            onChange={(e) => handleChildChange(index, 'maritalStatus', e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Married">Married</option>
                                            <option value="Unmarried">Unmarried</option>
                                            <option value="Divorced">Divorced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`occupation_child_${index}`}>School/College/Job</label>
                                        <input
                                            id={`occupation_child_${index}`}
                                            type="text"
                                            placeholder="Student / Engineer"
                                            className="form-input"
                                            value={child.occupation}
                                            onChange={(e) => handleChildChange(index, 'occupation', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="profession">Birth Date</label>
                                        <DatePicker value={date} onChange={setDate} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={addChild} className="btn btn-primary w-full sm:w-auto">
                            + Add More Child
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
