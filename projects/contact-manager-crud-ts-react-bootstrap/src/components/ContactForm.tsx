import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ContactFormProps {
  addContact: (contact: Contact) => void;
  editContact: Contact | null;
  updateContact: (contact: Contact) => void;
  setEditContact: React.Dispatch<React.SetStateAction<Contact | null>>;
}

const ContactForm: React.FC<ContactFormProps> = ({ addContact, editContact, updateContact, setEditContact }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  React.useEffect(() => {
    if (editContact) {
      setName(editContact.name);
      setEmail(editContact.email);
      setPhone(editContact.phone);
    } else {
      setName('');
      setEmail('');
      setPhone('');
    }
  }, [editContact]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editContact) {
      updateContact({ id: editContact.id, name, email, phone });
      setEditContact(null);
    } else {
      addContact({ id: uuidv4(), name, email, phone });
    }
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">Phone</label>
        <input type="text" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">{editContact ? 'Update' : 'Add'} Contact</button>
      {editContact && <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditContact(null)}>Cancel</button>}
    </form>
  );
};

export default ContactForm;

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}