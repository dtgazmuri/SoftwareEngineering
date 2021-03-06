import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerForm, OrderList, CustomerList } from '../Site/Employee/employee.js'
import { waitFor } from '@testing-library/dom';
import dayjs from 'dayjs';


import API from '../EmployeeAPI.js';
import { act } from 'react-dom/test-utils';
jest.mock('../EmployeeAPI.js'); 



const mockAlertWalletUpdated = jest.fn();
const mockSetCustomerList = jest.fn();
const mockSetWalletUpdated = jest.fn();

//########################################################## CustomerForm ##########################################################//
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





//########################################################## OrderList ##########################################################//
describe("test the OrderList component", () => {

    const mockGetCurrentTime = jest.fn().mockImplementation(
        () => {
            return dayjs("2022-01-0616:30").format("YYYY-MM-DDHH:mm");
        }
    );

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

    

    //TEST #1
    test('test if the page shows only in the right days', async () => {

        const mockBadTime = (jest.fn().mockImplementation(
            () => {
                return dayjs("2021-12-11T16:30");
            }
        ));

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        const responseBody = fake_orders;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        const elemet = render(<OrderList getCurrentTime={mockBadTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();

            //needs to have two sorry because we have two orders
            const sorryEl = screen.getAllByText(/[Ss]orry/i);
            expect(sorryEl.length).toBe(2);
        });

        
        //Restore the API
        mockGetOrders.mockRestore();



     });

    //TEST #2
    test('check form useEffect to trigger and display right', async () => {

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        const responseBody = fake_orders;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        const elemet = render(<OrderList getCurrentTime={mockGetCurrentTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            //Check display right
            const no_found = screen.queryByText(/no order/i);
            expect(no_found).not.toBeInTheDocument();

            const orderNUM = screen.queryAllByText(/Order number/i);
            expect(orderNUM.length).toBe(2);
            
            const elOrderNumber1 = screen.queryByText(/Order number: 1/i);
            expect(elOrderNumber1).toBeInTheDocument();

            
            const elOrderNumber2 = screen.queryByText(/Order number: 2/i);
            expect(elOrderNumber2).toBeInTheDocument();

            const elOrderNumber3 = screen.queryByText(/Order number: 3/i);
            expect(elOrderNumber3).not.toBeInTheDocument();
        });

        mockGetOrders.mockRestore();

    });


    //TEST #3
    test('check button presence', async () => {

        /*
        const test_date = dayjs('2022-01-06T16:30');
        console.log(`date day : ${test_date.day()}`);
        */

        const mockGetCurrentTimeTEST = jest.fn().mockImplementation(
            () => {
                return dayjs("2022-01-0616:30").format("YYYY-MM-DDHH:mm");
            }
        );


        //Define a fake order (only one, easier to test)
        const fake_order = [
            { 
                "id": 1, 
                "customerid": 1, 
                "state": "pending", 
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
            }
        ];

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        const responseBody = fake_order;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        const elemet = render(<OrderList getCurrentTime={mockGetCurrentTimeTEST}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockGetCurrentTimeTEST).toHaveBeenCalled();
        });

        await waitFor(() => {
            
            //get the button
            const handoutButton = screen.getByRole("button", {name : "Hand out order"});
            expect(handoutButton).toBeInTheDocument();



        });

        mockGetOrders.mockRestore();

    });

    //TEST #4
    test('check button absence', async () => {

        //Define a fake order (only one, easier to test)
        const fake_order = [
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
            }
        ];

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        const responseBody = fake_order;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        const elemet = render(<OrderList getCurrentTime={mockGetCurrentTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            
            //get the button
            const handoutButton = screen.queryByRole("button", {name : "Hand out order"});
            expect(handoutButton).not.toBeInTheDocument();



        });

        mockGetOrders.mockRestore();

    });


    //TEST #5
    test('check button click', async () => {


        const mockGetCurrentTimeTEST = jest.fn().mockImplementation(
            () => {
                return dayjs("2022-01-0616:30").format("YYYY-MM-DDHH:mm");
            }
        );

        //Define a fake order (only one, easier to test)
        const fake_order = [
            { 
                "id": 1, 
                "customerid": 1, 
                "state": "pending", 
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
            }
        ];

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        const responseBody = fake_order;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));

        //Define another mock funtion (update the order)
        const mockUpdateOrder = jest.spyOn(API, 'handOutOrder');
        mockUpdateOrder.mockImplementation((ord) => Promise.resolve({success : "success" }));
        
        //Render the component
        const elemet = render(<OrderList getCurrentTime={mockGetCurrentTimeTEST}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });



        await waitFor(() => {
            
            //get the button
            const handoutButton = screen.getByRole("button", {name : "Hand out order"});
            expect(handoutButton).toBeInTheDocument();

        });

        act(() => {
            const handoutButton = screen.getByRole("button", {name : "Hand out order"});
            expect(handoutButton).toBeInTheDocument();
    
            fireEvent.click(handoutButton);
        });
        
        
        expect(mockUpdateOrder).toHaveBeenCalled();

        //Check message
        await waitFor(() => {
            
            //get the button
            const successEl = screen.getByText(/success/i);
            expect(successEl).toBeInTheDocument();

        });

        mockGetOrders.mockRestore();
        mockUpdateOrder.mockRestore();

    });


    //TEST #6
    test('check button click - error', async () => {

        //Define a fake order (only one, easier to test)
        const fake_order = [
            { 
                "id": 1, 
                "customerid": 1, 
                "state": "pending", 
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
            }
        ];

        const mockGetCurrentTimeTEST = jest.fn().mockImplementation(
            () => {
                return dayjs("2022-01-0616:30").format("YYYY-MM-DDHH:mm");
            }
        );

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        const responseBody = fake_order;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));

        //Define another mock funtion (update the order)
        const mockUpdateOrder = jest.spyOn(API, 'handOutOrder');
        mockUpdateOrder.mockImplementation((ord) => Promise.reject({error : "error" }));
        
        //Render the component
        const elemet = render(<OrderList getCurrentTime={mockGetCurrentTimeTEST}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            
            //get the button
            const handoutButton = screen.getByRole("button", {name : "Hand out order"});
            expect(handoutButton).toBeInTheDocument();

        });

        act(() => {
            const handoutButton = screen.getByRole("button", {name : "Hand out order"});
            expect(handoutButton).toBeInTheDocument();
    
            fireEvent.click(handoutButton);
        });

        //Check message
        await waitFor(() => {
            
            //get the button
            const errorEl = screen.getByText(/unable/i);
            expect(errorEl).toBeInTheDocument();

        });

        mockGetOrders.mockRestore();
        mockUpdateOrder.mockRestore();

    });

});



