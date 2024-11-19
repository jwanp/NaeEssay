'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
    password?: string;
    cpassword?: string;
    termsAccepted?: string;
}

import { getProviders, signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
export default function SignIn() {
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
    const params = useSearchParams();
    const error = params?.get('error') as keyof typeof errors | undefined;

    const errorMessage = authErrors && error && authErrors[error ? error : 'default'];

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
                password: formData.password,
            };
            try {
                await signIn('credentials', {
                    ...submissionData,
                    redirect: true,
                    callbackUrl: '/topics',
                })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.error(err);
                    });

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
                <div className="text-center mb-6">
                    <Link href="/">
                        <p className="text-xl font-[300]">
                            <span className="text-teal-700 font-[500] hover:underline">Nae Essay </span>로그인
                        </p>
                    </Link>
                </div>
                <div className="text-center mb-6 text-red-500 text-sm font-[330]">{errorMessage}</div>
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
                    </div>

                    <div className="!mt-12">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none">
                            로그인
                        </button>
                    </div>
                    <p className="text-gray-800 text-sm mt-6 text-center">
                        <Link
                            href={'/register'}
                            className="text-teal-600 font-semibold hover:underline ml-1 cursor-pointer">
                            회원가입
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

interface SignInErrorProps {
    error: keyof typeof authErrors | null;
}

const authErrors: { [key: string]: string } = {
    Signin: '다른 계정으로 로그인해보세요.',
    OAuthSignin: '다른 계정으로 로그인해보세요.',
    OAuthCallback: '다른 계정으로 로그인해보세요.',
    OAuthCreateAccount: '다른 계정으로 로그인해보세요.',
    EmailCreateAccount: '다른 계정으로 로그인해보세요.',
    Callback: '다른 계정으로 로그인해보세요.',
    OAuthAccountNotLinked: '본인 확인을 위해 원래 사용했던 계정으로 로그인해 주세요.',
    EmailSignin: '이메일 주소를 확인해 주세요.',
    CredentialsSignin: '로그인 실패. 제공한 정보가 정확한지 확인해 주세요.',
    default: '로그인할 수 없습니다.',
};

const SignInError = ({ error }: SignInErrorProps) => {
    const errorMessage = error && (authErrors[error] ?? authErrors.default);
    return <div>{errorMessage}</div>;
};
