import { render, screen, fireEvent } from '@testing-library/react';
import { ProductList, ProductForm, OrderList, FarmerPage } from '../Site/Farmer/FarmerPage.js'
import Farmer from '../Site/Farmer/FarmerPage.js'

import { waitFor } from '@testing-library/dom';

import dayjs from 'dayjs';

//TEST MOCK
import API from '../FarmerAPI.js';
import { BrowserRouter } from 'react-router-dom';
jest.mock('../FarmerAPI.js');
//END TEST MOCK


const mockUpdatedQuantity = jest.fn();
const mockSetExpectedQuantityForProduct = jest.fn();
const mockGetCurrentTime = jest.fn();

//######################################################## ProductForm ########################################################//
describe("test the ProductForm component", () => {

    //TEST #1
    test('check form rendering with correct time', async () => {
        
        let d1 = dayjs("2018-06-05");

        const mockGetCurrentTimeGOOD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<ProductForm updatedQuantity={mockUpdatedQuantity} setExpectedQuantityForProduct={mockSetExpectedQuantityForProduct} getCurrentTime={mockGetCurrentTimeGOOD} />);

        //Check if the has the given parts
        const insertQTAElement = screen.getByPlaceholderText("Insert here the expected amount");
        const setQTABytton = screen.getByRole("button", {name: "Set expected amount"});

        expect(insertQTAElement).toBeInTheDocument();
        expect(setQTABytton).toBeInTheDocument();

    });

    //TEST #2
    test('check form rendering with uncorrect time', async () => {
        

        let d1 = dayjs("2018-06-03");
        const mockGetCurrentTimeBAD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<ProductForm updatedQuantity={mockUpdatedQuantity} setExpectedQuantityForProduct={mockSetExpectedQuantityForProduct} getCurrentTime={mockGetCurrentTimeBAD} />);

        //Check if the has the given parts
        const insertQTAElement = screen.queryByPlaceholderText("Insert here the expected amount");
        const setQTABytton = screen.queryByRole("button", {name: "Set expected amount"});

        expect(insertQTAElement).not.toBeInTheDocument();
        expect(setQTABytton).not.toBeInTheDocument();

        //Check if the sorry text is presrnt (search for sorry only so that if we need to change it is easier!)
        const sorryElement = screen.getByText(/[Ss]orry/i);

        expect(sorryElement).toBeInTheDocument();

    });

    //TEST #3
    test('check form insertion (with correct time)', async () => {
        
        let d1 = dayjs("2018-06-05");

        const mockGetCurrentTimeGOOD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<ProductForm updatedQuantity={mockUpdatedQuantity} setExpectedQuantityForProduct={mockSetExpectedQuantityForProduct} getCurrentTime={mockGetCurrentTimeGOOD} />);

        //Check if the has the given parts
        const insertQTAElement = screen.getByPlaceholderText("Insert here the expected amount");

        //Fire the events
        fireEvent.change(insertQTAElement, { target: { value: 12 } });

        //Check the value
        expect(insertQTAElement.value).toBe("12");

    });

    //TEST #4
    test('check form button (with correct time)', async () => {
        
        let d1 = dayjs("2018-06-05");

        const mockGetCurrentTimeGOOD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<ProductForm updatedQuantity={mockUpdatedQuantity} setExpectedQuantityForProduct={mockSetExpectedQuantityForProduct} getCurrentTime={mockGetCurrentTimeGOOD} />);

        //Check if the has the given parts
        const insertQTAElement = screen.getByPlaceholderText("Insert here the expected amount");
        const setQTABytton = screen.getByRole("button", {name: "Set expected amount"});

        //Fire the events
        fireEvent.change(insertQTAElement, { target: { value: 12 } });
        fireEvent.click(setQTABytton);

        //Check the function call
        await waitFor(() => expect(mockSetExpectedQuantityForProduct).toHaveBeenCalled());

    });

    //TEST #5
    test('check form button with uncorrect quantity', async () => {
        
        let d1 = dayjs("2018-06-05");

        const mockGetCurrentTimeGOOD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<ProductForm updatedQuantity={mockUpdatedQuantity} setExpectedQuantityForProduct={mockSetExpectedQuantityForProduct} getCurrentTime={mockGetCurrentTimeGOOD} />);

        //Check if the has the given parts
        const insertQTAElement = screen.getByPlaceholderText("Insert here the expected amount");
        const setQTABytton = screen.getByRole("button", {name: "Set expected amount"});

        //Fire the events
        fireEvent.change(insertQTAElement, { target: { value: -2 } });
        fireEvent.click(setQTABytton);

        expect(insertQTAElement.value).toBe("-2");

        //Check the function call
        await waitFor(() => expect(mockSetExpectedQuantityForProduct).not.toHaveBeenCalled());

    });

});


