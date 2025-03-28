import { Switch } from "./ui/switch";

interface HeaderProps {
    isSI: boolean;
    setIsSI: (value: boolean) => void;
}

const Header = ({ isSI, setIsSI }: HeaderProps) => {
    return (
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

                {/* Right side elements: Navigation + Unit Toggle */}
                <div className="flex items-center space-x-6">
                    {/* Navigation Links */}
                    <div className="flex items-center mr-10">
                        <a href="/guide" className="text-sm font-medium hover:text-blue-600">
                            Guide
                        </a>
                    </div>

                    {/* Unit System Toggle */}
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