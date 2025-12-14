import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const SignIn = () => {
    const navigate = useNavigate();
    const { user, loading, signInWithGoogle, signInWithGithub } = useAuth();

    // 이미 로그인된 경우 홈으로 리디렉션
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        const result = await signInWithGoogle();
        if (result.success) {
            alert(`환영합니다, ${result.user?.displayName}님!`);
            navigate('/');
        } else {
            alert('로그인 실패: ' + result.error);
        }
    };

    const handleGithubLogin = async () => {
        const result = await signInWithGithub();
        if (result.success) {
            alert(`환영합니다, ${result.user?.displayName}님!`);
            navigate('/');
        } else {
            alert('로그인 실패: ' + result.error);
        }
    };

    if (loading) {
        return (
            <Container>
                <LoadingMessage>로딩 중...</LoadingMessage>
            </Container>
        );
    }

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
                        as={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Logo>BUKFLIX</Logo>
                        <Title>로그인</Title>
                        <Subtitle>소셜 계정으로 간편하게 시작하세요</Subtitle>

                        <SocialButtonGroup>
                            <SocialButton
                                as={motion.button}
                                $provider="google"
                                onClick={handleGoogleLogin}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <GoogleIcon>
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                </GoogleIcon>
                                Google로 로그인
                            </SocialButton>

                            <SocialButton
                                as={motion.button}
                                $provider="github"
                                onClick={handleGithubLogin}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <GithubIcon>
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </GithubIcon>
                                GitHub로 로그인
                            </SocialButton>
                        </SocialButtonGroup>

                        <Features>
                            <Feature>✨ 무료 회원가입</Feature>
                            <Feature>🎬 무제한 영화 검색</Feature>
                            <Feature>❤️ 찜하기 기능</Feature>
                            <Feature>💬 실시간 채팅</Feature>
                        </Features>

                        <BackButton onClick={() => navigate('/')}>
                            ← 메인으로 돌아가기
                        </BackButton>
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
    background-color: rgba(0, 0, 0, 0.6);
`;

const FormContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.85);
    width: 100%;
    max-width: 450px;
    padding: 60px 50px 40px;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Logo = styled.h1`
    color: #e50914;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Title = styled.h2`
    color: white;
    margin-bottom: 10px;
    font-size: 1.8rem;
`;

const Subtitle = styled.p`
    color: #b3b3b3;
    margin-bottom: 30px;
    text-align: center;
    font-size: 0.95rem;
`;

const SocialButtonGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
`;

interface SocialButtonProps {
    $provider: 'google' | 'github';
}

const SocialButton = styled(motion.button)<SocialButtonProps>`
  width: 100%;
  padding: 14px 20px;
  border-radius: 6px;
  border: none;
  background: ${props => props.$provider === 'google' ? 'white' : '#24292e'};
  color: ${props => props.$provider === 'google' ? '#333' : 'white'};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const GoogleIcon = styled.div`
  display: flex;
  align-items: center;
`;

const GithubIcon = styled.div`
  display: flex;
  align-items: center;
`;

const Features = styled.div`
  width: 100%;
  background: rgba(229, 9, 20, 0.1);
  border: 1px solid rgba(229, 9, 20, 0.3);
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
`;

const Feature = styled.div`
  color: white;
  font-size: 0.9rem;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
  font-size: 1.5rem;
`;