import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../slices/userSlice';
import { RootState, AppDispatch } from '../store'; // Import RootState from your store

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch type for the dispatch
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const user = useSelector((state: RootState) => state.user.user);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch<any>(loginUser({ username, password })); // Use 'any' to bypass strict type checking
    };

    const handleLogout = () => {
      dispatch(logoutUser());
    };

    if (isLoggedIn) {
      return (
        <div>
          <p>Welcome, {user?.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    );
};

export default LoginComponent;
