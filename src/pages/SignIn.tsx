import React, { useState, useRef, useEffect } from 'react'; // ✅ useRef 추가
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { tryLogin, tryRegister } from '../utils/auth';

const SignIn = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // ✅ useRef를 활용한 DOM 접근
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    // ✅ 페이지 로드 시 이메일 입력창에 자동 포커스
    useEffect(() => {
        emailInputRef.current?.focus();
    }, []);

    // ✅ 로그인/회원가입 모드 전환 시 이메일 입력창에 포커스
    useEffect(() => {
        emailInputRef.current?.focus();
    }, [isSignUp]);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@')) {
            setError('유효한 이메일 주소를 입력하세요.');
            emailInputRef.current?.focus(); // ✅ 에러 발생 시 해당 필드에 포커스
            return;
        }
        if (password.length < 4) {
            setError('비밀번호는 4자리 이상이어야 합니다.');
            passwordInputRef.current?.focus(); // ✅ 에러 발생 시 해당 필드에 포커스
            return;
        }

        if (isSignUp) {
            const result = tryRegister(email, password);
            if (result.success) {
                alert(result.message);
                setIsSignUp(false);
                setEmail('');
                setPassword('');
            } else {
                setError(result.message);
            }
        } else {
            const result = tryLogin(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
                passwordInputRef.current?.focus(); // ✅ 로그인 실패 시 비밀번호 필드에 포커스
            }
        }
    };

    return (
        <Container>
            <Background>
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
                    alt="background"
                />
                <Overlay />
            </Background>

            <FormContainer>
                <AnimatePresence mode='wait'>
                    <Form
                        as={motion.form}
                        key={isSignUp ? "signup" : "signin"}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleAuth}
                    >
                        <h1>{isSignUp ? '회원가입' : '로그인'}</h1>
                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        {/* ✅ useRef를 통한 DOM 접근 */}
                        <Input
                            ref={emailInputRef}
                            type="email"
                            placeholder="이메일 주소 (자동 포커스)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            ref={passwordInputRef}
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <SubmitButton
                            type="submit"
                            whileHover={{ scale: 1.02, backgroundColor: '#f40612' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isSignUp ? '회원가입' : '로그인'}
                        </SubmitButton>

                        <SignUpLink>
                            {isSignUp ? '이미 계정이 있으신가요? ' : 'Netflix 회원이 아니신가요? '}
                            <span onClick={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? '로그인하기' : '지금 가입하세요.'}
                            </span>
                        </SignUpLink>
                    </Form>
                </AnimatePresence>
            </FormContainer>
        </Container>
    );
};

export default SignIn;

// Styled Components
const Container = styled.div`
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
`;

const Background = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
`;

const FormContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.75);
    width: 100%;
    max-width: 450px;
    padding: 60px 68px 40px;
    border-radius: 4px;
`;

const Form = styled(motion.form)`
    display: flex;
    flex-direction: column;
    h1 {
        color: white;
        margin-bottom: 28px;
    }
`;

const Input = styled.input`
    padding: 16px 20px;
    margin-bottom: 16px;
    border-radius: 4px;
    border: none;
    background: #333;
    color: white;
    font-size: 16px;

    &:focus {
        outline: none;
        background: #454545;
        box-shadow: 0 0 0 2px #e50914; // ✅ 포커스 시 강조 효과
    }
`;

const ErrorMessage = styled.p`
    background-color: #e87c03;
    padding: 10px;
    border-radius: 4px;
    color: white;
    margin-bottom: 15px;
    font-size: 14px;
`;

const SubmitButton = styled(motion.button)`
    padding: 16px;
    background-color: #e50914;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 24px;
    margin-bottom: 12px;
`;

const SignUpLink = styled.p`
    color: #737373;
    font-size: 16px;
    margin-top: 16px;

    span {
        color: white;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
`;