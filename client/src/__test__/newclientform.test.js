import { render, screen, fireEvent } from '@testing-library/react';
import { SignupForm } from '../Site/Employee/newclientform.js'

import { BrowserRouter } from 'react-router-dom';

import { waitFor } from '@testing-library/dom';



const mockHandleClose = jest.fn();
const mockAddClient = jest.fn();


//Create a fake environment for the component (actually useless for the CustomerSelection component but is for test if it works)
const MockComponent = ((props) => {

    return (
      <BrowserRouter>
        <SignupForm show={props.show} addClient={props.addClient} handleClose={props.handleClose}/>
      </BrowserRouter>
    );
  });

//Create a descrie block for the test for that component
describe("test the SignupForm component", () => {

    //TEST #1
    test('check form rendering', async () => {

        
        //Render the component
        const elemet = render(<MockComponent show={true} addClient={mockAddClient} handleClose={mockHandleClose}/>);

        //Check if the components with the basic infos are showing right
        const name = screen.getByText("Name");
        const surname = screen.getByText(/[Ss]urname/i);
        const username = screen.getByText(/[Uu]sername/i);
        const password = screen.getByText(/[Pp]assword/i);

        expect(name).toBeInTheDocument();
        expect(surname).toBeInTheDocument();
        expect(username).toBeInTheDocument();
        expect(password).toBeInTheDocument();

    });

    //TEST #2
    test('check form fields', async () => {

        
        //Render the component
        const elemet = render(<MockComponent show={true} addClient={mockAddClient} handleClose={mockHandleClose}/>);

        //Check if the components with the basic infos are showing right
        const saveButton = screen.getByRole("button", {name: "Save"});

        const nameForm = screen.getByTitle("insert-client-name");
        const surnameForm = screen.getByTitle("insert-client-surname");
        const usernameForm = screen.getByTitle("insert-client-username");
        const passwordForm = screen.getByTitle("insert-client-password");

        expect(nameForm).toBeInTheDocument();
        expect(surnameForm).toBeInTheDocument();
        expect(usernameForm).toBeInTheDocument();
        expect(passwordForm).toBeInTheDocument();

        expect(saveButton).toBeInTheDocument();

    });

    //TEST #3
    test('check form fields working properly', async () => {

        
        //Render the component
        const elemet = render(<MockComponent show={true} addClient={mockAddClient} handleClose={mockHandleClose}/>);

        const nameForm = screen.getByTitle("insert-client-name");
        const surnameForm = screen.getByTitle("insert-client-surname");
        const usernameForm = screen.getByTitle("insert-client-username");
        const passwordForm = screen.getByTitle("insert-client-password");

        //Mock the events
        fireEvent.change(nameForm, { target: { value: "pippo" } });
        fireEvent.change(surnameForm, { target: { value: "pippo" } });
        fireEvent.change(usernameForm, { target: { value: "pippo" } });
        fireEvent.change(passwordForm, { target: { value: "pippo" } });

        //Check the value
        expect(nameForm.value).toBe("pippo");
        expect(surnameForm.value).toBe("pippo");    
        expect(usernameForm.value).toBe("pippo");    
        expect(passwordForm.value).toBe("pippo"); 

    });

    //TEST #4
    test('check the addClint function to be called', async () => {

        
        //Render the component
        const elemet = render(<MockComponent show={true} addClient={mockAddClient} handleClose={mockHandleClose}/>);

        //Fills the fields
        const nameForm = screen.getByTitle("insert-client-name");
        const surnameForm = screen.getByTitle("insert-client-surname");
        const usernameForm = screen.getByTitle("insert-client-username");
        const passwordForm = screen.getByTitle("insert-client-password");

        //Mock the events
        fireEvent.change(nameForm, { target: { value: "pippo" } });
        fireEvent.change(surnameForm, { target: { value: "pippo" } });
        fireEvent.change(usernameForm, { target: { value: "pippo@pippo.it" } });
        fireEvent.change(passwordForm, { target: { value: "pippopippo" } });

        //Get the button
        const saveButton = screen.getByRole("button", {name: "Save"});



        //check if the function is called
        fireEvent.click(saveButton);

        //Check if it's called later
        await waitFor(() => expect(mockAddClient).toHaveBeenCalled());

    });

    //TEST #5
    test('check the handleClose function to be called', async () => {

        
        //Render the component
        const elemet = render(<MockComponent show={true} addClient={mockAddClient} handleClose={mockHandleClose}/>);

        const closeButton = screen.getByRole("button", {name: "Cancel"});



        //check if the function is called
        fireEvent.click(closeButton);

        //Check if it's called later
        await waitFor(() => expect(mockHandleClose).toHaveBeenCalled());

    });

    //TEST #6
    test('check absence of parameters', async () => {

        
        //Render the component
        const elemet = render(<MockComponent show={true} addClient={mockAddClient} handleClose={mockHandleClose}/>);

        //Fills the fields
        const nameForm = screen.getByTitle("insert-client-name");
        const surnameForm = screen.getByTitle("insert-client-surname");
        const usernameForm = screen.getByTitle("insert-client-username");
        
        //Check if whitout a field the function is not called

        //Mock the events
        fireEvent.change(nameForm, { target: { value: "pippo" } });
        fireEvent.change(surnameForm, { target: { value: "pippo" } });
        fireEvent.change(usernameForm, { target: { value: "pippo@pippo.it" } });

        //Get the button
        const saveButton = screen.getByRole("button", {name: "Save"});

        //check if the function is called
        fireEvent.click(saveButton);

        //Check if it's called later
        await waitFor(() => expect(mockAddClient).not.toHaveBeenCalled());

    });

});
