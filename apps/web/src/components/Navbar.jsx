import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-surface/80 backdrop-blur-md dark:bg-surface-dim/80 w-full sticky top-0 z-50 border-b border-outline/10 shadow-sm">
      <div className="flex justify-between items-center h-16 px-gutter max-w-7xl mx-auto">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed flex items-center">
          <img alt="Logo" className="h-10 w-auto inline-block mr-2 align-middle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1ZJb5XquQBqfse6TmUEpGq9ntMKLf_zCe0ECkSTlVwgDjeynSxsLisJ3M-po0FOppS3WaaL8isXm7dW70JFnuuD4gXtLWiFR7hAMKxjf6AHiS0Y7pGgHmXMNupzkUuAWueItXjl5ZnpvL0e4M_KdMvrWCOQP-8K2eDHSYXIKvlKwfYEa7e1wX6ohOJcCZPleIjUyMfLWSUsPY6h6yC7S8JJNGfRIJRTQctcouX0_u_a39ehKNhoFZzuHkA6K8DrvKIyDM11B2Dg" />
          FSPengajuan
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
