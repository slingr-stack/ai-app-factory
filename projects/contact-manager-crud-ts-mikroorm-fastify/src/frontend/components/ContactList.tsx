import React from 'react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface ContactListProps {
  contacts: Contact[];
  refreshContacts: () => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, refreshContacts }) => {
  const handleDelete = async (id: number) => {
    await fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
    });
    refreshContacts();
  };

  return (
    <ul className="list-group">
      {contacts.map((contact) => (
        <li key={contact.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <div><strong>{contact.name}</strong></div>
            <div>{contact.email}</div>
            <div>{contact.phone}</div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default ContactList;
