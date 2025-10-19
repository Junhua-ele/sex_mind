import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, Calendar, Clock, Info } from 'lucide-react';
import type { BirthInfo } from '@/lib/rebirth/types';

interface BirthInfoStepProps {
  initialValue?: BirthInfo;
  onComplete: (birthInfo: BirthInfo) => void;
  onBack: () => void;
}

const BirthInfoStep: React.FC<BirthInfoStepProps> = ({ initialValue, onComplete, onBack }) => {
  const { i18n } = useTranslation();
  const [date, setDate] = useState<string>(initialValue?.date || '');
  const [time, setTime] = useState<string>(initialValue?.time || '');
  const [hasTime, setHasTime] = useState<boolean>(initialValue?.hasTime ?? true);
  const [location, setLocation] = useState<string>(initialValue?.location || '');

  const handleContinue = () => {
    if (!date) return;

    const birthInfo: BirthInfo = {
      date,
      time: hasTime ? time : undefined,
      hasTime,
      location: location || undefined,
    };

    onComplete(birthInfo);
  };

  const canContinue = date !== '' && (!hasTime || time !== '');

  // Get current date for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {i18n.language === 'zh' ? '你的生辰信息' : 'Your Birth Information'}
        </h2>
        <p className="text-gray-600">
          {i18n.language === 'zh'
            ? '生辰八字将帮助我们分析你的五行能量,精准匹配前世身份'
            : 'Birth information helps us analyze your elemental energy for accurate matching'}
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {i18n.language === 'zh'
            ? '我们使用公历日期推算五行属性。如果不确定出生时辰，可以勾选"不知道时辰"选项。'
            : 'We use the Gregorian calendar to calculate elemental attributes. If unsure about birth time, check "Don\'t know time".'}
        </AlertDescription>
      </Alert>

      <div className="space-y-5">
        {/* Birth Date */}
        <div>
          <Label htmlFor="birth-date" className="text-base font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {i18n.language === 'zh' ? '出生日期 *' : 'Birth Date *'}
          </Label>
          <Input
            id="birth-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            required
            className="mt-2"
          />
        </div>

        {/* Birth Time */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="birth-time" className="text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {i18n.language === 'zh' ? '出生时间' : 'Birth Time'}
              {!hasTime && <span className="text-sm text-gray-500 font-normal">
                ({i18n.language === 'zh' ? '可选' : 'Optional'})
              </span>}
            </Label>
          </div>

          <div className="space-y-3">
            <Input
              id="birth-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!hasTime}
              className="mt-1"
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="no-time"
                checked={!hasTime}
                onCheckedChange={(checked) => {
                  setHasTime(!checked);
                  if (checked) setTime('');
                }}
              />
              <label
                htmlFor="no-time"
                className="text-sm text-gray-700 cursor-pointer"
              >
                {i18n.language === 'zh' ? '不知道出生时辰' : 'Don\'t know birth time'}
              </label>
            </div>
          </div>
        </div>

        {/* Birth Location (Optional) */}
        <div>
          <Label htmlFor="birth-location" className="text-base font-medium">
            {i18n.language === 'zh' ? '出生地点 (可选)' : 'Birth Location (Optional)'}
          </Label>
          <Input
            id="birth-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={i18n.language === 'zh' ? '例如: 北京, 中国' : 'e.g., Beijing, China'}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            {i18n.language === 'zh'
              ? '出生地点暂不影响计算结果，仅用于记录'
              : 'Location doesn\'t affect calculation yet, for record only'}
          </p>
        </div>
      </div>

      {date && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-purple-900 mb-1">
                {i18n.language === 'zh' ? '五行推算' : 'Elemental Analysis'}
              </p>
              <p className="text-purple-800">
                {i18n.language === 'zh'
                  ? `出生年份: ${new Date(date).getFullYear()} - 将用于推算你的五行本命属性`
                  : `Birth year: ${new Date(date).getFullYear()} - Used to calculate your elemental nature`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
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
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex-1"
          size="lg"
        >
          {i18n.language === 'zh' ? '下一步' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        {i18n.language === 'zh'
          ? '你的生辰信息仅用于五行计算，不会被保存或分享'
          : 'Your birth info is only used for calculation, not saved or shared'}
      </div>
    </div>
  );
};

export default BirthInfoStep;
