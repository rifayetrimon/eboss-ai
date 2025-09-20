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
    setDeleteConfirm,
}: {
    setIsOpen: (v: boolean) => void;
    history: any[];
    loading: boolean;
    error: string | null;
    refreshHistory: () => Promise<void>;
    showAlert: (type: 'success' | 'danger' | 'warning' | 'info', message: string) => void;
    setDeleteConfirm: (data: { show: boolean; documentId: string; filename: string }) => void;
}) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (documentId: string, filename: string) => {
        // Show confirmation modal instead of browser confirm
        setDeleteConfirm({ show: true, documentId, filename });
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
    const [uploadProgress, setUploadProgress] = useState(0);

    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [errorHistory, setErrorHistory] = useState<string | null>(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');

    // Delete confirmation state
    const [deleteConfirm, setDeleteConfirm] = useState<{
        show: boolean;
        documentId: string;
        filename: string;
    }>({
        show: false,
        documentId: '',
        filename: '',
    });
    const [deleting, setDeleting] = useState(false);

    const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'danger' | 'warning' | 'info'; message: string }>({
        show: false,
        type: 'info',
        message: '',
    });

    // Auto-dismiss timer ref
    const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showAlert = (type: 'success' | 'danger' | 'warning' | 'info', message: string) => {
        // Clear existing timeout
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }

        // Show alert
        setAlert({ show: true, type, message });

        // Auto-dismiss success alerts after 5 seconds
        if (type === 'success') {
            alertTimeoutRef.current = setTimeout(() => {
                setAlert((prev) => ({ ...prev, show: false }));
            }, 5000);
        }
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
        };
    }, []);

    // Handle manual alert close
    const handleAlertClose = () => {
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
        setAlert({ ...alert, show: false });
    };

    // Handle actual delete after confirmation
    const handleConfirmDelete = async () => {
        try {
            const key = localStorage.getItem('x-encrypted-key');
            if (!key) {
                showAlert('danger', 'Missing encrypted key!');
                return;
            }

            setDeleting(true);
            await deleteTrainingDocument(deleteConfirm.documentId, key);

            showAlert('success', `"${deleteConfirm.filename}" deleted successfully`);
            await fetchHistory();

            // Reset delete confirmation state
            setDeleteConfirm({ show: false, documentId: '', filename: '' });
        } catch (err: any) {
            console.error(err);
            showAlert('danger', `Failed to delete: ${err.message}`);
        } finally {
            setDeleting(false);
        }
    };

    // Simulate progress for demonstration - replace this with actual progress tracking
    const simulateProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90; // Keep at 90% until actual upload completes
                }
                return prev + Math.random() * 15;
            });
        }, 200);
        return interval;
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

            // Start progress simulation
            const progressInterval = simulateProgress();

            await uploadTrainingFile(file, key, selectedCategory, selectedTrainingType);

            // Complete the progress
            clearInterval(progressInterval);
            setUploadProgress(100);

            // Small delay to show 100% completion
            setTimeout(async () => {
                await fetchHistory();
                showAlert('success', 'File uploaded successfully!');
                setIsOpen(false);
                setFile(null);
                setUploadProgress(0);
            }, 500);
        } catch (err: any) {
            console.error(err);
            showAlert('danger', 'Upload failed. ' + err.message);
            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (!isOpen || showConfirm || deleteConfirm.show) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, showConfirm, deleteConfirm.show]);

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Global Alert */}
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md">
                <Alert type={alert.type} message={alert.message} show={alert.show} onClose={handleAlertClose} />
            </div>

            <TrainingHistory
                setIsOpen={setIsOpen}
                history={history}
                loading={loadingHistory}
                error={errorHistory}
                refreshHistory={fetchHistory}
                showAlert={showAlert}
                setDeleteConfirm={setDeleteConfirm}
            />

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

                        {/* Progress Bar */}
                        {uploading && (
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</h3>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(uploadProgress)}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex overflow-hidden">
                                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                        )}

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
                                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Public Upload Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[60]">
                    <div className="bg-red-50 rounded-xl shadow-xl w-full max-w-md p-6 relative text-center">
                        <h3 className="text-lg font-bold text-red-900 mb-2">Are you sure you want to make this file public?</h3>
                        <p className="text-sm text-red-800 mb-6">Try to keep sensitive information private.</p>

                        <div className="flex justify-center gap-3">
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
                                onClick={async () => {
                                    setShowConfirm(false);
                                    setConfirmInput('');
                                    await handleUpload();
                                }}
                                className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[60]">
                    <div className="bg-red-50 rounded-xl shadow-xl w-full max-w-md p-6 relative text-center">
                        <h3 className="text-lg font-bold text-red-900 mb-2">Delete Training File</h3>
                        <p className="text-sm text-red-800 mb-6">
                            Are you sure you want to delete <span className="font-semibold">&quot;{deleteConfirm.filename}&quot;</span>?
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => {
                                    setDeleteConfirm({ show: false, documentId: '', filename: '' });
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={deleting}
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:bg-red-400 disabled:cursor-not-allowed"
                            >
                                {deleting ? 'Deleting...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
