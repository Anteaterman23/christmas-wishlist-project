import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getYear } from '../../utils/getYear';

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
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
                    Christmas Wishlist {getYear()}
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Coordinate gifts with family & friends
                </p>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) =>
                                setLoginData({ ...loginData, password: e.target.value })
                            }
                            onKeyDown={(e) => { if (e.key === "Enter") verifyPassword(); }}
                            className="w-full px-3 py-2 pr-10 border rounded-md"
                            disabled={loading || passwordVerified}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            disabled={loading || passwordVerified}
                            tabIndex={-1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

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