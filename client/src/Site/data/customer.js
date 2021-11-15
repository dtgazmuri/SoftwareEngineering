class Customer {
    constructor(id,name,surname,wallet){
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.wallet = wallet;
    }

    static from(json){
        console.log(json.id)
        return new Customer(json.ID, json.NAME, json.SURNAME, json.WALLET)
    }
}
export default Customer;