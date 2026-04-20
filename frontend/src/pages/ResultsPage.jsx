import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recommendationAPI } from '../utils/api';
import { Download, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, ArrowRight, Sparkles, Trophy, Medal, Award } from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ResultsPage = () => {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recResponse, modelsResponse] = await Promise.all([
          recommendationAPI.getById(id),
          recommendationAPI.getAllModels()
        ]);
        setRecommendation(recResponse.data.data.recommendation);
        setModels(modelsResponse.data.data.models);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 bg-surface-50 rounded-full flex items-center justify-center">
              <Sparkles size={16} className="text-brand-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Analyzing your results...</p>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Recommendation not found</h2>
          <Link to="/questionnaire" className="btn btn-primary">Start New Questionnaire</Link>
        </div>
      </div>
    );
  }

  const topModels = recommendation.topModels || [];
  const topModel = topModels[0];
  const topModelDetails = models.find(m => m.slug === topModel?.model);
  
  // LLM Injected Data Fallbacks
  const prosToDisplay = topModel?.customPros?.length ? topModel.customPros : topModelDetails?.pros || [];
  const consToDisplay = topModel?.customCons?.length ? topModel.customCons : topModelDetails?.cons || [];
  const reasoningToDisplay = topModel?.customReasoning || topModelDetails?.description;

  const rankIcons = [<Trophy size={20} />, <Medal size={20} />, <Award size={20} />];
  const rankColors = ['from-amber-400 to-amber-600', 'from-gray-300 to-gray-500', 'from-amber-600 to-amber-800'];

  const radarData = {
    labels: ['Cost Fit', 'Speed', 'Scalability', 'Simplicity', 'Risk Fit', 'Control'],
    datasets: [{
      label: 'Your Fit',
      data: [
        topModel?.score || 0,
        Math.min(100, (topModel?.score || 0) + 10),
        Math.max(0, (topModel?.score || 0) - 5),
        topModel?.score || 0,
        Math.min(100, (topModel?.score || 0) + 5),
        Math.max(0, (topModel?.score || 0) - 10),
      ],
      backgroundColor: 'rgba(92, 124, 250, 0.12)',
      borderColor: 'rgba(92, 124, 250, 0.8)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(92, 124, 250, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, display: false },
        grid: { color: 'rgba(0,0,0,0.04)' },
        angleLines: { color: 'rgba(0,0,0,0.06)' },
        pointLabels: { font: { family: 'Inter', size: 11, weight: '500' }, color: '#6b7280' }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: true,
  };

  return (
    <div className="min-h-screen bg-surface-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle size={28} />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Your Results
          </h1>
          <p className="text-lg text-gray-500">Personalized recommendations based on your 24-parameter profile</p>
        </motion.div>

        {/* Top Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-3xl mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-4">
                  <Trophy size={14} className="text-amber-300" />
                  #1 BEST MATCH
                </span>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-5xl">{topModelDetails?.icon}</span>
                  <div>
                    <h2 className="font-display text-3xl font-bold text-white">{topModelDetails?.name}</h2>
                    {topModel?.customReasoning ? (
                      <div className="mt-4 bg-black/20 rounded-xl p-4 border border-white/10 relative">
                        <Sparkles className="absolute -top-3 -right-3 text-amber-300 animate-pulse" size={24} />
                        <p className="text-white/90 text-sm leading-relaxed">{reasoningToDisplay}</p>
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm mt-1">{reasoningToDisplay}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-5xl font-display font-bold text-white mb-1">
                  {Math.round(topModel?.score)}%
                </div>
                <p className="text-xs text-white/60 uppercase tracking-wider">Match Score</p>
              </div>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <DollarSign size={18} />, label: 'Startup Cost', value: topModelDetails?.startupCost },
                { icon: <Clock size={18} />, label: 'Time to Revenue', value: topModelDetails?.timeToRevenue },
                { icon: <TrendingUp size={18} />, label: 'Scalability', value: `${topModelDetails?.scalabilityScore || 0}/5` },
              ].map((metric, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                    {metric.icon}
                    {metric.label}
                  </div>
                  <p className="text-xl font-bold text-white">{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Pros / Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                <h4 className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-3">
                  <CheckCircle size={16} /> Key Advantages
                </h4>
                <ul className="space-y-2">
                  {prosToDisplay.slice(0, 4).map((pro, i) => (
                    <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                <h4 className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-3">
                  <XCircle size={16} /> Considerations
                </h4>
                <ul className="space-y-2">
                  {consToDisplay.slice(0, 4).map((con, i) => (
                    <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">!</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart + Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="card p-8 h-full">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Suitability Analysis</h3>
              <div className="max-w-sm mx-auto">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="card p-8 h-full">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Recommended Platforms</h3>
              <div className="space-y-3">
                {topModelDetails?.platforms?.map((platform, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-surface-200 hover:border-brand-200 transition-colors">
                    <span className="font-medium text-gray-900 text-sm">{platform}</span>
                    <span className="badge-brand text-[10px]">Recommended</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alternative Models */}
        {topModels.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="card p-8 mb-8">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Alternative Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topModels.slice(1, 3).map((model, index) => {
                  const details = models.find(m => m.slug === model.model);
                  return (
                    <div key={index} className="group rounded-2xl border border-surface-200 p-6 hover:border-brand-200 hover:shadow-elevated transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${rankColors[index + 1]} rounded-lg flex items-center justify-center text-white`}>
                            {rankIcons[index + 1]}
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-lg text-gray-900">{details?.name}</h4>
                            <p className="text-xs text-gray-500">{details?.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-display font-bold text-gray-900">{Math.round(model.score)}%</div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Match</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-surface-50 rounded-lg p-2.5">
                          <p className="text-xs text-gray-400 mb-0.5">Cost</p>
                          <p className="font-semibold text-gray-900">{details?.startupCost}</p>
                        </div>
                        <div className="bg-surface-50 rounded-lg p-2.5">
                          <p className="text-xs text-gray-400 mb-0.5">Time</p>
                          <p className="font-semibold text-gray-900">{details?.timeToRevenue}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="btn btn-primary btn-lg inline-flex items-center justify-center">
            <Download className="mr-2" size={18} />
            Download Report
          </button>
          <Link to="/questionnaire" className="btn btn-secondary btn-lg inline-flex items-center justify-center">
            New Analysis
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;