//######################################################## ProductList ########################################################//
describe("test the ProductList component", () => {

    //TEST #1
    test('check rendering', async () => {


        const fake_products = [
            {
                id: 1,
                name: "potato",
                price: 1.99
            },
            {
                id: 2,
                name: "tomato",
                price: 4.50
            }
        ];

        
        //Render the component
        const elemet = render(<ProductList products={fake_products} updatedQuantity={mockUpdatedQuantity} setExpectedQuantityForProduct={mockSetExpectedQuantityForProduct} getCurrentTime={mockGetCurrentTime} />);


        //Check the rendering
        let i = 0;
        for (i = 0; i < fake_products.length; i++){

            const exprN = new RegExp(`${fake_products[i].name}`, "i");
            const exprP = new RegExp(`${fake_products[i].price}`, "i");

            const prodName = screen.getByText(exprN);
            const prodPrice = screen.getByText(exprP);

            expect(prodName).toBeInTheDocument();
            expect(prodPrice).toBeInTheDocument();
        }

    });

});

//######################################################## FarmerPage ########################################################//
describe("test the FarmerPage component", () => {

    const MockComponent = ((props) => {
        return (
            <BrowserRouter>
                <FarmerPage></FarmerPage>
            </BrowserRouter>
        );
    });

    //TEST #1
    test('check rendering', async () => {
    
        //Render the component
        const elemet = render(<MockComponent/>);


        //Check the rendering
        const setProd = screen.getByText(/[Ss]et product amount/i);
        const confirmOrders = screen.getByText(/[Cc]onfirm [Oo]rders/i);

        expect(setProd).toBeInTheDocument();
        expect(confirmOrders).toBeInTheDocument();

    });

});


//######################################################## OrderList ########################################################//

