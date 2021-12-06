import { render, screen, fireEvent } from '@testing-library/react';
import MyNavbar from '../Site/navbar.js'
import { LogoutButton } from '../Site/navbar.js'

import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';

const mockLogout = jest.fn();

const MockComponent = ((props) => {

    return (

        <BrowserRouter>
            <LogoutButton logout={props.logout} />
        </BrowserRouter>

    );
});

const MockMyNavbar = ((props) => {

    return (

        <BrowserRouter>
            <MyNavbar logout={props.logout} isLogged={props.isLogged}/>
        </BrowserRouter>

    );
});

//######################################################## LogoutButton ########################################################//
describe("test the LogoutButton component", () => {

    //TEST #1
    test('check rendering', async () => {

        //Render the component
        const elemet = render(<MockComponent logout={mockLogout} />);

        //Check if the fields are showing
        const button = screen.getByRole("button", { name: "Logout" });
        expect(button).toBeInTheDocument();


    });

    //TEST #2
    test('check button pressed', async () => {

        //Render the component
        const elemet = render(<MockComponent logout={mockLogout} />);

        //Check if the fields are showing
        const button = screen.getByRole("button", { name: "Logout" });
        fireEvent.click(button);

        expect(mockLogout).toHaveBeenCalled();


    });
});


//######################################################## MyNavbar ########################################################//
describe("test the MyNavbar component", () => {

    //TEST #1
    test('check rendering - no logout button', async () => {

        //Render the component
        const elemet = render(<MockMyNavbar logout={mockLogout} isLogged={false}/>);

        const logoutButton = screen.queryByRole("button", { name: "Logout" });
        const SPG = screen.getByText("SPG");

        //Expect the name to be present
        expect(SPG).toBeInTheDocument();

        //Check if the button is NOT present!
        expect(logoutButton).not.toBeInTheDocument();
    });

    //TEST #2
    test('check rendering - logout button', async () => {

        //Render the component
        const elemet = render(<MockMyNavbar logout={mockLogout} isLogged={true}/>);

        const logoutButton = screen.queryByRole("button", { name: "Logout" });
        const SPG = screen.getByText("SPG");

        //Expect the name to be present
        expect(SPG).toBeInTheDocument();
        expect(logoutButton).toBeInTheDocument();
    });
});