class Farmer {
      /**
     * Create a new Farmer
     * @param {*} id farmer id
     * @param {*} name name of the farmer
     * @param {*} surname surname of the farmer    
    */
    constructor(id,name,surname){
        this.id = id;
        this.surname = surname;
        this.name = name
    }

    static from(json){
        return new Farmer(json.id, json.surname, json.name)
    }
}
export default Farmer;