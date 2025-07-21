// src/routes/PublicRoute.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { checkAuthAPI } from '../features/auth/authAPI';
import { setUser } from '../features/auth/authSlice';
import Loader from '../components/Loader';

export default function PublicRoute({ children }) {
  const dispatch=useDispatch()
  const user = useSelector((state)=>state.auth.user)
  const [loading,setLoading]=useState(true)
  const fetchUser=async()=>{
      try{
        const response= await checkAuthAPI()
        dispatch(setUser(response.user));
        setLoading(false)
      }
      catch(error){
        setLoading(false)
      }
     
    }
    
    useEffect(() => {
      if (!user?.username) {
        fetchUser();
      } else {
        setLoading(false);
      }
    }, []); // 👈 Run only on mount
    
      if (loading) return <div><Loader /></div>;

  return user ? <Navigate to="/dashboard" replace /> : children;
}
