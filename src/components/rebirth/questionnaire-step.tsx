import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { REBIRTH_QUESTIONS } from '@/lib/rebirth';
import type { QuestionnaireAnswer } from '@/lib/rebirth/types';

interface QuestionnaireStepProps {
  initialAnswers: QuestionnaireAnswer[];
  onComplete: (answers: QuestionnaireAnswer[]) => void;
  onBack: () => void;
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({ initialAnswers, onComplete, onBack }) => {
  const { i18n } = useTranslation();
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    initialAnswers.forEach(a => {
      initial[a.questionId] = String(a.answer);
    });
    return initial;
  });

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleComplete = () => {
    const questionnaireAnswers: QuestionnaireAnswer[] = REBIRTH_QUESTIONS.map(q => {
      const answerValue = answers[q.id];
      const selectedOption = q.options.find(opt => String(opt.value) === answerValue);

      return {
        questionId: q.id,
        answer: answerValue,
        tags: selectedOption?.tags || [],
      };
    });

    onComplete(questionnaireAnswers);
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = REBIRTH_QUESTIONS.length;
  const allAnswered = answeredCount === totalQuestions;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {i18n.language === 'zh' ? '人类学趣味问卷' : 'Anthropological Questionnaire'}
        </h2>
        <p className="text-gray-600">
          {i18n.language === 'zh'
            ? '通过8道趣味题了解你的行为模式与价值观'
            : 'Understanding your behavioral patterns through 8 questions'}
        </p>
      </div>

      {/* Progress Alert */}
      <Alert className={allAnswered ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}>
        <div className="flex items-center gap-2">
          {allAnswered && <Check className="h-4 w-4 text-green-600" />}
          <AlertDescription className={allAnswered ? 'text-green-900' : 'text-blue-900'}>
            {i18n.language === 'zh'
              ? `已完成 ${answeredCount} / ${totalQuestions} 题`
              : `Completed ${answeredCount} / ${totalQuestions} questions`}
          </AlertDescription>
        </div>
        <div className="mt-2 w-full bg-white/50 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${allAnswered ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </Alert>

      {/* Questions */}
      <div className="space-y-8">
        {REBIRTH_QUESTIONS.map((question, index) => {
          const isAnswered = !!answers[question.id];

          return (
            <div
              key={question.id}
              className={`p-5 rounded-lg border-2 transition-all ${
                isAnswered
                  ? 'border-purple-300 bg-purple-50/50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isAnswered ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {isAnswered ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {i18n.language === 'zh' ? question.text : question.textEn}
                  </h3>
                </div>
              </div>

              <RadioGroup
                value={answers[question.id]}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="space-y-3 ml-11"
              >
                {question.options.map((option) => (
                  <div key={String(option.value)} className="flex items-start space-x-3">
                    <RadioGroupItem
                      value={String(option.value)}
                      id={`${question.id}-${option.value}`}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`${question.id}-${option.value}`}
                      className="flex-1 cursor-pointer text-base leading-relaxed"
                    >
                      {i18n.language === 'zh' ? option.label : option.labelEn}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          {i18n.language === 'zh' ? '上一步' : 'Back'}
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!allAnswered}
          className="flex-1"
          size="lg"
        >
          {i18n.language === 'zh' ? '完成测算' : 'Complete'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {!allAnswered && (
        <div className="text-center text-sm text-amber-600">
          {i18n.language === 'zh'
            ? '请完成所有问题后再提交'
            : 'Please answer all questions before submitting'}
        </div>
      )}
    </div>
  );
};

export default QuestionnaireStep;
