import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationBox from './Register';
import LoginBox from './Login';

const FormContainer = ({ role = "trekker"  , onLoginSuccess}) => {
  const [authMode, setAuthMode] = useState('register'); // 'login' or 'register'

  return (
    <div className="w-full bg-white/0 backdrop-blur-3xl p-8 lg:p-12 rounded-2xl lg:rounded-[50px] border border-white/0 shadow-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        {authMode === 'login' ? (
          <motion.div
            key="login-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <LoginBox 
              onSwitchToRegister={() => setAuthMode('register')} 
              onLoginSuccess={onLoginSuccess}   
            />
          </motion.div>
        ) : (
          <motion.div
            key="register-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <RegistrationBox role={role} onSwitchToLogin={() => setAuthMode('login')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormContainer;