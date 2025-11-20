import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcryptjs from 'bcryptjs'
import { reg_model } from './models/reg.model.js';
import { server } from './config/server.config.js';
import { reg_route } from './routes/reg.route.js';
import { addbus_route } from './routes/addbus.route.js';
import { login_route } from './routes/login.route.js';
import { contact_data } from './routes/contact.route.js';
import { verify_Mobile } from './routes/verifyMobile.js';
import { heandlecomplain_route } from './routes/handlecomplaits.route.js';
import { delete_route } from './routes/deletebus.route.js';
import { modify_route } from './routes/modify.route.js';
import { bus_data } from './routes/BusData.route.js';
import { Ticket_Conf } from './routes/MyTicket.routes.js';
import { Ticket_status_Route } from './routes/TicketStatus.route.js';
// import { my_Booking } from './controllers/myBooking.controllers.js';
import { myBookingRoute } from './routes/myBooking.routes.js';
import { review_route } from './routes/review.route.js';
import { GmailApi_Route } from './routes/GmailApi.route.js';
import { viewRevenu_router } from './routes/viewRevenu.routes.js';
// import { gmailauth } from './gmailTesting.js';



const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(server.DB_URL)
const db = mongoose.connection
db.on('error', () => {
    console.log("Error while connecting the database !")
})

db.once('open', () => {
    console.log("Database connected successfully !");
    init()
})

const init = async () => {
    const user = await reg_model.findOne({ userType: 'ADMIN' })
    if (user) {
        console.log("Admin is already present ");
        return
    }
    try {
       const admin_user = await reg_model.create({
            name: 'Admin',
            email: 'ADMIN@GMAIL.COM',
            password: bcryptjs.hashSync("admin@123", 8),
            mobNum : 1234567890,
            userType: 'ADMIN'

        })
        console.log('Admin is created ', admin_user);

    }
    catch (error) {
        console.log("Error while creating the admin ",error);

    }


}

reg_route(app)
login_route(app)
contact_data(app)
verify_Mobile(app)
heandlecomplain_route(app)
addbus_route(app)
delete_route(app)
modify_route(app)
bus_data(app)
Ticket_Conf(app)
Ticket_status_Route(app)
myBookingRoute(app)
review_route(app)
GmailApi_Route(app)
viewRevenu_router(app)


app.listen(server.PORT, () => {
    console.log(`Server is running on port ${server.PORT}`);
});
