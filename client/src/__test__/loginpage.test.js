import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../Site/loginpage.js'

import { waitFor } from '@testing-library/dom';

const mockLogin = jest.fn();

//######################################################## LoginPage ########################################################//
describe("test the LoginPage component", () => {

    //TEST #1
    test('check rendering', async () => {
        
        //Render the component
        const elemet = render(<LoginPage login={mockLogin}/>);

        //Check if the fields are showing
        const insertUsernameEl = screen.getByTitle("insert-email");
        const insertPasswordEl = screen.getByTitle("insert-password");

        const loginButton = screen.getByRole("button", { name: "Login"});

        expect(insertUsernameEl).toBeInTheDocument();
        expect(insertPasswordEl).toBeInTheDocument();

        expect(loginButton).toBeInTheDocument();
    

    });

    //TEST #2
    test('check form insertion', async () => {
        
        //Render the component
        const elemet = render(<LoginPage login={mockLogin}/>);

        //Check if the fields are showing
        const insertUsernameEl = screen.getByTitle("insert-email");
        const insertPasswordEl = screen.getByTitle("insert-password");

        fireEvent.change(insertUsernameEl, {target : { value: "pippo"}});
        fireEvent.change(insertPasswordEl, {target : { value: "pippo"}});

        expect(insertUsernameEl.value).toBe("pippo");
        expect(insertPasswordEl.value).toBe("pippo");

    });

    //TEST #3
    test('check void fields login', async () => {
        
        //Render the component
        const elemet = render(<LoginPage login={mockLogin}/>);

        //Check if the fields are showing
        const insertUsernameEl = screen.getByTitle("insert-email");
        const insertPasswordEl = screen.getByTitle("insert-password");

        const loginButton = screen.getByRole("button", { name: "Login"});

        //Fire the click
        fireEvent.click(loginButton);

        //Expect login not been called
        expect(mockLogin).not.toHaveBeenCalled();
    
        //Expect error message
        /*
        await waitFor(() => {
            const errorEl = screen.getByText(/failed/i);
            expect(errorEl).toBeInTheDocument();
        });
        */
        

    });

    //TEST #3
    test('check filled values login - incorrect password', async () => {
        
        //Render the component
        const elemet = render(<LoginPage login={mockLogin}/>);

        //Check if the fields are showing
        const insertUsernameEl = screen.getByTitle("insert-email");
        const insertPasswordEl = screen.getByTitle("insert-password");

        //Fill the fields
        fireEvent.change(insertUsernameEl, {target : { value: "pippo"}});       //Correct email
        fireEvent.change(insertPasswordEl, {target : { value: "pippo"}});  //Incorrect password

        const loginButton = screen.getByRole("button", { name: "Login"});


        //Fire the click
        fireEvent.click(loginButton);

        //Expect login not been called
        expect(mockLogin).not.toHaveBeenCalled();

    });

    //TEST #4
    test('check filled values login', async () => {
        
        //Render the component
        const elemet = render(<LoginPage login={mockLogin}/>);

        //Check if the fields are showing
        const insertUsernameEl = screen.getByTitle("insert-email");
        const insertPasswordEl = screen.getByTitle("insert-password");

        //Fill the fields
        fireEvent.change(insertUsernameEl, {target : { value: "pippo"}});       //Correct email
        fireEvent.change(insertPasswordEl, {target : { value: "pippopippo"}});  //Correct password

        const loginButton = screen.getByRole("button", { name: "Login"});


        //Fire the click
        fireEvent.click(loginButton);

        //Expect login not been called
        expect(mockLogin).toHaveBeenCalled();

    });
    


});