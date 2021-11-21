import { render, screen, fireEvent } from '@testing-library/react';
import CustomerSelection from '../Site/Employee/CustomerSelection.js'
import { Container } from 'react-bootstrap';

//Create a fake environment for the component (actually useless for the CustomerSelection component but is for test if it works)
const MockComponent = ((props) => {

  return (
    <Container>
      <CustomerSelection customers={props.fake_array} handleCustomer={props.fake_function} />
    </Container>
  );
});

//Create a fake function to test this component
const mockHandleCustomer = jest.fn();

//Create a descrie block for the test for that component
describe("test the CustomerSelection component", () => {

  //TEST #1
  test('check customer presence', () => {

    //Create the array of customer that will be passed to the component itself
    const fake_array = [
      { id: 1, name: "pippo", surname: "franco" },
      { id: 2, name: "pierino", surname: "lapeste" }
    ];

    //Reender the component
    const elemet = render(<MockComponent fake_array={fake_array} fake_function={mockHandleCustomer}/>);

    //Get the elements that contains the two customer names (that shall be present due to the fact that the componet need to show them)
    const pippofranco = screen.getByText('pippo franco');
    const pierinolapeste = screen.getByText('pierino lapeste');

    //Check if the two elements are present in the component
    expect(pippofranco).toBeInTheDocument();
    expect(pierinolapeste).toBeInTheDocument();

  });

  //TEST #2
  test('check if the search input cell is present', () => {

    //Create the array of customer that will be passed to the component itself
    const fake_array = [
      { id: 1, name: "pippo", surname: "franco" },
      { id: 2, name: "pierino", surname: "lapeste" }
    ];

    //Reender the component
    const elemet = render(<MockComponent fake_array={fake_array} fake_function={mockHandleCustomer}/>);

    //Get the input component
    const inputElement = screen.getByPlaceholderText(/Search customer by name/i);

    //Check if it's present
    expect(inputElement).toBeInTheDocument();

  });

  //TEST #3
  test('check if the search input change', () => {

    //Create the array of customer that will be passed to the component itself
    const fake_array = [
      { id: 1, name: "pippo", surname: "franco" },
      { id: 2, name: "pierino", surname: "lapeste" }
    ];

    //Reender the component
    const elemet = render(<MockComponent fake_array={fake_array} fake_function={mockHandleCustomer}/>);

    //Get the input component
    const inputElement = screen.getByPlaceholderText(/Search customer by name/i);

    //Fire the changetext event
    fireEvent.change(inputElement, { target: { value: "pippo" } });

    //Check the value
    expect(inputElement.value).toBe("pippo");

  });

  //TEST #4
  test('check the searchbar', () => {

    //Create the array of customer that will be passed to the component itself
    const fake_array = [
      { id: 1, name: "pippo", surname: "franco" },
      { id: 2, name: "pierino", surname: "lapeste" }
    ];

    //Reender the component
    const elemet = render(<MockComponent fake_array={fake_array} fake_function={mockHandleCustomer}/>);

    //Get the input component
    const inputElement = screen.getByPlaceholderText(/Search customer by name/i);

    //Fire the changetext event
    fireEvent.change(inputElement, { target: { value: "pippo" } });

    //Get the components with the two names (uses qyery so that it didn't rise immediately an error when it founds nothing)
    const pippofranco = screen.queryByText('pippo franco');
    const pierinolapeste = screen.queryByText('pierino lapeste');

    //Check if the two elements are present in the component
    expect(pippofranco).toBeInTheDocument();
    expect(pierinolapeste).not.toBeInTheDocument();
  });

  //TEST #5
  test('check the customer selection', () => {

    //Create the array of customer that will be passed to the component itself
    const fake_array = [
      { id: 1, name: "pippo", surname: "franco" },
      { id: 2, name: "pierino", surname: "lapeste" }
    ];

    //Reender the component
    const elemet = render(<MockComponent fake_array={fake_array} fake_function={mockHandleCustomer} />);

    //Get the options
    const optionsElement = screen.getByText(/---select---/i);

    //Get the input component
    const inputElement = screen.getByTitle("select-statement");

    //Fire event
    fireEvent.change(inputElement, { target: { value: "pippo franco" } });

    //Check if the function is called once
    expect(mockHandleCustomer).toHaveBeenCalled();

  });
});