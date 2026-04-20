import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { questionnaireAPI } from '../utils/api';
import { FileText, TrendingUp, Clock, Plus, Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await questionnaireAPI.getUserQuestionnaires();
        setQuestionnaires(response.data.data.questionnaires);
      } catch (error) {
        console.error('Failed to fetch questionnaires:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaires();
  }, []);

  const completed = questionnaires.filter(q => q.status === 'completed').length;
  const inProgress = questionnaires.filter(q => q.status === 'in_progress').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 bg-surface-50 rounded-full" />
          </div>
          <p className="text-sm text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Total Analyses',
      value: questionnaires.length,
      icon: <FileText size={20} />,
      gradient: 'from-brand-500 to-brand-600',
      bg: 'bg-brand-50',
      text: 'text-brand-600',
    },
    {
      label: 'Completed',
      value: completed,
      icon: <TrendingUp size={20} />,
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: <Clock size={20} />,
      gradient: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                  {(user?.name || user?.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-gray-900">
                    Welcome back{user?.name ? `, ${user.name}` : ''}
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">Track your business model explorations</p>
                </div>
              </div>
            </div>
            <Link to="/questionnaire" className="btn btn-primary inline-flex items-center self-start">
              <Plus className="mr-2" size={16} />
              New Analysis
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statsCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="card p-6 group hover:shadow-elevated-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">{stat.label}</p>
                    <p className="text-3xl font-display font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} ${stat.text} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Questionnaires List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center">
                  <LayoutGrid size={18} className="text-gray-500" />
                </div>
                <h2 className="font-display text-xl font-bold text-gray-900">Your Analyses</h2>
              </div>
            </div>

            {questionnaires.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} className="text-gray-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">No analyses yet</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Start your first questionnaire to get personalized business model recommendations
                </p>
                <Link to="/questionnaire" className="btn btn-primary inline-flex items-center">
                  Get Started
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {questionnaires.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-surface-200 hover:border-brand-200 hover:shadow-elevated transition-all duration-300">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`badge ${
                            q.status === 'completed' ? 'badge-success' : 'badge-warning'
                          }`}>
                            {q.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {q.recommendations?.length > 0
                            ? `${q.recommendations.length} recommendation(s) generated`
                            : 'No recommendations yet'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {q.recommendations?.length > 0 && (
                          <Link
                            to={`/results/${q.recommendations[0].id}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Results
                          </Link>
                        )}
                        {q.status === 'in_progress' && (
                          <Link to="/questionnaire" className="btn btn-secondary btn-sm">
                            Continue
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
