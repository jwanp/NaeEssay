'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface FormData {
    email: string;
    name: string;
    password: string;
    cpassword: string;
    termsAccepted: boolean;
}

interface FormErrors {
    email?: string;
    name?: string;
    password?: string;
    cpassword?: string;
    termsAccepted?: string;
}
import { useSession } from 'next-auth/react';
export default function Register() {
    const router = useRouter();
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        router.push('/topics');
    }

    const [formData, setFormData] = useState<FormData>({
        email: '',
        name: '',
        password: '',
        cpassword: '',
        termsAccepted: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): FormErrors => {
        const errors: FormErrors = {};

        // Email validation
        if (!formData.email) {
            errors.email = '이메일을 입력해주세요.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = '유효한 이메일 주소를 입력해주세요.';
        }

        // Password validation
        if (!formData.password) {
            errors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 8) {
            errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
        }

        // Confirm password validation
        if (formData.password !== formData.cpassword) {
            errors.cpassword = '비밀번호가 일치하지 않습니다.';
        }

        // Terms checkbox validation
        if (!formData.termsAccepted) {
            errors.termsAccepted = '이용 약관에 동의해야 합니다.';
        }

        return errors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            // Pass only the necessary fields
            const submissionData = {
                email: formData.email,
                name: formData.name,
                password: formData.password,
            };
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Submission failed:', errorData || 'Unknown error');
                    errorData.email && setErrors({ email: errorData.email });
                    errorData.name && setErrors({ name: errorData.name });
                    return;
                }

                const responseData = await response.json();
                router.push('/signin');

                // Redirect or reset the form as needed
            } catch (error) {
                console.error('Error submitting form:', error);
                setErrors({ email: 'An error occurred. Please try again later.' });
            }
        }
    };

    return (
        <div className="min-w-[400px]  flex flex-col justify-center font-[sans-serif] h-screen p-4">
            <div className="bg-white max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
                <div className="text-center mb-12">
                    <Link href="/">
                        <p className="text-xl font-[300]">
                            <span className="text-teal-700 font-[500] hover:underline">Nae Essay </span>회원 가입
                        </p>
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">이메일</label>
                            <input
                                name="email"
                                type="text"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-teal-500"
                                placeholder="Enter email"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">이름</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-teal-500"
                                placeholder="Enter name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">비밀번호</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-teal-500"
                                placeholder="Enter password"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">비밀번호 확인</label>
                            <input
                                name="cpassword"
                                type="password"
                                value={formData.cpassword}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-teal-500"
                                placeholder="Enter confirm password"
                            />
                            {errors.cpassword && <p className="text-red-500 text-xs mt-1">{errors.cpassword}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                className="h-4 w-4 shrink-0 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <label className="text-gray-800 ml-3 block text-sm">
                                <a className="text-teal-600 font-semibold hover:underline mr-1">이용 약관</a>에 동의
                                합니다.
                            </label>
                        </div>
                        {errors.termsAccepted && <p className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>}
                    </div>

                    <div className="!mt-12">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none">
                            계정 생성하기
                        </button>
                    </div>
                    <p className="text-gray-800 text-sm mt-6 text-center">
                        <Link
                            href={'/signin'}
                            className="text-teal-600 font-semibold hover:underline ml-1 cursor-pointer">
                            로그인
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
