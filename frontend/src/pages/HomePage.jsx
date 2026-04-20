import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, TrendingUp, Zap, CheckCircle, Star, BarChart3, Layers, Shield, ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: '8 Models',
      description: 'From D2C to SaaS, we cover every viable e-commerce path',
      color: 'from-brand-500 to-brand-600',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: '24 Parameters',
      description: 'Deep multi-dimensional analysis of your unique profile',
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Results',
      description: 'Get AI-powered recommendations in under 10 minutes',
      color: 'from-neon-cyan to-brand-500',
    },
  ];

  const businessModels = [
    { icon: '🛒', name: 'Direct to Consumer', tag: 'D2C', cost: '$$$', gradient: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-200' },
    { icon: '🔄', name: 'Subscription Box', tag: 'Recurring', cost: '$$', gradient: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-200' },
    { icon: '🤝', name: 'Affiliate Marketing', tag: 'Low Risk', cost: '$', gradient: 'from-emerald-500/10 to-green-500/10', border: 'border-emerald-200' },
    { icon: '📦', name: 'Dropshipping', tag: 'No Inventory', cost: '$', gradient: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-200' },
    { icon: '🏪', name: 'Marketplace', tag: 'Platform', cost: '$$', gradient: 'from-rose-500/10 to-pink-500/10', border: 'border-rose-200' },
    { icon: '📱', name: 'Social Commerce', tag: 'Trending', cost: '$', gradient: 'from-sky-500/10 to-blue-500/10', border: 'border-sky-200' },
    { icon: '🎓', name: 'Digital / SaaS', tag: 'Scalable', cost: '$$', gradient: 'from-indigo-500/10 to-violet-500/10', border: 'border-indigo-200' },
    { icon: '🏭', name: 'White Label', tag: 'Brand Ready', cost: '$$$', gradient: 'from-slate-500/10 to-gray-500/10', border: 'border-slate-200' },
  ];

  const stats = [
    { value: '2,400+', label: 'Founders Helped' },
    { value: '97%', label: 'Satisfaction Rate' },
    { value: '8', label: 'Business Models' },
    { value: '<10m', label: 'Average Time' },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ============================== */}
      {/* HERO SECTION */}
      {/* ============================== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 dot-pattern opacity-30" />

        <div className="relative section-container w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                AI-Powered Recommendation Engine
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-6"
            >
              Find Your Perfect
              <br />
              <span className="text-gradient animate-gradient bg-[length:300%_auto]">
                E-Commerce Model
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed text-balance"
            >
              Answer 24 data-driven questions and our AI engine will analyze your 
              goals, skills, and resources to recommend the ideal business model for you.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/questionnaire" className="btn btn-primary btn-lg group inline-flex items-center justify-center">
                Start Analysis
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link to="/models" className="btn btn-secondary btn-lg inline-flex items-center justify-center">
                Explore Models
              </Link>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-display text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* FEATURES SECTION */}
      {/* ============================== */}
      <section className="section bg-white relative">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <span className="badge-brand mb-4 inline-block">Why ModelForge</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Precision-Driven<br className="hidden sm:block" /> Recommendations
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Our scoring algorithm evaluates your profile across financial, operational, 
              market, and skill dimensions to find the model that truly fits.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card-hover group p-8 h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* MODELS GRID */}
      {/* ============================== */}
      <section className="section bg-surface-50 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        
        <div className="section-container relative">
          <AnimatedSection className="text-center mb-16">
            <span className="badge-accent mb-4 inline-block">Full Coverage</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              8 Models, One Perfect Fit
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every major e-commerce approach analyzed with our weighted scoring algorithm
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {businessModels.map((model, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className={`group relative bg-gradient-to-br ${model.gradient} rounded-2xl p-5 border ${model.border} hover:shadow-elevated-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer`}>
                  <div className="text-4xl mb-3">{model.icon}</div>
                  <h3 className="font-display font-semibold text-gray-900 text-sm mb-1">{model.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500 font-medium">{model.tag}</span>
                    <span className="text-xs font-mono font-semibold text-gray-400">{model.cost}</span>
                  </div>
                  <ArrowUpRight size={14} className="absolute top-4 right-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* HOW IT WORKS */}
      {/* ============================== */}
      <section className="section bg-white">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <span className="badge-brand mb-4 inline-block">Simple Process</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Three Steps to Clarity
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              From questionnaire to actionable insights in minutes
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Answer Questions',
                description: '24 carefully crafted parameters covering finances, operations, market fit, and your skill set.',
                icon: <Layers className="w-6 h-6" />,
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our weighted scoring algorithm evaluates your profile against all 8 business models simultaneously.',
                icon: <BarChart3 className="w-6 h-6" />,
              },
              {
                step: '03',
                title: 'Get Your Roadmap',
                description: 'Receive ranked recommendations with match scores, pros/cons, and platform suggestions.',
                icon: <Shield className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <div className="relative group">
                  <div className="card-hover p-8 h-full">
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-mono text-5xl font-bold text-surface-200 group-hover:text-brand-100 transition-colors duration-500">
                        {item.step}
                      </span>
                      <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:flex absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                      <div className="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center border border-surface-200">
                        <ArrowRight className="text-gray-400" size={16} />
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* CTA SECTION */}
      {/* ============================== */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-brand-950 to-surface-900" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-brand-200 text-sm font-medium mb-8 backdrop-blur-sm">
              <Star size={14} className="text-amber-400" />
              Join 2,400+ founders
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Find Your<br />Perfect Model?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              Stop guessing. Let data guide your e-commerce journey. 
              Free analysis, instant results.
            </p>
            <Link
              to="/questionnaire"
              className="btn btn-lg bg-white text-gray-900 font-bold hover:bg-gray-100 shadow-glass-lg hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300 inline-flex items-center group"
            >
              Start Your Analysis
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
