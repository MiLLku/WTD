import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useReviews } from '../hooks/useReviews';

const GENRE_OPTIONS = [
    '액션', '코미디', '드라마', '공포', '스릴러',
    'SF', '로맨스', '판타지', '애니메이션', '다큐멘터리'
];

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { profile, loading, updateProfile } = useProfile();
    const { reviews } = useReviews();

    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    // 로그인 체크
    if (!user) {
        navigate('/signin');
        return null;
    }

    // 프로필 로딩 중
    if (loading || !profile) {
        return (
            <Container>
                <LoadingMessage>프로필을 불러오는 중...</LoadingMessage>
            </Container>
        );
    }

    // 수정 모드 진입
    const handleEditClick = () => {
        setBio(profile.bio || '');
        setSelectedGenres(profile.favoriteGenres || []);
        setIsEditing(true);
    };

    // 장르 토글
    const toggleGenre = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre]
        );
    };

    // 프로필 저장
    const handleSave = async () => {
        const result = await updateProfile({
            bio,
            favoriteGenres: selectedGenres,
        });

        alert(result.message);
        if (result.success) {
            setIsEditing(false);
        }
    };

    // 로그아웃
    const handleLogout = async () => {
        if (window.confirm('로그아웃하시겠습니까?')) {
            await logout();
            navigate('/');
        }
    };

    // 사용자가 작성한 리뷰만 필터링
    const userReviews = reviews.filter((review) => review.userId === user.uid);

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </Header>

            <ProfileCard>
                <AvatarSection>
                    <LargeAvatar src={profile.photoURL || '/default-avatar.png'} alt={profile.displayName} />
                    <UserName>{profile.displayName}</UserName>
                    <UserEmail>{profile.email}</UserEmail>
                </AvatarSection>

                <StatsSection>
                    <StatBox>
                        <StatValue>{userReviews.length}</StatValue>
                        <StatLabel>작성한 리뷰</StatLabel>
                    </StatBox>
                    <StatBox>
                        <StatValue>
                            {userReviews.length > 0
                                ? (
                                    userReviews.reduce((sum, r) => sum + r.rating, 0) /
                                    userReviews.length
                                ).toFixed(1)
                                : '0.0'}
                        </StatValue>
                        <StatLabel>평균 평점</StatLabel>
                    </StatBox>
                    <StatBox>
                        <StatValue>
                            {userReviews.reduce((sum, r) => sum + (r.likes?.length || 0), 0)}
                        </StatValue>
                        <StatLabel>받은 좋아요</StatLabel>
                    </StatBox>
                </StatsSection>

                {isEditing ? (
                    <>
                        <Section>
                            <SectionTitle>📝 소개 편집</SectionTitle>
                            <BioTextarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="자기소개를 입력하세요..."
                                maxLength={200}
                            />
                            <CharCount>{bio.length}/200</CharCount>
                        </Section>

                        <Section>
                            <SectionTitle>🎬 선호 장르 선택</SectionTitle>
                            <GenreGrid>
                                {GENRE_OPTIONS.map((genre) => (
                                    <GenreButton
                                        key={genre}
                                        $selected={selectedGenres.includes(genre)}
                                        onClick={() => toggleGenre(genre)}
                                    >
                                        {genre}
                                    </GenreButton>
                                ))}
                            </GenreGrid>
                        </Section>

                        <ButtonGroup>
                            <SaveButton onClick={handleSave}>저장</SaveButton>
                            <CancelButton onClick={() => setIsEditing(false)}>취소</CancelButton>
                        </ButtonGroup>
                    </>
                ) : (
                    <>
                        <Section>
                            <SectionTitleWithButton>
                                <SectionTitle>📝 소개</SectionTitle>
                                <EditButton onClick={handleEditClick}>수정</EditButton>
                            </SectionTitleWithButton>
                            {profile.bio ? (
                                <Bio>{profile.bio}</Bio>
                            ) : (
                                <EmptyText>소개글이 없습니다.</EmptyText>
                            )}
                        </Section>

                        <Section>
                            <SectionTitle>🎬 선호 장르</SectionTitle>
                            {profile.favoriteGenres && profile.favoriteGenres.length > 0 ? (
                                <GenreList>
                                    {profile.favoriteGenres.map((genre) => (
                                        <GenreTag key={genre}>{genre}</GenreTag>
                                    ))}
                                </GenreList>
                            ) : (
                                <EmptyText>선호 장르가 설정되지 않았습니다.</EmptyText>
                            )}
                        </Section>

                        <Section>
                            <SectionTitle>📖 내가 작성한 리뷰 ({userReviews.length})</SectionTitle>
                            {userReviews.length > 0 ? (
                                <ReviewList>
                                    {userReviews.slice(0, 5).map((review) => (
                                        <ReviewItem key={review.id}>
                                            <ReviewHeader>
                                                <ReviewTitle>{review.movieTitle}</ReviewTitle>
                                                <ReviewRating>⭐ {review.rating}/10</ReviewRating>
                                            </ReviewHeader>
                                            <ReviewContent>{review.content}</ReviewContent>
                                            <ReviewMeta>
                                                ❤️ {review.likes?.length || 0} · {new Date(review.createdAt?.toDate()).toLocaleDateString()}
                                            </ReviewMeta>
                                        </ReviewItem>
                                    ))}
                                </ReviewList>
                            ) : (
                                <EmptyText>아직 작성한 리뷰가 없습니다.</EmptyText>
                            )}
                        </Section>
                    </>
                )}
            </ProfileCard>
        </Container>
    );
};

