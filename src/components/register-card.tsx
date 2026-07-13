"use client";

import { useState } from "react";
import { register } from "@/src/services/auth-service";

export default function RegisterCard() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async () => {
        try {
            setError("");
            setSuccess("");

            if (!name || !email || !password) {
                setError("Preencha todos os campos");
                return;
            }

            const response = await register(
                name,
                email,
                password
            );

            console.log(response);

            setSuccess("Usuário cadastrado com sucesso!");

            setName("");
            setEmail("");
            setPassword("");

        } catch (error: any) {
            console.error(
                "Erro no cadastro:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Erro ao cadastrar usuário"
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">
                    Register
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
                        Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

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
                    onClick={handleRegister}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Register
                </button>
            </div>
        </div>
    );
}