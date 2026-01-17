'use client';

import { useState } from 'react';
import { Fixture } from '@/types';
import { generateICalEvent, generateGoogleCalendarUrl, generateOutlookCalendarUrl } from '@/lib/calendar';

interface AddToCalendarProps {
  fixture: Fixture;
}

export default function AddToCalendar({ fixture }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadICal = () => {
    const icalContent = generateICalEvent(fixture);
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cwmbran-celtic-${fixture.matchId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(fixture), '_blank');
    setIsOpen(false);
  };

  const handleOutlookCalendar = () => {
    window.open(generateOutlookCalendarUrl(fixture), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-celtic-blue hover:text-celtic-blue-dark text-sm font-medium"
        aria-label="Add to calendar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Add to Calendar</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
            <div className="py-1">
              <button
                onClick={handleGoogleCalendar}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#4285F4"/>
                </svg>
                Google Calendar
              </button>
              <button
                onClick={handleOutlookCalendar}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0078D4">
                  <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.152-.354.229-.586.229h-8.653v-6.161l1.06 1.06c.154.153.34.229.56.229.218 0 .405-.076.56-.229a.763.763 0 00.229-.56.764.764 0 00-.229-.56l-2.439-2.438a.763.763 0 00-.56-.23.763.763 0 00-.56.23L10.705 12.5a.763.763 0 00-.229.56c0 .22.076.406.229.56.155.153.342.229.56.229.22 0 .406-.076.56-.229l1.06-1.06v6.11H.824a.798.798 0 01-.586-.229A.759.759 0 010 17.865V7.387c0-.23.08-.424.238-.576.158-.152.354-.229.586-.229h22.352c.232 0 .428.077.586.229.158.152.238.346.238.576z"/>
                </svg>
                Outlook
              </button>
              <button
                onClick={handleDownloadICal}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download .ics
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
