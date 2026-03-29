'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Checkbox } from '@/components/ui/checkbox';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [warnBeforeLogin, setWarnBeforeLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('The credentials you provided cannot be determined to be authentic.');
      }
    } catch {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-[#003366] text-white">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#003366] font-bold text-lg">BK</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">HCMUT &ndash; Central Authentication Service</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-[#0066cc] text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <span className="font-semibold">BK</span>
          <span className="mx-2">&gt;</span>
          <span>Central Authentication Service</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white border border-gray-200 rounded shadow-sm">
            <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] px-4 py-3 border-b border-gray-300">
              <h2 className="text-[#333] font-semibold text-sm">Enter your Username and Password</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="warn"
                    checked={warnBeforeLogin}
                    onCheckedChange={(checked) => setWarnBeforeLogin(checked === true)}
                  />
                  <label htmlFor="warn" className="text-sm text-gray-600 cursor-pointer">
                    Warn me before logging me into other sites.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#4a90d9] hover:bg-[#3a7bc8] text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Authenticating...
                    </>
                  ) : (
                    'LOGIN'
                  )}
                </button>

                <div className="text-center">
                  <a href="#" className="text-[#0066cc] text-sm hover:underline">
                    Change password?
                  </a>
                </div>
              </form>
            </div>
          </div>

          {/* Info Panels */}
          <div className="space-y-6">
            {/* Languages */}
            <div className="bg-white border border-gray-200 rounded shadow-sm">
              <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] px-4 py-3 border-b border-gray-300">
                <h3 className="text-[#333] font-semibold text-sm">Languages</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-1 text-sm">
                  <li>
                    <a href="#" className="text-[#0066cc] hover:underline">Vietnamese</a>
                  </li>
                  <li>
                    <a href="#" className="text-[#0066cc] hover:underline">English</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Please Note */}
            <div className="bg-white border border-gray-200 rounded shadow-sm">
              <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] px-4 py-3 border-b border-gray-300">
                <h3 className="text-[#333] font-semibold text-sm">Please note</h3>
              </div>
              <div className="p-4 text-sm text-gray-600 space-y-3">
                <p>
                  The Login page enables single sign-on to multiple websites at HCMUT. 
                  This means that you only have to enter your user name and password once 
                  for websites that subscribe to the Login page.
                </p>
                <p>
                  You will need to use your HCMUT Username and password to login to this site. 
                  The &quot;HCMUT&quot; account provides access to many resources including the 
                  HCMUT Information System, e-mail, ...
                </p>
                <p>
                  For security reasons, please Exit your web browser when you are done 
                  accessing services that require authentication!
                </p>
              </div>
            </div>

            {/* Technical Support */}
            <div className="bg-white border border-gray-200 rounded shadow-sm">
              <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] px-4 py-3 border-b border-gray-300">
                <h3 className="text-[#333] font-semibold text-sm">Technical support</h3>
              </div>
              <div className="p-4 text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>E-mail: support@hcmut.edu.vn</li>
                  <li>Tel: (84-8) 38647256 - 5200</li>
                </ul>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded shadow-sm">
              <div className="bg-gradient-to-b from-blue-100 to-blue-200 px-4 py-3 border-b border-blue-300">
                <h3 className="text-blue-800 font-semibold text-sm">Demo Credentials</h3>
              </div>
              <div className="p-4 text-sm text-blue-700">
                <p className="mb-2">Use these credentials to test the system:</p>
                <ul className="space-y-1 font-mono text-xs">
                  <li><strong>Admin:</strong> admin / admin123</li>
                  <li><strong>Student:</strong> 2313292 / student123</li>
                  <li><strong>Faculty:</strong> faculty01 / faculty123</li>
                  <li><strong>Staff:</strong> staff01 / staff123</li>
                  <li><strong>Operator:</strong> operator01 / operator123</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          <p>Copyright &copy; 2011 - 2026 Ho Chi Minh University of Technology. All rights reserved.</p>
          <p className="mt-1">Powered by Jasig CAS 3.5.1</p>
        </div>
      </footer>
    </div>
  );
}
