import ValidateCategory from '../src/services/validateCategory';

it('should return category Technology', () => {
  const verifyCategory = new ValidateCategory().verifyCategoryExist('technology')
  
  expect(verifyCategory).toBe('Technology')
})