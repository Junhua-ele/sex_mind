import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LanguageSwitcher from '@/components/common/language-switcher';
import {
  Sparkles,
  RefreshCw,
  Share2,
  TrendingUp,
  Heart,
  DollarSign,
  Lightbulb,
  MapPin,
  Calendar,
  Star,
} from 'lucide-react';
import type { MatchingResult, RebirthFormData } from '@/lib/rebirth/types';
import { completeSession } from '@/lib/rebirth/storage';

const RebirthResult: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { result, formData } = (location.state as { result: MatchingResult; formData: RebirthFormData }) || {};

  useEffect(() => {
    if (!result) {
      navigate('/rebirth');
      return;
    }

    // Save completed session
    completeSession(result);
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const { persona, matchScore, mbtiMatch, elementMatch, behaviorMatch, reasoning } = result;

  // Helper function to get localized text
  const getLocalizedText = (en: string, zh?: string) => {
    return i18n.language === 'zh' && zh ? zh : en;
  };

  // Helper function to get localized evaluation
  const getLocalizedEvaluation = () => {
    if (i18n.language === 'zh' && persona.evaluationZh) {
      return persona.evaluationZh;
    }
    return persona.evaluation;
  };

  const handleRetake = () => {
    navigate('/rebirth');
  };

  const handleShare = () => {
    // Simple share functionality
    const shareText = `${i18n.language === 'zh' ? '我的前世身份是' : 'My past life was'}: ${persona.title}!`;
    if (navigator.share) {
      navigator.share({
        title: i18n.language === 'zh' ? '前世身份测算' : 'Past Life Calculator',
        text: shareText,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText);
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert(i18n.language === 'zh' ? '已复制到剪贴板!' : 'Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Language Switcher - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {i18n.language === 'zh' ? '你的前世身份' : 'Your Past Life Identity'}
          </h1>
          <p className="text-gray-600">
            {i18n.language === 'zh' ? '基于你的性格、五行与行为模式' : 'Based on your personality, elements, and behavior'}
          </p>
        </div>

        {/* Main Identity Card */}
        <Card className="p-8 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {i18n.language === 'zh' ? '匹配度' : 'Match'}: {Math.round(matchScore)}%
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {getLocalizedText(persona.title, persona.titleZh)}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 text-gray-700">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{getLocalizedText(persona.era, persona.eraZh)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{getLocalizedText(persona.region, persona.regionZh)}</span>
              </div>
              <span>•</span>
              <span className="font-medium">{getLocalizedText(persona.culture, persona.cultureZh)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {Array.from({ length: persona.rarity }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-gray-600">
                {i18n.language === 'zh' ? '稀有度' : 'Rarity'} {persona.rarity}/5
              </span>
            </div>
          </div>
        </Card>

        {/* Story */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            {i18n.language === 'zh' ? '前世故事' : 'Past Life Story'}
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {getLocalizedText(persona.storyTemplate, persona.storyTemplateZh)}
          </p>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-900">
              <strong>{i18n.language === 'zh' ? '五行平衡：' : 'Elemental Balance: '}</strong>
              {getLocalizedText(persona.balanceNote, persona.balanceNoteZh)}
            </p>
          </div>
        </Card>

        {/* Match Analysis */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {i18n.language === 'zh' ? '匹配分析' : 'Match Analysis'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{mbtiMatch}%</div>
              <div className="text-sm text-gray-600 mt-1">
                {i18n.language === 'zh' ? 'MBTI匹配' : 'MBTI Match'}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{elementMatch}%</div>
              <div className="text-sm text-gray-600 mt-1">
                {i18n.language === 'zh' ? '五行匹配' : 'Element Match'}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{behaviorMatch}%</div>
              <div className="text-sm text-gray-600 mt-1">
                {i18n.language === 'zh' ? '行为匹配' : 'Behavior Match'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">
              {i18n.language === 'zh' ? '为什么是这个身份？' : 'Why this identity?'}
            </h4>
            <ul className="space-y-2">
              {reasoning.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Evaluation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <Card className="p-5">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              {i18n.language === 'zh' ? '优势特质' : 'Strengths'}
            </h4>
            <p className="text-gray-700">{getLocalizedEvaluation().strengths}</p>
          </Card>

          {/* Weaknesses */}
          <Card className="p-5">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              {i18n.language === 'zh' ? '成长空间' : 'Growth Areas'}
            </h4>
            <p className="text-gray-700">{getLocalizedEvaluation().weaknesses}</p>
          </Card>

          {/* Romance */}
          <Card className="p-5">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              {i18n.language === 'zh' ? '桃花运势' : 'Romance'}
            </h4>
            <p className="text-gray-700">{getLocalizedEvaluation().romance}</p>
          </Card>

          {/* Wealth */}
          <Card className="p-5">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              {i18n.language === 'zh' ? '财运分析' : 'Wealth'}
            </h4>
            <p className="text-gray-700">{getLocalizedEvaluation().wealth}</p>
          </Card>
        </div>

        {/* Advice */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-purple-600" />
            {i18n.language === 'zh' ? '人生建议' : 'Life Advice'}
          </h3>
          <p className="text-lg text-gray-800 leading-relaxed">
            {getLocalizedEvaluation().advice}
          </p>
        </Card>

        {/* Traits */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {i18n.language === 'zh' ? '性格特质' : 'Personality Traits'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(i18n.language === 'zh' && persona.traitsZh ? persona.traitsZh : persona.traits).map((trait, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {trait}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Visual Cue */}
        <Card className="p-6 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {i18n.language === 'zh' ? '视觉符号' : 'Visual Symbols'}
          </h3>
          <p className="text-gray-700 italic">{getLocalizedText(persona.visualCue, persona.visualCueZh)}</p>
        </Card>

        {/* Action Hooks */}
        {persona.hooks.length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {i18n.language === 'zh' ? '互动引导' : 'Interactive Prompts'}
            </h3>
            <div className="space-y-2">
              {(i18n.language === 'zh' && persona.hooksZh ? persona.hooksZh : persona.hooks).map((hook, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{hook}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <Button onClick={handleShare} variant="outline" size="lg">
            <Share2 className="w-5 h-5 mr-2" />
            {i18n.language === 'zh' ? '分享结果' : 'Share Result'}
          </Button>
          <Button onClick={handleRetake} variant="outline" size="lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            {i18n.language === 'zh' ? '再测一次' : 'Retake'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          <p>
            {i18n.language === 'zh'
              ? '此结果基于心理学与传统文化相结合的算法生成，仅供娱乐参考'
              : 'Results are generated by algorithms combining psychology and traditional culture, for entertainment only'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RebirthResult;
