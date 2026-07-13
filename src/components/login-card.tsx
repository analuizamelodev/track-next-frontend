"use client";

import { useState } from "react";
import { login } from "../services/auth-service";

export default function LoginCard() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleLogin = async () => {
        try {
            setError("");
            setSuccess("");

            if (!email || !password) {
                setError("Preencha todos os campos");
                return;
            }

            const response = await login(email, password);

            console.log("Login realizado:", response);

            if (response.access_token) {
                localStorage.setItem(
                    "token",
                    response.access_token
                );
            }

            setSuccess("Login realizado com sucesso!");

        } catch (error: any) {
            console.error(
                "Erro no login:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Email ou senha inválidos"
            );
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">
                    Login
                </h2>

                {error && (
                    <p className="mb-4 text-red-500">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="mb-4 text-green-500">
                        {success}
                    </p>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Login
                </button>
            </div>
        </div>
    );
}