import { render, screen, waitFor} from '@testing-library/react';
import { CancelationOrderList } from '../Site/Employee/cancelationorders.js'

import API from '../EmployeeAPI'
jest.mock('../EmployeeAPI');


const mockNotifyBelance = jest.fn();
const mockNotifyQuantity = jest.fn();

//Create a descrie block for the test for that component
describe("test the CancelationOrderList component", () => {

    //TEST #1
    test('check list rendering rendering', async () => {

        //Create the asnwer
        const result = [
                            {
                                "id":2,
                                "customerid":2,
                                "state":"delivered",
                                "delivery":"False",
                                "total":7.6,
                                "customerName":"marcello",
                                "customerSurname":"fumagalli",
                                "customerUsername":"marcello.fumagalli@polito.it",
                                "customerWallet":0
                            },
                            {
                                "id":3,
                                "customerid":9,
                                "state":"pending",
                                "delivery":"False",
                                "total":5.699999999999999,
                                "customerName":"Stefano",
                                "customerSurname":"Stefanono",
                                "customerUsername":"wewe@wewe.it",
                                "customerWallet":5
                            }
                        ];

        //Mock the API
        const mockGetOrdersWithInsufficientWalletBalance = jest.spyOn(API, 'getOrdersWithInsufficientWalletBalance');
        mockGetOrdersWithInsufficientWalletBalance.mockImplementation(() => Promise.resolve(result));

        //Render the component
        const elemet = render(<CancelationOrderList/>);

        //Check the info on the screen
        await waitFor(() => {

            //Get the delivered order (THAT SHOULD NOT APPEAR!)
            const name = screen.queryByText(/name: marcello/i);
            const surname = screen.queryByText(/surname: fumagalli/i);
            const username = screen.queryByText(/username: marcello.fumagalli@polito.it/i);
            const wallet = screen.queryByText(/wallet: 0/i);
            const total = screen.queryByText(/total: 7.6/i);

            //Test if it's present
            expect(name).not.toBeInTheDocument();
            expect(surname).not.toBeInTheDocument();
            expect(username).not.toBeInTheDocument();
            expect(wallet).not.toBeInTheDocument();
            expect(total).not.toBeInTheDocument();



            //Get the pending order (THAT SHOULD APPEAR!)
            const nameA = screen.queryAllByText(/name: Stefano/i);

            const surnameA = screen.queryByText(/surname: Stefanono/i);
            const usernameA = screen.queryByText(/username: wewe@wewe.it/i);
            const walletA = screen.queryByText(/wallet: 5/i);
            const totalA = screen.queryByText(/total: 5.7/i);

            //Test if it's present
            expect(nameA.length).toBe(2);
            expect(surnameA).toBeInTheDocument();
            expect(usernameA).toBeInTheDocument();
            expect(walletA).toBeInTheDocument();
            expect(totalA).toBeInTheDocument();
        });

        

    });
});
