import React from 'react'
import { BookOpen, Github, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ERPCore</span>
            </div>
            <p className="text-gray-600 text-sm">
              Official documentation for ERPCore SA-MP Roleplay Server. 
              Stay updated with the latest rules and server changes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/rules" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Server Rules
                </a>
              </li>
              <li>
                <a href="/changelog" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors flex items-center space-x-1">
                  <span>Game Server</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors flex items-center space-x-1">
                  <span>Discord Community</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Server Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Server Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Server IP:</span> play.erpcore.com:7777
              </p>
              <p>
                <span className="font-medium">Version:</span> SA-MP 0.3.7
              </p>
              <p>
                <span className="font-medium">Mode:</span> Roleplay
              </p>
              <p>
                <span className="font-medium">Language:</span> English
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 by Amrul Hadi made with ❤️. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <a
              href="https://github.com/amrulpxl/erpcore-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 text-sm">
              Built with React & Express
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
