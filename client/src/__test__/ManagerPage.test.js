import { render, screen, fireEvent } from '@testing-library/react';
import { ManagerPage, ManagerPageFarmerOrders,  ManagerReports } from '../Site/Manager/ManagerPage.js'
import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import dayjs from 'dayjs';


import API from '../ManagerAPI.js';
import { act } from 'react-dom/test-utils';
jest.mock('../ManagerAPI.js'); 


const MockManagerPage = ((props) => {
    return (
        <BrowserRouter>
            <ManagerPage />
        </BrowserRouter>
    );
});

/*
const mockAlertWalletUpdated = jest.fn();
const mockSetCustomerList = jest.fn();
const mockSetWalletUpdated = jest.fn();
*/

//########################################################## ManagerPage ##########################################################//
describe("test the ManagerPage component", () => {

    //TEST #1 ---> tests that the manager page renders correctly and has the "See farmer orders element"
    //At this moment, in the ManagerPage there is only 1 button, called "See farmer orders"
    test('check rendering', async () => {
      
        //Render the component
        const element = render(<MockManagerPage />);
        //getting the element having the "See farmer orders" heading from the screen
        const seeFarmerOrdersHeading = screen.getByText('See Farmer Orders');
        const seeReports = screen.getByText('See Reports');

        expect(seeFarmerOrdersHeading).toBeInTheDocument();
        expect(seeReports).toBeInTheDocument();
    });
});



