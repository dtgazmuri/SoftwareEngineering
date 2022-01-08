import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useState } from "react";
import { UnregisteredUserProductList, UnregisteredProductTable, UnregisteredProductTableRow } from '../Site/Unregistered/undergisteredProductList'
import { Container } from 'react-bootstrap';

import API from '../API.js';
jest.mock('../API.js'); 

import dayjs from 'dayjs';

//################################# UnregisteredProductTableRow #################################/

//Create a descrie block for the test for that component
describe("test the UnregisteredProductTableRow component", () => {

  //Define the pieces necessary for the tests

  //Render the component
  const fake_product = {
    id: 1,
    name: "pizza",
    farmer: {
      name: "paolo",
      surname: "cellamare"
    },
    price: 2.99,
    quantity: 20,
    availability: 42
  };


  //TEST #1
  test('check info showing right', async () => {

    const elemet = render(<UnregisteredProductTableRow productData={fake_product} productIndex={1} />);

    //Check if the elements are showing right
    const prodNameColumn = screen.getByText("pizza");
    const farmerColumn = screen.getByText("paolo cellamare");
    const priceColumn = screen.getByText(/2.99 €/i);
    const availabilityColumn = screen.getByText(/42/i);

    expect(prodNameColumn).toBeInTheDocument();
    expect(farmerColumn).toBeInTheDocument();
    expect(priceColumn).toBeInTheDocument();
    expect(availabilityColumn).toBeInTheDocument();

  });


});




//################################# UnregisteredProductTable #################################//

//Create a descrie block for the test for that component
describe("test the UnregisteredProductTable component", () => {

  const fake_product_list = [
    {
      id: 1,
      name: "pizza",
      farmer: {
        name: "paolo",
        surname: "cellamare"
      },
      price: 2.99,
      quantity: 20,
      availability: 42
    },
    {
      id: 2,
      name: "peperoni",
      farmer: {
        name: "pippo",
        surname: "franco"
      },
      price: 0.80,
      quantity: 10,
      availability: 12
    }
  ];




  //TEST #1
  test('check table elements showing right', async () => {

    //Reender the element
    const elemet = render(<UnregisteredProductTable productList={fake_product_list} />);

    //Check if the elements are showing right
    const prodNameColumn1 = screen.getByText("pizza");
    const farmerColumn1 = screen.getByText("paolo cellamare");
    const priceColumn1 = screen.getByText(/2.99 €/i);
    const availabilityColumn1 = screen.getByText(/42/i);

    expect(prodNameColumn1).toBeInTheDocument();
    expect(farmerColumn1).toBeInTheDocument();
    expect(priceColumn1).toBeInTheDocument();
    expect(availabilityColumn1).toBeInTheDocument();

    const prodNameColumn2 = screen.getByText("peperoni");
    const farmerColumn2 = screen.getByText("pippo franco");
    const priceColumn2 = screen.getByText(/0.80 €/i);
    const availabilityColumn2 = screen.getByText(/12/i);

    expect(prodNameColumn2).toBeInTheDocument();
    expect(farmerColumn2).toBeInTheDocument();
    expect(priceColumn2).toBeInTheDocument();
    expect(availabilityColumn2).toBeInTheDocument();

  });
});


//################################# UnregisteredProductList #################################//

//Create a descrie block for the test for that component
describe("test the UnregisteredProductList component", () => {

  const fake_product_list = [
    {
      id: 1,
      name: "pizza",
      farmer: {
        name: "paolo",
        surname: "cellamare"
      },
      price: 2.99,
      quantity: 20,
      availability: 42
    },
    {
      id: 2,
      name: "peperoni",
      farmer: {
        name: "pippo",
        surname: "franco"
      },
      price: 0.80,
      quantity: 10,
      availability: 12
    }
  ];

  const bad_time = dayjs("2022-01-09T23:30");
  const good_time = dayjs("2022-08-01");


  //TEST #1
  test('check all elements showing right', async () => {

    //Mock the API

    //Define a mock function
    const mockGetProducts = jest.spyOn(API, 'fetchAllProducts');
    const responseBody = fake_product_list;
    mockGetProducts.mockImplementation(() => Promise.resolve(responseBody));
    
    

    //Reender the element
    const elemet = render(<UnregisteredUserProductList time={good_time}/>);

    //Check the basic elements
    expect(screen.getByText(/Product List/i)).toBeInTheDocument();
    expect(screen.getByText(/[Ff]armer/i)).toBeInTheDocument();
    expect(screen.getByText(/[Pp]rice\/[Pp]ackage/i)).toBeInTheDocument();
    expect(screen.getByText(/[Aa]vailability/i)).toBeInTheDocument();



    //Check if the function is called
    await waitFor(() => {
        
      //Check if the elements are showing right
      const prodNameColumn1 = screen.getByText("pizza");
      const farmerColumn1 = screen.getByText("paolo cellamare");
      const priceColumn1 = screen.getByText(/2.99 €/i);
      const availabilityColumn1 = screen.getByText(/42/i);

      expect(prodNameColumn1).toBeInTheDocument();
      expect(farmerColumn1).toBeInTheDocument();
      expect(priceColumn1).toBeInTheDocument();
      expect(availabilityColumn1).toBeInTheDocument();

      const prodNameColumn2 = screen.getByText("peperoni");
      const farmerColumn2 = screen.getByText("pippo franco");
      const priceColumn2 = screen.getByText(/0.80 €/i);
      const availabilityColumn2 = screen.getByText(/12/i);

      expect(prodNameColumn2).toBeInTheDocument();
      expect(farmerColumn2).toBeInTheDocument();
      expect(priceColumn2).toBeInTheDocument();
      expect(availabilityColumn2).toBeInTheDocument();

    });

    
    //Restore the API
    mockGetProducts.mockRestore();

  });

  //TEST #2 
  test('check if the timing message is showing', async () => {

    const bad_time = dayjs("2022-01-09T23:30");   //Time at which the warning need to show

    const elemet = render(<UnregisteredUserProductList time={bad_time}/>);

    //Check if the elements are showing right
    const errorM = screen.getByText(/WARNING/i);
    expect(errorM).toBeInTheDocument();

  });

  //TEST #3
  test('check if the timing message is NOT showing', async () => {

    const good_time = dayjs("2022-08-01");

    const elemet = render(<UnregisteredUserProductList time={good_time} />);

    //Check if the elements are showing right
    const errorM = screen.queryByText(/WARNING/i);
    expect(errorM).not.toBeInTheDocument();

  });

});

/*
UnregisteredUserProductList



*/