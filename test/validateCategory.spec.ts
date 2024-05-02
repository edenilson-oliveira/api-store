import ValidateCategory from '../src/services/validateCategory';

describe('Test verify category of store and products', () => {
  it('should return category Computer components', () => {
    const verifyCategory = new ValidateCategory().verifyCategoryExist('Computer components')
    
    expect(verifyCategory).toBe('Computer components')
  })
  
  it('should return undefined validate of category ', () => {
    const verifyCategory = new ValidateCategory().verifyCategoryExist('car')
    
    expect(verifyCategory).toBeUndefined()
  })
  
})