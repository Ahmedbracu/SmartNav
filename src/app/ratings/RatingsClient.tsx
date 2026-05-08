"use client";

import { useState } from "react";
import { Star, MessageSquare, PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { submitReview } from "@/app/actions/review";
import Link from "next/link";

export default function RatingsClient({ isLoggedIn, userId, transports, routes, overallRatings, recentReviews, myReviews }: any) {
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("rating", rating.toString());
    
    const res = await submitReview(userId, formData);
    
    if (res.error) {
      setMsg(res.error);
      setIsError(true);
    } else {
      setMsg(res.success || "Submitted");
      setIsError(false);
      (e.target as HTMLFormElement).reset();
      setRating(3);
    }
    setIsPending(false);
  };

  const renderStars = (val: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`${size} ${i < val ? "text-[#F4B400] fill-[#fbbf24]" : "text-[#30363d]"}`} />
    ));
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] mb-2 font-['Syne'] flex items-center gap-3">
          <Star className="w-8 h-8 text-[#F4B400] fill-[#fbbf24]" />
          Transport Ratings
        </h1>
        <p className="text-[#5F6368]">Community reviews and average ratings for all transport modes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="glass-card">
            <h2 className="text-lg font-bold text-[#202124] mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F4B400]" /> Overview
            </h2>
            <div className="space-y-6">
              {overallRatings.map((r: any) => {
                const pct = r.avg_r ? (r.avg_r / 5) * 100 : 0;
                return (
                  <div key={r._id}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-bold text-sm text-[#202124]">{r.type}</span>
                        <span className="text-[#5F6368] text-xs ml-2">৳{r.base_fare} base · {r.average_speed} km/h</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#F4B400] font-bold">{r.avg_r ? r.avg_r.toFixed(1) : "—"}</span>
                        <span className="text-[#5F6368] text-xs"> / 5 ({r.cnt})</span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex gap-0.5">{renderStars(Math.round(r.avg_r || 0), "w-3 h-3")}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card">
            <h2 className="text-lg font-bold text-[#202124] mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#188038]" /> Recent Reviews
            </h2>
            <div className="space-y-4">
              {recentReviews.length === 0 ? (
                <div className="text-center text-[#5F6368] italic p-4">No reviews yet.</div>
              ) : (
                recentReviews.map((r: any) => (
                  <div key={r._id} className="border-b border-[#DADCE0]/60 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A73E8] to-[#188038] flex items-center justify-center text-xs font-bold text-[#202124]">
                          {r.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#202124]">{r.user_name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#188038]/10 text-[#188038] px-1.5 py-0.5 rounded uppercase font-bold">{r.transport_type}</span>
                            {r.route_name && <span className="text-[10px] bg-[#F4B400]/10 text-[#F4B400] px-1.5 py-0.5 rounded">{r.route_name}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">{renderStars(r.rating, "w-3 h-3")}</div>
                    </div>
                    {r.comment && <p className="text-sm text-[#5F6368] italic">"{r.comment}"</p>}
                    <div className="text-[10px] text-[#5F6368]/50 mt-1">{new Date(r.timestamp).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="glass-card">
            <h2 className="text-lg font-bold text-[#202124] mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#1A73E8]" /> Write a Review
            </h2>
            {!isLoggedIn ? (
              <div className="text-sm text-[#5F6368] text-center p-4 bg-white/60 rounded-lg border border-[#DADCE0]">
                Please <Link href="/login" className="text-[#1A73E8] hover:underline">log in</Link> to submit a review.
              </div>
            ) : (
              <>
                {msg && (
                  <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${isError ? "bg-[#D93025]/10 text-[#D93025]" : "bg-[#1A73E8]/10 text-[#1A73E8]"}`}>
                    {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} {msg}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-[#5F6368] uppercase mb-1 block">Transport Mode</label>
                    <select name="transport_id" required className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-2 text-[#202124] text-sm">
                      <option value="">— Choose transport —</option>
                      {transports.map((t:any) => <option key={t._id} value={t._id}>{t.type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#5F6368] uppercase mb-1 block">Route (Optional)</label>
                    <select name="route_id" className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-2 text-[#202124] text-sm">
                      <option value="">— General review —</option>
                      {routes.map((r:any) => <option key={r._id} value={r._id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#5F6368] uppercase mb-2 block">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star className={`w-8 h-8 ${star <= (hoverRating || rating) ? "text-[#F4B400] fill-[#fbbf24]" : "text-[#30363d]"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#5F6368] uppercase mb-1 block">Comment (Optional)</label>
                    <textarea name="comment" rows={3} className="w-full bg-white/60 border border-[#DADCE0] rounded-lg p-2 text-[#202124] text-sm resize-none" placeholder="Share your experience..." />
                  </div>
                  <button type="submit" disabled={isPending} className="w-full bg-[#F4B400] text-white font-bold py-2 rounded-lg hover:bg-[#d97706] transition-colors text-sm disabled:opacity-50">
                    {isPending ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </div>

          {isLoggedIn && (
            <div className="glass-card">
              <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider mb-4">My Reviews</h2>
              <div className="space-y-4">
                {myReviews.length === 0 ? (
                  <div className="text-sm text-[#5F6368] italic">You haven't reviewed anything yet.</div>
                ) : (
                  myReviews.map((mr: any) => (
                    <div key={mr._id} className="border-b border-[#DADCE0]/60 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-bold text-[#202124] flex items-center gap-2">
                          {mr.transport_type}
                          {mr.route_name && <span className="text-[10px] font-normal text-[#5F6368]">({mr.route_name})</span>}
                        </div>
                        <div className="flex gap-0.5">{renderStars(mr.rating, "w-3 h-3")}</div>
                      </div>
                      {mr.comment && <div className="text-xs text-[#5F6368]">"{mr.comment}"</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
