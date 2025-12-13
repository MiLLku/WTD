export interface User {
    email: string;
    password?: string; // 보안상 저장된 데이터 불러올 땐 제외할 수도 있음
    name?: string;
}

// 로컬 스토리지 키
const USERS_KEY = 'netflix_users';
const CURRENT_USER_KEY = 'netflix_current_user';

// 모든 사용자 가져오기
const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// 회원가입 (Try Register)
export const tryRegister = (email: string, password: string): { success: boolean; message: string } => {
    const users = getUsers();

    if (users.find((user) => user.email === email)) {
        return { success: false, message: '이미 존재하는 계정입니다.' };
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, message: '회원가입 성공! 로그인해주세요.' };
};

// 로그인 (Try Login)
export const tryLogin = (email: string, password: string): { success: boolean; message: string } => {
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        // 로그인 성공 시 현재 사용자 저장 (세션 유지)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: user.email }));
        return { success: true, message: '로그인 성공' };
    }

    return { success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' };
};

// 현재 로그인한 사용자 가져오기
export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

// 로그아웃
export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};