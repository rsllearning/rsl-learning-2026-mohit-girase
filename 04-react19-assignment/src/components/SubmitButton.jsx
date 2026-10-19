import { useFormStatus } from 'react-dom';

export function SubmitButton({ defaultLabel = "Register Account" }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className={`btn-primary ${pending ? 'btn-pending' : ''}`}
    >
      {pending ? (
        <span className="button-loading-content">
          <span className="spinner-sm" aria-hidden="true"></span>
          Submitting...
        </span>
      ) : (
        defaultLabel
      )}
    </button>
  );
}
