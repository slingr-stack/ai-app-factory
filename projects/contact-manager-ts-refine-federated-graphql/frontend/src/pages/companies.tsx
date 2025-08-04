import React from 'react';
import { useList } from '@pankod/refine-core';
import { List, Table, TableBody, TableCell, TableHead, TableRow } from '@pankod/refine-mui';
import { GET_COMPANIES } from '../graphql/queries';

export const CompaniesList: React.FC = () => {
  const { data } = useList({
    resource: 'companies',
    queryOptions: {
      query: GET_COMPANIES
    }
  });

  return (
    <List>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.companies.map((company: any) => (
            <TableRow key={company.id}>
              <TableCell>{company.id}</TableCell>
              <TableCell>{company.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </List>
  );
};
