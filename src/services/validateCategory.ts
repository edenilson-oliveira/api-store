class ValidateCategory{
  public verifyCategoryExist(category: string) {
    const categories = ['Electronics','Laptop','Computer', 'Computer components','Cell phone']
    
    const returnCategory = categories.find((value: string,index: number) => {
      if(value.toUpperCase() === category.toUpperCase()){
        return categories[index]
      }
    })
    
    return returnCategory
  }
  
}

export default ValidateCategory