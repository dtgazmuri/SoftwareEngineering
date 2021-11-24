import { render, screen, fireEvent } from '@testing-library/react';
import ProductListEmployee from '../Site/Employee/ProductList'
import { useEffect, useState } from "react";
import { ProductTableRow, ConfirmDeliveryPanel, ErrorCartModal, RecapCart } from '../Site/Employee/ProductList'
import { Container } from 'react-bootstrap';


//################################# ProductTableRow #################################/

//Create a descrie block for the test for that component
describe("test the ProductTableRow component", () => {

  //Define the pieces necessary for the tests
  const fakeGetBookedProduct = jest.fn().mockImplementation((id) => {
    return 333;
  });

  const fakeAddToCart = jest.fn();
  const fakeRemoveFromCart = jest.fn();

  //Render the component
  const fake_product = {
    id: 1,
    name: "pizza",
    farmer: {
      name: "paolo",
      surname: "cellamare"
    },
    price: 2.99,
    quantity: 20
  };


  //TEST #1
  test('check info showing right', async () => {

    const elemet = render(<ProductTableRow productData={fake_product} productIndex={1} getBookedProduct={fakeGetBookedProduct} />);

    //Check if the elements are showing right
    const prodNameColumn = screen.getByText("pizza");
    const farmerColumn = screen.getByText("paolo cellamare");
    const priceColumn = screen.getByText(/2.99 €/i);
    const quantityColumn = screen.getByText(/20/i);

    expect(prodNameColumn).toBeInTheDocument();
    expect(farmerColumn).toBeInTheDocument();
    expect(priceColumn).toBeInTheDocument();
    expect(quantityColumn).toBeInTheDocument();

  });

  //TEST #2
  test('check button presence', async () => {

    const elemet = render(<ProductTableRow productData={fake_product} productIndex={1} getBookedProduct={fakeGetBookedProduct} />);

    //Check if the elements are showing right
    const addB = screen.getByRole("button", { name: "+" });
    const removeB = screen.getByRole("button", { name: "-" });

    expect(addB).toBeInTheDocument();
    expect(removeB).toBeInTheDocument();

  });

  //TEST #3
  test('check fake getBookedQuantity function', async () => {

    const elemet = render(<ProductTableRow productData={fake_product} productIndex={1} getBookedProduct={fakeGetBookedProduct} />);

    //Check if the function is called
    expect(fakeGetBookedProduct).toHaveBeenCalled();
  });


  //TEST #4
  test('check button function calls', async () => {

    const elemet = render(<ProductTableRow productData={fake_product} productIndex={1} getBookedProduct={fakeGetBookedProduct} addOrder={fakeAddToCart} removeOrder={fakeRemoveFromCart} />);

    //Check if the elements are showing right
    const addB = screen.getByRole("button", { name: "+" });
    const removeB = screen.getByRole("button", { name: "-" });

    //Fire add and remove events
    fireEvent.click(addB);
    fireEvent.click(removeB);

    //Check if the functions are called
    expect(fakeAddToCart).toHaveBeenCalledTimes(1);
    expect(fakeRemoveFromCart).toHaveBeenCalledTimes(1);

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




  //TEST #1
  test('check form elements showing right', async () => {

    //Reender the element
    const elemet = render(<ConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={fake_delivery} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);

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
    const elemet = render(<ConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={fake_delivery} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);

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
    const elemet = render(<ConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={true} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);

    //Check if the panel shows up
    const deliveryTestBox = screen.getByPlaceholderText("Enter Address");
    expect(deliveryTestBox).toBeInTheDocument();

  });

  //TEST #4
  test('test delivery panel address insertion', async () => {

    //Reender the element
    const elemet = render(<ConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={true} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);

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
    const elemet = render(<ConfirmDeliveryPanel handleDelivery={fakeHandleDelivery} address={fake_address} setAddress={fakeSetAddress} delivery={true} date={fake_date} time={fake_time} setTime={fakeSetTime} setDate={fakeSetDate} handleShow={fakeHandleShow} />);

    //Get the button
    const confirmButton = screen.getByRole("button", { name: "Confirm Order" });

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
    const elemet = render(<RecapCart order={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} />);

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
    render(<RecapCart order={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} />);

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
    render(<RecapCart order={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} />);

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
    render(<RecapCart order={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} />);

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
    render(<RecapCart order={fake_order} handleClose={fakeHandleClose} show={true} handleSubmit={fakeHandleSubmit} address={fake_address} delivery={fake_delivery} date={fake_date} time={fake_time} />);

    const cancelB = screen.getByRole("button", {name: "Cancel"});
    const saveB = screen.getByRole("button", {name: "Save"});

    fireEvent.click(cancelB);
    fireEvent.click(saveB);

    expect(fakeHandleClose).toHaveBeenCalled();
    expect(fakeHandleSubmit).toHaveBeenCalled();

  });
});






/*
  //Get the text area
        const textArea = screen.getByPlaceholderText("Insert amount to add to wallet");

        //Fire an event
        fireEvent.change(textArea, { target: { value: "100" } });

        //Check the new value!
        expect(textArea.value).toBe("100");
    */

/*
    //Trigger the select user event
    const inputElement = screen.getByTitle("select-statement");
    fireEvent.change(inputElement, { target: { value: "pippo franco" } });

    //Check if the function is called once
    expect(mockHandleCustomer).toHaveBeenCalled();

    //Get the first line and check if it works
    //const firstLineTr = await screen.findByTestId("product-item-0");
    */