// Desc: Header component for the app
interface HeaderProps {
    onContactClick: () => void;
}

const Header = ({ onContactClick }: HeaderProps) => {
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
                <nav className="flex items-center space-x-5">
                    <button
                        onClick={onContactClick}
                        className="text-sm font-medium hover:text-primary cursor-pointer bg-transparent border-none"
                    >
                        Contact
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;