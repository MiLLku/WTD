import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
    const [user, setUser] = useState<any>(null);
    const [testData, setTestData] = useState<string>('');

    useEffect(() => {
        // 로그인 상태 감지
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            console.log('현재 사용자:', currentUser);
        });

        return () => unsubscribe();
    }, []);

    // Google 로그인 테스트
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('로그인 성공:', result.user);
            alert(`환영합니다, ${result.user.displayName}님!`);
        } catch (error: any) {
            console.error('로그인 실패:', error);
            alert('로그인 실패: ' + error.message);
        }
    };

    // 로그아웃 테스트
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('로그아웃 성공');
            alert('로그아웃되었습니다.');
        } catch (error: any) {
            console.error('로그아웃 실패:', error);
        }
    };

    // Firestore 쓰기 테스트
    const handleWriteTest = async () => {
        if (!user) {
            alert('먼저 로그인해주세요!');
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'test'), {
                message: 'Firebase 연동 테스트',
                userId: user.uid,
                userName: user.displayName,
                timestamp: new Date(),
            });

            console.log('문서 작성 성공:', docRef.id);
            alert('Firestore에 데이터 저장 완료!');
        } catch (error: any) {
            console.error('쓰기 실패:', error);
            alert('쓰기 실패: ' + error.message);
        }
    };

    // Firestore 읽기 테스트
    const handleReadTest = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'test'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log('읽어온 데이터:', data);
            setTestData(JSON.stringify(data, null, 2));
            alert(`${data.length}개의 문서를 읽어왔습니다!`);
        } catch (error: any) {
            console.error('읽기 실패:', error);
            alert('읽기 실패: ' + error.message);
        }
    };

    return (
        <Container>
            <Title>🔥 Firebase 연동 테스트</Title>

            <Section>
                <SectionTitle>1️⃣ Authentication 테스트</SectionTitle>
                {user ? (
                    <UserInfo>
                        <Avatar src={user.photoURL} alt="avatar" />
                        <div>
                            <p><strong>이름:</strong> {user.displayName}</p>
                            <p><strong>이메일:</strong> {user.email}</p>
                            <p><strong>UID:</strong> {user.uid}</p>
                        </div>
                    </UserInfo>
                ) : (
                    <p>로그인되지 않음</p>
                )}

                <ButtonGroup>
                    {!user ? (
                        <TestButton onClick={handleGoogleLogin}>
                            Google 로그인
                        </TestButton>
                    ) : (
                        <TestButton onClick={handleLogout}>
                            로그아웃
                        </TestButton>
                    )}
                </ButtonGroup>
            </Section>

            <Section>
                <SectionTitle>2️⃣ Firestore 테스트</SectionTitle>
                <ButtonGroup>
                    <TestButton onClick={handleWriteTest}>
                        데이터 쓰기
                    </TestButton>
                    <TestButton onClick={handleReadTest}>
                        데이터 읽기
                    </TestButton>
                </ButtonGroup>

                {testData && (
                    <DataDisplay>
                        <pre>{testData}</pre>
                    </DataDisplay>
                )}
            </Section>

            <Notice>
                ✅ 로그인이 되고, 데이터 쓰기/읽기가 성공하면 Firebase 연동 완료!
            </Notice>
        </Container>
    );
};

export default FirebaseTest;

// Styled Components
const Container = styled.div`
  padding: 100px 40px;
  min-height: 100vh;
  background-color: #111;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  color: #e50914;
  margin-bottom: 20px;
  font-size: 1.3rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(229, 9, 20, 0.1);
  border-radius: 8px;
  
  p {
    margin: 5px 0;
    line-height: 1.6;
  }
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #e50914;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const TestButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f40612;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DataDisplay = styled.div`
  margin-top: 20px;
  background: #000;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #333;
  
  pre {
    margin: 0;
    font-size: 0.85rem;
    color: #0f0;
    overflow-x: auto;
  }
`;

const Notice = styled.div`
  background: linear-gradient(135deg, #e50914 0%, #831010 100%);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
`;