//########################################################## ManagerPageFarmerOrders ##########################################################//
describe("test the ManagerPageFarmerOrders component", () => {

    const getCorrectTime = () => {
        return "Tuesday 28/December/2021 12:00";
    }
    const getBadTime = () => {
        return "Friday 31/December/2021 00:00";
    }

    /*const mockGetCurrentTime = jest.fn().mockImplementation(
        () => {
            return dayjs("2021-12-28 12:00").format("DD/MMMM/YYYY HH:mm").toString("DD/MMMM/YYYY HH:mm"); //tuesday. On tuesday is possible to ack delivery
        }
    );*/

    const fake_orders = [
        {
            "id": 1,
            "farmerid": 1,
            "farmerName": "Tunin",
            "farmerSurname": "Lamiera",
            "state": "pending",
            "total": 5,
            "time": "2021-12-01 12:00",
            "listitems": [{
                "id": 1,
                "quantity": 2,
                "name": "Red Apple",
                "price": 3.8,
            },
            {
                "id": 3,
                "quantity": 2,
                "name": "Banana",
                "price": 1.98,
            }
            ]
        }, 
        {
            "id": 2,
            "farmerid": 2,
            "farmerName": "Peppiniello",
            "farmerSurname": "Rossi",
            "state": "pending",
            "total": 10.65,
            "time": "2021-12-01 16:00",
            "listitems": [{
                "id": 2,
                "quantity": 3,
                "name": "Kiwi",
                "price": 10.65,
            }
            ]
        }
    ];

    
    //TEST #1
    test('check absence of buttons for acking delivery in the wrong days', async () => {

        /*const mockBadTime = (jest.fn().mockImplementation(
            () => {
                return dayjs("2021-12-11"); //on saturday it's not possible to ack delivery from farmer orders
            }
        ));*/

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getFarmerOrders');
        const responseBody = fake_orders;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        render(<ManagerPageFarmerOrders getCurrentTime={getBadTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();

            //needs to don't have any ack button/element because day is not correct
            expect(screen.queryAllByText('Acknowledge delivery')).toEqual([]);
        });

        //Restore the API
        mockGetOrders.mockRestore();
     });
     
    //TEST #2 
    test('check for useEffect to trigger and display right when is possible to ack orders', async () => {

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getFarmerOrders');
        const responseBody = fake_orders;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        render(<ManagerPageFarmerOrders getCurrentTime={getCorrectTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            //Check display right
            //absence of warning "No orders found"        
            expect(screen.queryByText('No orders found.')).not.toBeInTheDocument();

            //presence of title
            expect(screen.getByText('List of all the farmer orders')).toBeInTheDocument();
            //presence of specifications on when it's possible to ack delivery from farmers
            expect(screen.getByText('Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00')).toBeInTheDocument();
            //presence of the searchbar
            expect(screen.getByPlaceholderText('Filter farmer orders by id, farmer name, farmer surname, state or product')).toBeInTheDocument();
            //presence of 2 "complete" orders with the acknowledge button, since we have 2 orders pending
            expect(screen.queryAllByText('Acknowledge delivery')).toHaveLength(2);

            //presence of 2 Order id
            const orderIds = screen.getAllByText('Order id:', {exact: false}); // substring match
            expect(orderIds).toHaveLength(2);
            expect(screen.getAllByText('Order info')).toHaveLength(2);
            expect(screen.getAllByText('Farmer info')).toHaveLength(2);
            expect(screen.getAllByRole('button', { name: 'Show more info' })).toHaveLength(2);
            expect(screen.getAllByText('State:', {exact: false})).toHaveLength(2);
            expect(screen.getAllByText('Total:', {exact: false})).toHaveLength(2);
            expect(screen.getAllByText('Date:', {exact: false})).toHaveLength(2);
            expect(screen.getAllByText('Farmer id:', {exact: false})).toHaveLength(2);
            expect(screen.getAllByText('Name:', {exact: false})).toHaveLength(2);
            expect(screen.getAllByText('Surname:', {exact: false})).toHaveLength(2);
        });

        mockGetOrders.mockRestore();

    });

    //TEST #3 
    test('check button for acking order click', async () => {

        //getting the first fake order (only one, easier to test)
        const fake_order = [
            {
                "id": 1,
                "farmerid": 1,
                "farmerName": "Tunin",
                "farmerSurname": "Lamiera",
                "state": "pending",
                "total": 5,
                "time": "2021-12-01 12:00",
                "listitems": [{
                    "id": 1,
                    "quantity": 2,
                    "name": "Red Apple",
                    "price": 3.8,
                },
                {
                    "id": 3,
                    "quantity": 2,
                    "name": "Banana",
                    "price": 1.98,
                }
                ]
            }
        ];

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getFarmerOrders');
        const responseBody = fake_order;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));

        //Define another mock funtion (ack the farmer order)
        const mockUpdateOrder = jest.spyOn(API, 'ackFarmerOrder');
        mockUpdateOrder.mockImplementation((ord) => Promise.resolve({success : "success" }));
        
        //Render the component
        render(<ManagerPageFarmerOrders getCurrentTime={getCorrectTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            //get the button
            const ackDeliveryButton = screen.getByRole('button', {name : "Acknowledge delivery"});
            expect(ackDeliveryButton).toBeInTheDocument();

        });

        act(() => {
            const ackDeliveryButton = screen.getByRole('button', {name : "Acknowledge delivery"});
            expect(ackDeliveryButton).toBeInTheDocument();
            //click on button
            fireEvent.click(ackDeliveryButton);
        });
        
        expect(mockUpdateOrder).toHaveBeenCalled();

        //Check message
        await waitFor(() => {
            //get the alert showing successfully acked delivery
            const successEl = screen.getByText('acked successfully', {exact: false});
            expect(successEl).toBeInTheDocument();
        });

        mockGetOrders.mockRestore();
        mockUpdateOrder.mockRestore();

    });

    
    //TEST #4 
    test('check button for acking order click - error', async () => {
        //getting the first fake order (only one, easier to test)
        const fake_order = [
            {
                "id": 1,
                "farmerid": 1,
                "farmerName": "Tunin",
                "farmerSurname": "Lamiera",
                "state": "pending",
                "total": 5,
                "time": "2021-12-01 12:00",
                "listitems": [{
                    "id": 1,
                    "quantity": 2,
                    "name": "Red Apple",
                    "price": 3.8,
                },
                {
                    "id": 3,
                    "quantity": 2,
                    "name": "Banana",
                    "price": 1.98,
                }
                ]
            }
        ];

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getFarmerOrders');
        const responseBody = fake_order;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));

        //Define another mock funtion (ack the order)
        const mockUpdateOrder = jest.spyOn(API, 'ackFarmerOrder');
        mockUpdateOrder.mockImplementation((ord) => Promise.reject({error : "error" }));
        
        //Render the component
        render(<ManagerPageFarmerOrders getCurrentTime={getCorrectTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            //get the button
            const ackDeliveryButton = screen.getByRole('button', {name : "Acknowledge delivery"});
            expect(ackDeliveryButton).toBeInTheDocument();

        });

        act(() => {
            const ackDeliveryButton = screen.getByRole('button', {name : "Acknowledge delivery"});
            expect(ackDeliveryButton).toBeInTheDocument();
            //click on button
            fireEvent.click(ackDeliveryButton);
        });
        
        expect(mockUpdateOrder).toHaveBeenCalled();

        //Check message
        await waitFor(() => {
            //get the alert showing unsuccessfull acked delivery
            const errorEl = screen.getByText('Error while trying to acknowledge delivery...');
            expect(errorEl).toBeInTheDocument();
        });

        mockGetOrders.mockRestore();
        mockUpdateOrder.mockRestore();

    });

    //TEST #5
    test('check click on show more info / hide more info button', async () => {
        //getting the first fake order (only one, easier to test)
        const prod1 = {
            "id": 1,
            "quantity": 2,
            "name": "Red Apple",
            "price": 3.8,
        };
        const prod2 = {
            "id": 3,
            "quantity": 1,
            "name": "Banana",
            "price": 0.99,
        };
        const fake_order = [
            {
                "id": 1,
                "farmerid": 1,
                "farmerName": "Tunin",
                "farmerSurname": "Lamiera",
                "state": "pending",
                "total": 4.79,
                "time": "2021-12-01 12:00",
                "listitems": [ prod1, prod2 ]
            }
        ];

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getFarmerOrders');
        const responseBody = fake_order;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));

        //Render the component
        render(<ManagerPageFarmerOrders getCurrentTime={getCorrectTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            //get the button
            const info = screen.getByRole('button', {name : "Show more info"});
            expect(info).toBeInTheDocument();

        });

        act(() => {
            const info = screen.getByRole('button', {name : "Show more info"});
            expect(info).toBeInTheDocument();
            //click on button
            fireEvent.click(info);
        });
        
        //Check the presence of the order info (products)
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Hide more info' })).toBeInTheDocument();
            expect(screen.getByTestId('farmer-order-products')).toBeInTheDocument();
    
            expect(screen.getByText(prod1.name)).toBeInTheDocument();
            expect(screen.getByText(prod2.name)).toBeInTheDocument();
        });
        
        act(() => {
            const info = screen.getByRole('button', {name : "Hide more info"});
            expect(info).toBeInTheDocument();
            //click on button
            fireEvent.click(info);
        });
        
        //Check the absence of the order info (products)
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Show more info' })).toBeInTheDocument();
            expect(screen.queryByTestId('farmer-order-products')).not.toBeInTheDocument();
    
            expect(screen.queryByText(prod1.name)).not.toBeInTheDocument();
            expect(screen.queryByText(prod2.name)).not.toBeInTheDocument();
        });
        

        mockGetOrders.mockRestore();

    });

    //TEST #6
    test('check rendering in case of no orders', async () => {
         //Define a mock function
         const mockGetOrders = jest.spyOn(API, 'getFarmerOrders');
         const responseBody = [];
         mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));
         
         //Render the component
         render(<ManagerPageFarmerOrders getCurrentTime={getCorrectTime}/>);
 
         //Check if the function is called
         await waitFor(() => {
             expect(mockGetOrders).toHaveBeenCalled();
         });
 
         await waitFor(() => {
             //Check if there is an alert "No orders found."
             expect(screen.getByText('No orders found.')).toBeInTheDocument();
         });
 
         mockGetOrders.mockRestore(); 
    });

    //TEST #7
    test('check rendering in case API returning error', async () => {
        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getFarmerOrders');
        const responseBody = [];
        mockGetOrders.mockImplementation(() => Promise.reject(responseBody));
        
        //Render the component
        render(<ManagerPageFarmerOrders getCurrentTime={getCorrectTime}/>);

        //Check if the function is called
        await waitFor(() => {
            expect(mockGetOrders).toHaveBeenCalled();
        });

        await waitFor(() => {
            //Check if there is an alert "No orders found."
            expect(screen.getByText('No orders found.')).toBeInTheDocument();
        });

        mockGetOrders.mockRestore(); 
   });
    
   //TEST #8
   test('check the rendering in case of filtering using the searchbar (all possible cases)', async () => {

    //Define a mock function
    const mockGetOrders = jest.spyOn(API, 'getFarmerOrders');
    const responseBody = fake_orders;
    mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));
    
    //Render the component
    render(<ManagerPageFarmerOrders getCurrentTime={getCorrectTime}/>);

    //Check if the function is called
    await waitFor(() => {
        expect(mockGetOrders).toHaveBeenCalled();
    });

    await waitFor(() => {
        //Check display right
        //absence of warning "No orders found"        
        expect(screen.queryByText('No orders found.')).not.toBeInTheDocument();

        //presence of title
        expect(screen.getByText('List of all the farmer orders')).toBeInTheDocument();
        //presence of specifications on when it's possible to ack delivery from farmers
        expect(screen.getByText('Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00')).toBeInTheDocument();
        //presence of the searchbar
        expect(screen.getByPlaceholderText('Filter farmer orders by id, farmer name, farmer surname, state or product')).toBeInTheDocument();
        //presence of 2 "complete" orders with the acknowledge button, since we have 2 orders pending
        expect(screen.queryAllByText('Acknowledge delivery')).toHaveLength(2);

        //Here we can add all the other checks, but they are useless since this type of test was part of TEST #2
    });
   
    const searchbar = screen.getByPlaceholderText('Filter farmer orders by id, farmer name, farmer surname, state or product');
    expect(searchbar).toBeInTheDocument();
    
    //changing the value inside the searchbar. Nothing to show
    act(() => {
        fireEvent.change(searchbar, { target: { value: 'prova' } });
    });
    await waitFor(() => {
        //still presence of title, subtitle
        expect(screen.getByText('List of all the farmer orders')).toBeInTheDocument();
        expect(screen.getByText('Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00')).toBeInTheDocument();

        //expecting searchbar to show the value put
        expect(searchbar.value).toBe('prova');
        //expecting no orders shown
        expect(screen.queryAllByText('Order id:', {exact: false})).toHaveLength(0);
    });

    //changing the value inside the searchbar. Showing only the order with id=2
    act(() => {
        fireEvent.change(searchbar, { target: { value: '2' } });
    });
    await waitFor(() => {
        //still presence of title, subtitle
        expect(screen.getByText('List of all the farmer orders')).toBeInTheDocument();
        expect(screen.getByText('Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00')).toBeInTheDocument();

        //expecting searchbar to show the value put
        expect(searchbar.value).toBe('2');
        //expecting to show order n.2
        expect(screen.getByText('Order id: 2')).toBeInTheDocument();
    });        

    //changing the value inside the searchbar. Showing first order
    act(() => {
        fireEvent.change(searchbar, { target: { value: 'Tunin' } });
    });
    await waitFor(() => {
        //still presence of title, subtitle
        expect(screen.getByText('List of all the farmer orders')).toBeInTheDocument();
        expect(screen.getByText('Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00')).toBeInTheDocument();

        //expecting searchbar to show the value put
        expect(searchbar.value).toBe('Tunin');
        //expecting to show order n.1
        expect(screen.getByText('Order id: 1')).toBeInTheDocument();
    });

    //changing the value inside the searchbar. Showing order n.2
    act(() => {
        fireEvent.change(searchbar, { target: { value: 'Rossi' } });
    });

    await waitFor(() => {
        //still presence of title, subtitle
        expect(screen.getByText('List of all the farmer orders')).toBeInTheDocument();
        expect(screen.getByText('Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00')).toBeInTheDocument();

        //expecting searchbar to show the value put
        expect(searchbar.value).toBe('Rossi');
        //expecting no orders shown
        expect(screen.getByText('Order id: 2')).toBeInTheDocument();
    });

    //changing the state of searchbar, showing both orders cause they are both pending
    act(() => {
        fireEvent.change(searchbar, { target: { value: 'pending' } });
    });
    await waitFor(() => {
        //still presence of title, subtitle
        expect(screen.getByText('List of all the farmer orders')).toBeInTheDocument();
        expect(screen.getByText('Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00')).toBeInTheDocument();

        //expecting searchbar to show the value put
        expect(searchbar.value).toBe('pending');
        //expecting no orders shown
        expect(screen.queryAllByText('Order id:', {exact: false})).toHaveLength(2);
    });

    //changing the state of searchbar, showing second order cause it has kiwi
    act(() => {
        fireEvent.change(searchbar, { target: { value: 'Kiwi' } });
    });
    await waitFor(() => {
        //still presence of title, subtitle
        expect(screen.getByText('List of all the farmer orders')).toBeInTheDocument();
        expect(screen.getByText('Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00')).toBeInTheDocument();

        //expecting searchbar to show the value put
        expect(searchbar.value).toBe('Kiwi');
        //expecting no orders shown
        expect(screen.getByText('Order id: 2')).toBeInTheDocument();
    });

    mockGetOrders.mockRestore();

});


});

