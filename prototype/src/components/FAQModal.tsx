import { X, HelpCircle, ChevronDown, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { FAQS } from '../data/carelinkData';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose, onOpenBooking }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
return null;
}

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-[#004B87] px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-black">Carelink FAQ & Policy Guide</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20 text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Medi-Cal, wheelchair, stretcher, dispatch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-4 py-2 text-xs outline-none focus:border-[#E64A19]"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredFaqs.map((faq, idx) => {
            const isOpenItem = openIndex === idx;

            return (
              <div
                key={faq.id || idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpenItem ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-slate-900 bg-slate-50 hover:bg-orange-50/50 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#E64A19] transition-transform duration-200 shrink-0 ${
                      isOpenItem ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpenItem && (
                  <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-6 rounded-2xl bg-orange-50 p-4 border border-orange-200 text-center text-xs space-y-2">
            <p className="font-black text-[#004B87]">Have a question not listed here?</p>
            <p className="text-slate-600">Carelink Dispatch is reachable in Eureka, CA.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
