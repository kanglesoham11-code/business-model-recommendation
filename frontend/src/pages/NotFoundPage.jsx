import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-surface-50 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center"
      >
        {/* 404 number */}
        <div className="font-display text-[12rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-surface-200 to-surface-100 select-none">
          404
        </div>

        <div className="-mt-8 relative z-10">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a new location.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn btn-primary inline-flex items-center justify-center">
              <Home className="mr-2" size={16} />
              Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-secondary inline-flex items-center justify-center">
              <ArrowLeft className="mr-2" size={16} />
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
