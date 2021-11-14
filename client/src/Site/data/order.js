import Product from "./product"
import Customer from "./customer"
class Order {
    constructor(id,customer,state,delivery,total, listitems){
        this.id = id;
        this.customer = customer;
        this.state = state;
        this.delivery=delivery;
        this.total = total;
        this.listitems=listitems

    }

    static from(json){
        let list = json.listitems.map((ex) => Product.from(ex))
        return new Order(json.id, Customer.from(json.customer), json.state, json.delivery, json.total, list);
    }
}
export default Order;