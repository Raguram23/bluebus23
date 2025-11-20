import { add_bus } from "../models/addbus.models.js";

export const BusData = async (req, res) => {
    const { Source, Destination } = req.body;

    try {
      // Build a case-insensitive query; trim inputs to avoid accidental whitespace mismatches
      const query = {};
      if (Source && typeof Source === 'string') {
        query.Source = { $regex: new RegExp(`^${Source.trim()}$`, 'i') };
      }
      if (Destination && typeof Destination === 'string') {
        query.Destination = { $regex: new RegExp(`^${Destination.trim()}$`, 'i') };
      }

      // If no Source/Destination provided, return all buses
      const data = await add_bus.find(Object.keys(query).length ? query : {});

      if (data && data.length > 0) {
        res.status(200).send(data);
      } else {
        res.status(200).send([]); // return empty array to the frontend for consistent handling
      }
    } catch (err) {
      console.error("Error while fetching data:", err);
      res.status(500).send({
        "Message": "Error while fetching the data!",
        "Error": err.message || "Unknown error occurred",
        "Details": err.stack || "No stack available"
      });
    }
  };