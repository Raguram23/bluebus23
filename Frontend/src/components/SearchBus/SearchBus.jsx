import React, { useEffect, useState } from 'react';
import TopBar from './BusTopbar';
import FilterOptions from './BusFilter';
import BusCard from './BusCard'
import axios from 'axios';
import { useSelector } from 'react-redux';

const token = localStorage.getItem("token");

// Use local backend during development
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: token ? { 'x-access-token': token } : {},
});

function BusResultsPage() {
  const Source = useSelector(state => state.filter.source);
  const Destination = useSelector(state => state.filter.destination);
  const Date = useSelector(state => state.filter.date);

  const [buses, setBuses] = useState([]);
  const [filters, setFilters] = useState({
    isAC: false,
    isNonAC: false,
    isSleeper: false,
    isSitting: false,
    isDay: false,
    isNight: false,
    isFoodAvailable: false,
    isFoodNotAvailable: false
  });

  // Prompt the user before refreshing the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Custom message for confirmation
      event.preventDefault(); // Standard in modern browsers
      event.returnValue = '';  // For older browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);  // Empty array ensures it only runs on mount and unmount

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await api.post('/busdata', { Source, Destination });
        setBuses(response.data);
      } catch (error) {
        console.error('Error fetching bus data:', error);
      }
    };

    fetchBusData();
  }, [Source, Destination]);

  const filteredBuses = buses.filter((bus) => {
    const matchesAC = filters.isAC && bus.Bus_type === 'AC';
    const matchesNonAC = filters.isNonAC && bus.Bus_type === 'Non-AC';
    const matchesACOrNonAC = (!filters.isAC && !filters.isNonAC) || matchesAC || matchesNonAC;

    const matchesSleeper = filters.isSleeper && bus.Bus_Class === 'Sleeper';
    const matchesSitting = filters.isSitting && bus.Bus_Class === 'Sitting';
    const matchesSleeperorSitting = (!filters.isSleeper && !filters.isSitting) || matchesSleeper || matchesSitting;

    const matchesDay = filters.isDay && bus.Timing === 'Day';
    const matchesNight = filters.isNight && bus.Timing === 'Night';
    const matchesDayorNight = (!filters.isDay && !filters.isNight) || matchesDay || matchesNight;

    const matchesFoodAvailable = filters.isFoodAvailable && bus.Food_Facility === 'Available';
    const matchesFoodNotAvailable = filters.isFoodNotAvailable && bus.Food_Facility === 'Not Available';
    const matchesFoodAvailableOrNot = (!filters.isFoodAvailable && !filters.isFoodNotAvailable) || matchesFoodAvailable || matchesFoodNotAvailable;

    return (
      matchesACOrNonAC &&
      matchesSleeperorSitting &&
      matchesFoodAvailableOrNot &&
      matchesDayorNight
    );
  });

  const hideScrollbarStyle = {
    overflowY: 'scroll',
    scrollbarWidth: 'none', // For Firefox
  };

  const hideScrollbarWebkit = {
    overflowY: 'scroll',
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-blue-400 p-2">
      <TopBar source={Source} destination={Destination} date={Date} />

      <div className="flex mt-32 h-[calc(100vh-64px)]">
        <div className="w-1/4 pr-4 relative h-full">
          <div 
            style={{ ...hideScrollbarStyle, ...hideScrollbarWebkit }}
            className="sticky top-0 bottom-0"
          >
            <FilterOptions filters={filters} setFilters={setFilters} />
          </div>
        </div>

        <div 
          className="w-3/4 flex flex-col space-y-4"
          style={{ ...hideScrollbarStyle, ...hideScrollbarWebkit }}
        >
          {filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <BusCard key={bus._id} bus={bus} />
            ))
          ) : (
            <div>No buses match the selected filters</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusResultsPage;
