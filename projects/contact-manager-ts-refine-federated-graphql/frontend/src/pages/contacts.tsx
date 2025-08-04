import React from 'react';
import { useList } from '@pankod/refine-core';
import { List, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@pankod/refine-mui';
import { GET_CONTACTS } from '../graphql/queries';

export const ContactsList: React.FC = () => {
  const { data } = useList({
    resource: 'contacts',
    queryOptions: {
      query: GET_CONTACTS
    }
  });

  return (
    <List>
      <TextField label="Filter by Name" />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.contacts.map((contact: any) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.firstName}</TableCell>
              <TableCell>{contact.lastName}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phoneNumber || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </List>
  );
};
