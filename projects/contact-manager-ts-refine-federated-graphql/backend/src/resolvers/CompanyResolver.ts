import { Query, Resolver } from 'type-graphql';
import axios from 'axios';

interface Company {
  id: string;
  name: string;
}

@Resolver()
export class CompanyResolver {
  @Query(() => [Company])
  async companies(): Promise<Company[]> {
    const response = await axios.get(`${process.env.COMPANIES_API_BASE_URL}`);
    return response.data;
  }
}
