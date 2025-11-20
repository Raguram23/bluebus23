import { BusData } from "../controllers/BusData.controller.js"
// Make /busdata public so passengers can search without authentication
export const bus_data=(app)=>{
    app.post('/busdata', BusData)
}