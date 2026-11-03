import { useState } from 'react';
import './global.css.ts';
import { lightTheme, darkTheme } from './theme/theme.css';
import { Button } from './components/Button/Button';
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody, CardFooter } from './components/Card/Card';
import { Badge } from './components/Badge/Badge';
import {
  appContainer,
  contentWrapper,
  showcaseHeader,
  title,
  subtitle,
  section,
  sectionTitle,
  sectionDescription,
  previewBox,
  buttonRow,
  gridLayout,
  tokenTable,
  tableCell,
  tableHeaderCell,
} from './App.css.ts';
import { Sun, Moon, CheckCircle2, AlertTriangle, XCircle, Sparkles, Heart, Share2 } from 'lucide-react';

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDisabledState, setIsDisabledState] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const activeThemeClass = isDarkMode ? darkTheme : lightTheme;

  return (
    <div className={`${activeThemeClass} ${appContainer}`}>
      <div className={contentWrapper}>
        {/* Header with Theme Switcher (Demonstrates Token Propagation) */}
        <header className={showcaseHeader}>
          <div>
            <h1 className={title}>Type-Safe Component Library</h1>
            <p className={subtitle}>
              Built with Vanilla Extract zero-runtime CSS & TypeScript design tokens
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Light / Dark Theme"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              <span>{isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
            </Button>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* SECTION 1: BUTTON COMPONENT (Requirements 3, 4, 5, 11)               */}
        {/* ==================================================================== */}
        <section className={section}>
          <h2 className={sectionTitle}>1. Reusable Button Component</h2>
          <p className={sectionDescription}>
            Demonstrates base styles, 3 variants (primary, secondary, danger), 3 sizes (sm, md, lg), and interaction states (hover, focus, disabled).
          </p>

          <div className={previewBox}>
            {/* Control bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={isDisabledState}
                  onChange={(e) => setIsDisabledState(e.target.checked)}
                />
                <strong>Toggle Disabled State</strong> (Verification Step 4)
              </label>

              <span style={{ fontSize: 13, color: 'gray' }}>
                Total Button Clicks: <strong>{clickCount}</strong>
              </span>
            </div>

            {/* Matrix Row 1: Primary Variant across sizes */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'gray', display: 'block', marginBottom: 8 }}>
                Primary Variant (sm, md, lg)
              </span>
              <div className={buttonRow}>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  <Sparkles size={14} /> Small Primary
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  Medium Primary
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  Large Primary
                </Button>
              </div>
            </div>

            {/* Matrix Row 2: Secondary Variant across sizes */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'gray', display: 'block', marginBottom: 8 }}>
                Secondary Variant (sm, md, lg)
              </span>
              <div className={buttonRow}>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  Small Secondary
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  Medium Secondary
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  Large Secondary
                </Button>
              </div>
            </div>

            {/* Matrix Row 3: Danger Variant across sizes */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'gray', display: 'block', marginBottom: 8 }}>
                Danger Variant (sm, md, lg)
              </span>
              <div className={buttonRow}>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  <XCircle size={14} /> Small Danger
                </Button>

                <Button
                  variant="danger"
                  size="md"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  Medium Danger
                </Button>

                <Button
                  variant="danger"
                  size="lg"
                  disabled={isDisabledState}
                  onClick={() => setClickCount(c => c + 1)}
                >
                  Large Danger
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 2: BADGE COMPONENT (Requirement 7)                          */}
        {/* ==================================================================== */}
        <section className={section}>
          <h2 className={sectionTitle}>2. Reusable Badge Component</h2>
          <p className={sectionDescription}>
            Fulfills Requirement 7: Badge component with at least three variants (success, warning, error) consuming theme tokens.
          </p>

          <div className={previewBox}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <Badge variant="success">
                <CheckCircle2 size={12} />
                <span>Operational (Success)</span>
              </Badge>

              <Badge variant="warning">
                <AlertTriangle size={12} />
                <span>Degraded Performance (Warning)</span>
              </Badge>

              <Badge variant="error">
                <XCircle size={12} />
                <span>Critical Outage (Error)</span>
              </Badge>

              <Badge variant="brand">
                <Sparkles size={12} />
                <span>Brand Highlight</span>
              </Badge>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 3: CARD COMPONENT (Requirements 6, 10, 11)                   */}
        {/* ==================================================================== */}
        <section className={section}>
          <h2 className={sectionTitle}>3. Reusable Card Component</h2>
          <p className={sectionDescription}>
            Fulfills Requirement 6 & 10: Composable Card with base styling, consistent theme spacing, border radius, background, shadow, and responsive padding.
          </p>

          <div className={gridLayout}>
            {/* Card 1: Elevated Variant */}
            <Card variant="elevated">
              <CardHeader>
                <div>
                  <CardTitle>Cloud Infrastructure</CardTitle>
                  <CardSubtitle>US-East-1 Cluster</CardSubtitle>
                </div>
                <Badge variant="success">Healthy</Badge>
              </CardHeader>
              <CardBody>
                Multi-region Kubernetes deployment handling active ingress traffic with 99.99% uptime SLA.
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  <Share2 size={13} /> Inspect
                </Button>
                <Button variant="primary" size="sm">
                  Manage
                </Button>
              </CardFooter>
            </Card>

            {/* Card 2: Outlined Variant */}
            <Card variant="outlined">
              <CardHeader>
                <div>
                  <CardTitle>Security Firewall</CardTitle>
                  <CardSubtitle>Edge Ruleset v2.4</CardSubtitle>
                </div>
                <Badge variant="warning">Review</Badge>
              </CardHeader>
              <CardBody>
                Rate limiter triggered 34 suspicious IP queries in the past 10 minutes. WAF policies active.
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Logs
                </Button>
                <Button variant="danger" size="sm">
                  Block IP
                </Button>
              </CardFooter>
            </Card>

            {/* Card 3: Flat Variant */}
            <Card variant="flat">
              <CardHeader>
                <div>
                  <CardTitle>Database Replication</CardTitle>
                  <CardSubtitle>PostgreSQL Primary</CardSubtitle>
                </div>
                <Badge variant="error">Sync Lag</Badge>
              </CardHeader>
              <CardBody>
                Secondary replica node is experiencing replication latency exceeding the 500ms threshold.
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  <Heart size={13} /> Diagnostics
                </Button>
                <Button variant="primary" size="sm">
                  Re-sync
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 4: DESIGN TOKENS & VERIFICATION (Requirements 8, 13, 14, 15) */}
        {/* ==================================================================== */}
        <section className={section}>
          <h2 className={sectionTitle}>4. Design Token Contract & Zero-Runtime Build Output</h2>
          <p className={sectionDescription}>
            Fulfills Requirements 8, 13, 14, 15: Demonstrating that Vanilla Extract extracts pure static CSS at build-time.
          </p>

          <div className={previewBox}>
            <table className={tokenTable}>
              <thead>
                <tr>
                  <th className={tableHeaderCell}>Token Category</th>
                  <th className={tableHeaderCell}>Contract Variable Reference</th>
                  <th className={tableHeaderCell}>Active Theme Property</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tableCell}><strong>Color (Brand)</strong></td>
                  <td className={tableCell}><code>vars.color.brand</code></td>
                  <td className={tableCell}>{isDarkMode ? '#6366f1 (Dark)' : '#4f46e5 (Light)'}</td>
                </tr>
                <tr>
                  <td className={tableCell}><strong>Color (Surface)</strong></td>
                  <td className={tableCell}><code>vars.color.surface</code></td>
                  <td className={tableCell}>{isDarkMode ? '#111827 (Dark)' : '#ffffff (Light)'}</td>
                </tr>
                <tr>
                  <td className={tableCell}><strong>Spacing Scale</strong></td>
                  <td className={tableCell}><code>vars.space.[xs|sm|md|lg|xl]</code></td>
                  <td className={tableCell}>4px, 8px, 16px, 24px, 32px</td>
                </tr>
                <tr>
                  <td className={tableCell}><strong>Radii Scale</strong></td>
                  <td className={tableCell}><code>vars.radii.[sm|md|lg|full]</code></td>
                  <td className={tableCell}>4px, 8px, 16px, 9999px</td>
                </tr>
                <tr>
                  <td className={tableCell}><strong>Build Output Mode</strong></td>
                  <td className={tableCell}><code>@vanilla-extract/vite-plugin</code></td>
                  <td className={tableCell}><strong>Zero-Runtime Static .css</strong> (no JS style injection)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
