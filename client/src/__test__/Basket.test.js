import { render, screen, fireEvent } from '@testing-library/react';
import { BasketButton } from '../Site/Customer/Basket.js'

import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';


const mockNotifyBelance = jest.fn();
const mockNotifyQuantity = jest.fn();
const fake_wallet = 100;

//######################################################## BasketButton ########################################################//
describe("test the BasketButton component", () => {

    const fake_product = {
        id:3,
        name:"Banana",
        farmer: {name: "piero", surname: "pappino"},
        price:0.99,
        quantity:0
    };

    //TEST #1
    test('check rendering', async () => {

        //Define the mock function? I don't know if this props is ALWAYS a function afterall...
        const mockSetChangeBasket = jest.fn();

        //Render the component
        const elemet = render(<BasketButton product={fake_product} mode="add" wallet={fake_wallet} notifyBalance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity} setChangeBasket={mockSetChangeBasket}/>);

        //Check Rendering
        const button = screen.getByRole("button");

        expect(button).toBeInTheDocument();
    });

    //TEST #2
    test('check pressed - add', async () => {

        //Define the mock function? I don't know if this props is ALWAYS a function afterall...
        const mockSetChangeBasket = jest.fn();

        //Render the component
        const elemet = render(<BasketButton product={fake_product} mode="add" wallet={fake_wallet} notifyBalance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity} setChangeBasket={mockSetChangeBasket}/>);

        //Check Rendering
        const button = screen.getByRole("button");

        //Check pressed
        fireEvent.click(button);

        //Check function call
        await waitFor(() => expect(mockSetChangeBasket).toHaveBeenCalled());

    });


     //TEST #3
     test('check pressed - delete', async () => {

        //Define the mock function? I don't know if this props is ALWAYS a function afterall...
        const mockSetChangeBasket = jest.fn();

        //Render the component
        const elemet = render(<BasketButton product={fake_product} mode="delete" wallet={fake_wallet} notifyBalance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity} setChangeBasket={mockSetChangeBasket}/>);

        //Check Rendering
        const button = screen.getByRole("button");

        //Check pressed
        fireEvent.click(button);

        //Check function call
        await waitFor(() => expect(mockSetChangeBasket).toHaveBeenCalled());

    });

    //TEST #4
    test('check notify belance', async () => {

        const fake_test_product = {
            id:3,
            name:"Banana",
            farmer: {name: "piero", surname: "pappino"},
            price:50.99,
            quantity:100
        };

        //Define the mock function? I don't know if this props is ALWAYS a function afterall...
        const mockSetChangeBasket = jest.fn();

        //Render the component
        const elemet = render(<BasketButton product={fake_test_product} mode="add" wallet={fake_wallet} notifyBalance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity} setChangeBasket={mockSetChangeBasket}/>);

        //Check Rendering
        const button = screen.getByRole("button");

        //Check pressed
        fireEvent.click(button);

        //Check function call
        await waitFor(() => expect(mockSetChangeBasket).toHaveBeenCalled());

        //Press again and check if it's called
        fireEvent.click(button);
        await waitFor(() => expect(mockNotifyBelance).toHaveBeenCalled());
    });

    
});