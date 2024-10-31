
"use client";

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col" >
      <header className="bg-blue-600 text-white">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Event Manager
          </Link>
          <div className="space-x-4">
            <Link
              href="/pages/users/login"
              className={`hover:underline ${pathname.startsWith('/admin') ? 'underline' : ''}`}
            >
              Login 
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          © 2024 Event Management System
        </div>
      </footer>
    </div>
  );
}
