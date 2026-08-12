import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { JobOpening } from '../types';
import { fetchJobs, submitJobApplication } from '../services/api';

export const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicant, setApplicant] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Solar Design Engineer',
    experience: '1-3 Years',
    message: ''
  });

  useEffect(() => {
    fetchJobs()
      .then((data) => {
        setJobs(data.filter((j) => j.isActive));
        if (data.length > 0) {
          setApplicant((prev) => ({ ...prev, role: data[0].title }));
        }
      })
      .catch((err) => console.error('Failed loading jobs:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (applicant.name && applicant.phone && applicant.email) {
      setSubmitting(true);
      try {
        await submitJobApplication({
          name: applicant.name,
          phone: applicant.phone,
          email: applicant.email,
          role: applicant.role,
          experience: applicant.experience,
          message: applicant.message
        });
        setSubmitted(true);
      } catch (err) {
        alert('Failed submitting application. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Join Our Cleantech Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-poppins">
          Careers at Sarva Solar
        </h1>
        <p className="text-sm text-slate-600">
          Build your career with one of South India's fastest-growing solar EPC companies.
        </p>
      </div>

      {/* Open Positions Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Open Positions Currently</h3>
          <p className="text-xs text-slate-500">You can still send us a general application below for future openings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase">
                    {job.type}
                  </span>
                  {job.department && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {job.department}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-poppins">{job.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{job.location}</span>
                </div>
                <p className="text-xs text-slate-600">{job.desc}</p>
                <p className="text-xs font-bold text-emerald-600">Req: {job.exp}</p>
              </div>
              <a
                href="#apply-form"
                onClick={() => setApplicant((prev) => ({ ...prev, role: job.title }))}
                className="w-full text-center bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800 block"
              >
                Apply for this Position
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Application Form */}
      <div id="apply-form" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 font-poppins text-center">
          Job Application Form
        </h3>

        {submitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-lg font-bold text-emerald-800">Application Submitted!</h4>
            <p className="text-xs text-emerald-700">
              Thank you {applicant.name}. HR team at Sarva Solar will review your details and reach out shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicant.name}
                  onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={applicant.phone}
                  onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={applicant.email}
                  onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Applied Role</label>
                <select
                  value={applicant.role}
                  onChange={(e) => setApplicant({ ...applicant, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.title}>{job.title}</option>
                  ))}
                  <option value="General Application / Other">General Application / Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Experience & Background Note</label>
              <textarea
                rows={3}
                placeholder="Brief summary of your educational qualification and past experience..."
                value={applicant.message}
                onChange={(e) => setApplicant({ ...applicant, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
