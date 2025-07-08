import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link href="/">
        <span className="text-2xl font-bold text-green-400">StreamFlow</span>
      </Link>
      <div>
        <Link href="/login" className="mr-4 hover:text-green-400">Login</Link>
        <Link href="/signup" className="hover:text-green-400">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar; 