//########################################################## CustomerList ##########################################################//
describe("test the CustomerList component", () => {

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

    //TEST #1
    test('check rendering', async () => {

        //Define a mock function
        const mockGetCustomers = jest.spyOn(API, 'getCustomers');
        const responseBody = fake_customers;
        mockGetCustomers.mockImplementation(() => Promise.resolve(responseBody));

        //Render the component (need to use act beacuse we are updating a component's state)
        act(() => {
            const elemet = render(<CustomerList />);
        });

        //Check rendering
        const nameElG = await screen.findByText(/Giovanna Arco/i);
        const nameElM = await screen.findByText(/Marcello Fumagalli/i);

        //get search bar
        const searchBar = await screen.findByPlaceholderText("Search customer by name");

        expect(nameElG).toBeInTheDocument();
        expect(nameElM).toBeInTheDocument();
        expect(searchBar).toBeInTheDocument();

        //Restore the function
        mockGetCustomers.mockRestore();

    });

    //TEST #2
    test('check search by customer name', async () => {

        //Define a mock function
        const mockGetCustomers = jest.spyOn(API, 'getCustomers');
        const responseBody = fake_customers;
        mockGetCustomers.mockImplementation(() => Promise.resolve(responseBody));

        //Render the component (need to use act beacuse we are updating a component's state)
        act(() => {
            const elemet = render(<CustomerList />);
        });

        //get search bar
        const searchBar = await screen.findByPlaceholderText("Search customer by name");

        //Fire the event
        fireEvent.change(searchBar, { target: { value: "giov" } });

        //Check the value
        expect(searchBar.value).toBe("giov");

        //Wait for dom change in order to see if the customer marcello is not present anymore
        waitFor(() => {

            const nameElG = screen.queryByText(/Giovanna Arco/i);
            const nameElM = screen.queryByText(/Marcello Fumagalli/i);

            expect(nameElG).toBeInTheDocument();
            expect(nameElM).not.toBeInTheDocument();
            

        });

        //Restore the function
        mockGetCustomers.mockRestore();

    });

    //TEST #3
    test('test top up wallet button & text area to be present', async () => {

        //Put only one customer to be earier to test
        const fake_customer = [
            {
                "id": 1,
                "name": "Giovanna",
                "surname": "Arco",
                "wallet": 90
            }
        ];

        //Define a mock function
        const mockGetCustomers = jest.spyOn(API, 'getCustomers');
        const responseBody = fake_customer;
        mockGetCustomers.mockImplementation(() => Promise.resolve(responseBody));

        //Render the component (need to use act beacuse we are updating a component's state)
        act(() => {
            const elemet = render(<CustomerList />);
        });

        //Now wait the function to be called
        await waitFor(() => {
            expect(mockGetCustomers).toHaveBeenCalled();
        });

        //At this point the page is loaded

        //Get the top up wallet button and textbox
        const topUpWalletText = screen.getByPlaceholderText("Insert amount to add to wallet");
        const topUpWalletButton = screen.getByRole("button", {name : "Submit"});

        //Expect their presence
        expect(topUpWalletText).toBeInTheDocument();
        expect(topUpWalletButton).toBeInTheDocument();

        //Restore the function
        mockGetCustomers.mockRestore();

    });

    //TEST #4
    test('test top up wallet - with no input', async () => {

        //Put only one customer to be earier to test
        const fake_customer = [
            {
                "id": 1,
                "name": "Giovanna",
                "surname": "Arco",
                "wallet": 90
            }
        ];

        //Define a mock function
        const mockGetCustomers = jest.spyOn(API, 'getCustomers');
        const responseBody = fake_customer;
        mockGetCustomers.mockImplementation(() => Promise.resolve(responseBody));

        //Mock the update customer wallet
        const mockUpdateCustomerWallet = jest.spyOn(API, 'updateCustomerWallet');
        mockUpdateCustomerWallet.mockImplementation((a, b) => Promise.resolve( { success: "success" } ));

        //Render the component (need to use act beacuse we are updating a component's state)
        act(() => {
            const elemet = render(<CustomerList />);
        });

        //Now wait the function to be called
        await waitFor(() => {
            expect(mockGetCustomers).toHaveBeenCalled();
        });

        //At this point the page is loaded

        //Get the top up wallet button and textbox
        const topUpWalletText = screen.getByPlaceholderText("Insert amount to add to wallet");
        const topUpWalletButton = screen.getByRole("button", {name : "Submit"});

        //Check if pressing without doying anything result in an error
        
        fireEvent.click(topUpWalletButton);

        //Now wait the function to be called
        await waitFor(() => {
            expect(mockUpdateCustomerWallet).toHaveBeenCalled();
        });


        //Restore the function
        mockGetCustomers.mockRestore();
        mockUpdateCustomerWallet.mockRestore();

    });

    //TEST #5
    test('test top up wallet - with input', async () => {

        //Put only one customer to be earier to test
        const fake_customer = [
            {
                "id": 1,
                "name": "Giovanna",
                "surname": "Arco",
                "wallet": 90
            }
        ];

        //Define a mock function
        const mockGetCustomers = jest.spyOn(API, 'getCustomers');
        const responseBody = fake_customer;
        mockGetCustomers.mockImplementation(() => Promise.resolve(responseBody));

        //Mock the update customer wallet
        const mockUpdateCustomerWallet = jest.spyOn(API, 'updateCustomerWallet');
        mockUpdateCustomerWallet.mockImplementation((a, b) => Promise.resolve( { success: "success" } ));

        //Render the component (need to use act beacuse we are updating a component's state)
        act(() => {
            const elemet = render(<CustomerList />);
        });

        //Now wait the function to be called
        await waitFor(() => {
            expect(mockGetCustomers).toHaveBeenCalled();
        });

        //At this point the page is loaded

        //Get the top up wallet button and textbox
        const topUpWalletText = screen.getByPlaceholderText("Insert amount to add to wallet");
        const topUpWalletButton = screen.getByRole("button", {name : "Submit"});

        //Check if pressing without doying anything result in an error
        fireEvent.change(topUpWalletText, {target: {value: 100}});

        fireEvent.click(topUpWalletButton);

        //Now wait the function to be called
        await waitFor(() => {
            expect(mockUpdateCustomerWallet).toHaveBeenCalled();
        });


        //Restore the function
        mockGetCustomers.mockRestore();
        mockUpdateCustomerWallet.mockRestore();

    });


});

