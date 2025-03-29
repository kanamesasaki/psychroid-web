import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// ガイドの章構造の定義
const chapters = [
    { id: 'intro', path: '/guide', title: '1. Introduction', exact: true },
    { id: 'basics', path: '/guide/basics', title: '2. Basic HVAC Process' },
];

const GuideLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const useScrollbar = (alwaysVisible: boolean = true) => {
        useEffect(() => {
            // 元のスタイルを保存
            const originalOverflow = document.documentElement.style.overflowY;

            // スクロールバーを表示
            if (alwaysVisible) {
                document.documentElement.style.overflowY = 'scroll';
            }

            // クリーンアップ関数：コンポーネントがアンマウントされたときに元に戻す
            return () => {
                document.documentElement.style.overflowY = originalOverflow;
            };
        }, [alwaysVisible]);
    };

    useScrollbar(true);

    // 現在のチャプターインデックスを検出
    const currentIndex = chapters.findIndex(ch =>
        (ch.exact && ch.path === currentPath) ||
        (!ch.exact && ch.path === currentPath)
    );
    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b py-4 mb-3">
                <div className="w-full mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1920px] px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center">
                            <img
                                src="/logo.svg"
                                alt="Logo"
                                className="h-8 w-8 mr-3"
                            />
                            <span className="text-2xl font-bold">
                                Psychrometric Chart Calculator
                            </span>
                        </a>
                    </div>

                    <div className="flex items-center space-x-6">
                        <a href="/" className="text-sm font-medium hover:text-blue-600">
                            Home
                        </a>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden border-b p-4">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center text-gray-700"
                >
                    <span className="mr-2">Guide Contents</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>

                {mobileMenuOpen && (
                    <div className="mt-3 border-t pt-3">
                        <ul className="space-y-2">
                            {chapters.map(chapter => (
                                <li key={chapter.id}>
                                    <NavLink
                                        to={chapter.path}
                                        end={chapter.exact}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`
                                        }
                                    >
                                        {chapter.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex flex-1 w-full mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1920px]">
                {/* Desktop Side Navigation */}
                <aside className="w-64 bg-gray-50 p-6 hidden md:block border-r">
                    <h3 className="font-bold text-lg mb-4">Guide Contents</h3>
                    <nav>
                        <ul className="space-y-2">
                            {chapters.map(chapter => (
                                <li key={chapter.id}>
                                    <NavLink
                                        to={chapter.path}
                                        end={chapter.exact}
                                        className={({ isActive }) =>
                                            `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`
                                        }
                                    >
                                        {chapter.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* チャプターコンテンツが表示される */}
                    <Outlet />

                    {/* チャプター間のナビゲーション */}
                    <div className="mt-12 pt-4 border-t flex justify-between">
                        {prevChapter ? (
                            <NavLink to={prevChapter.path} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                                ← {prevChapter.title}
                            </NavLink>
                        ) : (
                            <span></span>
                        )}

                        {nextChapter && (
                            <NavLink to={nextChapter.path} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                {nextChapter.title} →
                            </NavLink>
                        )}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t py-2 px-6">
                <div className="w-full mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1920px] flex justify-start items-center">
                    <div className="flex space-x-6 items-center">
                        <div className="text-sm text-gray-600">
                            © {new Date().getFullYear()} K. Sasaki
                        </div>
                        <span className="text-gray-300">|</span>
                        <a href="/contact/" className="text-sm text-gray-600 hover:underline">
                            Contact
                        </a>
                        <span className="text-gray-300">|</span>
                        <a href="/terms/" className="text-sm text-gray-600 hover:underline">
                            Terms & Conditions
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GuideLayout;