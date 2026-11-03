import { useState } from 'react';
import './global.css.ts';
import { lightTheme, darkTheme } from './theme/theme.css';
import { vars } from './theme/contract.css';
import { Button } from './components/Button/Button';
import type { ButtonSize } from './components/Button/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardFooter,
} from './components/Card/Card';
import { Badge } from './components/Badge/Badge';
import {
  appContainer,
  contentWrapper,
  showcaseHeader,
  brandBadge,
  brandDot,
  title,
  subtitle,
  section,
  sectionHeader,
  sectionTitle,
  sectionDescription,
  previewBox,
  toolbar,
  toolbarGroup,
  controlLabel,
  buttonRow,
  cardGrid,
  swatchGrid,
  swatchCard,
  swatchColorPill,
  swatchName,
  swatchMeta,
  tokenScaleRow,
  tokenScaleLabel,
  tokenScaleBar,
} from './App.css.ts';
import {
  Sun,
  Moon,
  Sparkles,
  Share2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  Layers,
  Database,
  Sliders,
} from 'lucide-react';

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDisabledState, setIsDisabledState] = useState(false);
  const [activeSize, setActiveSize] = useState<ButtonSize>('md');

  const activeThemeClass = isDarkMode ? darkTheme : lightTheme;

  return (
    <div className={`${activeThemeClass} ${appContainer}`}>
      <div className={contentWrapper}>
        {/* Navigation / Header */}
        <header className={showcaseHeader}>
          <div>
            <div className={brandBadge}>
              <span className={brandDot} />
              <span>Kinetic UI • Design System</span>
            </div>
            <h1 className={title}>Component Studio</h1>
            <p className={subtitle}>
              Zero-runtime type-safe design tokens and composable UI primitives
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle color theme"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </Button>
          </div>
        </header>

        {/* 1. BUTTON COMPONENT WORKBENCH */}
        <section className={section}>
          <div className={sectionHeader}>
            <div>
              <h2 className={sectionTitle}>Button Primitives</h2>
              <p className={sectionDescription}>
                Stateful action controls with variant styling, size scaling, and focus indicators
              </p>
            </div>
          </div>

          <div className={previewBox}>
            {/* Interactive Workbench Toolbar */}
            <div className={toolbar}>
              <div className={toolbarGroup}>
                <Sliders size={14} style={{ color: 'gray' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Active Size:</span>
                {(['sm', 'md', 'lg'] as ButtonSize[]).map((size) => (
                  <Button
                    key={size}
                    variant={activeSize === size ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setActiveSize(size)}
                  >
                    {size.toUpperCase()}
                  </Button>
                ))}
              </div>

              <div className={toolbarGroup}>
                <label className={controlLabel}>
                  <input
                    type="checkbox"
                    checked={isDisabledState}
                    onChange={(e) => setIsDisabledState(e.target.checked)}
                  />
                  <span>Disabled State</span>
                </label>
              </div>
            </div>

            {/* Live Interactive Action Preview */}
            <div className={buttonRow}>
              <Button
                variant="primary"
                size={activeSize}
                disabled={isDisabledState}
              >
                <Sparkles size={14} />
                <span>Primary Action</span>
              </Button>

              <Button
                variant="secondary"
                size={activeSize}
                disabled={isDisabledState}
              >
                <Share2 size={14} />
                <span>Secondary Action</span>
              </Button>

              <Button
                variant="danger"
                size={activeSize}
                disabled={isDisabledState}
              >
                <Trash2 size={14} />
                <span>Danger Action</span>
              </Button>
            </div>
          </div>
        </section>

        {/* 2. BADGE COMPONENT GALLERY */}
        <section className={section}>
          <div className={sectionHeader}>
            <div>
              <h2 className={sectionTitle}>Status Badges</h2>
              <p className={sectionDescription}>
                Micro-indicators for operational health, telemetry alerts, and system state
              </p>
            </div>
          </div>

          <div className={previewBox}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <Badge variant="success">
                <CheckCircle2 size={12} />
                <span>Operational</span>
              </Badge>

              <Badge variant="warning">
                <AlertTriangle size={12} />
                <span>Degraded Service</span>
              </Badge>

              <Badge variant="error">
                <XCircle size={12} />
                <span>Cluster Outage</span>
              </Badge>

              <Badge variant="brand">
                <Sparkles size={12} />
                <span>Production Tier</span>
              </Badge>
            </div>
          </div>
        </section>

        {/* 3. CARD COMPONENT DECK */}
        <section className={section}>
          <div className={sectionHeader}>
            <div>
              <h2 className={sectionTitle}>Card Containers</h2>
              <p className={sectionDescription}>
                Composite structured views with header, body, footer, and elevation levels
              </p>
            </div>
          </div>

          <div className={cardGrid}>
            {/* Card 1: Elevated */}
            <Card variant="elevated">
              <CardHeader>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Cpu size={14} />
                    <CardTitle>Edge Compute Node</CardTitle>
                  </div>
                  <CardSubtitle>us-east-virginia • Cluster 04</CardSubtitle>
                </div>
                <Badge variant="success">Active</Badge>
              </CardHeader>
              <CardBody>
                Autonomous serverless runtime processing edge routing and request dispatch with 99.99% availability.
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Metrics
                </Button>
                <Button variant="primary" size="sm">
                  Deploy
                </Button>
              </CardFooter>
            </Card>

            {/* Card 2: Outlined */}
            <Card variant="outlined">
              <CardHeader>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Layers size={14} />
                    <CardTitle>Traffic Gateway</CardTitle>
                  </div>
                  <CardSubtitle>Policy Ruleset v3.1</CardSubtitle>
                </div>
                <Badge variant="warning">Throttled</Badge>
              </CardHeader>
              <CardBody>
                Rate limiter actively mitigating sudden burst spikes across upstream microservice gateways.
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Rules
                </Button>
                <Button variant="primary" size="sm">
                  Adjust
                </Button>
              </CardFooter>
            </Card>

            {/* Card 3: Flat */}
            <Card variant="flat">
              <CardHeader>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Database size={14} />
                    <CardTitle>PostgreSQL Replica</CardTitle>
                  </div>
                  <CardSubtitle>db-node-09 • Frankfurt</CardSubtitle>
                </div>
                <Badge variant="error">Sync Lag</Badge>
              </CardHeader>
              <CardBody>
                Write-ahead replication buffer lag exceeds thresholds. Automatic warm failover node initiated.
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Logs
                </Button>
                <Button variant="danger" size="sm">
                  Failover
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 4. DESIGN TOKEN SHOWCASE */}
        <section className={section}>
          <div className={sectionHeader}>
            <div>
              <h2 className={sectionTitle}>Design Token Foundation</h2>
              <p className={sectionDescription}>
                Contract-enforced color themes, spacing primitives, and geometry tokens
              </p>
            </div>
          </div>

          <div className={previewBox}>
            {/* Color swatches */}
            <div className={swatchGrid} style={{ marginBottom: 24 }}>
              <div className={swatchCard}>
                <div
                  className={swatchColorPill}
                  style={{ backgroundColor: vars.color.brand }}
                />
                <span className={swatchName}>Brand Accent</span>
                <span className={swatchMeta}>vars.color.brand</span>
              </div>

              <div className={swatchCard}>
                <div
                  className={swatchColorPill}
                  style={{ backgroundColor: vars.color.surface }}
                />
                <span className={swatchName}>Surface Container</span>
                <span className={swatchMeta}>vars.color.surface</span>
              </div>

              <div className={swatchCard}>
                <div
                  className={swatchColorPill}
                  style={{ backgroundColor: vars.color.surfaceElevated }}
                />
                <span className={swatchName}>Elevated Surface</span>
                <span className={swatchMeta}>vars.color.surfaceElevated</span>
              </div>

              <div className={swatchCard}>
                <div
                  className={swatchColorPill}
                  style={{ backgroundColor: vars.color.border }}
                />
                <span className={swatchName}>Subtle Border</span>
                <span className={swatchMeta}>vars.color.border</span>
              </div>
            </div>

            {/* Spacing & Radii Scales */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                paddingTop: 16,
                borderTop: `1px solid ${vars.color.border}`,
              }}
            >
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 12 }}>
                  Spacing Primitive Scale
                </span>
                {[
                  { label: 'xs (4px)', width: '12%' },
                  { label: 'sm (8px)', width: '25%' },
                  { label: 'md (16px)', width: '50%' },
                  { label: 'lg (24px)', width: '75%' },
                  { label: 'xl (32px)', width: '100%' },
                ].map((item) => (
                  <div key={item.label} className={tokenScaleRow}>
                    <span className={tokenScaleLabel}>{item.label}</span>
                    <div style={{ flex: 1, backgroundColor: vars.color.surfaceElevated, height: 8, borderRadius: 4 }}>
                      <div className={tokenScaleBar} style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <span style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 12 }}>
                  Border Radius Scale
                </span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {[
                    { label: 'sm', radius: vars.radii.sm },
                    { label: 'md', radius: vars.radii.md },
                    { label: 'lg', radius: vars.radii.lg },
                    { label: 'full', radius: vars.radii.full },
                  ].map((r) => (
                    <div
                      key={r.label}
                      style={{
                        width: 54,
                        height: 54,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: vars.color.surfaceElevated,
                        border: `1px solid ${vars.color.border}`,
                        borderRadius: r.radius,
                        fontSize: 11,
                        fontFamily: 'monospace',
                        color: vars.color.textMuted,
                      }}
                    >
                      {r.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
