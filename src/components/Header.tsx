import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    return (
        <Container>
            <Logo onClick={() => navigate('/')}>BUKFLIX</Logo>

            <Nav>
                <NavItem $active={isActive('/')} onClick={() => navigate('/')}>
                    홈
                </NavItem>
                <NavItem $active={isActive('/search')} onClick={() => navigate('/search')}>
                    검색
                </NavItem>
                <NavItem $active={isActive('/wishlist')} onClick={() => navigate('/wishlist')}>
                    내가 찜한 콘텐츠
                </NavItem>
            </Nav>

            <RightSection>
                {user ? (
                    <UserSection>
                        <Avatar
                            src={user.photoURL || '/default-avatar.png'}
                            alt={user.displayName || 'User'}
                            onClick={() => navigate('/profile')}
                        />
                        <UserName>{user.displayName}</UserName>
                    </UserSection>
                ) : (
                    <SignInButton onClick={() => navigate('/signin')}>
                        로그인
                    </SignInButton>
                )}
            </RightSection>
        </Container>
    );
};

export default Header;

// Styled Components
const Container = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 68px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 10%, transparent);
    display: flex;
    align-items: center;
    padding: 0 40px;
    z-index: 1000;
    transition: background-color 0.3s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
    }
`;

const Logo = styled.h1`
    color: #e50914;
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    margin-right: 40px;

    &:hover {
        color: #f40612;
    }
`;

const Nav = styled.nav`
    display: flex;
    gap: 20px;
    flex: 1;
`;

interface NavItemProps {
    $active: boolean;
}

const NavItem = styled.span<NavItemProps>`
    color: ${(props) => (props.$active ? 'white' : '#e5e5e5')};
    font-size: 1rem;
    cursor: pointer;
    transition: color 0.3s;
    font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};

    &:hover {
        color: #b3b3b3;
    }
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Avatar = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #e50914;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }
`;

const UserName = styled.span`
    color: white;
    font-size: 0.95rem;
`;

const SignInButton = styled.button`
    background-color: #e50914;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s;

    &:hover {
        background-color: #f40612;
    }
`;