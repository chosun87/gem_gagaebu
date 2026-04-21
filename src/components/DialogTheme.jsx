import { Sidebar, Button, Card, Divider, InputSwitch, SelectButton, Panel, TreeSelect } from '@/components/PrimeReact';
import { useTheme } from '@/context/ThemeContext';
import { THEME_NODES, INPUT_STYLE_OPTIONS, SCALES } from '@/assets/js/constants_theme';

const selectedThemeTemplate = (themeKey) => {
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

const nodeTemplate = (node) => {
  if (node.children) {
    return (
      <div className="flex align-items-center gap-2 py-1">
        <img
          src={node.iconUrl}
          alt={node.label}
          style={{ width: '20px', height: '20px', objectFit: 'contain' }}
        />
        <span className="font-bold">{node.label}</span>
      </div>
    );
  }

  return (
    <div className="flex align-items-center gap-2 py-1">
      <div
        className="colorChip shadow-1"
        style={{ backgroundColor: node.color }}
      ></div>
      <span>{node.label}</span>
    </div>
  );
};

export default function DialogTheme({ visible, onHide }) {
  const {
    theme, changeTheme,
    scale, set_scale,
    ripple, set_ripple,
    inputStyle, set_inputStyle,
    condensed, set_condensed
  } = useTheme();

  const isDarkMode = theme.includes('dark');
  const isMaterialTheme = theme.startsWith('md-');

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

          <Divider />

          <div className="inputWrap">
            <label htmlFor="darkmode" className="text-lg">다크 모드 (Dark Mode)</label>
            <InputSwitch id="darkmode"
              className="ml-auto"
              tooltip="다크 모드"
              tooltipOptions={{ position: 'left' }}
              checked={isDarkMode} onChange={onDarkModeToggle} />
          </div>

          <Divider />

          <div className="inputWrap">
            <label htmlFor="theme" className="text-lg mb-2">테마</label>
            <TreeSelect id="theme"
              className="themeSelector w-full"
              value={theme}
              options={THEME_NODES}
              onChange={(e) => changeTheme(e.value)}
              placeholder="테마를 선택하세요"
              valueTemplate={() => selectedThemeTemplate(theme)}
              nodeTemplate={nodeTemplate}
              display="comma"
              selectionMode="single"
            />
          </div>

          <div className={!isMaterialTheme ? 'hidden' : ''}>
            <Divider />

            <div className="inputWrap">
              <label htmlFor="condensed" className="text-lg">Condensed</label>
              <InputSwitch id="condensed"
                className="ml-auto"
                tooltip="Material 테마 전용 압축 레이아웃"
                tooltipOptions={{ position: 'left' }}
                checked={condensed} onChange={(e) => set_condensed(e.value)}
              />
            </div>
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
