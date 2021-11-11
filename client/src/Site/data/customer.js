class Customer {
    constructor(id,name,surname){
        this.id = id;
        this.surname = surname;
        this.name = name
    }

    static from(json){
        return new Customer(json.id, json.name, json.surname)
    }
}
export default Customer;