import React from 'react';
import { Refine, AuthProvider } from '@pankod/refine-core';
import { RefineKbar, RefineSnackbarProvider } from '@pankod/refine-mui';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client';
import { ContactsList } from './pages/contacts';
import { CompaniesList } from './pages/companies';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <ApolloProvider client={client}>
      <RefineSnackbarProvider>
        <Refine
          dataProvider={new ApolloDataProvider(client)}
          authProvider={null}
          resources={[
            { name: 'contacts', list: ContactsList },
            { name: 'companies', list: CompaniesList }
          ]}>
          <BrowserRouter>
            <Routes>
              <Route path="/contacts" element={<ContactsList />} />
              <Route path="/companies" element={<CompaniesList />} />
            </Routes>
          </BrowserRouter>
        </Refine>
      </RefineSnackbarProvider>
    </ApolloProvider>
  );
}

export default App;
