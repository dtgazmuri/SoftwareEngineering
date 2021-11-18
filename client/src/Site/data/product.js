class Product {
        /**
     * Create a new Product
     * @param {*} id product id
     * @param {*} name name of the product
     * @param {*} farmer farmer who sell the product
     * @param {*} price price of the product
     * @param {*} quantity ?
    
    */


    constructor(id, name, farmer, price, quantity){
        this.id = id;
        this.name = name;
        this.farmer = farmer;
        this.price = price;
        this.quantity = quantity;

    }

    static from(json) {
        return new Product(json.id, json.name, json.farmerid, json.price, json.quantity);
    }
    
    
}

export default Product;