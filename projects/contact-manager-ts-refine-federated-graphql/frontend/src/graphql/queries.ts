import { gql } from '@apollo/client';

export const GET_CONTACTS = gql`
  query GetContacts($filter: String) {
    contacts(filter: $filter) {
      id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
    }
  }
`;
