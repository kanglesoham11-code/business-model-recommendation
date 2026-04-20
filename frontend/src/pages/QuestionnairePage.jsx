import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuestionnaireStore } from '../store/questionnaireStore';
import { questionnaireAPI, recommendationAPI } from '../utils/api';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, DollarSign, Settings, Globe, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { currentStep, setStep, nextStep, prevStep, answers, updateAnswers, setQuestionnaireId } = useQuestionnaireStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: answers
  });

  const steps = [
    {
      title: 'Financial Profile',
      description: 'Tell us about your budget, revenue goals, and financial constraints',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      fields: [
        { name: 'startupBudget', label: 'What is your startup budget?', type: 'number', placeholder: '5000', suffix: 'USD', hint: 'Total capital you can invest upfront' },
        { name: 'monthlyBurnTolerance', label: 'Monthly burn rate tolerance?', type: 'number', placeholder: '1000', suffix: 'USD/mo', hint: 'How much can you spend per month' },
        { name: 'targetARR', label: 'Target annual revenue?', type: 'number', placeholder: '50000', suffix: 'USD/yr', hint: 'Your first-year revenue goal' },
        { name: 'timeToProfitability', label: 'Time to profitability?', type: 'number', placeholder: '12', suffix: 'months', hint: 'When you expect to break even' },
        { name: 'existingRevenue', label: 'Current existing revenue?', type: 'number', placeholder: '0', suffix: 'USD', hint: 'Any revenue from existing business' },
        { name: 'maxCAC', label: 'Max customer acquisition cost?', type: 'number', placeholder: '100', suffix: 'USD', hint: 'What you\'d spend to acquire one customer' }
      ]
    },
    {
      title: 'Operational Capacity',
      description: 'Your resources, team, and operational capabilities',
      icon: <Settings className="w-6 h-6" />,
      color: 'from-brand-500 to-brand-700',
      fields: [
        { name: 'inventoryWillingness', label: 'Inventory management willingness?', type: 'slider', min: 1, max: 5, hint: '1 = Not at all, 5 = Very willing' },
        { name: 'logisticsCapability', label: 'Logistics capability level?', type: 'slider', min: 1, max: 5, hint: '1 = No experience, 5 = Expert' },
        { name: 'teamSize', label: 'Team size?', type: 'number', placeholder: '1', hint: 'Including yourself' },
        { name: 'hoursPerWeek', label: 'Hours per week available?', type: 'number', placeholder: '20', suffix: 'hrs', hint: 'Time you can dedicate weekly' },
        { name: 'supplierAccess', label: 'Do you have supplier access?', type: 'checkbox' },
        { name: 'warehouseAvailability', label: 'Do you have warehouse availability?', type: 'checkbox' }
      ]
    },
    {
      title: 'Market Position',
      description: 'Your target market, geography, and competitive landscape',
      icon: <Globe className="w-6 h-6" />,
      color: 'from-accent-500 to-accent-700',
      fields: [
        { name: 'targetGeography', label: 'Target geography?', type: 'select', options: ['Domestic', 'International', 'Global'] },
        { name: 'nicheType', label: 'Niche type?', type: 'select', options: ['General', 'Specific', 'Micro'] },
        { name: 'businessType', label: 'Business type?', type: 'select', options: ['B2C', 'B2B', 'B2B2C'] },
        { name: 'competitionLevel', label: 'Competition level in your space?', type: 'slider', min: 1, max: 5, hint: '1 = Low competition, 5 = Saturated' },
        { name: 'existingAudienceSize', label: 'Existing audience size?', type: 'number', placeholder: '0', hint: 'Social followers, email list, etc.' },
        { name: 'brandRecognition', label: 'Brand recognition level?', type: 'slider', min: 1, max: 5, hint: '1 = Unknown, 5 = Well-known' }
      ]
    },
    {
      title: 'Skills & Expertise',
      description: 'Rate your skills across key business areas',
      icon: <Code className="w-6 h-6" />,
      color: 'from-violet-500 to-purple-700',
      fields: [
        { name: 'techStackProficiency', label: 'Tech stack proficiency?', type: 'slider', min: 1, max: 5, hint: 'Coding, platforms, tools' },
        { name: 'contentCreationAbility', label: 'Content creation ability?', type: 'slider', min: 1, max: 5, hint: 'Writing, video, graphics' },
        { name: 'seoSemExperience', label: 'SEO/SEM experience?', type: 'slider', min: 1, max: 5, hint: 'Search marketing knowledge' },
        { name: 'designSkills', label: 'Design skills?', type: 'slider', min: 1, max: 5, hint: 'UI/UX, branding, visual design' },
        { name: 'salesExperience', label: 'Sales experience?', type: 'slider', min: 1, max: 5, hint: 'B2B/B2C selling ability' },
        { name: 'dataAnalysisCapability', label: 'Data analysis capability?', type: 'slider', min: 1, max: 5, hint: 'Analytics, metrics, reporting' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const onSubmit = async (data) => {
    updateAnswers(data);

    if (!isLastStep) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoading(true);
      try {
        const payload = { ...answers, ...data };
        
        // Clean up NaN, null, and empty string
        Object.keys(payload).forEach(key => {
          if (payload[key] == null || payload[key] === '' || Number.isNaN(payload[key])) {
            delete payload[key];
          }
        });

        const questionnaireResponse = await questionnaireAPI.create({
          ...payload,
          status: 'completed'
        });
        
        const questionnaireId = questionnaireResponse.data.data.questionnaire.id;
        setQuestionnaireId(questionnaireId);
        const recommendationResponse = await recommendationAPI.generate(questionnaireId);
        const recommendationId = recommendationResponse.data.data.recommendation.id;
        navigate(`/results/${recommendationId}`);
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to generate recommendation. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const SliderField = ({ field, registerFn }) => {
    const [value, setValue] = useState(answers[field.name] || 3);
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-sm font-semibold text-brand-600">{value}/5</span>
          <span className="text-xs text-gray-400">{labels[value - 1]}</span>
        </div>
        <input
          type="range"
          min={field.min}
          max={field.max}
          value={value}
          className="w-full h-2 bg-surface-200 rounded-full appearance-none cursor-pointer accent-brand-600
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:shadow-glow
                     [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:hover:scale-125"
          {...registerFn(field.name, {
            onChange: (e) => setValue(parseInt(e.target.value)),
          })}
        />
        <div className="flex justify-between mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`text-[10px] ${value >= n ? 'text-brand-500' : 'text-gray-300'}`}>●</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-50 py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={() => setStep(index)}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 ${
                    index === currentStep
                      ? 'bg-gradient-to-br ' + step.color + ' text-white shadow-glow scale-110'
                      : index < currentStep
                      ? 'bg-brand-100 text-brand-600'
                      : 'bg-surface-100 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle size={18} />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-surface-200">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-700"
                      style={{ width: index < currentStep ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Progress bar text */}
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 w-full bg-surface-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Form Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="card p-8">
              {/* Step Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentStepData.color} rounded-2xl flex items-center justify-center text-white flex-shrink-0`}>
                  {currentStepData.icon}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-900">
                    {currentStepData.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{currentStepData.description}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {currentStepData.fields.map((field, idx) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <label className="label">{field.label}</label>
                    {field.hint && (
                      <p className="text-xs text-gray-400 -mt-1 mb-2">{field.hint}</p>
                    )}

                    {field.type === 'slider' ? (
                      <SliderField field={field} registerFn={register} />
                    ) : field.type === 'select' ? (
                      <select className="input" {...register(field.name)}>
                        <option value="">Select an option...</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-200 cursor-pointer hover:border-brand-300 transition-colors group/check">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-brand-600 border-gray-300 rounded-lg focus:ring-brand-500 cursor-pointer"
                          {...register(field.name)}
                        />
                        <span className="text-sm text-gray-700 group-hover/check:text-gray-900">Yes, I have access</span>
                      </label>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          className="input pr-16"
                          placeholder={field.placeholder}
                          {...register(field.name, { valueAsNumber: true })}
                        />
                        {field.suffix && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400">
                            {field.suffix}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-surface-200">
                  {currentStep > 0 ? (
                    <button
                      type="button"
                      onClick={() => { prevStep(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="btn btn-secondary inline-flex items-center"
                    >
                      <ArrowLeft className="mr-2" size={18} />
                      Back
                    </button>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn inline-flex items-center ${
                      isLastStep ? 'btn-accent btn-lg' : 'btn-primary'  
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : isLastStep ? (
                      <>
                        <Sparkles className="mr-2" size={18} />
                        Get Recommendations
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2" size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestionnairePage;
