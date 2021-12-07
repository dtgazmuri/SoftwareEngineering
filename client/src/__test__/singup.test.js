import { render, screen, fireEvent } from '@testing-library/react';
import { SignupForm } from '../Site/signup.js'

import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';



//Mock
import API from '../API.js';
jest.mock('../API.js');


const mockNotifyError = jest.fn();
const mockNotifySuccess = jest.fn();

const MockSingupForm = ((props) => {
    return (
        <BrowserRouter>
            <SignupForm notifySuccess={props.notifySuccess} notifyError={props.notifyError} />
        </BrowserRouter>
    );
});

//######################################################## SignupForm ########################################################//
describe("test the SignupForm component", () => {

    //TEST #1
    test('check rendering', async () => {
        
        //Render the component
        const elemet = render(<MockSingupForm notifySuccess={mockNotifySuccess} notifyError={mockNotifyError} />);

        //Check if the fields are showing
        const nameEl = screen.getByTitle("name-insertion");
        const surnameEl = screen.getByTitle("surname-insertion");
        const usernameEl = screen.getByTitle("username-insertion");
        const password1El = screen.getByTitle("password1-insertion");
        const password2El = screen.getByTitle("password2-insertion");

        expect(nameEl).toBeInTheDocument();
        expect(surnameEl).toBeInTheDocument();
        expect(usernameEl).toBeInTheDocument();
        expect(password1El).toBeInTheDocument();
        expect(password2El).toBeInTheDocument();

    });

    //TEST #2
    test('check form fields insertion', async () => {
        
        //Render the component
        const elemet = render(<MockSingupForm notifySuccess={mockNotifySuccess} notifyError={mockNotifyError} />);

        //Check if the fields are showing
        const nameEl = screen.getByTitle("name-insertion");
        const surnameEl = screen.getByTitle("surname-insertion");
        const usernameEl = screen.getByTitle("username-insertion");
        const password1El = screen.getByTitle("password1-insertion");
        const password2El = screen.getByTitle("password2-insertion");

        //Fire the events
        fireEvent.change(nameEl, { target: { value: "pippo" } });
        fireEvent.change(surnameEl, { target: { value: "pippo" } });
        fireEvent.change(usernameEl, { target: { value: "pippo@pippo.it" } });
        fireEvent.change(password1El, { target: { value: "pippo" } });
        fireEvent.change(password2El, { target: { value: "pippo" } });

        //Check the value
        expect(nameEl.value).toBe("pippo");
        expect(surnameEl.value).toBe("pippo");
        expect(usernameEl.value).toBe("pippo@pippo.it");
        expect(password1El.value).toBe("pippo");
        expect(password2El.value).toBe("pippo");

    });

    //TEST #3
    test('check form buttons - error', async () => {
        
        //Render the component
        const elemet = render(<MockSingupForm notifySuccess={mockNotifySuccess} notifyError={mockNotifyError} />);

        //Check if the fields are showing
        const nameEl = screen.getByTitle("name-insertion");
        const surnameEl = screen.getByTitle("surname-insertion");
        const usernameEl = screen.getByTitle("username-insertion");
        const password1El = screen.getByTitle("password1-insertion");
        const password2El = screen.getByTitle("password2-insertion");

        //Check if it says error if no filed are present
        const saveButton = screen.getByRole("button", { name: "Save" });

        fireEvent.click(saveButton);

        expect(mockNotifySuccess).not.toHaveBeenCalled();
    });

    //TEST #4
    test('check form buttons - error logs', async () => {
        
        //Render the component
        const elemet = render(<MockSingupForm notifySuccess={mockNotifySuccess} notifyError={mockNotifyError} />);

        //Check if the fields are showing
        const nameEl = screen.getByTitle("name-insertion");
        const surnameEl = screen.getByTitle("surname-insertion");
        const usernameEl = screen.getByTitle("username-insertion");
        const password1El = screen.getByTitle("password1-insertion");
        const password2El = screen.getByTitle("password2-insertion");

        //Check if it says error if no filed are present
        const saveButton = screen.getByRole("button", { name: "Save" });
        fireEvent.click(saveButton);

        expect(mockNotifySuccess).not.toHaveBeenCalled();

        const arr = await screen.findAllByText(/[Ff]ield [Rr]equired/i);
        expect(arr.length).toBe(5);
    });

    /*
    //TEST #5
    test('check form buttons - check save', async () => {
        
        //Render the component
        const elemet = render(<MockSingupForm notifySuccess={mockNotifySuccess} notifyError={mockNotifyError} />);

        //Check if the fields are showing
        const nameEl = screen.getByTitle("name-insertion");
        const surnameEl = screen.getByTitle("surname-insertion");
        const usernameEl = screen.getByTitle("username-insertion");
        const password1El = screen.getByTitle("password1-insertion");
        const password2El = screen.getByTitle("password2-insertion");

        //Insert the fields
        fireEvent.change(nameEl, { target: { value: "pippo" } });
        fireEvent.change(surnameEl, { target: { value: "pippo" } });
        fireEvent.change(usernameEl, { target: { value: "pippo@pippo.it" } });
        fireEvent.change(password1El, { target: { value: "pippo" } });
        fireEvent.change(password2El, { target: { value: "pippo" } });

        //Select the customer
        const custButton = screen.getByRole("button", { name: "Customer" });
        fireEvent.click(custButton);

        //Mock the API!
        const mockAddNewUser = jest.spyOn(API, 'addNewUser');
        const responseBody = {id : 1};
        
        //mockAddNewUser.mockImplementation(() => Promise.resolve(responseBody));

        mockAddNewUser.mockImplementation(() => Promise.reject({error : "error" }));

        //Fire the save
        const saveButton = screen.getByRole("button", { name: "Save" });
        fireEvent.click(saveButton);

        //Check calls
        expect(mockAddNewUser).toHaveBeenCalled();
        expect(mockNotifySuccess).toHaveBeenCalled();
        
        //Restore it
        mockAddNewUser.mockRestore();
    });
    */
    


});