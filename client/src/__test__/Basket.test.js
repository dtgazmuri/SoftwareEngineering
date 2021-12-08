import { render, screen, fireEvent } from '@testing-library/react';
import { BasketButton, BasketItem, Basket } from '../Site/Customer/Basket.js'

import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';



//######################################################## BasketButton ########################################################//
describe("test the BasketButton component", () => {

    const mockNotifyBelance = jest.fn();
    const mockNotifyQuantity = jest.fn();
    const fake_wallet = 100;

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


//######################################################## BasketItem ########################################################//
describe("test the BasketItem component", () => {

    const mockNotifyBelance = jest.fn();
    const mockNotifyQuantity = jest.fn();
    const mockSetChangeBasket = jest.fn();

    const fake_product = {
        id:3,
        name:"Banana",
        farmer: {name: "piero", surname: "pappino"},
        price:0.99,
        quantity:2
    };

    //TEST #1
    test('check rendering', async () => {

        //Render the component
        const elemet = render(<BasketItem product={fake_product} notifyBalance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity} setChangeBasket={mockSetChangeBasket}/>);

        const nameEl = screen.getByText(/[Bb]anana/i);
        const buttons = screen.getAllByRole("button");
        const priceEl = screen.getByText(/1.98/i);            //product of quantity * price

        expect(nameEl).toBeInTheDocument();
        expect(priceEl).toBeInTheDocument();
        expect(buttons.length).toBe(2);

    });

    //TEST #2
    test('check button pressed', async () => {

        //Render the component
        const elemet = render(<BasketItem product={fake_product} notifyBalance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity} setChangeBasket={mockSetChangeBasket}/>);

        const buttons = screen.getAllByRole("button");

        //Check pressed
        fireEvent.click(buttons[0]);
        await waitFor(() => expect(mockSetChangeBasket).toHaveBeenCalled());

        fireEvent.click(buttons[1]);
        await waitFor(() => expect(mockSetChangeBasket).toHaveBeenCalled());
    });
});



//######################################################## Basket ########################################################//
describe("test the Basket component", () => {

    const fake_user = {userid: 1, username: "pippo@pippo.it"};

    const mockSetMessage = jest.fn();
    const mockNotifyBelance = jest.fn();
    const mockNotifyQuantity = jest.fn();

    //TEST #1
    test('check rendering', async () => {

        //Render the component
        const elemet = render(<Basket user={fake_user} setMessage={mockSetMessage} notifyBalance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity} />);

        //Check major components rendering
        /*
        await waitFor(() => {
            screen.debug();
            const nameEl = screen.getByText(/[Nn]ame/i);
            expect(nameEl).toBeInTheDocument();
        });

        screen.debug();
        */
       
        //const priceEl = await screen.findByText(/[Pp]rice/i);

        /*
        const nameEl = screen.getByText(/[Nn]ame/i);
        const priceEl = screen.getByText(/[Pp]rice/i);
        const walletEl = screen.getByText(/[Ww]allet/i);
        const totalEl = screen.getByText(/[Tt]otal/i);

        expect(nameEl).toBeInTheDocument();
        expect(priceEl).toBeInTheDocument();
        expect(walletEl).toBeInTheDocument();
        expect(totalEl).toBeInTheDocument();
        */

    });
});