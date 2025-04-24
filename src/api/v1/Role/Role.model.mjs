import { model, Schema } from 'mongoose';

let Admin_Role_Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

let Admin_Role = model('Admin_Role', Admin_Role_Schema);
export default Admin_Role;
