// File: components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Campus Event Management</h1>
      <div className="flex space-x-4">
        <Link href="/login">
          <button className="bg-blue-500 px-4 py-2 rounded">Sign In</button>
        </Link>
        <Link href="/register">
          <button className="bg-green-500 px-4 py-2 rounded">Sign Up</button>
        </Link>
      </div>
    </header>
  );
}
