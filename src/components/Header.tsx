import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

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

    const handleLogout = async () => {
        const result = await signOut();
        if (result.success) {
            alert('로그아웃되었습니다.');
            navigate('/');
        }
    };

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
                <MenuItem to="/firebase-test" $active={location.pathname === '/firebase-test'}>🔥 테스트</MenuItem>
            </Menu>

            <RightSection>
                {user ? (
                    <>
                        <UserInfo>
                            <Avatar src={user.photoURL || '/default-avatar.png'} alt="avatar" />
                            <UserName>{user.displayName}</UserName>
                        </UserInfo>
                        <AuthButton
                            as={motion.button}
                            onClick={handleLogout}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            로그아웃
                        </AuthButton>
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

// Styled Components
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
    background-color: ${(props) => (props.$scrolled ? '#141414' : 'transparent')};
    transition: background-color 0.3s ease-in-out;

    @media (max-width: 768px) {
        padding: 0 20px;
        font-size: 14px;
    }
`;

const Logo = styled.div`
    font-size: 25px;
    font-weight: bold;
    color: #e50914;
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

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #e50914;
`;

const UserName = styled.span`
  color: white;
  font-size: 0.9rem;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AuthButton = styled(motion(Link))`
    background-color: #e50914;
    color: white;
    padding: 7px 17px;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
`;