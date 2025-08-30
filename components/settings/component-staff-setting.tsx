'use client';

import { useState, useEffect } from 'react';
import { staffFormConfig, SectionConfig } from '@/lib/staffFormConfig';

export default function ComponentStaffSetting() {
    const [config, setConfig] = useState<SectionConfig[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('staffFormConfig');
        if (saved) {
            setConfig(JSON.parse(saved));
        } else {
            setConfig(staffFormConfig.map((s) => ({ ...s, enabled: s.enabled ?? true })));
        }
    }, []);

    const toggleSection = (section: string) => {
        setConfig((prev) => prev.map((s) => (s.section === section ? { ...s, enabled: !s.enabled } : s)));
    };

    const toggleField = (section: string, key: string) => {
        setConfig((prev) =>
            prev.map((s) =>
                s.section === section
                    ? {
                          ...s,
                          fields: s.fields.map((f) => (f.key === key && !f.mandatory ? { ...f, visible: !f.visible } : f)),
                      }
                    : s,
            ),
        );
    };

    const saveConfig = () => {
        localStorage.setItem('staffFormConfig', JSON.stringify(config));
        alert('Settings saved!');
    };

    if (config.length === 0) return null;

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.map((section) => (
                    <div key={section.section} className="border rounded-lg shadow-sm p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold capitalize">{section.title}</h3>

                            <label className="w-12 h-6 relative">
                                <input
                                    type="checkbox"
                                    checked={section.enabled}
                                    onChange={() => toggleSection(section.section)}
                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                />
                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                            </label>
                        </div>

                        {section.enabled && (
                            <div className="space-y-2">
                                {section.fields.map((field) => (
                                    <label key={field.key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox text-primary"
                                            checked={field.visible}
                                            disabled={field.mandatory}
                                            onChange={() => toggleField(section.section, field.key)}
                                        />
                                        <span className="ml-2">
                                            {field.label} {field.mandatory && <span className="text-red-500 text-xs">(mandatory)</span>}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={saveConfig} className="btn btn-primary mt-6 w-full md:w-auto">
                Save Settings
            </button>
        </div>
    );
}
