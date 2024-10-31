"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaEye, FaPlus } from "react-icons/fa";
import { MdDeleteOutline, MdEditSquare } from "react-icons/md";
import Layout from "@/app/layouts/Layout";
import jwt from "jsonwebtoken";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";



interface Event {
  _id?: string;
  title: string;
  description: string; 
  date: string;
  availableSeats: number;
  totalSeats: number;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEventModalIsOpen, setNewEventModalIsOpen] = useState(false);
  const [updateEventModalIsOpen, setUpdateEventModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [numberOfSeat,setNumberOfSeat] = useState<number>(0);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: '',
    description: '',
    date: '',
    availableSeats: 0,
    totalSeats: 0,
  });
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
      if (token) {
        const decoded = jwt.decode(token);
        setLoggedInUser(decoded);
      }
  }, [token]);

  const fetchEvents = async () => {
    setLoading(true); 
    const response = await fetch("/api/events");
    setLoading(false); 
    const data = await response.json(); 
    if (Array.isArray(data.data)) {
      setEvents(data.data);
    } else {
      setEvents([]);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const openNewEventModal = () => {
    setNewEventModalIsOpen(true);
  };
  const openUpdateEventModal = (event: Event) => {
    setSelectedEvent(event);
    if (selectedEvent) {
      setNewEvent({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date,
        availableSeats: selectedEvent.availableSeats,
        totalSeats: selectedEvent.totalSeats,
      });
      setUpdateEventModalIsOpen(true);
    }
  };
  const handleSeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = Number(value);
    
    if (!isNaN(parsedValue)) {
      setNumberOfSeat(parsedValue);
    }
  };
  const closeNewEventModal = () => {
    setNewEventModalIsOpen(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      availableSeats: 0,
      totalSeats: 0,
    });
  };
  const closeUpdateEventModal = () => {
    setNewEvent({
      title: '',
      description: '',
      date: '',
      availableSeats: 0,
      totalSeats: 0,
    });
    setUpdateEventModalIsOpen(false);
  };

  const handleDelete = async (event:Event) => {
    setSelectedEvent(event);
    if (selectedEvent) {
      setdeleteLoading(true); 
     const response =  await fetch(`/api/events/${selectedEvent._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const text = await response.text();
      let responseData;
  
      try {
        responseData = JSON.parse(text); 
      } catch {
        toast.error("Failed to delete event.");
        return;
      }
      setdeleteLoading(false); 
      if(response.ok){
        toast.success("Event deleted")
      }else{
        toast.error(responseData?.error|| "failed to delete event");
      }
      setEvents((prev) => prev.filter((event) => event._id !== selectedEvent._id));
      closeModal();
    }
  };

  const handleBook = async () => {
    if (selectedEvent) {
      setBookingLoading(true); 
      const response = await fetch(`/api/events/${selectedEvent._id}/book-seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ numberOfSeats: numberOfSeat }), 
      });
      fetchEvents();
      setBookingLoading(false); 
  
      const text = await response.text();
      let responseData;
  
      try {
        responseData = JSON.parse(text); 
      } catch {
        console.error("Error response is not JSON:", text);
        toast.error("Failed to book the event.");
        return;
      }
  
      if (response.ok) {
        toast.success("Booking successful!");
        closeModal();
      } else {
        toast.error(responseData?.error || "Failed to book the event."); 
      }
    }
  };
  

  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
  
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });
  
      const text = await response.text();
      let responseData;
  
      try {
        responseData = JSON.parse(text);
      } catch {
        throw new Error("Failed to parse response.");
      }
  
      if (response.ok) {
        const createdEvent = responseData;
        setEvents((prev) => [...prev, createdEvent]);
        fetchEvents();
        toast.success("New event created!");
        closeNewEventModal();
      } else {
        throw new Error(responseData?.details || "Failed to create new event.");
      }
    } catch (error:any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setAddLoading(false);
    }
  };
  

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
  
    if (!selectedEvent) {
      toast.error("No event selected for update.");
      setUpdateLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`/api/events/${selectedEvent._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });
  
      const text = await response.text();
      let responseData;
  
      try {
        responseData = JSON.parse(text);
      } catch {
        throw new Error("Failed to parse response.");
      }
  
      if (response.ok) {
        const updatedEvent = responseData; 
        setEvents((prev) =>
          prev.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
        );
        fetchEvents();
        toast.success("Event updated!");
        closeUpdateEventModal();
      } else {
        throw new Error(responseData?.details || "Failed to update the event.");
      }
    } catch (error:any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setUpdateLoading(false);
    }
  };
  
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      {loggedInUser && loggedInUser?.role === "admin" && (
        <button
          onClick={openNewEventModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2"
        >
          <FaPlus /> Add New Event
        </button>
      )}

      {loading ? "Loading ..." : (
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Title</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Date</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Available Seats</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Total Seats</th>
              <th className="py-3 px-6 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr className="border-b" key={event._id}>
                <td className="py-4 px-6 text-gray-800">{event.title}</td>
                <td className="py-4 px-6 text-gray-800">
              {new Date(event.date).toLocaleString('default', { weekday: 'long' })}, {new Date(event.date).toLocaleString('default', { month: 'long' })} {new Date(event.date).getDate()}, {new Date(event.date).getFullYear()}
            </td>
                <td className="py-4 px-6 text-gray-800">{event.availableSeats}</td>
                <td className="py-4 px-6 text-gray-800">{event.totalSeats}</td>
                <td className="py-4 px-6 text-gray-800 flex justify-center items-center gap-2">
                  <FaEye size={20} onClick={() => openModal(event)} className="cursor-pointer"/>
                  {loggedInUser && loggedInUser.role === 'admin' && (
                    <>
                      <MdEditSquare size={20} onClick={() => openUpdateEventModal(event)}  className="cursor-pointer"/>
                      {deleteLoading ? "Deleting..." : <MdDeleteOutline size={20} onClick={() => handleDelete(event)} className="cursor-pointer"/>}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {/* Modal for Single event  and booking */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="view event"        
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50">
        {selectedEvent && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
            <p className="mb-2 text-gray-700"> {selectedEvent.description}</p>
            <p className="mb-2 text-gray-700"><b>Hapening on</b> :{new Date(selectedEvent.date).toLocaleString('default', { weekday: 'long' })}, {new Date(selectedEvent.date).toLocaleString('default', { month: 'long' })} {new Date(selectedEvent.date).getDate()}, {new Date(selectedEvent.date).getFullYear()}</p>
            <p className="mb-4 text-gray-700"><b>Available Seats</b>: {selectedEvent.availableSeats}</p>
            <p className="mb-4 text-gray-700"><b>Total Seats</b>: {selectedEvent.totalSeats}</p>
            <p className="text-xl font-semibold text-center mb-4">
              Don't miss! Book your seat now.
            </p>
              <label htmlFor="booking">Number of seat
                <input
                type="text"
                name="title"
                value={numberOfSeat}
                onChange={handleSeatChange}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md mb-4"
                required
              />
              </label>
            <div className="flex gap-4">
              <button
                onClick={handleBook}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                {bookingLoading ? "Booking...": "Book seat"}
              </button>
              <button onClick={closeModal} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Close
            </button>
            </div>
           
          </div>
        )}
      </Modal>

      {/* Modal for Adding New Event  */ }
      <Modal
  isOpen={newEventModalIsOpen}
  onRequestClose={closeNewEventModal}
  contentLabel="Add New Event"
  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
  overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
>
  <form onSubmit={handleNewEventSubmit} className="p-6">
    <h2 className="text-2xl font-bold mb-4">
      {selectedEvent ? "Update Event" : "Add New Event"}
    </h2>
    
    <label className="block mb-2 text-gray-700">
      Title:
      <input
        type="text"
        name="title"
        value={newEvent.title}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
        required
      />
    </label>

    <label className="block mb-2 text-gray-700">
      Description:
      <input
        type="text" 
        name="description"
        value={newEvent.description} 
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
        required
      />
    </label>

    <label className="block mb-2 text-gray-700">
      Date:
      <input
        type="date"
        name="date"
        value={newEvent.date}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
        required
      />
    </label>

    <label className="block mb-2 text-gray-700">
      Available Seats:
      <input
        type="number"
        name="availableSeats"
        value={newEvent.availableSeats}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
        required
      />
    </label>

    <label className="block mb-2 text-gray-700">
      Total Seats:
      <input
        type="number"
        name="totalSeats"
        value={newEvent.totalSeats}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
        required
      />
    </label>

    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 mr-2"
    >
      {addLoading ? "Loading..." : "Add Event"}
    </button>
    
    <button
      onClick={closeNewEventModal}
      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Cancel
    </button>
  </form>
</Modal>


      {/* Modal for  update event*/ }
      <Modal
  isOpen={updateEventModalIsOpen}
  onRequestClose={closeUpdateEventModal}
  contentLabel="Update Event"
  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
  overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
>
  <form onSubmit={handleUpdateEvent} className="p-6">
    <h2 className="text-2xl font-bold mb-4">Update Event</h2>

    <label className="block mb-2 text-gray-700">
      Title:
      <input
        type="text"
        name="title"
        value={newEvent.title}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
      />
    </label>

    <label className="block mb-2 text-gray-700">
      Description:
      <input
        type="text"
        name="description"
        value={newEvent.description}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
      />
    </label>

    <label className="block mb-2 text-gray-700">
      Date:
      <input
        type="date"
        name="date"
        value={newEvent.date}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
      />
    </label>

    <label className="block mb-2 text-gray-700">
      Available Seats:
      <input
        type="number"
        name="availableSeats"
        value={newEvent.availableSeats}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
      />
    </label>

    <label className="block mb-2 text-gray-700">
      Total Seats:
      <input
        type="number"
        name="totalSeats"
        value={newEvent.totalSeats}
        onChange={handleNewEventChange}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
      />
    </label>

    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 mr-2"
    >
      {updateLoading ? "Updating..." : "Update"}
    </button>

    <button
      onClick={closeUpdateEventModal}
      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Cancel
    </button>
  </form>
</Modal>

<ToastContainer/>
    </Layout>
  );
};

export default Events;
