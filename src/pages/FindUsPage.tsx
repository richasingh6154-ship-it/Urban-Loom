import { useState, type FormEvent } from 'react';
import { Calendar, CheckCircle2, MapPin, PackageCheck } from 'lucide-react';
import { api } from '../api/client';
import type { PopupEvent } from '../types';
import { validateEmail } from '../utils/format';

interface FindUsPageProps {
  events: PopupEvent[];
  onEventsUpdated: (events: PopupEvent[]) => void;
}

export function FindUsPage({ events, onEventsUpdated }: FindUsPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredLocation, setPreferredLocation] = useState(
    events[0] ? `${events[0].city} — ${events[0].campusName}` : 'Delhi NCR — North Campus',
  );
  const [requestType, setRequestType] = useState<
    'Campus Pop-up Interest' | 'Fabric Sample Request'
  >('Campus Pop-up Interest');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSelectCampus = (ev: PopupEvent, mode: 'Campus Pop-up Interest' | 'Fabric Sample Request') => {
    setPreferredLocation(`${ev.city} — ${ev.campusName}`);
    setRequestType(mode);
    setSuccessMsg(null);
    const formEl = document.getElementById('popup-registration-form');
    formEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.registerPopup({
        name: name.trim(),
        email: email.trim(),
        preferredLocation,
        requestType,
        notes: notes.trim() || undefined,
      });
      onEventsUpdated(res.events);
      setSuccessMsg(
        requestType === 'Fabric Sample Request'
          ? `Fabric swatch kit request recorded for ${preferredLocation}. Check ${email} for dispatch confirmation.`
          : `Spot reserved for ${preferredLocation}. We will email stall timings 48 hours prior.`,
      );
      setName('');
      setEmail('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-medium text-[#4B5842]">Find Us Near You</p>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#1A1917] [text-wrap:balance]">
          Campus Pop-Ups &amp; Fabric Touch Bars
        </h1>
        <p className="text-sm sm:text-base text-[#635E56] leading-relaxed">
          We bring Urban Loom physically to university lawns and student festivals across Delhi NCR,
          Dehradun, Mumbai, Bengaluru, and Pune so you can feel fabric weight, check sizing, and
          pre-order without guesswork.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upcoming Campus Events List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-semibold text-[#1A1917]">Upcoming Pop-Up Schedule</h2>

          {events.map((ev) => (
            <article
              key={ev.id}
              className="bg-white border border-[#E2DDD3] rounded-lg p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#4B5842] font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{ev.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                      <Calendar className="w-3.5 h-3.5" />
                      {ev.dateLabel}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-medium text-[#1A1917]">
                    {ev.campusName}
                  </h3>
                  <p className="text-xs text-[#635E56]">
                    {ev.venue} · {ev.timeWindow}
                  </p>
                </div>

                <span className="font-mono tabular-nums text-xs text-[#635E56] shrink-0">
                  {ev.registrationCount} registered
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#635E56] leading-relaxed">{ev.highlights}</p>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectCampus(ev, 'Campus Pop-up Interest')}
                  className="px-4 py-2 text-xs font-medium bg-[#1A1917] text-white rounded-md hover:bg-[#33312D] transition-colors"
                >
                  Register Your Interest
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCampus(ev, 'Fabric Sample Request')}
                  className="px-4 py-2 text-xs font-medium border border-[#D8D1C5] text-[#1A1917] rounded-md hover:bg-[#F7F5F0] transition-colors inline-flex items-center gap-1.5"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-[#4B5842]" />
                  <span>Request a Fabric Sample</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Registration / Fabric Sample Form */}
        <aside
          id="popup-registration-form"
          className="lg:col-span-5 bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-5 lg:sticky lg:top-24"
        >
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl font-medium text-[#1A1917]">
              {requestType === 'Fabric Sample Request'
                ? 'Request a Fabric Swatch Kit'
                : 'Register Your Pop-Up Interest'}
            </h2>
            <p className="text-xs text-[#635E56]">
              Choose whether you want a campus stall reminder or a complimentary organic cotton &amp;
              hemp swatch pack.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFECE6] rounded-md">
            <button
              type="button"
              onClick={() => setRequestType('Campus Pop-up Interest')}
              className={`py-2 text-xs font-medium rounded-sm transition-colors ${
                requestType === 'Campus Pop-up Interest'
                  ? 'bg-white text-[#1A1917] shadow-xs'
                  : 'text-[#635E56]'
              }`}
            >
              Pop-up Interest
            </button>
            <button
              type="button"
              onClick={() => setRequestType('Fabric Sample Request')}
              className={`py-2 text-xs font-medium rounded-sm transition-colors ${
                requestType === 'Fabric Sample Request'
                  ? 'bg-white text-[#1A1917] shadow-xs'
                  : 'text-[#635E56]'
              }`}
            >
              Fabric Sample
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="pop-name" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                Your Name
              </label>
              <input
                id="pop-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohan Verma"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>

            <div>
              <label htmlFor="pop-email" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                Email Address
              </label>
              <input
                id="pop-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@university.ac.in"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>

            <div>
              <label htmlFor="pop-loc" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                Preferred Location
              </label>
              <select
                id="pop-loc"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              >
                {events.map((ev) => {
                  const val = `${ev.city} — ${ev.campusName}`;
                  return (
                    <option key={ev.id} value={val}>
                      {val}
                    </option>
                  );
                })}
                <option value="Host a Pop-up at My College">Host a Pop-up at My College</option>
              </select>
            </div>

            <div>
              <label htmlFor="pop-notes" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                {requestType === 'Fabric Sample Request'
                  ? 'Which fabrics or sizes interest you?'
                  : 'Optional note (club, size preference)'}
              </label>
              <textarea
                id="pop-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Hemp-Linen shirt swatches & size M fit check"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>

            {error && <p className="text-xs text-[#8B2E2E]">{error}</p>}
            {successMsg && (
              <div className="p-3 bg-[#F0F4ED] border border-[#C3D1B8] rounded-md text-xs text-[#2F3B28] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4B5842]" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#4B5842] text-white text-xs font-medium rounded-md hover:bg-[#3B4634] transition-colors disabled:opacity-60"
            >
              {submitting
                ? 'Submitting...'
                : requestType === 'Fabric Sample Request'
                  ? 'Request Free Fabric Swatches'
                  : 'Confirm Pop-Up Interest'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
