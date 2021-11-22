import { render, screen, fireEvent } from '@testing-library/react';
import ProductListEmployee from '../Site/Employee/ProductList'
import { Container } from 'react-bootstrap';

//Create a descrie block for the test for that component
describe("test the CustomerSelection component", () => {

  //TEST #1
  test('check product row', async () => {

    //Create the array of customer that will be passed to the component itself
  
    //Render the component
    const elemet = render(<ProductListEmployee />);

    /*
    //Trigger the select user event
    const inputElement = screen.getByTitle("select-statement");
    fireEvent.change(inputElement, { target: { value: "pippo franco" } });

    //Check if the function is called once
    expect(mockHandleCustomer).toHaveBeenCalled();

    //Get the first line and check if it works
    //const firstLineTr = await screen.findByTestId("product-item-0");
    */

  });
});