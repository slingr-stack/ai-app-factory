import React, { useState } from 'react';

interface ContactFormProps {
  refreshContacts: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ refreshContacts }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone }),
    });

    setName('');
    setEmail('');
    setPhone('');
    refreshContacts();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Add Contact</button>
    </form>
  );
};

export default ContactForm;
