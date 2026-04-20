import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recommendationAPI } from '../utils/api';
import { CheckCircle, XCircle, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ModelsPage = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulatingSlug, setSimulatingSlug] = useState(null);

  const handleSimulate = async (slug) => {
    setSimulatingSlug(slug);
    try {
      const response = await recommendationAPI.simulateModel(slug);
      const recommendationId = response.data.data.recommendation.id;
      navigate(`/results/${recommendationId}`);
    } catch (error) {
      console.error('Failed to simulate model:', error);
      alert('Simulation failed. Please check connection.');
    } finally {
      setSimulatingSlug(null);
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await recommendationAPI.getAllModels();
        setModels(response.data.data.models);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  const modelColors = [
    { gradient: 'from-violet-500/8 to-purple-500/8', border: 'hover:border-violet-300', accent: 'bg-violet-100 text-violet-700' },
    { gradient: 'from-blue-500/8 to-cyan-500/8', border: 'hover:border-blue-300', accent: 'bg-blue-100 text-blue-700' },
    { gradient: 'from-emerald-500/8 to-green-500/8', border: 'hover:border-emerald-300', accent: 'bg-emerald-100 text-emerald-700' },
    { gradient: 'from-amber-500/8 to-orange-500/8', border: 'hover:border-amber-300', accent: 'bg-amber-100 text-amber-700' },
    { gradient: 'from-rose-500/8 to-pink-500/8', border: 'hover:border-rose-300', accent: 'bg-rose-100 text-rose-700' },
    { gradient: 'from-sky-500/8 to-blue-500/8', border: 'hover:border-sky-300', accent: 'bg-sky-100 text-sky-700' },
    { gradient: 'from-indigo-500/8 to-violet-500/8', border: 'hover:border-indigo-300', accent: 'bg-indigo-100 text-indigo-700' },
    { gradient: 'from-slate-500/8 to-gray-500/8', border: 'hover:border-slate-300', accent: 'bg-slate-100 text-slate-700' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 bg-surface-50 rounded-full" />
          </div>
          <p className="text-sm text-gray-400">Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="badge-brand mb-4 inline-block">Knowledge Base</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            E-Commerce Models
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Explore all 8 business models our engine evaluates to find your perfect fit
          </p>
        </motion.div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model, i) => {
            const color = modelColors[i % modelColors.length];
            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={`card group p-7 bg-gradient-to-br ${color.gradient} border-surface-200 ${color.border} hover:shadow-elevated-lg hover:-translate-y-1 transition-all duration-500`}>
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <span className="text-4xl">{model.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-xl text-gray-900 mb-1">{model.name}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{model.description}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Cost</p>
                      <p className="font-display font-bold text-gray-900">{model.startupCost}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Revenue</p>
                      <p className="font-display font-bold text-gray-900 text-xs">{model.timeToRevenue}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Complexity</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, j) => (
                          <div
                            key={j}
                            className={`w-2.5 h-2.5 rounded-full ${
                              j < model.complexityIndex ? 'bg-brand-500' : 'bg-surface-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pros / Cons */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-2">
                        <CheckCircle size={13} /> Pros
                      </h4>
                      <ul className="space-y-1.5">
                        {model.pros.slice(0, 3).map((pro, j) => (
                          <li key={j} className="text-xs text-gray-600 leading-relaxed">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-semibold text-red-600 mb-2">
                        <XCircle size={13} /> Cons
                      </h4>
                      <ul className="space-y-1.5">
                        {model.cons.slice(0, 3).map((con, j) => (
                          <li key={j} className="text-xs text-gray-600 leading-relaxed">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Best For tags */}
                  <div className="pt-4 border-t border-surface-200/60 mb-5">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-2">
                      <TrendingUp size={13} className="text-brand-600" /> Best For
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {model.bestFor.map((item, j) => (
                        <span key={j} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${color.accent}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Simulate Button */}
                  <button
                    onClick={() => handleSimulate(model.slug)}
                    disabled={simulatingSlug === model.slug}
                    className="w-full btn bg-white/80 hover:bg-white text-gray-900 border border-gray-200 hover:border-brand-300 shadow-sm transition-all"
                  >
                    {simulatingSlug === model.slug ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles size={16} className="text-brand-500" />
                        Analyze {model.name}
                      </div>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="card-gradient inline-block px-10 py-8">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-3 justify-center">
              <Sparkles size={16} /> AI-Powered Analysis
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              Not sure which model fits you?
            </h3>
            <Link to="/questionnaire" className="btn bg-white text-brand-700 font-bold hover:bg-gray-100 shadow-lg inline-flex items-center group">
              Take the Quiz
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModelsPage;