describe("test the confirmOrdersSection component", () => {
    
    //TEST #1
    test('check rendering with correct time', async () => {
        
        let d1 = dayjs("2022-01-05");

        const mockGetCurrentTimeGOOD = jest.fn(() => d1);
        const mockOrders = [
            {
                id: 3,
                products: [
                    {
                        name: "Red Apple",
                        quantity: 4
                    }
                ],
                status: "pending"
            }
        ];
        const mockConfirmOrders = jest.fn(()=>{});

        //Render the component
        render(<OrderList getCurrentTime={mockGetCurrentTimeGOOD} updated={true} orders={mockOrders} confirmOrders={mockConfirmOrders}/>);

        //Check if the has the given parts
        const header = screen.getByText("Here is your list of orders to be confirmed");
        const orderNo = screen.getByText("Order number: 3");
        const name = screen.getByText("Red Apple");
        const quantity = screen.getByText("4");
        const button = screen.getByRole("button", {name: "Confirm order"});

        expect(header).toBeInTheDocument();
        expect(orderNo).toBeInTheDocument();
        expect(name).toBeInTheDocument();
        expect(quantity).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    //TEST #2
    test('check rendering with incorrect time', async () => {
        
        let d1 = dayjs("2022-01-03T01:00:00");

        const mockGetCurrentTimeGOOD = jest.fn(() => d1);
        const mockOrders = [];
        const mockConfirmOrders = jest.fn(()=>{});

        //Render the component
        render(<OrderList getCurrentTime={mockGetCurrentTimeGOOD} updated={true} orders={mockOrders} confirmOrders={mockConfirmOrders}/>);

        //Check if the has the given parts
        const warning = screen.getByText("Orders can be confirmed only from Monday at 9 am to Sunday at 11 pm");

        expect(warning).toBeInTheDocument();
    });

    //TEST #3
    test('check rendering with multiple orders', async () => {
        
        let d1 = dayjs("2022-01-05");

        const mockGetCurrentTimeGOOD = jest.fn(() => d1);
        const mockOrders = [
            {
                id: 3,
                products: [
                    {
                        name: "Red Apple",
                        quantity: 4
                    }
                ],
                status: "pending"
            },
            {
                id: 4,
                products: [
                    {
                        name: "Banana",
                        quantity: 1
                    }
                ],
                status: "pending"
            }
        ];
        const mockConfirmOrders = jest.fn(()=>{});

        //Render the component
        render(<OrderList getCurrentTime={mockGetCurrentTimeGOOD} updated={true} orders={mockOrders} confirmOrders={mockConfirmOrders}/>);

        //Check if the has the given parts
        const orderNo1 = screen.getByText("Order number: 3");
        const name1 = screen.getByText("Red Apple");
        const quantity1 = screen.getByText("4");
        const orderNo2 = screen.getByText("Order number: 4");
        const name2 = screen.getByText("Banana");
        const quantity2 = screen.getByText("1");
        const buttons = screen.getAllByRole("button", {name: "Confirm order"})

        expect(orderNo1).toBeInTheDocument();
        expect(name1).toBeInTheDocument();
        expect(quantity1).toBeInTheDocument();
        expect(orderNo2).toBeInTheDocument();
        expect(name2).toBeInTheDocument();
        expect(quantity2).toBeInTheDocument();
        expect(buttons.length).toBe(2);
    });

    //TEST #4
    test('check if confirm orders button works', async () => {
        
        let d1 = dayjs("2022-01-05");

        const mockGetCurrentTimeGOOD = jest.fn(() => d1);
        const mockOrders = [
            {
                id: 3,
                products: [
                    {
                        name: "Red Apple",
                        quantity: 4
                    }
                ],
                status: "pending"
            }
        ];
        const mockConfirmOrders = jest.fn(()=>{});

        //Render the component
        render(<OrderList getCurrentTime={mockGetCurrentTimeGOOD} updated={true} orders={mockOrders} confirmOrder={mockConfirmOrders}/>);

        //Check if the has the given parts
        const button = screen.getByRole("button", {name: "Confirm order"});

        fireEvent.click(button);

        await waitFor(() => expect(mockConfirmOrders).toHaveBeenCalled());
    });

});


/*
//######################################################## Farmer ########################################################//
describe("test the Farmer component", () => {

    //TEST #1
    test('check search farmer rendering', async () => {

        //Create a correct date
        let d1 = dayjs("2018-06-05");
        const mockGetCurrentTimeGOOD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<Farmer getCurrentTime={mockGetCurrentTimeGOOD} />);

        const insertFarmerElement = screen.getByPlaceholderText("Insert id, name or surname");
        const searchButton = screen.getByRole("button", {name: "Search products"});

        expect(insertFarmerElement).toBeInTheDocument();
        expect(searchButton).toBeInTheDocument();

    });

    //TEST #2
    test('check search farmer insertion', async () => {

        //Create a correct date
        let d1 = dayjs("2018-06-05");
        const mockGetCurrentTimeGOOD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<Farmer getCurrentTime={mockGetCurrentTimeGOOD} />);

        const insertFarmerElement = screen.getByPlaceholderText("Insert id, name or surname");

        //Check the isertion
        fireEvent.change(insertFarmerElement, { target: { value: 1 } });
        expect(insertFarmerElement.value).toBe("1");

        fireEvent.change(insertFarmerElement, { target: { value: "peppino" } });
        expect(insertFarmerElement.value).toBe("peppino");

    });

    //TEST #3
    test('check search farmer button', async () => {

        //Create a correct date
        let d1 = dayjs("2018-06-05");
        const mockGetCurrentTimeGOOD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<Farmer getCurrentTime={mockGetCurrentTimeGOOD} />);

        //get the elements I need
        const insertFarmerElement = screen.getByPlaceholderText("Insert id, name or surname");
        const searchButton = screen.getByRole("button", {name: "Search products"});

        //Insert farmer id
        fireEvent.change(insertFarmerElement, { target: { value: 1 } });
        expect(insertFarmerElement.value).toBe("1");

        
        //Now I need to check if the API are called...
        const mockGetProductsOfFarmer = jest.spyOn(API, 'getProductsOfFarmer');

        const responseBody = [
            {
                "id":1,
                "name":"Red Apple",
                "price":1.9
            },
            {
                "id":3,
                "name":"Banana",
                "price":0.99
            }
        ];

        mockGetProductsOfFarmer.mockImplementation(() => Promise.resolve(responseBody));

        //Click the button
        fireEvent.click(searchButton);

        //Check if the function is called
        expect(mockGetProductsOfFarmer).toHaveBeenCalled();

        //Check if the products are showing! (need to wait)
        await waitFor(() => {

            const appleElement = screen.getByText(/Red Apple/i);
            const bananaElement = screen.getByText(/Banana/i);

            expect(appleElement).toBeInTheDocument();
            expect(bananaElement).toBeInTheDocument();
        });
        
        //Restore it
        mockGetProductsOfFarmer.mockRestore();
        

    });


    //TEST #4
    test('check search farmer button with wrong response', async () => {

        //Create a correct date
        let d1 = dayjs("2018-06-05");
        const mockGetCurrentTimeGOOD = jest.fn(() => d1);

        //Render the component
        const elemet = render(<Farmer getCurrentTime={mockGetCurrentTimeGOOD} />);

        //get the elements I need
        const insertFarmerElement = screen.getByPlaceholderText("Insert id, name or surname");
        const searchButton = screen.getByRole("button", {name: "Search products"});

        //Insert farmer id
        fireEvent.change(insertFarmerElement, { target: { value: 100 } });
        expect(insertFarmerElement.value).toBe("100");

        
        //Now I need to check if the API are called...
        const mockGetProductsOfFarmer = jest.spyOn(API, 'getProductsOfFarmer');

        const responseBody = {error: "error"};

        mockGetProductsOfFarmer.mockImplementation(() => Promise.resolve(responseBody));

        //Click the button
        fireEvent.click(searchButton);

        //Check if the function is called
        expect(mockGetProductsOfFarmer).toHaveBeenCalled();

        //Check if the products are showing! (need to wait)
        await waitFor(() => {

            const errorElemet = screen.getByText(/[Ss]orry/i);
            expect(errorElemet).toBeInTheDocument();
        });
        
        //Restore it
        mockGetProductsOfFarmer.mockRestore();
        

    });


});
*/