import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as apiModule from './api'; // ajuste o caminho para seu arquivo
import { api, getUser, postTransfer, putUser, deleteUser, getHistory, postReverse } from './api';

describe('API functions', () => {
  const mock = new MockAdapter(api);
  

  afterEach(() => {
    mock.reset();
  });

   it('deve retornar valores no getUser', async () => {
    const mockData = {
      userAuthenticated: { id: 1, name: 'User Test' },
      users: [{ id: 2, name: 'Other User' }]
    };

    mock.onGet('/api/user').reply(200, mockData);

    const result = await getUser();
    expect(result).toEqual({
      user: mockData.userAuthenticated,
      users: mockData.users,
    });
  });

  it('deve retornar null quando getUser falhar', async () => {
    mock.onGet('/api/user').reply(500);

    const result = await getUser();

    expect(result).toBeNull();
  });

  it('deve realizar requisição na postTransfer', async () => {
     const mockData = {
      email: 'teste@hotmail.com',
      amount: 1000,
      description:'test'
    };

    mock.onPost('/api/transfer').reply(200, mockData);
    const result = await postTransfer('teste@hotmail.com', 1000, 'test');
    expect(result).toEqual({"amount": 1000, "description": "test", "email": "teste@hotmail.com"});
  });


  it('deve retornar null quando postTransfer falhar', async () => {
    mock.onPost('/api/transfer').reply(500);
    await expect(postTransfer('teste@hotmail.com', 1000, 'test')).rejects.toThrow();
  });

  it('deve realizar requisição na putUser', async () => {
    const mockData = {
      success: true
    };

    mock.onPut('/api/user').reply(200, mockData);
    const result = await putUser('test');
    expect(result).toEqual({"success": true});
  });
  
    it('deve retornar null quando putUser falhar', async () => {
    mock.onPut('/api/user').reply(500);
    await expect(putUser('test')).rejects.toThrow();
  });

    it('deve realizar requisição na deleteUser', async () => {
    const mockData = {
      success: true
    };

    mock.onDelete('/api/user').reply(200, mockData);
    const result = await deleteUser();
    expect(result).toEqual(mockData);
  });
  
    it('deve retornar null quando deleteUser falhar', async () => {
    mock.onPut('/api/user').reply(500);
    await expect(deleteUser()).rejects.toThrow();
  });


  it('deve retornar valores no getHistory', async () => {
  const mockData = {
    success: true
  };

  mock.onGet('/api/history').reply(200, mockData);

  const result = await getHistory();

  expect(result.data).toEqual(mockData);
});


  it('deve retornar null quando getHistory falhar', async () => {
   mock.onGet('/api/history').reply(500);

   await expect(getHistory()).rejects.toThrow();
  });

it('deve realizar requisição na postReverse', async () => {
  const mockData = {
    success: true
  };

  mock.onPost('/api/reverse').reply(200, mockData);
  const result = await postReverse('1213');
  expect(result).toEqual(mockData);
});

  it('deve retornar null quando postReverse falhar', async () => {
    mock.onPost('/api/reverse').reply(500);
    await expect(postReverse('1213')).rejects.toThrow();
  });

});




// import axios from "axios";
// import { api, getUser, postTransfer, putUser, deleteUser, getHistory, postReverse } from "./api";

// jest.mock("axios");
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// jest.mock('./api', () => ({
//     getUser: jest.fn(() => 'mocked value'),
//     postTransfer: jest.fn(() => 'mocked value'),
//     putUser: jest.fn(() => 'mocked value'),
//     deleteUser: jest.fn(() => 'mocked value'), 
//     getHistory: jest.fn(() => 'mocked value'), 
//     postReverse: jest.fn(() => 'mocked value'), 
// }));

// describe("API functions", () => {
  
//   afterEach(() => {
//     jest.clearAllMocks();
//   });


//   it("deve chamar getUser", async () => {
    
//     mockedAxios.get.mockRejectedValueOnce({user:[]});

//     const result = await getUser();

//     expect(result).toBe('mocked value');
//   });

//    it("deve chamar postTransfer", async () => {
    
//     const result = await postTransfer('',1,'');

//     expect(result).toBe('mocked value');
//   });

//    it("deve chamar putUser", async () => {

//     const result = await putUser('');

//     expect(result).toBeDefined();
//   });


//    it("deve chamar getHistory", async () => {
//     const result = await getHistory();

//     expect(result).toBeDefined();
//   });

//    it("deve chamar postReverse", async () => {
//     const result = await postReverse('');

//     expect(result).toBeDefined;
//   });


  
 

// });
