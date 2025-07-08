import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form className="bg-gray-800 p-6 rounded-lg flex flex-col w-80">
        <input type="email" placeholder="Email" className="mb-4 p-2 rounded bg-gray-700" />
        <input type="password" placeholder="Password" className="mb-4 p-2 rounded bg-gray-700" />
        <button type="submit" className="bg-green-500 py-2 rounded hover:bg-green-600">Login</button>
      </form>
    </div>
  );
};

export default LoginPage; 