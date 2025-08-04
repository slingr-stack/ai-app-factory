import React from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

const App: React.FC = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [editContact, setEditContact] = React.useState<Contact | null>(null);

  const addContact = (contact: Contact) => {
    setContacts([...contacts, contact]);
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts(contacts.map(contact => contact.id === updatedContact.id ? updatedContact : contact));
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Contact Manager</h1>
      <ContactForm 
        addContact={addContact} 
        editContact={editContact} 
        updateContact={updateContact} 
        setEditContact={setEditContact} 
      />
      <ContactList 
        contacts={contacts} 
        deleteContact={deleteContact} 
        setEditContact={setEditContact} 
      />
    </div>
  );
};

export default App;

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}