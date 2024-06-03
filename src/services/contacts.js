import { ContactsCollection } from '../db/models/contact.js';
import mongoose from 'mongoose';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    console.log(
      '\x1b[41m%s\x1b[0m',
      '\nStudent with this ID does not exist!\n',
    );
    return null;
  }
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};
