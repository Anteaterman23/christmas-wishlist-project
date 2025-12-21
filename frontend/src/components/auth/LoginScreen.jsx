import React from 'react';

const LoginScreen = ({
    users,
    loginData,
    setLoginData,
    loading,
    passwordVerified,
    verifiedAsAdmin,
    verifyPassword,
    handleLogin
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
                    Christmas Wishlist 2025
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Coordinate gifts with family & friends
                </p>

                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) =>
                            setLoginData({ ...loginData, password: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-md"
                        disabled={loading || passwordVerified}
                    />

                    {!passwordVerified && (
                        <button
                            onClick={verifyPassword}
                            className="w-full bg-green-600 text-white py-2 rounded-md"
                        >
                            Continue
                        </button>
                    )}

                    {passwordVerified && !verifiedAsAdmin && (
                        <>
                            <select
                                value={loginData.selectedUser}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, selectedUser: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={loading}
                            >
                                <option value="">Choose your name...</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.name}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={handleLogin}
                                className="w-full bg-green-600 text-white py-2 rounded-md"
                            >
                                Log In
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;