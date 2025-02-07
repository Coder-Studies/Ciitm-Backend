import { google } from 'googleapis';
import dotenv from 'dotenv';
doncet.config();

const google_Cliend_ID = process.env.GOOGLE_CLIENT_ID;
const google_Client_Secret = process.env.GOOGLE_CLIENT_SECRET;

export default oauth2Client = new google.auth.OAuth2(
  google_Cliend_ID,
  google_Client_Secret,
  'postmessage'
);
