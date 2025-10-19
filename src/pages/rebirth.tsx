import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import LanguageSwitcher from '@/components/common/language-switcher';
import MBTIStep from '@/components/rebirth/mbti-step';
import BirthInfoStep from '@/components/rebirth/birth-info-step';
import QuestionnaireStep from '@/components/rebirth/questionnaire-step';
import {
  type RebirthFormData,
  type MBTIType,
  type BirthInfo,
  type QuestionnaireAnswer,
} from '@/lib/rebirth/types';
import { saveCurrentSession, getCurrentSession } from '@/lib/rebirth/storage';
import { calculateMatch } from '@/lib/rebirth/calculator';

type Step = 'mbti' | 'birth' | 'questionnaire';

const Rebirth: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('mbti');
  const [formData, setFormData] = useState<RebirthFormData>({
    questionnaireAnswers: [],
  });
  const [isCalculating, setIsCalculating] = useState(false);

  // Load saved session on mount
  useEffect(() => {
    const saved = getCurrentSession();
    if (saved) {
      setFormData(saved.formData);
      // Determine which step to show based on completed data
      if (!saved.formData.mbti) {
        setCurrentStep('mbti');
      } else if (!saved.formData.birthInfo) {
        setCurrentStep('birth');
      } else if (saved.formData.questionnaireAnswers.length === 0) {
        setCurrentStep('questionnaire');
      }
    }
  }, []);

  // Save progress whenever form data changes
  useEffect(() => {
    if (formData.mbti || formData.birthInfo || formData.questionnaireAnswers.length > 0) {
      saveCurrentSession(formData);
    }
  }, [formData]);

  const handleMBTIComplete = (mbti: MBTIType | undefined) => {
    setFormData(prev => ({ ...prev, mbti }));
    setCurrentStep('birth');
  };

  const handleBirthInfoComplete = (birthInfo: BirthInfo) => {
    setFormData(prev => ({ ...prev, birthInfo }));
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = async (answers: QuestionnaireAnswer[]) => {
    setFormData(prev => ({ ...prev, questionnaireAnswers: answers }));

    // Calculate result
    setIsCalculating(true);

    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    const finalFormData = { ...formData, questionnaireAnswers: answers };
    const result = calculateMatch(finalFormData);

    // Navigate to results page
    navigate('/rebirth/result', { state: { result, formData: finalFormData } });
  };

  const goBack = () => {
    if (currentStep === 'birth') {
      setCurrentStep('mbti');
    } else if (currentStep === 'questionnaire') {
      setCurrentStep('birth');
    }
  };

  const getStepNumber = (): number => {
    switch (currentStep) {
      case 'mbti': return 1;
      case 'birth': return 2;
      case 'questionnaire': return 3;
      default: return 1;
    }
  };

  const getProgress = (): number => {
    return (getStepNumber() / 3) * 100;
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <Sparkles className="w-16 h-16 mx-auto text-purple-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {i18n.language === 'zh' ? '正在推算前世...' : 'Calculating your past life...'}
          </h2>
          <p className="text-gray-600 mb-6">
            {i18n.language === 'zh'
              ? '正在分析你的性格特质、五行能量和行为模式...'
              : 'Analyzing your personality traits, elemental energy, and behavioral patterns...'}
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Language Switcher - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            {i18n.language === 'zh' ? '前世身份测算' : 'Past Life Calculator'}
          </h1>
          <p className="text-gray-600">
            {i18n.language === 'zh'
              ? '通过MBTI、生辰八字与心理问卷，探索你的前世身份'
              : 'Discover your past life identity through MBTI, birth info, and psychology'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className={currentStep === 'mbti' ? 'font-semibold text-purple-600' : ''}>
              {i18n.language === 'zh' ? '1. 性格类型' : '1. Personality'}
            </span>
            <span className={currentStep === 'birth' ? 'font-semibold text-purple-600' : ''}>
              {i18n.language === 'zh' ? '2. 生辰信息' : '2. Birth Info'}
            </span>
            <span className={currentStep === 'questionnaire' ? 'font-semibold text-purple-600' : ''}>
              {i18n.language === 'zh' ? '3. 趣味问卷' : '3. Questionnaire'}
            </span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8">
          {currentStep === 'mbti' && (
            <MBTIStep
              initialValue={formData.mbti}
              onComplete={handleMBTIComplete}
            />
          )}

          {currentStep === 'birth' && (
            <BirthInfoStep
              initialValue={formData.birthInfo}
              onComplete={handleBirthInfoComplete}
              onBack={goBack}
            />
          )}

          {currentStep === 'questionnaire' && (
            <QuestionnaireStep
              initialAnswers={formData.questionnaireAnswers}
              onComplete={handleQuestionnaireComplete}
              onBack={goBack}
            />
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          {i18n.language === 'zh'
            ? '所有数据仅保存在您的浏览器本地，不会上传服务器'
            : 'All data is stored locally in your browser only'}
        </div>
      </div>
    </div>
  );
};

export default Rebirth;
