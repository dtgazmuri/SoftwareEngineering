class ShopEmployee {
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
      return new ShopEmployee(json.id, json.name, json.surname)
  }
}
export default ShopEmployee;