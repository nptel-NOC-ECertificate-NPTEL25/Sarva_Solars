import React from 'react';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { FAQItem } from '../../types';

interface AdminFaqsTabProps {
  faqs: FAQItem[];
  onStartCreate: () => void;
  onStartEdit: (faq: FAQItem) => void;
  onDeleteRequest: (id: string, question: string) => void;
}

export const AdminFaqsTab: React.FC<AdminFaqsTabProps> = ({
  faqs,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Frequently Asked Questions ({faqs.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Common questions regarding solar subsidies, net metering, DISCOM approvals, and 25-year performance warranties.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ Item</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                  {faq.category || 'General'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 font-poppins flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                {faq.question}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onStartEdit(faq)}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                title="Edit FAQ"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteRequest(faq.id, faq.question)}
                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                title="Delete FAQ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
