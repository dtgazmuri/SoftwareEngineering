import { render, screen, fireEvent } from '@testing-library/react';
import { BasketButton, BasketItem, Basket } from '../Site/Customer/Basket.js';

import { useState } from "react";
import { Container } from 'react-bootstrap';

import { ConfirmDeliveryPanel, ErrorCartModal, RecapCart } from '../Site/Customer/Basket.js'

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








//################################# ConfirmDeliveryPanel #################################//

//Create a descrie block for the test for that component
describe("test the ConfirmDeliveryPanel component", () => {

    //<ConfirmDeliveryPanel handleDelivery={handleDelivery} address={address} setAddress={setAddress} delivery={delivery} date={date} time={time} setTime={setTime} setDate={setDate} handleShow={handleShow}></ConfirmDeliveryPanel>
  
    const fakeHandleDelivery = jest.fn();
    const fakeSetAddress = jest.fn();
    const fakeSetDate = jest.fn();
    const fakeSetTime = jest.fn();
    const fakeHandleShow = jest.fn();
  
    const fake_address = "[fake_address]"
    const fake_date = "[fake_date]";
    const fake_time = "[fake_time]";
  
    const fake_delivery = false;
  
  
    const MockConfirmDeliveryPanel = (props) => {
        return (
            <BrowserRouter>
                <ConfirmDeliveryPanel handleDelivery={props.handleDelivery} address={props.address} setAddress={props.setAddress} delivery={props.delivery} date={props.date} time={props.time} setTime={props.setTime} setDate={props.setDate} handleShow={props.handleShow} />
            </BrowserRouter>
        );
    }
  
    //TEST #1
    test('check form elements showing right', async () => {
  
      //Reender the element
      const elemet = render(<MockConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={fake_delivery} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);
  
      //Check if the form elements are showing right
      const dateFormTextArea = screen.getByTitle("insert-date");
      const timeFormTextArea = screen.getByTitle("insert-time");
      const deliveryFormCheckbox = screen.getByTitle("insert-delivery");
  
      expect(dateFormTextArea).toBeInTheDocument();
      expect(timeFormTextArea).toBeInTheDocument();
      expect(deliveryFormCheckbox).toBeInTheDocument();
  
    });
  
    //TEST #2
    test('check form elements insertion', async () => {
  
      //Reender the element
      const elemet = render(<MockConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={fake_delivery} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);
  
      //Check if the form elements are showing right
      const dateFormTextArea = screen.getByTitle("insert-date");
      const timeFormTextArea = screen.getByTitle("insert-time");
      const deliveryFormCheckbox = screen.getByTitle("insert-delivery");
  
      fireEvent.change(dateFormTextArea, { target: { value: "data_pippo" } });
      fireEvent.change(timeFormTextArea, { target: { value: "ora_pippo" } });
  
      //Check function called
      fireEvent.click(deliveryFormCheckbox);
      expect(fakeHandleDelivery).toHaveBeenCalled();
  
    });
  
    //TEST #3
    test('test delivery panel shows up', async () => {
  
      //Reender the element
      const elemet = render(<MockConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={true} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);
  
      //Check if the panel shows up
      const deliveryTestBox = screen.getByPlaceholderText("Enter Address");
      expect(deliveryTestBox).toBeInTheDocument();
  
    });
  
    //TEST #4
    test('test delivery panel address insertion', async () => {
  
      //Reender the element
      const elemet = render(<MockConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={true} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);
  
      //Check if the panel shows up
      const deliveryTextBox = screen.getByPlaceholderText("Enter Address");
  
      //Fire event
      fireEvent.change(deliveryTextBox, { target: { value: "fake_address" } });
  
      //Check function called
      expect(fakeSetAddress).toHaveBeenCalled();
  
    });
  
    //TEST #5
    test('test delivery panel confirm button', async () => {
  
      //Reender the element
      const elemet = render(<MockConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={true} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);
  
      //Get the button
      const confirmButton = screen.getByRole("button", { name: "Place Order Request" });
  
      fireEvent.click(confirmButton);
  
      //Check function called
      expect(fakeHandleShow).toHaveBeenCalled();
  
    });
  
  });
  
  
  
  //################################# ErrorCartModal #################################//
  
  //Create a descrie block for the test for that component
  describe("test the ErrorCartModal component", () => {
  
    //<ConfirmDeliveryPanel handleDelivery={handleDelivery} address={address} setAddress={setAddress} delivery={delivery} date={date} time={time} setTime={setTime} setDate={setDate} handleShow={handleShow}></ConfirmDeliveryPanel>
  
    const fake_message = "fake_error_message";
    const fake_show = true;
    const fakeHandleClose = jest.fn();
  
    //Create a fake environment for the component (actually useless for the CustomerSelection component but is for test if it works)
    const MockWrapper = ((props) => {
  
      const [show, setShow] = useState(true);
  
      const mockHandle = (() => {
        setShow(false);
      });
  
      return (
        <Container>
          {
            show ?
              <>
                <ErrorCartModal show={show} errorMessage={props.fake_message} handleClose={mockHandle} />
              </>
              :
              <>
              </>
          }
  
        </Container>
      );
    });
  
    //TEST #1
    test('check form elements showing right', async () => {
  
      //Reender the element
      const elemet = render(<ErrorCartModal show={fake_show} errorMessage={fake_message} handleClose={fakeHandleClose} />);
  
      //Check if the form elements are showing right
      const messageText = screen.getByText(fake_message);
      const okButton = screen.getByRole("button", { name: "Ok" });
  
      expect(messageText).toBeInTheDocument();
      expect(okButton).toBeInTheDocument();
  
  
    });
  
    //TEST #2
    test('check close', async () => {
  
      //Reender the element
      const elemet = render(<MockWrapper fake_message={fake_message} />);
  
      //Check if the form elements are showing right
      const messageText = screen.getByText(fake_message);
      const okButton = screen.getByRole("button", { name: "Ok" });
  
      expect(messageText).toBeInTheDocument();
      expect(okButton).toBeInTheDocument();
  
      //Fire event
      fireEvent.click(okButton);
  
      //Check if something change!
      const messageTextVoid = screen.queryByText(fake_message);
      const okButtonVoid = screen.queryByText("button", { name: "Ok" });
  
      expect(messageTextVoid).not.toBeInTheDocument();
      expect(okButtonVoid).not.toBeInTheDocument();
    });
  
  });
  
  
  //################################# RecapCart #################################//
  
  
  
  
  //Create a descrie block for the test for that component
  describe("test the RecapCart component", () => {
  
    //<RecapCart order={order} handleClose={handleClose} show={show} handleSubmit={handleSubmit} address={address} delivery={delivery} date={date} time={time} />
  
    const fakeHandleClose = jest.fn();
    const fakeHandleSubmit = jest.fn();
  
    const fake_address = "[fake_address]"
    const fake_date = "[fake_date]";
    const fake_time = "[fake_time]";
  
    const mockSetOrderDate = jest.fn();
    const mockSetOrderTime = jest.fn();
    const fakeOrderTime = "[fake_order_time]";
    const fakeOrderDate = "[fake_order_date]"
  
  
    //TEST #1
    test('check form elements showing right', async () => {
  
      const fake_order = [
        {
          id: 1, 
          name: "Red Apple", 
          price: 1.9
        },
        { 
          id: 2, 
          name: "Kiwi", 
          price: 3.55 
        }
      ];
  
      const fake_delivery = false;
  
      //Reender the element
  
      //<RecapCart order={order} handleClose={handleClose} show={show} handleSubmit={handleSubmit} address={address} delivery={delivery} date={date} time={time} setOrderDate={setOrderDate} setOrderTime={setOrderTime} orderTime={orderTime} orderDate={orderDate}/>
  
      const elemet = render(<RecapCart items={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} setOrderDate={mockSetOrderDate} setOrderTime={mockSetOrderTime} orderTime={fakeOrderTime} orderDate={fakeOrderDate}/>);
  
      //Check if all order element are present
      let i = 0;
      for (i = 0; i < fake_order.length; i++){
        const roww = screen.getByText(fake_order[i].name);
        expect(roww).toBeInTheDocument();
      }
    });
  
    //TEST #2 A
    test('check delivery 1', async () => {
  
      const fake_order = [
        {
          id: 1, 
          name: "Red Apple", 
          price: 1.9
        },
        { 
          id: 2, 
          name: "Kiwi", 
          price: 3.55 
        }
      ];
  
      let fake_delivery = false;
  
      //Reender the element
      render(<RecapCart items={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} setOrderDate={mockSetOrderDate} setOrderTime={mockSetOrderTime} orderTime={fakeOrderTime} orderDate={fakeOrderDate}/>);
  
      const el1 = screen.getByText("Pick-up at the shop");
      expect(el1).toBeInTheDocument();
  
    });
  
    //TEST #2 B
    test('check delivery 2', async () => {
  
      const fake_order = [
        {
          id: 1, 
          name: "Red Apple", 
          price: 1.9
        },
        { 
          id: 2, 
          name: "Kiwi", 
          price: 3.55 
        }
      ];
  
      let fake_delivery = true;
  
      //Reender the element
      render(<RecapCart items={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} setOrderDate={mockSetOrderDate} setOrderTime={mockSetOrderTime} orderTime={fakeOrderTime} orderDate={fakeOrderDate}/>);
  
      const el1 = screen.queryByText("Pick-up at the shop");
      expect(el1).not.toBeInTheDocument();
  
    });
  
    //TEST #3
    test('check buttons presence', async () => {
  
      const fake_order = [
        {
          id: 1, 
          name: "Red Apple", 
          price: 1.9
        },
        { 
          id: 2, 
          name: "Kiwi", 
          price: 3.55 
        }
      ];
  
      let fake_delivery = true;
  
      //Reender the element
      render(<RecapCart items={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} setOrderDate={mockSetOrderDate} setOrderTime={mockSetOrderTime} orderTime={fakeOrderTime} orderDate={fakeOrderDate}/>);
  
      const cancelB = screen.getByRole("button", {name: "Cancel"});
      const saveB = screen.getByRole("button", {name: "Save"});
  
      expect(cancelB).toBeInTheDocument();
      expect(saveB).toBeInTheDocument();
  
    });
  
    //TEST #4
    test('check buttons calls', async () => {
  
      const fake_order = [
        {
          id: 1, 
          name: "Red Apple", 
          price: 1.9
        },
        { 
          id: 2, 
          name: "Kiwi", 
          price: 3.55 
        }
      ];
  
      let fake_delivery = true;
  
      //Reender the element
      render(<RecapCart items={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} setOrderDate={mockSetOrderDate} setOrderTime={mockSetOrderTime} orderTime={fakeOrderTime} orderDate={fakeOrderDate}/>);
  
      const cancelB = screen.getByRole("button", {name: "Cancel"});
      const saveB = screen.getByRole("button", {name: "Save"});
  
      fireEvent.click(cancelB);
      fireEvent.click(saveB);
  
      expect(fakeHandleClose).toHaveBeenCalled();
      expect(fakeHandleSubmit).toHaveBeenCalled();
  
    });
  });
  