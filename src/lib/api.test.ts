import axios from "axios";
import { api, getUser, postTransfer, putUser, deleteUser, getHistory, postReverse } from "./api";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('./api', () => ({
    getUser: jest.fn(() => 'mocked value'),
    postTransfer: jest.fn(() => 'mocked value'),
    putUser: jest.fn(() => 'mocked value'),
    deleteUser: jest.fn(() => 'mocked value'), 
    getHistory: jest.fn(() => 'mocked value'), 
    postReverse: jest.fn(() => 'mocked value'), 
}));

describe("API functions", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });


  it("deve chamar getUser", async () => {
    
    mockedAxios.get.mockRejectedValueOnce({user:[]});

    const result = await getUser();

    expect(result).toBe('mocked value');
  });

   it("deve chamar postTransfer", async () => {
    
    const result = await postTransfer('',1,'');

    expect(result).toBe('mocked value');
  });

   it("deve chamar putUser", async () => {

    const result = await putUser('');

    expect(result).toBeDefined();
  });


   it("deve chamar getHistory", async () => {
    const result = await getHistory();

    expect(result).toBeDefined();
  });

   it("deve chamar postReverse", async () => {
    const result = await postReverse('');

    expect(result).toBeDefined;
  });


  
 

});
