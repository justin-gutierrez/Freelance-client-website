'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchStore } from '@/lib/useSearchStore';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const initialDarkMode = savedTheme === 'dark';
    setDarkMode(initialDarkMode);
    applyTheme(initialDarkMode);
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      html.classList.remove('dark', 'light');
      if (isDark) {
        html.classList.add('dark');
        html.style.colorScheme = 'dark';
      } else {
        html.classList.add('light');
        html.style.colorScheme = 'light';
      }
      document.body.style.backgroundColor = isDark ? '#000000' : '#ffffff';
      document.body.style.color = isDark ? '#ededed' : '#171717';
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    applyTheme(newDarkMode);
  };

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-sm fixed w-full z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl">📸</div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">ChulaVisions</span>
          </Link>
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={e => e.preventDefault()} className="relative">
              <input
                type="text"
                placeholder="Search collections..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                aria-label="Search collections"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-md shadow-lg py-1 z-50 border border-gray-100 dark:border-zinc-800">
                <Link
                  href="/booking"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book a Session
                </Link>
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>
                <a
                  href="mailto:hello@photographer.com"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
} 