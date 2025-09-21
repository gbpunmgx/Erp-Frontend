"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

// Shadcn UI components
const Button = ({ children, className = "", ...props }) => (
  <button className={`rounded-md px-4 py-2 font-medium transition-colors ${className}`} {...props}>
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>
);

// Move CircularProgress **outside** of AttendanceDashboard
const CircularProgress = ({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) => {
  const totalMinutes = hours * 60 + minutes;
  const totalSeconds = totalMinutes * 60 + seconds;
  const workDaySeconds = 8 * 60 * 60;
  const progress = (totalSeconds / workDaySeconds) * 100;
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  return (
    <div className="relative h-32 w-32">
      <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#3b82f6"
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-16 w-16">
          <div
            className="absolute top-1/2 left-1/2 h-6 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full transform bg-blue-600"
            style={{
              transform: `translate(-50%, -100%) rotate(${(totalMinutes / 60) * 30}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AttendanceDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [workingTime, setWorkingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Optional: breakTime can stay as static if unused
  const [breakTime] = useState({ hours: 0, minutes: 0, seconds: 55 });

  // Always update current time
  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  // Update working time only if punched in
  useEffect(() => {
    if (!isPunchedIn) return;

    const workTimer = setInterval(() => {
      setWorkingTime((prev) => {
        let newSeconds = prev.seconds + 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
        }

        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours += 1;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(workTimer);
  }, [isPunchedIn]);

  // Calendar data for February 2023
  const daysInMonth = 28;
  const firstDayOfWeek = 3;
  const today = 2;
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const generateCalendarDays = () => {
    const days = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: 31 - i, isCurrentMonth: false, isToday: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isToday: day === today,
      });
    }
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({ day, isCurrentMonth: false, isToday: false });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Attendance</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar Card */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">February 2023</h2>
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayObj, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-md p-2 text-center text-sm transition-colors ${
                    dayObj.isCurrentMonth
                      ? dayObj.isToday
                        ? "bg-blue-500 font-semibold text-white"
                        : "text-gray-900 hover:bg-gray-100"
                      : "text-gray-400"
                  } `}
                >
                  {dayObj.day}
                </div>
              ))}
            </div>
          </Card>

          {/* Timer Card */}
          <Card className="flex flex-col items-center justify-center p-6">
            <div className="mb-6">
              <CircularProgress hours={workingTime.hours} minutes={workingTime.minutes} seconds={workingTime.seconds} />
            </div>

            <div className="mb-6 text-center">
              <div className="mb-2 text-2xl font-bold text-gray-900">{formatTime(currentTime)}</div>
              <div className="text-sm text-gray-500">Current Time</div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Working Hours</span>
                <span className="text-sm font-medium text-blue-600">
                  {workingTime.hours} Hr {workingTime.minutes} Mins {workingTime.seconds} Secs
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Break Hours</span>
                <span className="text-sm font-medium text-orange-600">
                  {breakTime.hours} Hr {breakTime.minutes} Mins {breakTime.seconds} Secs
                </span>
              </div>
            </div>
          </Card>

          {/* Punch In/Out Card */}
          <Card className="p-6">
            <div className="flex h-full flex-col">
              <div className="mb-6 flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">Punctuality is the virtue of the bored.</p>
                  <div className="mx-auto h-12 w-12">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-yellow-400">
                      <div className="h-8 w-6 rounded-sm bg-green-600"></div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  if (isPunchedIn) {
                    // Reset timer when punching out
                    setWorkingTime({ hours: 0, minutes: 0, seconds: 0 });
                  }
                  setIsPunchedIn(!isPunchedIn);
                }}
                className={`w-full rounded-md py-3 font-semibold text-white transition-colors ${
                  isPunchedIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isPunchedIn ? "Punch Out" : "Punch In"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
