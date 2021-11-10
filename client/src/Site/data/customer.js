class Customer {
    contructor(id,name,surname){
        this.id = id;
        this.surname = surname;
        this.name = name
    }

    static from(json){
        return new Customer(json.id, json.surname, json.name)
    }
}
export default Customer;