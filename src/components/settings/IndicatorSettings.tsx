/**
 * Advanced Indicator Settings Component
 * Granular control over all chart indicators with independent styling
 */
import React from 'react';
import { CompactToggleWidget } from './CompactToggleWidget';
import { BarChart } from 'lucide-react';  // or whatever icon you use
import useSettingsStore from '@/stores/settings';

export const IndicatorSettings: React.FC = () => {
  const {
    // CPR master
    enableCPR,
    setEnableCPR,
    cprColor,
    setCprColor,
    cprLineStyle,
    setCprLineStyle,
    cprThickness,
    setCprThickness,
    // R1
    r1Enabled,
    setR1Enabled,
    r1Color,
    setR1Color,
    r1LineStyle,
    setR1LineStyle,
    r1Thickness,
    setR1Thickness,
    // R2
    r2Enabled,
    setR2Enabled,
    r2Color,
    setR2Color,
    r2LineStyle,
    setR2LineStyle,
    r2Thickness,
    setR2Thickness,
    // R3
    r3Enabled,
    setR3Enabled,
    r3Color,
    setR3Color,
    r3LineStyle,
    setR3LineStyle,
    r3Thickness,
    setR3Thickness,
    // S1
    s1Enabled,
    setS1Enabled,
    s1Color,
    setS1Color,
    s1LineStyle,
    setS1LineStyle,
    s1Thickness,
    setS1Thickness,
    // S2
    s2Enabled,
    setS2Enabled,
    s2Color,
    setS2Color,
    s2LineStyle,
    setS2LineStyle,
    s2Thickness,
    setS2Thickness,
    // S3
    s3Enabled,
    setS3Enabled,
    s3Color,
    setS3Color,
    s3LineStyle,
    setS3LineStyle,
    s3Thickness,
    setS3Thickness,
    // BC (Bottom Central)
    bcEnabled,
    setBcEnabled,
    bcColor,
    setBcColor,
    bcLineStyle,
    setBcLineStyle,
    bcThickness,
    setBcThickness,
    // TC (Top Central)
    tcEnabled,
    setTcEnabled,
    tcColor,
    setTcColor,
    tcLineStyle,
    setTcLineStyle,
    tcThickness,
    setTcThickness,
  } = useSettingsStore();

  // Build the list, marking everything except the master as disabled when enableCPR is false
  const cprItems = [
    {
      id: 'enableCPR',
      label: 'Enable CPR',
      checked: enableCPR,
      onChange: setEnableCPR,
      color: cprColor,
      onColorChange: setCprColor,
      lineStyle: cprLineStyle,
      onLineStyleChange: setCprLineStyle,
      thickness: cprThickness,
      onThicknessChange: setCprThickness,
      disabled: false,
    },
    {
      id: 'bc',
      label: 'Bottom Central (BC)',
      checked: bcEnabled,
      onChange: setBcEnabled,
      color: bcColor,
      onColorChange: setBcColor,
      lineStyle: bcLineStyle,
      onLineStyleChange: setBcLineStyle,
      thickness: bcThickness,
      onThicknessChange: setBcThickness,
      disabled: !enableCPR,
    },
    {
      id: 'tc',
      label: 'Top Central (TC)',
      checked: tcEnabled,
      onChange: setTcEnabled,
      color: tcColor,
      onColorChange: setTcColor,
      lineStyle: tcLineStyle,
      onLineStyleChange: setTcLineStyle,
      thickness: tcThickness,
      onThicknessChange: setTcThickness,
      disabled: !enableCPR,
    },
    {
      id: 'r1',
      label: 'Resistance 1 (R1)',
      checked: r1Enabled,
      onChange: setR1Enabled,
      color: r1Color,
      onColorChange: setR1Color,
      lineStyle: r1LineStyle,
      onLineStyleChange: setR1LineStyle,
      thickness: r1Thickness,
      onThicknessChange: setR1Thickness,
      disabled: !enableCPR,
    },
    {
      id: 'r2',
      label: 'Resistance 2 (R2)',
      checked: r2Enabled,
      onChange: setR2Enabled,
      color: r2Color,
      onColorChange: setR2Color,
      lineStyle: r2LineStyle,
      onLineStyleChange: setR2LineStyle,
      thickness: r2Thickness,
      onThicknessChange: setR2Thickness,
      disabled: !enableCPR,
    },
    {
      id: 'r3',
      label: 'Resistance 3 (R3)',
      checked: r3Enabled,
      onChange: setR3Enabled,
      color: r3Color,
      onColorChange: setR3Color,
      lineStyle: r3LineStyle,
      onLineStyleChange: setR3LineStyle,
      thickness: r3Thickness,
      onThicknessChange: setR3Thickness,
      disabled: !enableCPR,
    },
    {
      id: 's1',
      label: 'Support 1 (S1)',
      checked: s1Enabled,
      onChange: setS1Enabled,
      color: s1Color,
      onColorChange: setS1Color,
      lineStyle: s1LineStyle,
      onLineStyleChange: setS1LineStyle,
      thickness: s1Thickness,
      onThicknessChange: setS1Thickness,
      disabled: !enableCPR,
    },
    {
      id: 's2',
      label: 'Support 2 (S2)',
      checked: s2Enabled,
      onChange: setS2Enabled,
      color: s2Color,
      onColorChange: setS2Color,
      lineStyle: s2LineStyle,
      onLineStyleChange: setS2LineStyle,
      thickness: s2Thickness,
      onThicknessChange: setS2Thickness,
      disabled: !enableCPR,
    },
    {
      id: 's3',
      label: 'Support 3 (S3)',
      checked: s3Enabled,
      onChange: setS3Enabled,
      color: s3Color,
      onColorChange: setS3Color,
      lineStyle: s3LineStyle,
      onLineStyleChange: setS3LineStyle,
      thickness: s3Thickness,
      onThicknessChange: setS3Thickness,
      disabled: !enableCPR,
    },
  ];

  return (
    <div className="space-y-4">
      <CompactToggleWidget
        title="CPR & Levels"
        icon={<BarChart className="h-5 w-5" />}
        items={cprItems}
        columns={2}
      />
      {/* …other sections (Pivot Points, etc.) */}
    </div>
  );
};
