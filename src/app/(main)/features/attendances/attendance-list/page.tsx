"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

const Button = ({ children, className = "", ...props }) => (
  <button className={`rounded-md px-4 py-2 font-medium transition-colors ${className}`} {...props}>
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>
);

const CircularProgress = ({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) => {
  const totalMinutes = hours * 60 + minutes;
  const totalSeconds = totalMinutes * 60 + seconds;
  const workDaySeconds = 8 * 60 * 60;
  const progress = (totalSeconds / workDaySeconds) * 100;
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  return (
    <div className="xs:h-28 xs:w-28 relative h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40">
      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
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
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
          <div
            className="absolute top-1/2 left-1/2 h-4 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full transform bg-blue-600 sm:h-5 sm:w-0.5 md:h-6 md:w-0.5"
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

  const [breakTime] = useState({ hours: 0, minutes: 0, seconds: 55 });

  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

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
    <div className="xs:p-3 min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="xs:text-xl mb-4 px-2 text-lg font-bold text-gray-900 sm:text-2xl md:text-3xl">Attendance</h1>

        {/* Mobile-first responsive grid */}
        <div className="xs:gap-4 mb-5 grid grid-cols-1 gap-3 sm:gap-6">
          {/* Calendar Card - Full width on mobile, spans 2 cols on medium screens */}
          <Card className="xs:p-4 order-1 p-3 sm:col-span-2 sm:p-5 md:p-6 lg:order-1 lg:col-span-1">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="xs:text-base text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">February 2023</h2>
              <Calendar className="xs:h-5 xs:w-5 h-4 w-4 text-gray-500 sm:h-6 sm:w-6" />
            </div>

            <div className="xs:text-sm mb-2 grid grid-cols-7 gap-1 text-xs">
              {weekDays.map((day) => (
                <div key={day} className="xs:p-1.5 p-1 text-center font-medium text-gray-500 sm:p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="xs:text-sm grid grid-cols-7 gap-1 text-xs">
              {calendarDays.map((dayObj, index) => (
                <div
                  key={index}
                  className={`xs:p-1.5 cursor-pointer rounded-md p-1 text-center transition-colors transition-transform duration-150 hover:scale-105 active:scale-95 sm:p-2 ${
                    dayObj.isCurrentMonth
                      ? dayObj.isToday
                        ? "bg-blue-500 font-semibold text-white shadow-md"
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
          <Card className="xs:p-4 xs:min-h-[320px] order-2 flex min-h-[280px] flex-col items-center justify-center p-3 sm:min-h-[360px] sm:p-5 md:p-6 lg:order-2">
            <div className="mb-4 flex-shrink-0 sm:mb-6">
              <CircularProgress hours={workingTime.hours} minutes={workingTime.minutes} seconds={workingTime.seconds} />
            </div>

            <div className="mb-4 flex-shrink-0 text-center sm:mb-6">
              <div className="xs:text-xl mb-1 text-lg font-bold text-gray-900 sm:mb-2 sm:text-2xl md:text-3xl">
                {formatTime(currentTime)}
              </div>
              <div className="xs:text-sm text-xs text-gray-500">Current Time</div>
            </div>

            <div className="xs:text-sm w-full space-y-3 text-xs sm:space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-2">
                <span className="font-medium text-gray-600">Working Hours</span>
                <span className="font-semibold text-blue-600">
                  <span className="xs:inline hidden">
                    {workingTime.hours} Hr {workingTime.minutes} Mins {workingTime.seconds} Secs
                  </span>
                  <span className="xs:hidden">
                    {String(workingTime.hours).padStart(2, "0")}:{String(workingTime.minutes).padStart(2, "0")}:
                    {String(workingTime.seconds).padStart(2, "0")}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-orange-50 p-2">
                <span className="font-medium text-gray-600">Break Hours</span>
                <span className="font-semibold text-orange-600">
                  <span className="xs:inline hidden">
                    {breakTime.hours} Hr {breakTime.minutes} Mins {breakTime.seconds} Secs
                  </span>
                  <span className="xs:hidden">
                    {String(breakTime.hours).padStart(2, "0")}:{String(breakTime.minutes).padStart(2, "0")}:
                    {String(breakTime.seconds).padStart(2, "0")}
                  </span>
                </span>
              </div>
            </div>
          </Card>

          {/* Punch In/Out Card */}
          <Card className="xs:p-4 xs:min-h-[320px] order-3 min-h-[280px] p-3 sm:col-span-2 sm:min-h-[360px] sm:p-5 md:p-6 lg:order-3 lg:col-span-1">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex flex-1 items-center justify-center sm:mb-6">
                <div className="text-center">
                  <div className="xs:h-12 xs:w-12 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 transition-transform hover:scale-105 sm:mb-4 sm:h-16 sm:w-16 md:h-20 md:w-20">
                    <div className="xs:h-6 xs:w-6 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 sm:h-8 sm:w-8 md:h-10 md:w-10">
                      <svg
                        className="xs:h-3 xs:w-3 h-2.5 w-2.5 text-white sm:h-4 sm:w-4 md:h-5 md:w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="xs:text-sm mb-3 px-2 text-xs text-gray-600 sm:mb-4">
                    <span className="hidden sm:inline">Punctuality is the virtue of the bored.</span>
                    <span className="sm:hidden">Stay punctual!</span>
                  </p>
                  <div className="xs:h-10 xs:w-10 mx-auto h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-yellow-400 transition-transform hover:rotate-12">
                      <div className="xs:h-5 xs:w-4 h-4 w-3 rounded-sm bg-green-600 sm:h-6 sm:w-4 md:h-8 md:w-6"></div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  if (isPunchedIn) {
                    setWorkingTime({ hours: 0, minutes: 0, seconds: 0 });
                  }
                  setIsPunchedIn(!isPunchedIn);
                }}
                className={`xs:py-3 xs:text-base w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 sm:py-4 sm:text-lg ${
                  isPunchedIn
                    ? "bg-red-500 shadow-red-200 hover:bg-red-600"
                    : "bg-green-500 shadow-green-200 hover:bg-green-600"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isPunchedIn ? "bg-red-200" : "bg-green-200"}`}></div>
                  {isPunchedIn ? "Punch Out" : "Punch In"}
                </span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Additional responsive info section for larger screens */}
        <div className="my-10 hidden lg:block">
          <div className="grid grid-cols-3 gap-6">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{workingTime.hours + workingTime.minutes / 60}</div>
              <div className="text-sm text-gray-600">Hours Today</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Attendance Rate</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <div className="text-sm text-gray-600">Days This Week</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
