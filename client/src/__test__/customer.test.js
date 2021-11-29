import { render, screen} from '@testing-library/react';
import { CustomerHome } from '../Site/customer.js'
import { BrowserRouter } from 'react-router-dom';

const mockNotifyBelance = jest.fn();
const mockNotifyQuantity = jest.fn();

//Create a fake environment for the component (actually useless for the CustomerSelection component but is for test if it works)
const MockComponent = ((props) => {

    return (
        <BrowserRouter>
            <CustomerHome user={props.fake_user} notifyBalance={props.fake_function_one} notifyQuantity={props.fake_function_two} />
        </BrowserRouter>
    );
});

//Create a descrie block for the test for that component
describe("test the CustomerHome component", () => {

    //TEST #1
    test('check wallet rendering', async () => {

        //Create a fake user object
        const fake_user = { userid : 1 };

        //Render the component
        const elemet = render(<MockComponent fake_user={fake_user} fake_function_one={mockNotifyBelance} fake_function_two={mockNotifyQuantity}/>);

        //Await to see the result!
        const walletIntoElement = await screen.findByText(/Amount on your wallet/i);

        //Test if it's present
        expect(walletIntoElement).toBeInTheDocument();

    });

    //TEST #2
    test('check basket button rendering', async () => {

        //Create a fake user object
        const fake_user = { userid : 1 };

        //Render the component
        const elemet = render(<MockComponent fake_user={fake_user} fake_function_one={mockNotifyBelance} fake_function_two={mockNotifyQuantity}/>);

        //Await to see the result!
        const backetButtonElement = await screen.findByRole("button", { name: /Basket/i });

        //Test if it's present
        expect(backetButtonElement).toBeInTheDocument();

    });
});
