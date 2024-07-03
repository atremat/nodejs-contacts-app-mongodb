import { ContactsCollection } from '../db/models/contact.js';
import mongoose from 'mongoose';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  contactsQuery.where('userId').equals(userId);

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async ({ contactId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    console.log(
      '\x1b[41m%s\x1b[0m',
      '\nStudent with this ID does not exist!\n',
    );
    return null;
  }
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });

  return contact;
};

export const addContact = async ({ payload, userId, photo }) => {
  const contact = await ContactsCollection.create({
    ...payload,
    userId,
    photo,
  });
  return contact;
};

export const patchContact = async ({ contactId, contact, userId, photo }) => {
  const result = ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    { ...contact, photo },
    {
      new: true,
    },
  );
  return result;
};

export const deleteContact = async ({ contactId, userId }) => {
  const result = ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return result;
};
