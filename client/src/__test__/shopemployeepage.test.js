import { render, screen, fireEvent } from '@testing-library/react';
import MyPage from '../Site/Employee/shopemployeepage'

import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';

const MockSingupForm = ((props) => {
    return (
        <BrowserRouter>
            <MyPage />
        </BrowserRouter>
    );
});

//######################################################## MyPage ########################################################//
describe("test the MyPage component", () => {

    //TEST #1
    test('check rendering', async () => {
        
        //Render the component
        const elemet = render(<MockSingupForm />);

        const newClientEl = screen.getByText(/Create new Client/i);
        const topUpWalletEl = screen.getByText(/Top Up Wallet/i);
        const showProductsEl = screen.getByText(/Show products/i);
        const handoutOrderEl = screen.getByText(/Handout Order/i);
        const orderPendingCalncelationEl = screen.getByText(/Orders pending cancelation/i);

        expect(newClientEl).toBeInTheDocument();
        expect(topUpWalletEl).toBeInTheDocument();
        expect(showProductsEl).toBeInTheDocument();
        expect(handoutOrderEl).toBeInTheDocument();
        expect(orderPendingCalncelationEl).toBeInTheDocument();

    });
});