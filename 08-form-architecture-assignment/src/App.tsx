import { JobApplicationWizard } from './features/job-application/components/JobApplicationWizard';

export function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="portal-title">Company Careers Portal</h1>
        <p className="portal-subtitle">Job Application Form</p>
      </header>
      <JobApplicationWizard />
    </div>
  );
}

export default App;

