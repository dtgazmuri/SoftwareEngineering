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
            quantity:0,
            availability:32
        },
        {
            id:2,
            name:"Kiwi",
            farmer: {name: "piero", surname: "pappino"},
            price:3.55,
            quantity:0,
            availability:44
        },
        {
            id:3,
            name:"Banana",
            farmer: {name: "piero", surname: "pappino"},
            price:0.99,
            quantity:0,
            availability:56
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
            const availability = screen.getByText(`${fake_products[i].availability}`);

            expect(el).toBeInTheDocument();
            expect(priceEl).toBeInTheDocument();
            expect(availability).toBeInTheDocument();
        }

        //Check farmers
        const farmerEl = screen.getAllByText(/piero pappino/i);
        expect(farmerEl.length).toBe(3);
        
    });

    //TEST #2
    test('check the buttons presence and the show', async () => {
        
        //Render the component
        const elemet = render(<ProductList debug_product_list={fake_products} wallet={fale_wallet} notifyBelance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity}/>);


        //add_remove_basket_button
        const button_num = screen.getAllByTitle("add_remove_basket_button");
        expect(button_num.length).toBe(6);

    });

    /*
    //TEST #3
    test('check the button pressed', async () => {

        const fake_product_one = [
            {
                id:1,
                name:"Red Apple",
                farmer: {name: "piero", surname: "pappino"},
                price:1.9,
                quantity:0
            },
        ];

         //Render the component
         const elemet = render(<ProductList debug_product_list={fake_product_one} wallet={fale_wallet} notifyBelance={mockNotifyBelance} notifyQuantity={mockNotifyQuantity}/>);


         //add_remove_basket_button
         const button_num = screen.getAllByTitle("add_remove_basket_button");
         expect(button_num.length).toBe(2);

         //Press the buttons and check rendering og quantity
    });
    */
});