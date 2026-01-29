import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner text-gray-600 body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <Link href="/" className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
          <span className="ml-3 text-xl">Quiz App</span>
        </Link>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>

          {/* Twitter */}
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="ml-3 text-gray-500 hover:text-blue-400">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.03 9.03 0 01-2.83 1.08A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.51 0 .35.04.69.11 1.01C7.69 5.4 4.07 3.59 1.64.69a4.48 4.48 0 00-.61 2.27 4.51 4.51 0 002.01 3.75A4.48 4.48 0 01.96 6v.05a4.52 4.52 0 003.62 4.43 4.52 4.52 0 01-2.04.08 4.52 4.52 0 004.21 3.13 9.05 9.05 0 01-5.6 1.93A9.06 9.06 0 010 19.54a12.81 12.81 0 006.95 2.04c8.35 0 12.92-6.92 12.92-12.92 0-.2 0-.39-.01-.58A9.23 9.23 0 0023 3z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ml-3 text-gray-500 hover:text-pink-600">
            <svg fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="ml-3 text-gray-500 hover:text-blue-700">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5V5c0-2.761-2.239-5-5-5zm-11 19H5v-9h3v9zm-1.5-10.29c-.966 0-1.75-.78-1.75-1.75S5.534 5.21 6.5 5.21s1.75.78 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.42-2-1.5-2s-1.5.92-1.5 2v4.5h-3v-9h3v1.26c.42-.72 1.2-1.26 2.25-1.26 1.8 0 3 1.32 3 3.3v5.7z"/>
            </svg>
          </a>
        </span>
      </div>
    </footer>
  )
}

export default Footer
