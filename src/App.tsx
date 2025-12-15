import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import SignIn from './pages/SignIn';
import MovieReview from './pages/MovieReview';
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/movie/:movieId/reviews" element={<MovieReview />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;