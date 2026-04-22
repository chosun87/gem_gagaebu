import { useState } from 'react';
import { Sidebar, Button, Card, Divider, InputSwitch, SelectButton, Panel, TreeSelect } from '@/components/PrimeReact';
import { useTheme } from '@/context/ThemeContext';
import { THEME_NODES, INPUT_STYLE_OPTIONS, SCALES } from '@/assets/js/constants_theme';

export default function DialogTheme({ visible, onHide }) {
  const {
    scale, set_scale,
    inputStyle, set_inputStyle,
    ripple, set_ripple,
    theme, changeTheme,
    condensed, set_condensed
  } = useTheme();

  const allThemes = THEME_NODES.flatMap(group => group.children || []);
  const currentThemeNode = allThemes.find(t => {
    const pattern = t.key.replace('{MODE}', '(light|dark)');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(theme);
  });

  const isDarkMode = theme.includes('dark');
  const isMaterialTheme = theme.startsWith('md-');
  const supportsDarkMode = currentThemeNode?.darkMode !== false;

  const onScaleChange = (type) => {
    if (type === 'plus') {
      set_scale(prev => Math.min(prev + 1, 16));
    } else {
      set_scale(prev => Math.max(prev - 1, 12));
    }
  };

  const onDarkModeToggle = (e) => {
    let newTheme = '';
    if (e.value) {
      newTheme = theme.replace('light', 'dark');
    } else {
      newTheme = theme.replace('dark', 'light');
    }
    changeTheme(newTheme);
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateSelectedTheme = (themeKey) => {
    if (!themeKey) return null;

    const allThemes = THEME_NODES.flatMap(group => group.children || []);
    const selectedTheme = allThemes.find(t => t.key === themeKey);

    if (selectedTheme) {
      return (
        <div className="flex align-items-center gap-2">
          <div
            className="colorChip shadow-1"
            style={{ backgroundColor: selectedTheme.color }}
          ></div>
          <span>{selectedTheme.label}</span>
        </div>
      );
    }

    return <span>{themeKey}</span>;
  };

  const templateTreeSelectNode = (node) => {
    if (node.children) {
      return (
        <div className="theme-group">
          {node.iconUrl && <img className="icon"
            src={node.iconUrl}
            alt={node.label}
          />}
          <span className="font-bold">{node.label}</span>
        </div>
      );
    }

    return (
      <div className="theme-item">
        <div
          className="colorChip shadow-1"
          style={{ backgroundColor: node.color }}
        ></div>
        <span>{node.label}</span>
      </div>
    );
  };

  return (
    <Sidebar
      className="dialog-theme w-25rem"
      header={<h3 className="text-2xl">테마 설정</h3>}
      position="right"
      visible={visible}
      onHide={onHide}
    >
      <Panel>
        <div className="formWrap">
          <Divider />

          <div className="inputWrap" style={{ gap: '3rem' }}>
            <label htmlFor="inputStyle" className="text-lg">글씨 크기 ({scale}px)</label>
            <div className="flex align-items-center gap-3">
              <Button icon="pi pi-minus" className="p-button-text p-button-rounded w-2rem h-2rem" disabled={scale === 12}
                onClick={() => onScaleChange('minus')}
              />
              <div className="flex align-items-center gap-2 flex-grow-1">
                {SCALES.map((s) => (
                  <i key={s} className={`${s == scale ? 'pi pi-circle-fill text-primary' : 'pi pi-circle text-200'} text-normal transition-duration-200`} />
                ))}
              </div>
              <Button icon="pi pi-plus" className="p-button-text p-button-rounded w-2rem h-2rem" disabled={scale === 16}
                onClick={() => onScaleChange('plus')}
              />
            </div>
          </div>

          <Divider />

          <div className="inputWrap">
            <label htmlFor="theme" className="text-lg mb-2">테마</label>
            <TreeSelect id="theme"
              className="themeSelector w-full"
              placeholder="테마를 선택하세요"
              display="comma"
              selectionMode="single"
              options={THEME_NODES}
              value={theme}
              nodeTemplate={templateTreeSelectNode}
              valueTemplate={() => templateSelectedTheme(theme)}
              onChange={(e) => {
                let newTheme = e.value;
                if (newTheme.includes('{MODE}')) {
                  newTheme = newTheme.replace('{MODE}', isDarkMode ? 'dark' : 'light');
                }
                changeTheme(newTheme);
              }}
            />
            {/* expandedKeys={expandedKeysTheme}
              onToggle={(e) => setExpandedKeysTheme(e.value)} */}
          </div>

          <Divider />

          <div className="inputWrap">
            <label htmlFor="darkmode" className={!supportsDarkMode ? 'text-lg opacity-50' : 'text-lg'}>
              다크 모드 (Dark Mode)
            </label>
            <InputSwitch id="darkmode"
              className="ml-auto"
              disabled={!supportsDarkMode}
              tooltip="다크 모드"
              tooltipOptions={{ position: 'left' }}
              checked={isDarkMode} onChange={onDarkModeToggle} />
          </div>

          <Divider />

          <div className="inputWrap">
            <label htmlFor="condensed" className={!isMaterialTheme ? 'text-lg opacity-50' : 'text-lg'}>
              Condensed (Material 테마 전용)
            </label>
            <InputSwitch id="condensed"
              className="ml-auto"
              disabled={!isMaterialTheme}
              tooltip="Material 테마 전용 압축 레이아웃"
              tooltipOptions={{ position: 'left' }}
              checked={condensed} onChange={(e) => set_condensed(e.value)}
            />
          </div>

          <Divider />

          <div className="inputWrap" style={{ gap: '3rem' }}>
            <label htmlFor="inputStyle" className="text-lg">입력 스타일</label>
            <SelectButton id="inputStyle"
              value={inputStyle}
              onChange={(e) => set_inputStyle(e.value)}
              options={INPUT_STYLE_OPTIONS}
            />
          </div>

          <Divider />

          <div className="inputWrap">
            <label htmlFor="ripple" className="text-lg">리플 효과 (Ripple Effect)</label>
            <InputSwitch id="ripple"
              className="ml-auto"
              tooltip="리플 효과"
              tooltipOptions={{ position: 'left' }}
              checked={ripple} onChange={(e) => set_ripple(e.value)} />
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
