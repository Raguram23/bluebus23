import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddBusForm = () => {
    const [formData, setFormData] = useState({
        Bus_number: '',
        Bus_name: '',
        Number_seat: '',
        Seat_price: '',
        Source: '',
        Destination: '',
        Source_time: '',
        Destination_time: '00:00',
        Bus_type: '',
        Bus_Class: '',
        Timing: '',
        Food_Facility: ''
    });




function selectDayOrNight(time) {
    // Split the time string (e.g., "2:50") into hours and minutes
    const [hours, minutes] = time.split(":")
    
    // Check if time is between 4:00 and 7:00 (inclusive of 4:00 and 7:00)
    if (hours >= 4 && hours < 19){
        formData.Timing='Day'
    } else {
        formData.Timing='Night'
    }
}
selectDayOrNight(formData.Source_time)

    if(formData.Bus_Class == 'Sleeper' ){

      formData.Number_seat=48
    }
    
    if(formData.Bus_Class == 'Sitting' ){

      formData.Number_seat=32
    }

    const locations = [
        "Mumbai", "Delhi", "Bengaluru", "Kolkata", "Chennai", "Hyderabad", "Ahmedabad", "Pune","Thane","Pryagraj","Kalyan","Pune","Nashik","Bhusawal","Jaunpur","Janghai","Pratapgad","Vanarsi","Ayodhya","Ulhasnagar"
        // Add other locations here
    ];

    const [filteredSourceSuggestions, setFilteredSourceSuggestions] = useState([]);
    const [filteredDestinationSuggestions, setFilteredDestinationSuggestions] = useState([]);
    const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

    const handleSourceChange = (e) => {
        const input = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            Source: input
        }));
        const filteredSuggestions = locations.filter(location =>
            location.toLowerCase().startsWith(input.toLowerCase())
        );
        setFilteredSourceSuggestions(filteredSuggestions);
        setShowSourceSuggestions(true);
    };

    const handleDestinationChange = (e) => {
        const input = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            Destination: input
        }));
        const filteredSuggestions = locations.filter(location =>
            location.toLowerCase().startsWith(input.toLowerCase())
        );
        setFilteredDestinationSuggestions(filteredSuggestions);
        setShowDestinationSuggestions(true);
    };

    const handleSourceSelect = (suggestion) => {
        setFormData(prevData => ({
            ...prevData,
            Source: suggestion
        }));
        setShowSourceSuggestions(false);
    };

    const handleDestinationSelect = (suggestion) => {
        setFormData(prevData => ({
            ...prevData,
            Destination: suggestion
        }));
        setShowDestinationSuggestions(false);
    };

    const handleBlurWithDelay = (setStateFunction) => {
        setTimeout(() => setStateFunction(false), 100);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    const [alert, setAlert] = useState({ message: '', type: '', countdown: 5 });
    const [countdown, setCountdown] = useState(5);

    const token = localStorage.getItem('token');
    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'x-access-token': token,
        },
    });
    // if (formData.Seat_price < 0) {
    //     setAlert({ message: "Seat price cannot be negative", type: 'error', countdown: 5 });
    //     return; // Stop submission if seat price is invalid
    // }
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Regular expression to match non-negative integers only (0 or greater, no decimals)
        const validSeatPricePattern = /^\d*$/;
    
        // Prevent negative values and decimals for Seat_price
        if (name === "Seat_price") {
            if (value === '' || validSeatPricePattern.test(value)) {
                setFormData(prevData => {
                    const newData = { ...prevData, [name]: value }; // Update state only if the value is valid
                    
                    // Validate Source_time and Destination_time
                    if (newData.Source_time === newData.Destination_time) {
                        setAlert({ message: "Source time and Destination time cannot be the same", type: 'error', countdown: 5 });
                    }
    
                    return newData;
                });
            } else {
                setAlert({ message: "Price cannot be negative or a decimal", type: 'error' });
                setFormData(prevData => ({
                    ...prevData,
                    Seat_price: '' // Clear the field if an invalid value is entered
                }));
            }
        } else {
            // Update the state for all other fields
            setFormData(prevData => {
                const newData = { ...prevData, [name]: value }; // Update the state
               
                // Validate Source_time and Destination_time
                if (newData.Source_time === newData.Destination_time) {
                    setAlert({ message: "Source time and Destination time cannot be the same", type: 'error', countdown: 5 });
                }
                return newData;
            });
        }
    };
    
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.Source == formData.Destination){
                alert("Source and Destination are not same !")
            }
            const response = await api.post('/addbus', formData);
            setAlert({ message: "Bus Added Successfully!", type: 'success', countdown: 5 });
            setCountdown(5);
        } catch (error) {
            setAlert({ message: "Something went wrong please check !", type: 'error', countdown: 5 });
            setCountdown(5);
            
        }
    };

    useEffect(() => {
        if (alert.message) {
            const interval = setInterval(() => {
                setCountdown(prev => prev - 1);
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



    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    
    //     // Prevent negative values for Seat_price
    //     if (name === "Seat_price" && value < 0) {
    //         setFormData(prevData => ({
    //             ...prevData,
    //             Seat_price: '' // Clear the field if negative value is entered
    //         }));
    //         setAlert({ message: "Price cannot be negative", type: 'error', countdown: 5 });
    //     } else {
    //         setFormData({
    //             ...formData,
    //             [name]: value
    //         });
    //     }
    // };

    return (
        <div className="relative p-4 mt-1 mb-2 max-w-6xl mx-auto bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 shadow-lg rounded-3xl">
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Add New Bus</h2>

            {/* Alert Message in the top-right corner with countdown */}
            {alert.message && (
                <div
                    className={`absolute top-4 right-4 p-4 text-sm text-white rounded-lg shadow-lg transition-opacity duration-300 ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    role="alert"
                >
                    {alert.message +"   !"} 
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="busNumber" className="block text-sm font-semibold text-gray-100">Bus Number</label>
                        <input
                            type="text"
                            id="busNumber"
                            name="Bus_number"
                            value={formData.Bus_number}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="busName" className="block text-sm font-semibold text-gray-100">Bus Name</label>
                        <input
                            type="text"
                            id="busName"
                            name="Bus_name"
                            value={formData.Bus_name}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        />
                    </div>

                    

                    <div>
                        <label htmlFor="pricePerSeats" className="block text-sm font-semibold text-gray-100">Price Per Seat</label>
                        <input
                            type="number"
                            id="pricePerSeats"
                            name="Seat_price"
                            value={formData.Seat_price}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        />
                    </div>

                    {/* Source input with suggestions */}
                    <div className="relative">
                        <label htmlFor="source" className="block text-sm font-semibold text-gray-100">Source</label>
                        <input
                            type="text"
                            id="source"
                            name="Source"
                            value={formData.Source}
                            onChange={handleSourceChange}
                            onFocus={() => setShowSourceSuggestions(true)}
                            onBlur={() => handleBlurWithDelay(setShowSourceSuggestions)}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        />
                        {showSourceSuggestions && (
                            <ul className="bg-white border border-gray-300 mt-1 rounded-lg shadow-lg absolute z-10 max-h-48 overflow-y-auto">
                                {filteredSourceSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onMouseDown={handleMouseDown} // Prevents input blur on click
                                        onClick={() => handleSourceSelect(suggestion)}
                                        className="cursor-pointer hover:bg-gray-200 p-2"
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Destination input with suggestions */}
                    <div className="relative">
                        <label htmlFor="destination" className="block text-sm font-semibold text-gray-100">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            name="Destination"
                            value={formData.Destination}
                            onChange={handleDestinationChange}
                            onFocus={() => setShowDestinationSuggestions(true)}
                            onBlur={() => handleBlurWithDelay(setShowDestinationSuggestions)}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        />
                        {showDestinationSuggestions && (
                            <ul className="bg-white border border-gray-300 mt-1 rounded-lg shadow-lg absolute z-10 max-h-48 overflow-y-auto">
                                {filteredDestinationSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onMouseDown={handleMouseDown} // Prevents input blur on click
                                        onClick={() => handleDestinationSelect(suggestion)}
                                        className="cursor-pointer hover:bg-gray-200 p-2"
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label htmlFor="sourceTime" className="block text-sm font-semibold text-gray-100">Source Time</label>
                        <input
                            type="time"
                            id="sourceTime"
                            name="Source_time"
                            value={formData.Source_time}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="destinationTime" className="block text-sm font-semibold text-gray-100">Destination Time</label>
                        <input
                            type="time"
                            id="destinationTime"
                            name="Destination_time"
                            value={formData.Destination_time}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="busType" className="block text-sm font-semibold text-gray-100">Bus Type</label>
                        <select
                            id="busType"
                            name="Bus_type"
                            value={formData.Bus_type}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        >
                            <option value="" disabled>Select Bus Type</option>
                            <option value="AC">AC</option>
                            <option value="Non-AC">Non-AC</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="busClass" className="block text-sm font-semibold text-gray-100">Bus Class</label>
                        <select
                            id="busClass"
                            name="Bus_Class"
                            value={formData.Bus_Class}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        >
                            <option value="" disabled>Select Bus Class</option>
                            <option value="Sleeper">Sleeper</option>
                            <option value="Sitting">Sitting</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="seats" className="block text-sm font-semibold text-gray-100">Number of Seats</label>
                        <input
                            type="number"
                            id="seats"
                            name="Number_seat"
                            value={formData.Number_seat}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Timing" className="block text-sm font-semibold text-gray-100">Timing</label>
                        <select
                            id="Timing"
                            name="Timing"
                            value={formData.Timing}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
    
                        >
                            <option value="" disabled>Select Bus Timing</option>
                            <option value="Day">Day</option>
                            <option value="Night">Night</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="Food_Facility" className="block text-sm font-semibold text-gray-100">Food Facility</label>
                        <select
                            id="Food_Facility"
                            name="Food_Facility"
                            value={formData.Food_Facility}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                            required
                        >
                            <option value="" disabled>Food Facility</option>
                            <option value="Available">Available</option>
                            <option value="Not Available">Not Available</option>
                        </select>
                    </div>

                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                    >
                        Add Bus
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBusForm;
