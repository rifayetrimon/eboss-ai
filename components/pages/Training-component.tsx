'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import Dropdown from '../dropdown';
import { getTrainingHistory, uploadTrainingFile, deleteTrainingDocument } from '@/services/ai/training';
import Loading from '../layouts/loading';
import Alert from '../ui/alert';

// -------------------- TrainingHistory Component --------------------
function TrainingHistory({
    setIsOpen,
    history,
    loading,
    error,
    refreshHistory,
    showAlert,
}: {
    setIsOpen: (v: boolean) => void;
    history: any[];
    loading: boolean;
    error: string | null;
    refreshHistory: () => Promise<void>;
    showAlert: (type: 'success' | 'danger' | 'warning' | 'info', message: string) => void;
}) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (documentId: string, filename: string) => {
        if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

        try {
            const key = localStorage.getItem('x-encrypted-key');
            if (!key) {
                showAlert('danger', 'Missing encrypted key!');
                return;
            }

            setDeletingId(documentId);
            await deleteTrainingDocument(documentId, key);

            showAlert('success', `"${filename}" deleted successfully`);
            await refreshHistory();
        } catch (err: any) {
            console.error(err);
            showAlert('danger', `Failed to delete: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-0 flex flex-col h-full px-6 pt-14 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Training History</h2>
                <button onClick={() => setIsOpen(true)} className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition">
                    Train File
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {loading ? (
                    <Loading />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : history.length > 0 ? (
                    history.map((item) => (
                        <div
                            key={item._id}
                            className="flex flex-col justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate flex-1 mr-4">{item.filename}</h3>
                                {/* <span className="text-sm text-blue-800 dark:text-gray-400 flex-shrink-0">
                                    {item.upload_date}
                                    {item.upload_time}
                                </span> */}
                                <div className="text-right text-sm text-blue-800 dark:text-gray-400 flex-shrink-0">
                                    <div>{item.upload_date}</div>
                                    <div>{item.upload_time}</div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{item.description || 'No description available.'}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <span className="px-2 py-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium">{item.file_type.toUpperCase()}</span>
                                    <span className="px-2 py-1 rounded-md bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 font-medium">{item.category || 'N/A'}</span>
                                    <span className="px-2 py-1 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 font-medium">{item.level || 'N/A'}</span>
                                </div>

                                <button
                                    onClick={() => handleDelete(item.document_id, item.filename)}
                                    disabled={deletingId === item.document_id}
                                    className={`ml-4 p-2 rounded-lg transition-colors flex-shrink-0 ${
                                        deletingId === item.document_id
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-red-300 text-red-700 hover:text-white hover:bg-red-500 dark:hover:bg-red-900/20'
                                    }`}
                                    title={`Delete ${item.filename}`}
                                >
                                    {deletingId === item.document_id ? (
                                        <span className="text-xs">Deleting...</span>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No training history available.</p>
                )}
            </div>
        </motion.div>
    );
}

// -------------------- Parent Page --------------------
export default function TrainingPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [selectedTrainingType, setSelectedTrainingType] = useState('Internal');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryList, setCategoryList] = useState<{ value: string; display_name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [errorHistory, setErrorHistory] = useState<string | null>(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');

    const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'danger' | 'warning' | 'info'; message: string }>({
        show: false,
        type: 'info',
        message: '',
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showAlert = (type: 'success' | 'danger' | 'warning' | 'info', message: string) => {
        setAlert({ show: true, type, message });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await fetch('https://devapi02.awfatech.com/api/v1/llm/categories');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setCategoryList(data.data);
                    setSelectedCategory(data.data[0]?.value || null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const key = localStorage.getItem('x-encrypted-key');
            const res = await getTrainingHistory(key);
            setHistory(res.data || []);
        } catch (err) {
            console.error('Error fetching history:', err);
            setErrorHistory('Failed to load training history.');
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleUpload = async () => {
        if (!file) return showAlert('danger', 'Please select a file first!');
        if (!selectedCategory) return showAlert('warning', 'Please select a category!');

        try {
            setUploading(true);
            const key = localStorage.getItem('x-encrypted-key');
            if (!key) {
                showAlert('danger', 'Missing encrypted key!');
                return;
            }

            await uploadTrainingFile(file, key, selectedCategory, selectedTrainingType);

            await fetchHistory();
            showAlert('success', 'File uploaded successfully!');
            setIsOpen(false);
            setFile(null);
        } catch (err: any) {
            console.error(err);
            showAlert('danger', 'Upload failed. ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (!isOpen || showConfirm) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, showConfirm]);

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Global Alert */}
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md">
                <Alert type={alert.type} message={alert.message} show={alert.show} onClose={() => setAlert({ ...alert, show: false })} />
            </div>

            <TrainingHistory setIsOpen={setIsOpen} history={history} loading={loadingHistory} error={errorHistory} refreshHistory={fetchHistory} showAlert={showAlert} />

            {/* Upload Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl p-8 relative min-h-[500px]">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Upload Training File</h2>

                        {/* Dropdowns */}
                        <div className="mt-6 flex gap-3">
                            <Dropdown
                                button={
                                    <div className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                                        <span>{selectedTrainingType}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                }
                            >
                                <ul className="w-40 bg-white border rounded-md shadow-lg py-1 text-sm text-gray-700">
                                    {['Internal', 'Public'].map((item) => (
                                        <li key={item}>
                                            <button onClick={() => setSelectedTrainingType(item)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </Dropdown>

                            <Dropdown
                                button={
                                    <div className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                                        <span>{categoryList.find((c) => c.value === selectedCategory)?.display_name || 'Select Category'}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                }
                            >
                                <ul className="w-52 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto py-1 text-sm text-gray-700">
                                    {loading ? (
                                        <li className="px-4 py-2 text-gray-500">Loading...</li>
                                    ) : categoryList.length ? (
                                        categoryList.map((item) => (
                                            <li key={item.value}>
                                                <button onClick={() => setSelectedCategory(item.value)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                                    {item.display_name}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2 text-gray-500">No categories</li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div>

                        {/* File Upload */}
                        <div
                            className="mt-6 flex flex-col items-center justify-center w-full h-72 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    setFile(e.dataTransfer.files[0]);
                                }
                            }}
                        >
                            <svg className="w-20 h-20 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 6a5 5 0 00-4.546 2.916A4.992 4.992 0 007 9a5 5 0 00-4.546 2.916A4.992 4.992 0 002 15a5 5 0 005 5h11a5 5 0 00.09-9.998A7 7 0 0012 6z" />
                            </svg>

                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                                Browse
                            </button>
                            <p className="mt-2 text-sm text-gray-500">or drag a file here</p>

                            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />

                            {file && (
                                <p className="mt-3 text-sm text-green-600">
                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end">
                            <button
                                disabled={uploading}
                                onClick={async () => {
                                    if (!file) return showAlert('danger', 'Please select a file first!');
                                    if (!selectedCategory) return showAlert('warning', 'Please select a category!');

                                    if (selectedTrainingType === 'Public') {
                                        setShowConfirm(true);
                                    } else {
                                        await handleUpload();
                                    }
                                }}
                                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🚨 Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[60]">
                    <div className="bg-red-100 rounded-xl shadow-xl w-full max-w-md p-6 relative">
                        <h3 className="text-lg font-bold text-red-900 mb-2">Do not share internal matters to public</h3>
                        <p className="text-sm text-red-800 mb-4">
                            Type <span className="font-semibold">&quot;allow&quot;</span> to continue.
                        </p>

                        <input
                            type="text"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder="Type here..."
                            className="w-full px-3 py-2 rounded-lg border border-red-400 focus:ring-2 focus:ring-red-500 outline-none mb-6"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    setConfirmInput('');
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={confirmInput.toLowerCase() !== 'allow'}
                                onClick={async () => {
                                    if (confirmInput.toLowerCase() === 'allow') {
                                        setShowConfirm(false);
                                        setConfirmInput('');
                                        await handleUpload();
                                    }
                                }}
                                className={`px-4 py-2 rounded-lg font-medium text-white transition ${
                                    confirmInput.toLowerCase() === 'allow' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-400 cursor-not-allowed'
                                }`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