//########################################################## ManagerReports ##########################################################//
describe("test the ManagerReports component", () => {
    const weekReport = { 
        lostFood: {}, 
        type: 0, 
        weekEndDate: "2021-11-28",
        weekStartDate: "2021-11-22"
    };
    const monthReport = { 
        lostFood: {}, 
        type: 1, 
        month: "11",
        year: "2021"
    };
    //TEST #1
    test('check rendering in case of no reports', async () => {
        //Define a mock function
        const mockReports = jest.spyOn(API, 'getManagerReports');
        const responseBody = [];
        mockReports.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        render(<ManagerReports />);

        //Check if the function is called
        await waitFor(() => {
            expect(mockReports).toHaveBeenCalled();
        });

        //check page content
        expect(screen.getByText('Manager Reports')).toBeInTheDocument();
        expect(screen.getByText('Reports are completely generated after each week and after each month. Only partial version are available before that.')).toBeInTheDocument();
        expect(screen.getByText('No reports found.')).toBeInTheDocument();
        
        //Restore the API
        mockReports.mockRestore();
    });
    //TEST #2
    test('check rendering in case there are reports', async () => {
        //Define a mock function
        const mockReports = jest.spyOn(API, 'getManagerReports');
        const responseBody = [monthReport, weekReport];
        mockReports.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        render(<ManagerReports />);

        //Check if the function is called
        await waitFor(() => {
            expect(mockReports).toHaveBeenCalled();
        });

        //check page content
        expect(screen.getByText('Manager Reports')).toBeInTheDocument();
        expect(screen.getByText('Reports are completely generated after each week and after each month. Only partial version are available before that.')).toBeInTheDocument();
        expect(screen.queryByText('No reports found.')).not.toBeInTheDocument();
        expect(screen.getByText('Weekly Reports')).toBeInTheDocument();
        expect(screen.getByText('Monthly Reports')).toBeInTheDocument();
        expect(screen.getByText("November 2021")).toBeInTheDocument();
        expect(screen.getByText('November 22, 2021 - November 28, 2021')).toBeInTheDocument();
          
        //Restore the API
        mockReports.mockRestore();
    });

    //TEST #3
    test('check rendering of the modal weekly', async () => {
        //Define a mock function
        const mockReports = jest.spyOn(API, 'getManagerReports');
        const responseBody = [monthReport, weekReport];
        mockReports.mockImplementation(() => Promise.resolve(responseBody));
        
        //Render the component
        render(<ManagerReports />);

        //Check if the function is called
        await waitFor(() => {
            expect(mockReports).toHaveBeenCalled();
        });

        //check page content
        expect(screen.getByText('Manager Reports')).toBeInTheDocument();
        expect(screen.getByText('Reports are completely generated after each week and after each month. Only partial version are available before that.')).toBeInTheDocument();
        expect(screen.queryByText('No reports found.')).not.toBeInTheDocument();
        expect(screen.getByText('Weekly Reports')).toBeInTheDocument();
        expect(screen.getByText('Monthly Reports')).toBeInTheDocument();
        const report0 = screen.getByText("November 2021");
        expect(report0).toBeInTheDocument();
        const report1 = screen.getByText('November 22, 2021 - November 28, 2021');
        expect(report1).toBeInTheDocument();

        act(() => {
            //click on button
            fireEvent.click(report1);
        });
        await waitFor(() => {
            //MODAL
            expect(screen.getByText('Week Report')).toBeInTheDocument();
            expect(screen.getByText('Close')).toBeInTheDocument();
            expect(screen.getByText('The following products were lost during this period:')).toBeInTheDocument();
            expect(screen.getByText('Product')).toBeInTheDocument();
            expect(screen.getByText('Quantity')).toBeInTheDocument();
            expect(screen.getByText('Total:')).toBeInTheDocument();
            expect(screen.getByText('0')).toBeInTheDocument();
            expect(screen.getByText(`Week: from ${weekReport.weekStartDate} to ${weekReport.weekEndDate}`)).toBeInTheDocument();     
        });
        act(() => {
            //click on close
            const closeBtn = screen.getByText('Close');
            expect(closeBtn).toBeInTheDocument();
            fireEvent.click(closeBtn);
        });
        act(() => {
            const report = screen.getByText("November 2021");
            expect(report).toBeInTheDocument();
            //click on monthly report
            fireEvent.click(report);
        });
        await waitFor(() => {
            //MODAL
            expect(screen.getByText('November 2021 Report')).toBeInTheDocument();
            expect(screen.getByText('Close')).toBeInTheDocument();
            expect(screen.getByText('The following food was lost during this month:')).toBeInTheDocument();
            expect(screen.getByText('Product')).toBeInTheDocument();
            expect(screen.getByText('Quantity')).toBeInTheDocument();
            expect(screen.getByText('Total:')).toBeInTheDocument();
            expect(screen.getByText('0')).toBeInTheDocument();
        });
        //Restore the API
        mockReports.mockRestore();
    });

});