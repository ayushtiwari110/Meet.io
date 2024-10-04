import React from 'react';
import { useUser } from '@clerk/nextjs';
import { gapi } from 'gapi-script';

const GoogleCalendarButton = () => {
  const { user } = useUser();

  const handleAddToGoogleCalendar = () => {
    const event = {
      summary: 'New Meeting',
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Los_Angeles',
      },
    };

    gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    }).then((response: any) => {
      console.log('Event created: ', response);
    }).catch((error: any) => {
      console.log('Error creating event: ', error);
    });
  };

  return (
    <button onClick={handleAddToGoogleCalendar}>
      Add to Google Calendar
    </button>
  );
};

export default GoogleCalendarButton;
