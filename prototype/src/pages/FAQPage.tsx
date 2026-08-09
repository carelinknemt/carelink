import { ChevronDown, Search, HelpCircle, Send, CheckCircle2, ArrowLeft, PhoneCall, Calendar } from 'lucide-react';
import React, { useState } from 'react';
import { FAQS, COMPANY_INFO } from '../data/carelinkData';

interface FAQPageProps {
  onOpenBooking: () => void;
  onBackToHome: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenBooking, onBackToHome }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [userQuestion, setUserQuestion] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const categories = ['ALL', 'GENERAL', 'INSURANCE & MEDI-CAL', 'VEHICLES', 'FACILITIES'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'ALL' || faq.category.toUpperCase().includes(selectedCategory);
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userQuestion.trim()) {
return;
}

    setSubmittedMessage(true);
    setTimeout(() => {
      setUserQuestion('');
      setUserEmail('');
      setSubmittedMessage(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        
        {/* Navigation Back Button */}
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#004B87] hover:bg-slate-100 transition-all border border-slate-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="h-4 w-4 text-[#E64A19]" />
            <span>Back to Overview</span>
          </button>
        </div>

        {/* Page Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-[#004B87] p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Carelink Help & Advisory Center
            </h1>
            <p className="text-sm sm:text-base text-orange-100 leading-relaxed">
              Clear answers regarding Medi-Cal coverage, wheelchair ramp assistance, hospital discharge dispatch times, and group transit shuttle rides.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. Medi-Cal, wheelchair, shuttle, dispatch, cost)..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#E64A19] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#E64A19] text-white shadow-md shadow-orange-900/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 space-y-3 border border-slate-200">
              <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
              <p className="text-sm font-semibold">No matching questions found.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-extrabold text-slate-900 hover:text-[#E64A19] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#E64A19] text-xs font-black">
                        Q
                      </span>
                      <span className="text-sm sm:text-base">{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#E64A19]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                      <div className="pl-10 space-y-2">
                        <p>{faq.answer}</p>
                        <span className="inline-block mt-2 text-[10px] font-black text-[#E64A19] bg-orange-100 border border-orange-200/60 px-2.5 py-0.5 rounded-full uppercase">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Submit Custom Question Form */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3 text-[#E64A19]">
            <HelpCircle className="h-6 w-6" />
            <h3 className="text-xl font-black text-slate-900">Have a specific dispatch or route question?</h3>
          </div>

          {submittedMessage ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-sm">Inquiry Sent!</p>
                <p>Carelink Dispatch will review your question and reply within 2 hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAskSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Email or Phone *</label>
                  <input
                    type="text"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="contact@example.com or phone"
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-[#E64A19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic</label>
                  <select className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-[#E64A19]">
                    <option>Medi-Cal Transportation Voucher</option>
                    <option>Hospital Discharge Emergency</option>
                    <option>Out-of-County Long Distance Trip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Question / Trip Detail</label>
                <textarea
                  required
                  rows={3}
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Describe passenger needs, wheel chair requirements, origin, destination..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-[#E64A19]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E64A19] px-6 py-3 text-xs font-black text-white shadow-md shadow-orange-900/20 hover:bg-[#d83f0e] transition-all"
                >
                  <Send className="h-4 w-4 text-orange-200" />
                  <span>Send Advisory Question</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Dispatch Hotline Callout */}
        <div className="rounded-3xl bg-[#004B87] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-black">Need immediate ride dispatch?</h3>
            <p className="text-xs text-orange-100">Speak directly with Carelink dispatch in Eureka, CA.</p>
          </div>
          <div className="flex gap-4">
            <a
              href={`tel:${COMPANY_INFO.dispatchPhone}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-[#004B87] shadow hover:bg-orange-50 transition-colors"
            >
              <PhoneCall className="h-4 w-4 text-[#E64A19]" />
              <span>Call {COMPANY_INFO.dispatchPhone}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
