import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerForm } from '../Site/Employee/employee.js'

import { waitFor } from '@testing-library/dom';
//import API from '../API.js';


import API from '../API.js';
jest.mock('../API.js'); 



const mockAlertWalletUpdated = jest.fn();
const mockSetCustomerList = jest.fn();
const mockSetWalletUpdated = jest.fn();

//Create a descrie block for the test for that component
describe("test the CustomerForm component", () => {

    //TEST #1
    test('check form rendering', async () => {

        const fake_customerid = 1;
        const fake_customers = [
            {
                "id": 1,
                "name": "Giovanna",
                "surname": "Arco",
                "wallet": 90
            },
            {
                "id": 2,
                "name": "Marcello",
                "surname": "Fumagalli",
                "wallet": 0
            }
        ];

        //Render the component
        const elemet = render(<CustomerForm id={fake_customerid} customers={fake_customers} alertWalletUpdated={mockAlertWalletUpdated} setCustomerList={mockSetCustomerList} setWalletUpdated={mockSetWalletUpdated} />);



        //Check if the components are showing right!
        const button = screen.getByRole("button", { name: "Submit" });
        const textArea = screen.getByPlaceholderText("Insert amount to add to wallet");

        expect(button).toBeInTheDocument();
        expect(textArea).toBeInTheDocument();

    });

    //TEST #2
    test('check form update', async () => {

        const fake_customerid = 1;
        const fake_customers = [
            {
                "id": 1,
                "name": "Giovanna",
                "surname": "Arco",
                "wallet": 90
            },
            {
                "id": 2,
                "name": "Marcello",
                "surname": "Fumagalli",
                "wallet": 0
            }
        ];

        //Render the component
        const elemet = render(<CustomerForm id={fake_customerid} customers={fake_customers} alertWalletUpdated={mockAlertWalletUpdated} setCustomerList={mockSetCustomerList} setWalletUpdated={mockSetWalletUpdated} />);



        //Get the text area
        const textArea = screen.getByPlaceholderText("Insert amount to add to wallet");

        //Fire an event
        fireEvent.change(textArea, { target: { value: "100" } });

        //Check the new value!
        expect(textArea.value).toBe("100");

    });

    //TEST #3
    test('check form submit button', async () => {

        const fake_customerid = 1;
        const fake_customers = [
            {
                "id": 1,
                "name": "Giovanna",
                "surname": "Arco",
                "wallet": 90
            },
            {
                "id": 2,
                "name": "Marcello",
                "surname": "Fumagalli",
                "wallet": 0
            }
        ];

        //Render the component
        const elemet = render(<CustomerForm id={fake_customerid} customers={fake_customers} alertWalletUpdated={mockAlertWalletUpdated} setCustomerList={mockSetCustomerList} setWalletUpdated={mockSetWalletUpdated} />);



        //Get the component I need
        const button = screen.getByRole("button", { name: "Submit" });
        const textArea = screen.getByPlaceholderText("Insert amount to add to wallet");

        //Write 100 in the box
        fireEvent.change(textArea, { target: { value: "100" } });

        //Test the button
        fireEvent.click(button);

        //Check if the function 
        expect(mockSetWalletUpdated).toHaveBeenCalled();

    });

    //TEST #4
    //How I can test if I insert an invalid amout the system is showing wrong?

});





//Create a descrie block for the test for that component
describe("test the OrderList component", () => {

    //TEST #1
    test('check form useEffect to trigger and display right', async () => {

        const fake_orders = [
            { 
                "id": 1, 
                "customerid": 1, 
                "state": "delivered", 
                "delivery": "no", 
                "total": 72.25, 
                "listitems": 
                [
                    { 
                        "id": 1, 
                        "orderid": 1, 
                        "productid": 1, 
                        "quantity": 10, 
                        "price": 19 
                    }, 
                    { 
                        "id": 2, 
                        "orderid": 1, 
                        "productid": 2, 
                        "quantity": 15, 
                        "price": 53.25 
                    }
                ] 
            }, 
            { 
                "id": 2, 
                "customerid": 2, 
                "state": "delivered", 
                "delivery": "false", 
                "total": 7.6, 
                "listitems": 
                [
                    { 
                        "id": 3, 
                        "orderid": 2, 
                        "productid": 1, 
                        "quantity": 4, 
                        "price": 1.9 
                    }
                ] 
            }
        ];

        //Another mock test...
        /*
        getOrders.mockResolvedValue(fake_orders);
        const wrapper = shallow(<OrderList />);
        
        const updatedEmailInput = simulateChangeOnInput(wrapper, 'input#email-input', 'test@gmail.com')
        const updatedPasswordInput = simulateChangeOnInput(wrapper, 'input#password-input', 'cats'); 
        wrapper.find('form').simulate('submit', {
        preventDefault: () =>{}
        });
        



        await waitFor(() => expect(getOrders).toHaveBeenCalled());
        */

        /*
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        mockGetOrders.mockResolvedValue(fake_orders);
        
        //Render the component
        const elemet = render(<OrderList />);


        //Await for the API to be called

        //await waitFor(() => expect(mockGetOrders).toHaveBeenCalled());

        const el = await screen.findAllByText(/number/i);

        mockGetOrders.mockRestore();
        */

        /*
        //Mock the API request
        jest.mock('../API.js', () => ({
            redirect: jest.fn()
        }));
        */
        

        

        //Test
        //const no_found = await screen.findByText(/no order/i);

        //Wait for the useEffect
        //const elOrderNumber1 = await screen.findByText(/Order number/i);
        //expect(elOrderNumber1).toBeInTheDocument();

        /*
        const elOrderNumber2 = await screen.findByText(/Order number: 2/i);
        expect(elOrderNumber2).toBeInTheDocument();

        const elOrderNumber3 = await screen.queryByText(/Order number: 3/i);
        expect(elOrderNumber3).not.toBeInTheDocument();
        */
        


    });

});