export default Profile;

// Styled Components
const Container = styled.div`
  padding-top: 68px;
  min-height: 100vh;
  background-color: #111;
  color: white;
`;

const Header = styled.div`
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const LogoutButton = styled.button`
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid #e50914;
  color: #e50914;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: #e50914;
    color: white;
  }
`;

const ProfileCard = styled.div`
  max-width: 900px;
  margin: 0 auto 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const AvatarSection = styled.div`
  text-align: center;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;
`;

const LargeAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #e50914;
  margin-bottom: 15px;
`;

const UserName = styled.h1`
  font-size: 2rem;
  margin: 10px 0;
  font-weight: bold;
`;

const UserEmail = styled.p`
  color: #999;
  font-size: 1rem;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  background: rgba(229, 9, 20, 0.1);
  border: 1px solid rgba(229, 9, 20, 0.3);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  color: #e50914;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #999;
`;

const Section = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitleWithButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: #e50914;
  margin-bottom: 15px;
  font-weight: bold;
`;

const EditButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Bio = styled.p`
  color: #ddd;
  line-height: 1.6;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 8px;
`;

const EmptyText = styled.p`
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px;
`;

const BioTextarea = styled.textarea`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.85rem;
  color: #999;
  margin-top: 5px;
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const GenreTag = styled.span`
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid rgba(229, 9, 20, 0.4);
  color: #ff6b6b;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;

interface GenreButtonProps {
    $selected: boolean;
}

const GenreButton = styled.button<GenreButtonProps>`
  background: ${(props) =>
    props.$selected
        ? 'linear-gradient(135deg, #e50914 0%, #831010 100%)'
        : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${(props) => (props.$selected ? '#e50914' : 'rgba(255, 255, 255, 0.2)')};
  color: white;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
    props.$selected
        ? 'linear-gradient(135deg, #f40612 0%, #941212 100%)'
        : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const SaveButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #e50914 0%, #831010 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(229, 9, 20, 0.5);
  }
`;

const CancelButton = styled.button`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ReviewItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ReviewTitle = styled.h4`
  font-size: 1rem;
  color: white;
  margin: 0;
`;

const ReviewRating = styled.span`
  font-size: 0.9rem;
  color: #ffd700;
`;

const ReviewContent = styled.p`
  font-size: 0.9rem;
  color: #ccc;
  line-height: 1.5;
  margin: 0 0 10px 0;
`;

const ReviewMeta = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 1.1rem;
  padding: 40px;
`;