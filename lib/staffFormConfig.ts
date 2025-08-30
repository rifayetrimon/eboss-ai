// lib/staffFormConfig.ts

export type FieldType = 'text' | 'select' | 'date' | 'textarea' | 'checkbox';

export interface FieldConfig {
    key: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: string[];
    mandatory?: boolean;
    visible: boolean; // controlled by settings
    span?: number; // grid column span (1 or 2+)
}

export interface SectionConfig {
    enabled: boolean; // section toggle
    section: string;
    title: string;
    fields: FieldConfig[];
}

export const staffFormConfig: SectionConfig[] = [
    {
        enabled: true,
        section: 'system-information',
        title: 'System Information',
        fields: [
            { key: 'name', label: 'Name', type: 'text', placeholder: 'Jimmy Turner', mandatory: true, visible: true },
            { key: 'systemLevel', label: 'System Level', type: 'select', options: ['Admin', 'User'], mandatory: true, visible: true },
            { key: 'icNumber', label: 'IC Number', type: 'text', placeholder: '123456789', visible: true },
            { key: 'systemAccess', label: 'System Access', type: 'select', options: ['All', 'Limited'], visible: true },
            { key: 'phone', label: 'Phone', type: 'text', placeholder: '+60 (162) 531-588', visible: true },
            { key: 'startDate', label: 'Start Date', type: 'date', visible: true },
            { key: 'email', label: 'Email', type: 'text', placeholder: 'jimmy@gmail.com', visible: true },
            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], visible: true },
            { key: 'defaultAddress', label: 'Make this my default address', type: 'checkbox', visible: true, span: 2 },
        ],
    },
    // {
    //     enabled: true,
    //     title: 'Social Media',
    //     fields: [
    //         { name: 'linkedin', label: 'LinkedIn', type: 'social', icon: 'linkedin' },
    //         { name: 'twitter', label: 'Twitter', type: 'social', icon: 'twitter' },
    //         { name: 'facebook', label: 'Facebook', type: 'social', icon: 'facebook' },
    //         { name: 'github', label: 'GitHub', type: 'social', icon: 'github' },
    //     ],
    // },
    {
        enabled: true,
        section: 'personal',
        title: 'Personal',
        fields: [
            { key: 'race', label: 'Race', type: 'select', options: ['Malay', 'Chinese', 'Indian'], visible: true },
            { key: 'religion', label: 'Religion', type: 'select', options: ['Islam', 'Christianity', 'Hinduism'], visible: true },
            { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], visible: true },
            { key: 'nationality', label: 'Nationality', type: 'select', options: ['Malaysia', 'China', 'India'], visible: true },
            { key: 'birthPlace', label: 'Birth Place', type: 'select', options: ['Selangor', 'Johor', 'Kedah'], visible: true },
            { key: 'telHome', label: 'Tel. Home', type: 'text', placeholder: '+60 (162) 531-588', visible: true },
            { key: 'birthDate', label: 'Birth Date', type: 'date', visible: true },
        ],
    },
    {
        enabled: true,
        section: 'address',
        title: 'Address',
        fields: [
            { key: 'permanentAddress', label: 'Permanent Address', type: 'textarea', visible: true, span: 2 },
            { key: 'permanentState', label: 'State', type: 'select', options: ['Selangor', 'Johor', 'Kedah'], visible: true },
            { key: 'permanentCountry', label: 'Country', type: 'select', options: ['Malaysia', 'United States'], visible: true },
            { key: 'sameAsMailing', label: 'Mailing address same as above', type: 'checkbox', visible: true, span: 2 },
            { key: 'presentAddress', label: 'Present Address', type: 'textarea', visible: true, span: 2 },
            { key: 'presentState', label: 'State', type: 'select', options: ['Selangor', 'Johor', 'Kedah'], visible: true },
            { key: 'presentCountry', label: 'Country', type: 'select', options: ['Malaysia', 'United States'], visible: true },
        ],
    },
    {
        enabled: true,
        section: 'occupation',
        title: 'Occupation',
        fields: [
            { key: 'qualification', label: 'Qualification', type: 'select', options: ['PHD', 'Bachelor', 'Masters'], visible: true },
            { key: 'occupation', label: 'Occupation', type: 'select', options: ['Guru Besar', 'Ketua Unit SPBT'], visible: true },
            { key: 'division', label: 'Division', type: 'select', options: ['Support', 'Academic'], visible: true },
            { key: 'status', label: 'Status', type: 'select', options: ['Tetap', 'Kontrak', 'Sandaran'], visible: true },
            { key: 'grade', label: 'Grade', type: 'select', options: ['A', 'B', 'C'], visible: true },
            { key: 'branch', label: 'Branch', type: 'select', options: [], visible: true },
            { key: 'confirmDate', label: 'Confirm Date', type: 'date', visible: true },
            { key: 'endDate', label: 'End Date', type: 'date', visible: true },
            { key: 'visaExpiry', label: 'Visa Expiry', type: 'date', visible: true },
            { key: 'permitExpiry', label: 'Permit Expiry', type: 'date', visible: true },
            { key: 'contractExpiry', label: 'Contract Expiry', type: 'date', visible: true },
            { key: 'passportExpiry', label: 'Passport Expiry', type: 'date', visible: true },
        ],
    },
    {
        enabled: true,
        section: 'academic',
        title: 'Academic',
        fields: [
            { key: 'qualification', label: 'Qualification', type: 'text', placeholder: 'Enter Degree', visible: true },
            { key: 'institute', label: 'Institute Name', type: 'text', placeholder: 'Enter Institute', visible: true, span: 4 },
            { key: 'passingYear', label: 'Passing Year', type: 'text', placeholder: 'YYYY', visible: true },
        ],
    },
    {
        enabled: true,
        section: 'working-experience',
        title: 'Working Experience',
        fields: [
            { key: 'position', label: 'Position', type: 'text', placeholder: 'Enter Position', visible: true },
            { key: 'grade', label: 'Grade', type: 'text', placeholder: 'Enter Grade', visible: true },
            { key: 'division', label: 'Division', type: 'text', placeholder: 'Enter Division', visible: true },
            { key: 'employer', label: 'Employer', type: 'text', placeholder: 'Enter Employer', visible: true },
            { key: 'startDate', label: 'Start Date', type: 'date', visible: true },
            { key: 'endDate', label: 'End Date', type: 'date', visible: true },
        ],
    },
    {
        enabled: true,
        section: 'family-information',
        title: 'Family Information',
        fields: [
            { key: 'fatherName', label: "Father's Name", type: 'text', placeholder: 'John Doe', visible: true },
            { key: 'motherName', label: "Mother's Name", type: 'text', placeholder: 'Jane Doe', visible: true },
            { key: 'phone', label: 'Phone', type: 'text', placeholder: '+60 (162) 531-588', visible: true },
            { key: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Married', 'Unmarried', 'Divorced'], visible: true },
            { key: 'spouseName', label: 'Spouse Name', type: 'text', placeholder: 'Jane Doe', visible: true },
            { key: 'spouseIC', label: 'Spouse IC', type: 'text', placeholder: '123456789', visible: true },
            { key: 'spousePhone', label: 'Spouse Phone', type: 'text', placeholder: '+60 (162) 531-588', visible: true },
            { key: 'spouseOccupation', label: 'Spouse Occupation', type: 'text', placeholder: 'Engineer', visible: true },
        ],
    },
];
