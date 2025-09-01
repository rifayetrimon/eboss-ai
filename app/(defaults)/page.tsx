import Sidebar from '@/components/layouts/sidebar';

export default function Home() {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="border-b border-border p-4">
                    <h1 className="text-xl font-semibold">AI Assistant</h1>
                    <p className="text-sm text-muted-foreground">Ask me anything</p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Welcome Message */}
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="bg-muted rounded-lg p-3">
                                <p className="text-sm">Hello! Im your AI assistant. How can I help you today?</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Just now</p>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
