import React, { Component, ErrorInfo, ReactNode } from "react";
import { clearAllData } from "../services/storageService";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = async () => {
    if (window.confirm("This will delete all uploaded logos, banners, and videos to fix the crash. Are you sure?")) {
        try {
            await clearAllData();
            window.location.reload();
        } catch (e) {
            alert("Failed to clear data automatically. Please clear your browser cache manually.");
        }
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdf9f2] p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#373A4D] mb-3">Something went wrong</h1>
            <p className="text-[#9e9e9e] mb-8 text-sm leading-relaxed">
              The app crashed while trying to load your saved data. This usually happens if an uploaded video file is too large for the browser's memory.
            </p>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-6 text-xs text-left font-mono text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                Error: {this.state.error?.message || "Unknown Error"}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-4 px-6 bg-[#ffb800] hover:bg-[#ffc933] text-[#373A4D] rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Reset App Data & Reload
            </button>
            <p className="mt-4 text-xs text-[#9e9e9e]/60">
                This will revert the app to its default state.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
