import React from 'react';

interface ContactListProps {
  contacts: Contact[];
  deleteContact: (id: string) => void;
  setEditContact: React.Dispatch<React.SetStateAction<Contact | null>>;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, deleteContact, setEditContact }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(contact => (
          <tr key={contact.id}>
            <td>{contact.name}</td>
            <td>{contact.email}</td>
            <td>{contact.phone}</td>
            <td>
              <button className="btn btn-warning btn-sm me-2" onClick={() => setEditContact(contact)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteContact(contact.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactList;

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}