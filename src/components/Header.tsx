import { Switch } from "./ui/switch";

interface HeaderProps {
    isSI: boolean;
    setIsSI: (value: boolean) => void;
}

const Header = ({ isSI, setIsSI }: HeaderProps) => {
    return (
        <header className="border-b py-4 mb-3">
            <div className="w-full mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1920px] px-4 sm:px-6">
                {/* First row: Logo and Title */}
                <div className="flex items-center justify-between md:justify-start">
                    <a href="/" className="flex items-center">
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-6 w-6 mr-3"
                        />
                        <h1 className="text-xl md:text-xl font-bold m-0">
                            Psychrometric Chart Calculator
                        </h1>
                    </a>

                    {/* Desktop: Navigation + Unit Toggle on same line */}
                    <div className="hidden md:flex items-center space-x-6 ml-auto">
                        <a href="/guide/" className="text-sm font-medium hover:text-blue-600">
                            Guide
                        </a>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">IP</span>
                            <Switch
                                id="unit-toggle"
                                checked={isSI}
                                onCheckedChange={setIsSI}
                            />
                            <span className="text-sm font-medium">SI</span>
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet: Second row for Navigation + Unit Toggle */}
                <div className="flex md:hidden items-center justify-end space-x-6 mt-3 pt-3 border-t border-gray-200">
                    <a href="/guide/" className="text-sm font-medium hover:text-blue-600">
                        Guide
                    </a>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">IP</span>
                        <Switch
                            id="unit-toggle"
                            checked={isSI}
                            onCheckedChange={setIsSI}
                        />
                        <span className="text-sm font-medium">SI</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;