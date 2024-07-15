import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Mock data for holidays and day orders
const holidays = [
  { date: new Date(2024, 9, 2), name: 'Gandhi Jayanti' },
  // Add more holidays here
];

const dayOrders = [1, 2, 3, 4, 5];

const UniversityCalendarApp = () => {
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [margin, setMargin] = useState(0);

  useEffect(() => {
    // Initialize the calendar with holidays and day orders
    const initialEvents = [];
    let currentDayOrder = 1;
    const startDate = new Date(2024, 7, 1); // August 1, 2024
    const endDate = new Date(2024, 11, 31); // December 31, 2024

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const holiday = holidays.find(h => h.date.getTime() === date.getTime());
      if (holiday) {
        initialEvents.push({
          start: new Date(date),
          end: new Date(date),
          title: `Holiday: ${holiday.name}`,
          isHoliday: true,
        });
      } else if (date.getDay() !== 0 && date.getDay() !== 6) { // Exclude weekends
        initialEvents.push({
          start: new Date(date),
          end: new Date(date),
          title: `Day Order: ${currentDayOrder}`,
          dayOrder: currentDayOrder,
        });
        currentDayOrder = currentDayOrder % 5 + 1;
      }
    }

    setEvents(initialEvents);
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedDate(event.start);
  };

  const handleSubjectChange = (dayOrder, time, subject) => {
    setSubjects(prev => ({
      ...prev,
      [dayOrder]: {
        ...prev[dayOrder],
        [time]: subject,
      },
    }));
  };

  const calculateMargin = () => {
    const totalDays = events.filter(e => !e.isHoliday && e.dayOrder).length;
    const attendedDays = totalDays - Object.keys(subjects).length;
    setMargin(attendedDays);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">University Calendar App</h1>
      <div className="flex">
        <div className="w-3/4 pr-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => ({
              className: event.isHoliday ? 'bg-red-500' : 'bg-blue-500',
            })}
          />
        </div>
        <div className="w-1/4">
          <Card>
            <CardHeader>Selected Date: {selectedDate ? selectedDate.toDateString() : 'None'}</CardHeader>
            <CardContent>
              {selectedDate && events.find(e => e.start.getTime() === selectedDate.getTime() && e.dayOrder) && (
                <div>
                  <h3 className="font-bold mb-2">Subjects for Day Order {events.find(e => e.start.getTime() === selectedDate.getTime()).dayOrder}</h3>
                  {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'].map(time => (
                    <div key={time} className="mb-2">
                      <Label>{time}</Label>
                      <Input
                        type="text"
                        placeholder="Enter subject"
                        value={subjects[events.find(e => e.start.getTime() === selectedDate.getTime()).dayOrder]?.[time] || ''}
                        onChange={(e) => handleSubjectChange(events.find(ev => ev.start.getTime() === selectedDate.getTime()).dayOrder, time, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={calculateMargin} className="mt-4">Calculate Margin</Button>
              {margin > 0 && <p className="mt-2">You can take {margin} days off this semester.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UniversityCalendarApp;
