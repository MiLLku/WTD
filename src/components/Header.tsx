import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // 애니메이션 라이브러리 활용

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // 로그인 여부 체크 (나중에 LocalStorage 연동 예정)
    // 지금은 테스트를 위해 false로 둡니다.
    const isLoggedIn = false;

    // 스크롤 감지 이벤트 리스너
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Nav $scrolled={isScrolled}>
            <Logo onClick={() => navigate('/')}>
                BUKFLIX <span>DEMO</span>
            </Logo>

            <Menu>
                <MenuItem to="/" $active={location.pathname === '/'}>홈</MenuItem>
                <MenuItem to="/popular" $active={location.pathname === '/popular'}>대세 콘텐츠</MenuItem>
                <MenuItem to="/search" $active={location.pathname === '/search'}>찾아보기</MenuItem>
                <MenuItem to="/wishlist" $active={location.pathname === '/wishlist'}>내가 찜한 리스트</MenuItem>
                {/* ✅ Firebase 테스트 메뉴 추가 */}
                <MenuItem to="/firebase-test" $active={location.pathname === '/firebase-test'}>🔥 테스트</MenuItem>
            </Menu>

            <RightSection>
                {isLoggedIn ? (
                    <>
                        <UserMessage>반가워요, <strong>User</strong>님</UserMessage>
                        <AuthButton whileHover={{ scale: 1.1 }}>로그아웃</AuthButton>
                    </>
                ) : (
                    <AuthButton
                        to="/signin"
                        whileHover={{ scale: 1.1, backgroundColor: '#e50914' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        로그인
                    </AuthButton>
                )}
            </RightSection>
        </Nav>
    );
};

export default Header;

// --- Styled Components (스타일 정의) ---

// prop 타입 정의
interface NavProps {
    $scrolled: boolean;
}

const Nav = styled.nav<NavProps>`
  position: fixed;
  top: 0;
  width: 100%;
  height: 68px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  
  /* 스크롤 여부에 따른 배경색 전환 (Transition 과제 항목) */
  background-color: ${(props) => (props.$scrolled ? '#141414' : 'transparent')};
  transition: background-color 0.3s ease-in-out;

  /* 모바일 반응형 처리 */
  @media (max-width: 768px) {
    padding: 0 20px;
    font-size: 14px;
  }
`;

const Logo = styled.div`
  font-size: 25px;
  font-weight: bold;
  color: #e50914; /* 넷플릭스 레드 */
  cursor: pointer;
  margin-right: 25px;
  
  span {
    color: white;
    font-size: 14px;
    font-weight: normal;
  }
`;

const Menu = styled.div`
    display: flex;
    gap: 20px;
    flex: 1;
    align-items: center;

    @media (max-width: 768px) {
        display: flex;
        gap: 10px;
        font-size: 12px;
        overflow-x: auto;
        white-space: nowrap;
        margin-left: 10px;
        margin-right: 10px;
        -ms-overflow-style: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

interface MenuItemProps {
    $active: boolean;
}

const MenuItem = styled(Link)<MenuItemProps>`
  color: ${(props) => (props.$active ? '#fff' : '#b3b3b3')};
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserMessage = styled.span`
  font-size: 14px;
  color: #fff;
  @media (max-width: 480px) {
    display: none;
  }
`;

// Framer Motion + Styled Component 결합 (로그인 버튼 애니메이션)
const AuthButton = styled(motion(Link))`
  background-color: #e50914;
  color: white;
  padding: 7px 17px;
  border-radius: 3px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  cursor: pointer;
`;