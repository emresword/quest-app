import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import User from './components/User/User';
import Navbar from './components/NavBar/NavBar';
import MessageBox from './components/Message/MessageBox';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ConversationList from './components/Message/ConversationList';
import Followers from './components/User/Followers';
import Following from './components/User/Following';
import SearchUser from './components/Search/SearchUser';
import FindFlirt from './components/User/FindFlirt'; 

import UserPosts from './components/Post/UserPosts';
import Hobby from './components/Hobby/Hobby';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/users/:userId" element={<User />} />
          <Route exact path="/messages/:userId" element={<MessageBox />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/conversations" element={<ConversationList />} />
          <Route exact path="/followers/:userId" element={<Followers />} />
          <Route exact path="/following/:userId" element={<Following />} />
          <Route exact path="/findFlirt/:userId" element={<FindFlirt />} />
          <Route path="/searchUsers" element={<SearchUser />} />
          <Route path="/hobby" element={<Hobby />} />
          {/* <Route exact path="/posts/:postId" element={<UserPosts />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
