import React, { useEffect, useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

const App: React.FC = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    const response = await fetch('/api/contacts');
    const data = await response.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Contact Manager</h1>
      <ContactForm refreshContacts={fetchContacts} />
      <ContactList contacts={contacts} refreshContacts={fetchContacts} />
    </div>
  );
};

export default App;
