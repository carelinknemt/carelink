import { Star, ShieldCheck, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef } from 'react';
import person1 from '../assets/images/persons/person-1.jpeg';
import person2 from '../assets/images/persons/person-2.jpg';
import person3 from '../assets/images/persons/person-3.png';
import person4 from '../assets/images/persons/person-4.webp';
import person5 from '../assets/images/persons/person-5.jpg';
import person6 from '../assets/images/persons/person-6.webp';
import person7 from '../assets/images/persons/person-7.jpg';

export const SmileThatShine: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const reviews = [
    {
      id: 1,
      author: 'Chris M.',
      initials: 'CM',
      rating: 5,
      date: '2 days ago',
      text: 'Always on time, polite, and highly professional. A lifesaver for dialysis.',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      avatar: person1
    },
    {
      id: 2,
      author: 'Robert K.',
      initials: 'RK',
      rating: 5,
      date: '1 week ago',
      text: 'Wonderful curb-to-curb service. The driver helped my father safely to the car.',
      avatarBg: 'bg-cyan-100 text-cyan-800',
      avatar: person2
    },
    {
      id: 3,
      author: 'Sarah J.',
      initials: 'SJ',
      rating: 5,
      date: '2 weeks ago',
      text: 'Prompt, reliable, and fantastic dispatchers. Highly dependable partners.',
      avatarBg: 'bg-indigo-100 text-indigo-800',
      avatar: person7
    },
    {
      id: 4,
      author: 'Thomas L.',
      initials: 'TL',
      rating: 5,
      date: '3 weeks ago',
      text: 'Excellent communication and patient drivers. Top-notch service!',
      avatarBg: 'bg-pink-100 text-pink-800',
      avatar: person4
    },
    {
      id: 5,
      author: 'Marcus D.',
      role: 'Son of Patient',
      initials: 'MD',
      rating: 5,
      date: '1 month ago',
      text: 'Extremely reliable wheelchair transport. Gives us complete peace of mind.',
      avatarBg: 'bg-amber-100 text-amber-800',
      avatar: person6
    }
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth < 640 ? 280 : 350;
      scrollRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth < 640 ? 280 : 350;
      scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-b border-slate-200/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        
        {/* Title & Google Badge Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs font-black tracking-widest text-[#E64A19] uppercase">
              Patient & Clinical Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#004B87] tracking-tight mt-0.5">
              Google Patient Reviews
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">
              See what our patients and regional healthcare case managers say about Carelink’s safe NEMT services.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* Google Star Rating Summary Widget */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-orange-200/60 shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xl font-black select-none border border-orange-200/40">
                <span className="text-[#E64A19]">G</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-slate-900 leading-none">4.9</span>
                  <div className="flex items-center text-orange-500">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-500" />
                    <Star className="h-4 w-4 fill-orange-400 text-orange-500" />
                    <Star className="h-4 w-4 fill-orange-400 text-orange-500" />
                    <Star className="h-4 w-4 fill-orange-400 text-orange-500" />
                    <Star className="h-4 w-4 fill-orange-400 text-orange-500 opacity-90" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Based on 11+ reviews on Google
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={scrollLeft}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#004B87] shadow-xs border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 hover:text-[#003B6B] transition-all active:scale-95 cursor-pointer"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={scrollRight}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#004B87] shadow-xs border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 hover:text-[#003B6B] transition-all active:scale-95 cursor-pointer"
                aria-label="Next reviews"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Slider Container */}
        <div className="relative w-full overflow-hidden py-2">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth py-4 px-1 no-scrollbar scroll-snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="relative w-[280px] sm:w-[350px] shrink-0 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-300 scroll-snap-align-start"
              >
                <div>
                  {/* Stars and Date Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-0.5 text-orange-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-500" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                  </div>

                  {/* Review Text */}
                  <div className="relative mb-5 text-slate-800 leading-relaxed text-sm sm:text-base font-medium">
                    <Quote className="absolute -top-2.5 -left-1 h-7 w-7 text-slate-100 -z-0 opacity-80" />
                    <p className="relative z-10">{review.text}</p>
                  </div>
                </div>

                {/* Author & Source Row */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden shadow-inner border border-slate-100/40">
                      {review.avatar ? (
                        <img 
                          src={review.avatar} 
                          alt={review.author} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={`flex h-full w-full items-center justify-center font-bold text-xs ${review.avatarBg}`}>
                          {review.initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-none">{review.author}</h4>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">{review.role}</span>
                    </div>
                  </div>
                  
                  {/* No verified badge */}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

