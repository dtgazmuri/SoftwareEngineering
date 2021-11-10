import Button from "@restart/ui/esm/Button";
import { Form,Col, Row, Table } from "react-bootstrap";

function ProductList(props){




    const addbutton = <Button onClick={{/*add product to the cart*/}}>+</Button>
    const productlist = props.products.map( (prod,id) => {
        return <tr>
            <td>{prod.id}</td>
            <td>{prod.name}</td>
            <td>{prod.farmer.name}</td> {/*da cambiare, meglio avere il nome del farmer */}
            <td>{prod.quantity}</td>
            <td>{prod.price}</td>
            <td>{addbutton}</td>
        </tr>
    });

    return(
        <Table responsive>
         <thead>
            <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Farmer</th>
            <th>Expected Quantity</th>
            <th>Price</th>
            <th>Add to the cart</th>
            </tr>
        </thead>
        <tbody>
            {productlist}
        </tbody>
        </Table>
    )





}

export default ProductList;