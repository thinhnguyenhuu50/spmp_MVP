'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Checkbox } from '@/components/ui/checkbox';
import ssoData from '@/data/hcmut_sso.json';

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
    <div className="min-h-screen bg-[#eee] font-[Helvetica,Arial,sans-serif] text-[13px] leading-[1.4em] py-8 text-left md:text-justify">
      <div className="w-full md:w-[85%] max-w-[1200px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.1)] bg-white rounded-b-[4px]">
        {/* Header */}
        <header className="bg-white pt-[10px]">
          <div className="bg-[#210F7A] text-white p-[0.4em] flex flex-row items-start">
            <img src="/bk_logo.png" alt="BK" className="inline-block shrink-0 mt-[10px] ml-[10px] pb-2" />
            <h1 className="font-bold text-[2em] mt-[20px] ml-[20px] align-top whitespace-nowrap overflow-hidden text-ellipsis">Central Authentication Service</h1>
          </div>
        </header>

        {/* Content */}
        <main className="p-[10px] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Login Form */}
            <div className="w-full md:w-[420px] md:mr-[20px] md:float-left shrink-0">
              <div className="bg-[#eee] rounded-[5px] p-[20px]">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <h2 className="text-[1.4em] font-bold pb-[10px] mb-[10px] border-b border-[#DDDDDD] text-[#990033]">
                    Enter your Username and Password
                  </h2>

                  {error && (
                    <div className="border border-dotted border-[#BB0000] text-[#BB0000] pl-[100px] py-[10px] mb-2.5 text-sm font-bold bg-transparent">
                      {error}
                    </div>
                  )}

                  <div className="mb-[10px]">
                    <label htmlFor="username" className="block text-[#777] font-bold text-[107.692%] mb-1">
                      <span className="underline decoration-1">U</span>sername
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="p-[6px] rounded-[3px] border border-[#DDDDDD] bg-[#FFFFDD] w-full md:w-[22.5em] focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="mb-[10px]">
                    <label htmlFor="password" className="block text-[#777] font-bold text-[107.692%] mb-1">
                      <span className="underline decoration-1">P</span>assword
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-[6px] rounded-[3px] border border-[#DDDDDD] bg-[#FFFFDD] w-full md:w-[22.5em] focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="pb-[10px] mb-[10px] border-b border-[#DDDDDD] text-[#777] text-[12px] flex items-center gap-2">
                    <Checkbox
                      id="warn"
                      checked={warnBeforeLogin}
                      onCheckedChange={(checked) => setWarnBeforeLogin(checked === true)}
                    />
                    <label htmlFor="warn" className="cursor-pointer">
                      <span className="underline decoration-1">W</span>arn me before logging me into other sites.
                    </label>
                  </div>

                  <div className="mb-[10px] flex gap-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#006DCC] hover:bg-[#0055CC] bg-gradient-to-b from-[#0088CC] to-[#0044CC] border border-[rgba(0,0,0,0.1)_rgba(0,0,0,0.1)_rgba(0,0,0,0.25)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),_0_1px_2px_rgba(0,0,0,0.05)] rounded-[4px] px-[14px] py-[4px] text-[14px] leading-[20px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ...
                        </>
                      ) : (
                        'Login'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUsername(''); setPassword(''); setError(''); }}
                      className="bg-[#006DCC] hover:bg-[#0055CC] bg-gradient-to-b from-[#0088CC] to-[#0044CC] border border-[rgba(0,0,0,0.1)_rgba(0,0,0,0.1)_rgba(0,0,0,0.25)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),_0_1px_2px_rgba(0,0,0,0.05)] rounded-[4px] px-[14px] py-[4px] text-[14px] leading-[20px] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="mt-0">
                    <ul className="flex m-0 p-0 text-[13px] list-none">
                      <li>
                        <a href="#" className="text-blue-700 hover:underline">Change password?</a>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-auto flex-1 mt-[20px] md:mt-0 md:pl-[20px]">
              <div>
                <h3 className="text-[1.2em] font-bold text-[#990033] mt-[1.2em] mb-2">Languages</h3>
                <ul className="flex list-none p-0 m-0">
                  <li className="pr-[10px] border-r border-[#e2e2e2]">
                    <a href="#" className="text-[#0000EE] hover:underline">Vietnamese</a>
                  </li>
                  <li className="px-[10px]">
                    <a href="#" className="text-[#0000EE] hover:underline">English</a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[1.2em] font-bold text-[#990033] mt-[1.2em] mb-2">Please note</h3>
                <div className="text-[1.2em]">
                  <p className="p-2">
                    The Login page enables single sign-on to multiple websites at HCMUT. This means that you only have to enter your user name and password once for websites that subscribe to the Login page.
                  </p>
                  <p className="p-2">
                    You will need to use your HCMUT Username and password to login to this site. The &quot;HCMUT&quot; account provides access to many resources including the HCMUT Information System, e-mail, ...
                  </p>
                  <p className="p-2">
                    For security reasons, please Exit your web browser when you are done accessing services that require authentication!
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[1.2em] font-bold text-[#990033] mt-[1.2em] mb-2">Technical support</h3>
                <ul className="list-none p-0 m-0">
                  <li>E-mail: <a href="mailto:support@hcmut.edu.vn" className="text-[#0000EE] hover:underline">support@hcmut.edu.vn</a></li>
                  <li>Tel: (84-8) 38647256 - 7204</li>
                </ul>
              </div>

              {/* Demo Credentials */}
              <div className="mt-8 bg-[#FFFFDD] border border-[#DDDDDD] p-3 text-[12px] text-[#777] rounded">
                <h3 className="font-bold text-[#990033] mb-1">Demo Credentials</h3>
                <ul className="space-y-1 font-mono">
                  {ssoData.users.map((user) => {
                    const role = user.userId.startsWith('ADM') ? 'Admin' : 
                                 user.userId.startsWith('STU') ? 'Student' : 
                                 user.userId.startsWith('FAC') ? 'Faculty' : 
                                 user.userId.startsWith('STA') ? 'Staff' : 
                                 user.userId.startsWith('OPR') ? 'Operator' : 'User';
                    return (
                      <li key={user.userId}>
                        <strong>{role}:</strong> {user.username} / {user.password}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="text-[#999] w-full md:w-[85%] max-w-[1200px] mx-auto my-[20px] md:pl-[10px] text-justify px-[10px] md:px-0">
        <p className="mb-0">Copyright &copy; 2011 - 2012 Ho Chi Minh University of Technology. All rights reserved.</p>
        <p>Powered by <a href="http://www.jasig.org/cas" className="text-[#0000EE] hover:underline">Jasig CAS 3.5.1</a></p>
      </footer>
    </div>
  );
}
