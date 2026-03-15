// src/components/custom/AxiosInterceptorSetup/AxiosInterceptorSetup.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/shared/services/api';
import { useAuth } from '@/context/AuthContext';

const AxiosInterceptorSetup = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  useEffect(() => {
    apiService.setNavigate(navigate);
    
    apiService.setUnauthorizedCallback(() => {
      clearAuth();
      navigate('/login');
    });
  }, [navigate, clearAuth]);

  return null;
};

export default AxiosInterceptorSetup;