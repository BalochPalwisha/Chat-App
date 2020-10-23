import {useContext} from 'react';
import AuthContext from '../context/auth/AuthContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;