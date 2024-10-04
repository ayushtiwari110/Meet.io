import React from 'react';
import { useUser } from '@clerk/nextjs';

const GoogleCalendarButton = () => {
  const { user } = useUser();

  const handleAddToGoogleCalendar = () => {
    // Logic to add the meeting to Google Calendar
  };

  return (
    <button onClick={handleAddToGoogleCalendar}>
      Add to Google Calendar
    </button>
  );
};

export default GoogleCalendarButton;
