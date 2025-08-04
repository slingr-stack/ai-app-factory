import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

const IndexPage: React.FC = () => {
  const utils = trpc.useContext();
  const contacts = trpc.contact.getAll.useQuery();
  const addContact = trpc.contact.add.useMutation({
    onSuccess: () => utils.contact.getAll.invalidate(),
  });
  const deleteContact = trpc.contact.delete.useMutation({
    onSuccess: () => utils.contact.getAll.invalidate(),
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContact.mutate({ name, email, phone });
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Contact Manager</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          className="border rounded p-2 mb-4"
          type="text" 
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input 
          className="border rounded p-2 mb-4"
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          className="border rounded p-2 mb-4"
          type="text" 
          placeholder="Phone" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">Add Contact</button>
      </form>
      <ul>
        {contacts.data?.map(contact => (
          <li key={contact.id} className="mb-2">
            <span>{contact.name} - {contact.email} - {contact.phone}</span>
            <button 
              className="ml-4 text-red-500"
              onClick={() => deleteContact.mutate({ id: contact.id })}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IndexPage;
