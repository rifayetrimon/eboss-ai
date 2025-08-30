export default function IconExcel({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
            {/* File outline with folded corner */}
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Label rectangle */}
            <rect x="5" y="11" width="14" height="6" rx="1.5" fill="currentColor" />

            {/* XLS text */}
            <text x="12" y="15.5" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="white" dominantBaseline="middle">
                XLS
            </text>
        </svg>
    );
}
