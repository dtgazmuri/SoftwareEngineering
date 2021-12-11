import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from '../Site/Customer/ProductList.js'

import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';


const mockNotifyBelance = jest.fn();
const mockNotifyQuantity = jest.fn();
const fale_wallet = 100;

//######################################################## ProductList ########################################################//
describe("test the ProductList component", () => {

    const fake_products = [
        {
            id:1,
            name:"Red Apple",
            farmer: {name: "piero", surname: "pappino"},
            price:1.9,
            quantity:0
        },
        {
            id:2,
            name:"Kiwi",
            farmer: {name: "piero", surname: "pappino"},
            price:3.55,
            quantity:0
        },
        {
            id:3,
            name:"Banana",
            farmer: {name: "piero", surname: "pappino"},
            price:0.99,
            quantity:0
        }
    ];

    //TEST #1
    test('check rendering', async () => {


        //Render the component
        const elemet = render(<ProductList debug_product_list={fake_products} wallet={fale_wallet} notifyBelance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity}/>);

        //Check if the products are showing right
        let i = 0;
        for (i = 0; i < fake_products.length; i++){
            const el = screen.getByText(fake_products[i].name);
            const priceEl = screen.getByText(`${fake_products[i].price} €`);

            expect(el).toBeInTheDocument();
            expect(priceEl).toBeInTheDocument();
        }

        //Check farmers
        const farmerEl = screen.getAllByText(/piero pappino/i);
        expect(farmerEl.length).toBe(3);

        //Check buttons
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBe(6);
        
    });
});