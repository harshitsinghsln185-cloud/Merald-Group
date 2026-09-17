import React, { useState } from 'react';
import { X, KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/auth.service';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentMsg, setSentMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await authService.forgotPassword(email);
      setSentMsg(res.message);
    } catch (err: any) {
      setSentMsg(`Password reset instructions dispatched to ${email}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 max-w-md relative">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)] mb-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <span>Reset Admin Password</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sentMsg ? (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-xs text-slate-300 leading-relaxed">{sentMsg}</p>
            <button
              onClick={onClose}
              className="glass-button w-full py-2.5 text-xs font-bold rounded-xl"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your corporate administrator email address to receive secure password recovery instructions.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@meraldgroup.com"
                  required
                  className="glass-input pl-10"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="glass-button-secondary text-xs py-2 px-4 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="glass-button text-xs py-2 px-5 rounded-xl"
              >
                {loading ? 'Sending Request...' : 'Send Recovery Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
