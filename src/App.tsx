import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import Header from './components/Header';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import FirebaseTest from './components/FirebaseTest'; // ✅ 추가

function App() {
    return (
        <>
            <GlobalStyle />
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/popular" element={<Popular />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    {/* ✅ Firebase 테스트 라우트 추가 */}
                    <Route path="/firebase-test" element={<FirebaseTest />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;