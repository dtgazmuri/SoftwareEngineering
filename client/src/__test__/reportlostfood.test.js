import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';

import { ReportLostFood, DisplayOrder } from '../Site/Employee/reportlostfood';
import API from '../EmployeeAPI';
import API2 from '../API';

const PageMock= ((props) => {
    return (
        <BrowserRouter>
            <ReportLostFood getCurrentTime = {props.getCurrentTime}/>
        </BrowserRouter>
    );
});

//######################################################## MyPage ########################################################//
describe("test the ReportLostFood component", () => {
    /*const getCorrectTime = jest.fn().mockImplementation(
        () => {
            return "Saturday 01/January/2022 00:00";
        }
    );*/
    
    const getCorrectTime = () => {
        return "Saturday 01/January/2022 00:00";
    }
    const getBadTime = () => {
        return "Friday 31/December/2021 00:00";
    }
    //TEST #1
    test('check rendering when time is correct', async () => {
        
        //Render the component
        render(<PageMock getCurrentTime = {getCorrectTime}/>);

        const title = screen.getByText(/Report Lost Products/i);
        const subtitle = screen.getByText(/Food that is not received by a client is lost. Report here when an entire order or a specific product is lost./i);
        const insertLostProduct = screen.getByText(/Insert lost product/i);
        const entireOrderLost = screen.getByText(/Report that an entire order was lost/i);
        const error = screen.queryByText(/Orders not handed out can only be reported between Fridays at 21:00 and Sundays at 23:59./i);
        
        expect(title).toBeInTheDocument();
        expect(subtitle).toBeInTheDocument();
        expect(insertLostProduct).toBeInTheDocument();
        expect(entireOrderLost).toBeInTheDocument();
        expect(error).not.toBeInTheDocument();
        
    });
    
    //TEST #2
    test('check rendering when time is wrong', async () => {
        
        //Render the component
        render(<PageMock getCurrentTime = {getBadTime}/>);

        const title = screen.getByText(/Report Lost Products/i);
        const subtitle = screen.getByText(/Food that is not received by a client is lost. Report here when an entire order or a specific product is lost./i);
        const insertLostProduct = screen.queryByText(/Insert lost product/i);
        const entireOrderLost = screen.queryByText(/Report that an entire order was lost/i);
        const error = screen.getByText(/Orders not handed out can only be reported between Fridays at 21:00 and Sundays at 23:59./i);

        expect(title).toBeInTheDocument();
        expect(subtitle).toBeInTheDocument();
        expect(insertLostProduct).not.toBeInTheDocument();
        expect(entireOrderLost).not.toBeInTheDocument();
        expect(error).toBeInTheDocument();
    });

    //TODO: test what happens after clicking on "Insert lost product"
    //TEST#3
    test('check click on Insert lost product', async () => {
        const fake_order = {};
        const fake_products = [{name: "carrots"}, {name: "apples"}];

        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        const responseBody = fake_order;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));

        //Define a mock function
        const mockProducts = jest.spyOn(API2, 'fetchAllProducts');
        const responseBody2 = fake_products;
        mockProducts.mockImplementation(() => Promise.resolve(responseBody2));

        //Render the component
        render(<PageMock getCurrentTime = {getCorrectTime}/>);

        await waitFor(() => {
            //get the button
            const insertLostProduct = screen.getByText("Insert lost product");
            expect(insertLostProduct).toBeInTheDocument();
        });

        act(() => {
            const insertLostProduct = screen.getByText("Insert lost product");
            expect(insertLostProduct).toBeInTheDocument();
            //click on button
            fireEvent.click(insertLostProduct);
        });
        
        //check the new screen
        await waitFor(() => {
            //expect(screen.getByText('You can filter by product name.')).toBeInTheDocument();
            expect(screen.getByText('Please enter all data properly')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Search product')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Amount lost')).toBeInTheDocument();
            expect(screen.getByText('Confirm')).toBeInTheDocument();
            expect(screen.getByText('---select---')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(screen.getByPlaceholderText('Amount lost'), {target: {value: "a"}});
            fireEvent.change(screen.getByText('---select---'), {target: {value: 'Carrots'}});

            const confirm = screen.getByText("Confirm");
            expect(confirm).toBeInTheDocument();
            //click on button
            fireEvent.click(confirm);
        });

        await waitFor(() => {
            expect(screen.getByText('Quantity entered is not a number')).toBeInTheDocument();
        });
        
        
        act(() => {
            const insertLostProduct = screen.getByText("Insert lost product");
            expect(insertLostProduct).toBeInTheDocument();
            //click on button
            fireEvent.click(insertLostProduct);
        });
        
        //check the new screen
        await waitFor(() => {
            //expect(screen.getByText('You can filter by product name.')).not.toBeInTheDocument();
            expect(screen.queryByText('Please enter all data properly')).not.toBeInTheDocument();
            expect(screen.queryByPlaceholderText('Search product')).not.toBeInTheDocument();
            expect(screen.queryByPlaceholderText('Amount lost')).not.toBeInTheDocument();
            expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
            expect(screen.queryByText('---select---')).not.toBeInTheDocument();
        });
    });

    //TEST#4
    test('check click on Report that an entire order was lost', async () => {  
        const fake_products = [
            {id: 5, orderid: 65, price: 1.99, productid: 1, quantity: 1},
            {id: 6, orderid: 65, price: 1.98, productid: 5, quantity: 2}
        ];
        const fake_orders = [{customerid: 25, delivery: "False", id: 65, state: "pending", total: 6.46, 
            username: "miriam.smith@gmail.com",
            products : fake_products
        }];
        //Define a mock function
        const mockGetOrders = jest.spyOn(API, 'getOrders');
        const responseBody = fake_orders;
        mockGetOrders.mockImplementation(() => Promise.resolve(responseBody));

        //Define a mock function
        const mockProducts = jest.spyOn(API2, 'fetchAllProducts');
        const responseBody2 = fake_products;
        mockProducts.mockImplementation(() => Promise.resolve(responseBody2));

        //Render the component
        render(<PageMock getCurrentTime = {getCorrectTime}/>);

        await waitFor(() => {
            //get the button
            const reportLost = screen.getByText(/Report that an entire order was lost/i);
            expect(reportLost).toBeInTheDocument();
        });

        act(() => {
            const reportLost = screen.getByText(/Report that an entire order was lost/i);
            expect(reportLost).toBeInTheDocument();
            //click on button
            fireEvent.click(reportLost);
        });
        
        //check the new screen
        await waitFor(() => {
            expect(screen.getByText(`Order number ${fake_orders[0].id}`)).toBeInTheDocument();
            expect(screen.getByText(`Items in order: ${fake_orders[0].products.length}`)).toBeInTheDocument();
            expect(screen.getByRole('button', {name: 'Report as lost'})).toBeInTheDocument();
            
        });
        
        act(() => {
            const reportLost = screen.getByText(/Report that an entire order was lost/i);
            expect(reportLost).toBeInTheDocument();
            //click on button again
            fireEvent.click(reportLost);
        });
        
        //check the new screen - infos have to be not displayed
        await waitFor(() => {
            expect(screen.queryByText(`Order number ${fake_orders[0].id}`)).not.toBeInTheDocument();
            expect(screen.queryByText(`Items in order: ${fake_orders[0].products.length}`)).not.toBeInTheDocument();
            expect(screen.queryByRole('button', {name: 'Report as lost'})).not.toBeInTheDocument();
        });
    });
    
});
describe("test the Display Order component", () => {
    const orderWithProducts = {
        customerid: 9,
        delivery: "False",
        id: 3,
        products: [{id: 4,orderid: 3,price: 1.9,productid: 1,quantity: 3}],
        state: "pending",
        total: 5.7,
        username: "wewe@wewe.it",
    }; 
    const orderWithoutProducts = {
        customerid: 9,
        delivery: "False",
        id: 2,
        products: [],
        state: "pending",
        total: 0,
        username: "wewe@wewe.it",
    }  
    //TEST #1
    test('check rendering when order has products', async () => {
        
        //Render the component
        render(<DisplayOrder order = {orderWithProducts}/>);

        const title = screen.getByText('Order number 3', {exact: false});
        const subtitle = screen.getByText('Items in order: 1', {exact: false});
        const button = screen.getByRole('button', {name: 'Report as lost'});

        expect(title).toBeInTheDocument();
        expect(subtitle).toBeInTheDocument();
        expect(button).toBeInTheDocument();        
    });
    //TEST #2
    test('check rendering when order has no products', async () => {
        
        //Render the component
        render(<DisplayOrder order = {orderWithoutProducts}/>);

        const title = screen.getByText('Order number 2', {exact: false});
        const subtitle = screen.getByText('Order Empty', {exact: false});
        const button = screen.getByRole('button', {name: 'Report as lost'});

        expect(title).toBeInTheDocument();
        expect(subtitle).toBeInTheDocument();
        expect(button).toBeInTheDocument();  
        
    });
    //TEST #3
    test('check click on report as lost and confirm', async () => {
        const mockLostOrderStatus = jest.spyOn(API, 'lostOrderStatus');
        const responseBody = 1;
        mockLostOrderStatus.mockImplementation(() => Promise.resolve(responseBody));

        const getCorrectTime = () => {
            return "Saturday 01/January/2022 00:00";
        }
        const fake_products = [
            {id: 1, price: 1.99, quantity: 1, name: "Pumpkin"},
            {id: 6, price: 1.98, quantity: 2, name: "Apples"}
        ];

        
        //Render the component
        render(<DisplayOrder order = {orderWithProducts} productList={fake_products} getCurrentTime={getCorrectTime} />);

        const title = screen.getByText('Order number 3', {exact: false});
        const subtitle = screen.getByText('Items in order: 1', {exact: false});
        const button = screen.getByRole('button', {name: 'Report as lost'});

        expect(title).toBeInTheDocument();
        expect(subtitle).toBeInTheDocument();
        expect(button).toBeInTheDocument();  

        act(() => {
            //click on button
            fireEvent.click(button);
        });
        await waitFor(() => {
            expect(screen.getByText("Are you sure? This can't be undone")).toBeInTheDocument();
            expect(screen.getByRole('button', {name: 'Confirm'})).toBeInTheDocument();
        });
        act(() => {
            //click on confirm
            const confirm = screen.getByRole('button', {name: 'Confirm'});
            expect(confirm).toBeInTheDocument();
            fireEvent.click(confirm);
        });
        await waitFor(() => {
            expect(screen.queryByText("Food from order reported as lost correctly")).toBeInTheDocument();
            expect(screen.queryByRole('button', {name: 'Confirm'})).not.toBeInTheDocument();
        });
        
        
    });

});