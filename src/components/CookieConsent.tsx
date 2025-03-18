import { useState, useEffect } from 'react';

// Add interface to extend Window
interface CustomWindow extends Window {
    [key: string]: any;
    gtag?: any;
}

declare let window: CustomWindow;

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        // Check if consent has already been given
        const consentGiven = localStorage.getItem('cookieConsent') === 'true';
        if (!consentGiven) {
            setShowConsent(true);

            // Temporarily disable Google Analytics
            window['ga-disable-G-NR7TMX1P1S'] = true;
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShowConsent(false);

        // Enable Google Analytics
        window['ga-disable-G-NR7TMX1P1S'] = false;

        // Reinitialize Analytics if already loaded
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
            window.gtag('js', new Date());
            window.gtag('config', 'G-NR7TMX1P1S');
        }
    };

    const declineCookies = () => {
        localStorage.setItem('cookieConsent', 'false');
        setShowConsent(false);

        // Keep Google Analytics disabled
        window['ga-disable-G-NR7TMX1P1S'] = true;
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 border-t">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <p className="text-sm">
                        We use analytics cookies to improve our service.
                        This data is completely anonymous and helps us enhance your experience.
                        By clicking "Accept", you consent to our use of cookies.
                    </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={declineCookies}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Decline
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;