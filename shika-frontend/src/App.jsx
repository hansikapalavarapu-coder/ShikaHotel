import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Users, 
  MessageSquare, 
  Send, 
  Lock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  LogOut,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [slide, setSlide] = useState(1); // 1: Auth, 2: Messenger
  const [role, setRole] = useState('MANAGER'); // 'MANAGER' or 'STAFF'
  
  // Form Inputs
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Management');
  
  // UI Feedback Popup State
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  // Messenger State
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  // Sample Chat Data
  const [users, setUsers] = useState([
    { id: 'M101', name: 'Manager (M101)', role: 'MANAGER', dept: 'Management', status: 'online' },
    { id: 'S201', name: 'Staff (S201)', role: 'STAFF', dept: 'House Keeping', status: 'online' },
    { id: 'S202', name: 'Staff (S202)', role: 'STAFF', dept: 'Receptionist', status: 'offline' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, senderId: 'S201', receiverId: 'M101', text: 'Room 304 cleaning completed.', timestamp: '10:15 AM' },
    { id: 2, senderId: 'M101', receiverId: 'S201', text: 'Great, thank you. Please inspect Room 305 next.', timestamp: '10:18 AM' },
  ]);

  // Handle Authentication Submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      setPopup({ show: true, message: 'Please enter a valid User ID', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, role, department }),
      });

      if (response.ok) {
        const userObj = {
          id: userId,
          name: `${role === 'MANAGER' ? 'Manager' : 'Staff'} (${userId})`,
          role,
          dept: role === 'MANAGER' ? 'Management' : department,
          status: 'online',
        };

        setCurrentUser(userObj);
        setPopup({
          show: true,
          message: `${role === 'MANAGER' ? 'Manager' : 'Staff'} Access Granted!`,
          type: 'success',
        });
      } else {
        setPopup({ show: true, message: 'Enter the correct password', type: 'error' });
      }
    } catch (err) {
      setPopup({
        show: true,
        message: 'Server connection failed. Make sure Spring Boot is running on port 8080!',
        type: 'error',
      });
    }
  };

  const closePopup = () => {
    setPopup({ ...popup, show: false });
    if (popup.type === 'success') {
      setSlide(2);
    }
  };

  // Send Message Function
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const newMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: activeChat.id,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setMessageInput('');
  };

  // Filter Users for Messenger Sidebar
  const filteredUsers = users.filter((u) => {
    if (u.id === currentUser?.id) return false;
    if (activeTab === 'MANAGERS') return u.role === 'MANAGER';
    if (activeTab === 'STAFF') return u.role === 'STAFF';
    return true;
  });

  // Filter Messages for Active Chat
  const activeMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser?.id && m.receiverId === activeChat?.id) ||
      (m.senderId === activeChat?.id && m.receiverId === currentUser?.id)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">SHIKA HOTEL</h1>
            <p className="text-xs text-slate-400">Internal Management Platform</p>
          </div>
        </div>

        {slide === 2 && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-200">{currentUser?.name}</p>
              <p className="text-xs text-indigo-400">{currentUser?.dept}</p>
            </div>
            <button
              onClick={() => {
                setSlide(1);
                setPassword('');
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        {/* SLIDE 1: AUTHENTICATION */}
        {slide === 1 && (
          <div className="w-full max-w-md bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Portal Sign-In</h2>
              <p className="text-slate-400 text-sm">Select your role and enter credentials</p>
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-900/80 rounded-xl border border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setRole('MANAGER');
                  setDepartment('Management');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  role === 'MANAGER'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                <span>Manager</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('STAFF')}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  role === 'STAFF'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Staff</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  User ID
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'MANAGER' ? 'e.g., M101' : 'e.g., S201'}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Department Dropdown for Staff */}
              {role === 'STAFF' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                    Department
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="House Cleaning">House Cleaning</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Receptionist/Help Desk">Receptionist/Help Desk</option>
                      <option value="Kitchen/Catering">Kitchen/Catering</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-200"
              >
                SUBMIT
              </button>
            </form>
          </div>
        )}

        {/* SLIDE 2: MESSENGER INTERFACE */}
        {slide === 2 && (
          <div className="w-full max-w-5xl h-[700px] bg-slate-800/60 border border-slate-700/60 rounded-2xl shadow-2xl backdrop-blur-xl flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-700/60 bg-slate-900/50 flex flex-col">
              <div className="p-4 border-b border-slate-700/60">
                <h3 className="font-semibold text-slate-200 mb-3">Directory</h3>
                <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {['ALL', 'MANAGERS', 'STAFF'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 text-[10px] font-bold py-1.5 rounded transition ${
                        activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setActiveChat(u)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                      activeChat?.id === u.id
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.dept}</p>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        u.status === 'online' ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-900/30">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-700/60 bg-slate-900/40 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{activeChat.name}</h3>
                      <p className="text-xs text-indigo-400">{activeChat.dept}</p>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {activeMessages.length > 0 ? (
                      activeMessages.map((m) => {
                        const isMe = m.senderId === currentUser.id;
                        return (
                          <div
                            key={m.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                                isMe
                                  ? 'bg-indigo-600 text-white rounded-br-none'
                                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
                              }`}
                            >
                              <p>{m.text}</p>
                              <span
                                className={`block text-[10px] mt-1 ${
                                  isMe ? 'text-indigo-200 text-right' : 'text-slate-400'
                                }`}
                              >
                                {m.timestamp}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        No messages yet. Say hello!
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/60 bg-slate-900/50 flex space-x-2">
                    <input
                      type="text"
                      placeholder={`Message ${activeChat.name}...`}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                  <MessageSquare className="h-12 w-12 mb-3 text-slate-600" />
                  <p className="font-medium text-slate-400">Select a user from the directory</p>
                  <p className="text-xs text-slate-600 mt-1">Start communication with hotel staff or management</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal Popup for Auth Notifications */}
      {popup.show && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              {popup.type === 'success' ? (
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              ) : (
                <ShieldAlert className="h-12 w-12 text-rose-500" />
              )}
            </div>
            <h3 className="text-lg font-bold text-white">
              {popup.type === 'success' ? 'Authentication Successful' : 'Access Denied'}
            </h3>
            <p className="text-sm text-slate-300">{popup.message}</p>
            <button
              onClick={closePopup}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition ${
                popup.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}