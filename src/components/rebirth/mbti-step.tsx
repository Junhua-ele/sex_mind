import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ChevronRight, HelpCircle } from 'lucide-react';
import type { MBTIType } from '@/lib/rebirth/types';

interface MBTIStepProps {
  initialValue?: MBTIType;
  onComplete: (mbti: MBTIType | undefined) => void;
}

const MBTI_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const MBTI_DESCRIPTIONS: Record<MBTIType, { zh: string; en: string }> = {
  INTJ: { zh: '建筑师 - 富有想象力的战略家', en: 'Architect - Imaginative strategist' },
  INTP: { zh: '逻辑学家 - 创新的思想家', en: 'Logician - Innovative thinker' },
  ENTJ: { zh: '指挥官 - 大胆的领导者', en: 'Commander - Bold leader' },
  ENTP: { zh: '辩论家 - 聪明的思考者', en: 'Debater - Smart thinker' },
  INFJ: { zh: '提倡者 - 理想主义的组织者', en: 'Advocate - Idealistic organizer' },
  INFP: { zh: '调停者 - 诗意的理想主义者', en: 'Mediator - Poetic idealist' },
  ENFJ: { zh: '主人公 - 有魅力的领袖', en: 'Protagonist - Charismatic leader' },
  ENFP: { zh: '竞选者 - 充满热情的自由灵魂', en: 'Campaigner - Enthusiastic free spirit' },
  ISTJ: { zh: '物流师 - 实用的传统主义者', en: 'Logistician - Practical traditionalist' },
  ISFJ: { zh: '守卫者 - 坚定的保护者', en: 'Defender - Dedicated protector' },
  ESTJ: { zh: '总经理 - 出色的管理者', en: 'Executive - Excellent administrator' },
  ESFJ: { zh: '执政官 - 关怀他人的给予者', en: 'Consul - Caring giver' },
  ISTP: { zh: '鉴赏家 - 大胆的实验家', en: 'Virtuoso - Bold experimenter' },
  ISFP: { zh: '探险家 - 灵活的艺术家', en: 'Adventurer - Flexible artist' },
  ESTP: { zh: '企业家 - 聪明的企业家', en: 'Entrepreneur - Smart entrepreneur' },
  ESFP: { zh: '表演者 - 自发的娱乐者', en: 'Entertainer - Spontaneous entertainer' },
};

const MBTIStep: React.FC<MBTIStepProps> = ({ initialValue, onComplete }) => {
  const { i18n } = useTranslation();
  const [selectedMBTI, setSelectedMBTI] = useState<MBTIType | undefined>(initialValue);
  const [skipMBTI, setSkipMBTI] = useState(false);

  const handleContinue = () => {
    onComplete(skipMBTI ? undefined : selectedMBTI);
  };

  const canContinue = skipMBTI || selectedMBTI !== undefined;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {i18n.language === 'zh' ? '你的MBTI性格类型' : 'Your MBTI Personality Type'}
        </h2>
        <p className="text-gray-600">
          {i18n.language === 'zh'
            ? 'MBTI性格类型将帮助我们匹配与你性格相符的前世身份'
            : 'MBTI personality type helps us match your past life identity'}
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {i18n.language === 'zh'
            ? '如果你不知道自己的MBTI类型，可以跳过此步骤，我们将通过后续问卷推测你的性格特质。'
            : 'If you don\'t know your MBTI type, you can skip this step. We\'ll infer your personality from the questionnaire.'}
        </AlertDescription>
      </Alert>

      {!skipMBTI && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="mbti-select" className="text-base font-medium">
              {i18n.language === 'zh' ? '选择你的MBTI类型' : 'Select your MBTI type'}
            </Label>
            <Select value={selectedMBTI} onValueChange={(value) => setSelectedMBTI(value as MBTIType)}>
              <SelectTrigger id="mbti-select" className="mt-2">
                <SelectValue placeholder={i18n.language === 'zh' ? '请选择...' : 'Please select...'} />
              </SelectTrigger>
              <SelectContent>
                {MBTI_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{type}</span>
                      <span className="text-sm text-gray-500">
                        {i18n.language === 'zh' ? MBTI_DESCRIPTIONS[type].zh : MBTI_DESCRIPTIONS[type].en}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMBTI && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900">
                    {selectedMBTI} - {i18n.language === 'zh' ? MBTI_DESCRIPTIONS[selectedMBTI].zh : MBTI_DESCRIPTIONS[selectedMBTI].en}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={() => setSkipMBTI(true)}
            className="w-full"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {i18n.language === 'zh' ? '我不知道我的MBTI类型' : 'I don\'t know my MBTI type'}
          </Button>
        </div>
      )}

      {skipMBTI && (
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              {i18n.language === 'zh'
                ? '没问题!我们将通过后续的趣味问卷来了解你的性格特质。'
                : 'No problem! We\'ll understand your personality through the upcoming questionnaire.'}
            </AlertDescription>
          </Alert>

          <Button
            variant="outline"
            onClick={() => setSkipMBTI(false)}
            className="w-full"
          >
            {i18n.language === 'zh' ? '返回选择MBTI' : 'Back to select MBTI'}
          </Button>
        </div>
      )}

      <div className="pt-4">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full"
          size="lg"
        >
          {i18n.language === 'zh' ? '下一步' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className="text-center">
        <a
          href="https://www.16personalities.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-600 hover:text-purple-700 underline inline-flex items-center gap-1"
        >
          <HelpCircle className="w-4 h-4" />
          {i18n.language === 'zh' ? '不知道MBTI?点击测试' : 'Don\'t know MBTI? Take the test'}
        </a>
      </div>
    </div>
  );
};

export default MBTIStep;
