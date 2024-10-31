"use client";
import React from "react";
import { FaCalendarAlt, FaUsers, FaTicketAlt } from "react-icons/fa";
import Layout from "@/app/layouts/Layout"; 
import { ToastContainer } from "react-toastify";
import Link from "next/link";

const WelcomePage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-600">Welcome to Event Management System</h1>
          <p className="mt-4 text-lg text-gray-700">
            Your one-stop solution for managing events effortlessly.
          </p>
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            <Link href="/pages/events">
            Get Started
            </Link>
          </button>
        </div>

        {/* Feature Cards */}
        <div className="sm:flex block lg:grid-cols-3 gap-6 ">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center sm:w-[50%] w-full ">
            <FaCalendarAlt size={40} className="text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold">Create Events</h2>
            <p className="mt-2 text-gray-600">
              Easily create and manage your events with just a few clicks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center sm:w-[50%] w-full mt-4">
            <FaTicketAlt size={40} className="text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold">Book tickets </h2>
            <p className="mt-2 text-gray-600">
              Booking tickets to attend the events.
            </p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 text-center ">
          <h2 className="text-2xl font-bold">Ready to start?</h2>
          <p className="mt-2 text-gray-600">
            Login and create an event.
          </p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
           <Link href="/pages/users/login">
           Login
           </Link>
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WelcomePage;
