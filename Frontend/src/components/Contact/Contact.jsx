import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Contact() {
    const [alert, setAlert] = useState({ message: '', type: '', countdown: 5 });
    const [countdown, setCountdown] = useState(5);
    const [message, setMessage] = useState({
        Bus_number: '',
        name: '',
        email: '',
        contact_number: '',
        message: ''
    });
    const [validation, setValidation] = useState({
        Bus_number: '',
        name: '',
        email: '',
        contact_number: '',
        message: ''
    });

    const token = localStorage.getItem('token');

    const api = axios.create({
        baseURL: 'https://safar-bus-booking-system.onrender.com',
        headers: {
            'x-access-token': token
        }
    });

    const validateInput = (name, value) => {
        let error = '';
        switch (name) {
            case 'Bus_number':
                if (value.trim() === '') {
                    error = 'Bus number is required';
                } else if (!/^\d+$/.test(value)) {
                    error = 'Bus number must be numeric';
                }
                break;
            case 'name':
                if (value.trim() === '') {
                    error = 'Name is required';
                } else if (/\d/.test(value)) {
                    error = 'Name cannot contain numbers';
                }
                break;
            case 'email':
                if (value.trim() === '') {
                    error = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Email is invalid';
                }
                break;
            case 'contact_number':
                if (value.trim() === '') {
                    error = 'Contact number is required';
                } else if (!/^\d{10}$/.test(value)) {
                    error = 'Contact number must be a 10-digit number';
                }
                break;
            case 'message':
                if (value.trim() === '') {
                    error = 'Message is required';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessage({
            ...message,
            [name]: value
        });

        const error = validateInput(name, value);
        setValidation({
            ...validation,
            [name]: error
        });
    };

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        const role = localStorage.getItem("role");
        
        if (role !== 'PASSENGER') {
            setAlert({ message: "Please Login First", type: 'info', countdown: 5 });
            setCountdown(5);
           
        }else{

        // Check if there are any validation errors
        const errors = Object.keys(message).reduce((acc, key) => {
            const error = validateInput(key, message[key]);
            if (error) acc[key] = error;
            return acc;
        }, {});

        if (Object.keys(errors).length > 0) {
            setValidation(errors);
            return;
        }
        
        
        try {
            const response = await api.post('/contact', message);
            console.log(response.data);
            setAlert({ message: "We Will Contact You Soon !", type: 'success', countdown: 5 });
            setCountdown(5);

        } catch (error) {
            console.log("Error while sending!", error);
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    setAlert({ message: "Bus Number Not Exists", type: 'error', countdown: 5 });
                    setCountdown(5);
                } else if (status === 403) {
                    setAlert({ message: "Please Login First", type: 'error', countdown: 5 });
                    setCountdown(5);
                }
            } else {
                setAlert({ message: "An Error Occurred", type: 'error', countdown: 5 });
                    setCountdown(5);
            }
        }}
    };

    useEffect(() => {
        if (alert.message) {
            const interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            const timeout = setTimeout(() => {
                setAlert({ message: '', type: '', countdown: 5 });
            }, 5000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [alert.message]);

    return (
        <div className="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-8">
            <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-12 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Alert Message in the top-right corner with countdown */}
                        {alert.message && (
                            <div
                                className={`absolute top-20 right-4 p-4 text-sm text-white rounded-lg shadow-lg transition-opacity duration-300 ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                role="alert"
                            >
                                {alert.message} — Disappearing in {countdown} seconds
                            </div>
                        )}

                        {/* Contact Info Section */}
                        <div className="p-6 bg-white shadow-md sm:rounded-lg flex flex-col space-y-6">
                            <h1 className="text-2xl sm:text-3xl text-blue-900 font-extrabold tracking-tight">
                                Get in touch:
                            </h1>
                            <p className="text-normal text-lg sm:text-xl font-medium text-gray-700">
                                Fill in the form or reach out through the following options:
                            </p>

                            <div className="flex items-center text-gray-700">
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                    className="w-8 h-8 text-blue-600"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <div className="ml-4 text-md tracking-wide font-semibold">
                                    Kaka Dhaba, Kalyan (E)
                                </div>
                            </div>

                            <div className="flex items-center text-gray-700">
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                    className="w-8 h-8 text-blue-600"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <div className="ml-4 text-md tracking-wide font-semibold">
                                    +91 9876543210
                                </div>
                            </div>

                            <div className="flex items-center text-gray-700">
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                    className="w-8 h-8 text-blue-600"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <div className="ml-4 text-md tracking-wide font-semibold">
                                    info@example.com
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Section */}
                        <form className="p-6 bg-white shadow-md sm:rounded-lg flex flex-col space-y-4" onSubmit={handleMessageSubmit}>
                            <div className="flex flex-col">
                                <label htmlFor="Bus_number" className="hidden">
                                    Bus Number
                                </label>
                                <input
                                    type="text"
                                    name="Bus_number"
                                    value={message.Bus_number}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        // Allow only numeric keys, backspace, and arrow keys
                                        if (!/[\d]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="Bus Number"
                                    className="w-full mt-2 py-3 px-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold focus:border-blue-500 focus:outline-none"
                                />
                                {validation.Bus_number && (
                                    <span className="text-red-500 text-sm">{validation.Bus_number}</span>
                                )}
                            </div>

                            <div className="flex flex-col">
                            <label htmlFor="name" className="hidden">
    Full Name
</label>
<input
    type="text"
    name="name"
    value={message.name}
    onChange={handleChange}
    onKeyDown={(e) => {
        // Allow only alphabetic characters, backspace, and space
        if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
            e.preventDefault();
        }
    }}
    placeholder="Full Name"
    className="w-full mt-2 py-3 px-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold focus:border-blue-500 focus:outline-none"
/>
{validation.name && (
    <span className="text-red-500 text-sm">{validation.name}</span>
)}

                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className="hidden">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={message.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full mt-2 py-3 px-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold focus:border-blue-500 focus:outline-none"
                                />
                                {validation.email && (
                                    <span className="text-red-500 text-sm">{validation.email}</span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="contact_number" className="hidden">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={message.contact_number}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        // Allow only numeric keys, backspace, and arrow keys
                                        if (!/[\d]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="Contact Number"
                                    className="w-full mt-2 py-3 px-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold focus:border-blue-500 focus:outline-none"
                                />
                                {validation.contact_number && (
                                    <span className="text-red-500 text-sm">{validation.contact_number}</span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="message" className="hidden">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={message.message}
                                    onChange={handleChange}
                                    placeholder="Your Message"
                                    className="w-full mt-2 py-3 px-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold focus:border-blue-500 focus:outline-none"
                                    rows="2"
                                ></textarea>
                                {validation.message && (
                                    <span className="text-red-500 text-sm">{validation.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg mt-3 transition ease-in-out duration-300"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
