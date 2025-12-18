import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LayoutDashboard } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(logout());
    };

    const [searchTerm, setSearchTerm] = React.useState('');
    const navigate = useNavigate();
    const [showDepartments, setShowDepartments] = React.useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${searchTerm}`);
        }
    };

    return (
        <header className="bg-primary text-white font-sans relative">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-6">
                {/* Logo & Department */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex flex-col leading-none">
                        <span className="text-2xl font-bold tracking-tight">GeM Compare</span>
                        <span className="text-secondary text-[10px] tracking-wider uppercase font-semibold">Save Money. Live Better.</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-3xl relative">
                    <form onSubmit={handleSearch} className="flex w-full">
                        <input
                            type="text"
                            placeholder="Search everything at GeM Compare..."
                            className="w-full py-2 px-5 text-gray-900 focus:outline-none rounded-full rounded-r-none h-10 shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="bg-secondary text-primary px-6 h-10 rounded-r-full hover:bg-yellow-400 transition flex items-center justify-center">
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* Nav Icons */}
                <div className="flex items-center space-x-8">
                    <div
                        className="flex flex-col items-center cursor-pointer hover:bg-white/10 p-2 rounded relative group"
                        onMouseEnter={() => setShowDepartments(true)}
                        onMouseLeave={() => setShowDepartments(false)}
                    >
                        <div className="bg-white text-primary rounded-full p-1">
                            <Menu className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] mt-1 font-semibold">Departments</span>

                        {/* Departments Dropdown */}
                        {showDepartments && (
                            <div className="absolute top-full left-0 w-56 bg-white text-gray-800 shadow-xl rounded-b-md z-50 border-t border-gray-100">
                                <ul className="py-2">
                                    {['Electronics', 'Office Supplies', 'Furniture', 'IT Peripherals'].map(cat => (
                                        <li key={cat}>
                                            <Link to={`/products?category=${cat}`} className="block px-4 py-2 hover:bg-gray-100 hover:text-primary hover:underline text-sm">
                                                {cat}
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="border-t mt-2 pt-2">
                                        <Link to="/products" className="block px-4 py-2 font-bold text-primary hover:underline text-sm">
                                            View All Departments
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {user && user.role === 'admin' && (
                        <Link to="/admin/dashboard" className="flex flex-col items-center cursor-pointer hover:bg-white/10 p-2 rounded text-secondary">
                            <LayoutDashboard className="h-6 w-6" />
                            <span className="text-[11px] mt-1 font-bold">Admin</span>
                        </Link>
                    )}

                    {user ? (
                        <div className="flex flex-col items-center cursor-pointer hover:bg-white/10 p-2 rounded group relative">
                            <User className="h-6 w-6" />
                            <span className="text-[11px] mt-1 font-semibold">Account</span>

                            <div className="absolute top-full right-0 w-48 bg-white text-gray-800 shadow-xl rounded-md z-50 hidden group-hover:block border border-gray-100 text-sm">
                                <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-md">
                                    <p className="font-bold text-gray-900">Hi, {user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <ul className="py-1">
                                    <li>
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 hover:text-primary">My Profile</Link>
                                    </li>
                                    <li>
                                        <button onClick={onLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-red-600 text-red-600 font-medium">
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="flex flex-col items-center cursor-pointer hover:bg-white/10 p-2 rounded">
                                <User className="h-6 w-6" />
                                <span className="text-[11px] mt-1 font-semibold">Sign In</span>
                            </Link>
                            <Link to="/register" className="flex flex-col items-center cursor-pointer hover:bg-white/10 p-2 rounded">
                                <User className="h-6 w-6" />
                                <span className="text-[11px] mt-1 font-semibold">Join</span>
                            </Link>
                        </div>
                    )}

                    <Link to="/cart" className="flex flex-col items-center cursor-pointer hover:bg-white/10 p-2 rounded relative">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="text-[11px] mt-1 font-semibold">Cart</span>
                        {cartItems.length > 0 && (
                            <span className="absolute top-1 right-1 bg-secondary text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Secondary Nav / Breadcrumbs style bar */}
            <div className="bg-[#004f9a] text-white text-sm py-2.5 px-4 shadow-md">
                <div className="container mx-auto flex items-center space-x-8">
                    <Link to="/products" className="flex items-center font-bold hover:underline gap-2">
                        <Menu className="h-5 w-5" /> All Departments
                    </Link>
                    <div className="flex space-x-6 text-white font-medium">
                        <span className="opacity-80">Top Categories:</span>
                        <Link to="/products?category=Electronics" className="hover:text-secondary hover:underline transition">Electronics</Link>
                        <Link to="/products?category=Office" className="hover:text-secondary hover:underline transition">Office Supplies</Link>
                        <Link to="/products?category=Furniture" className="hover:text-secondary hover:underline transition">Furniture</Link>
                        <Link to="/products?category=IT" className="hover:text-secondary hover:underline transition">IT & Peripherals</Link>
                        <Link to="/products?category=Appliances" className="hover:text-secondary hover:underline transition">Appliances</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
