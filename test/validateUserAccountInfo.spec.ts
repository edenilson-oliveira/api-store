import ValidateUserAccountInfo from '../src/services/validateUserAccountInfo';


describe('Test of validate user infos', () => {
  
  it('should return isValidate true in validate info account', () => {
    const validate = new ValidateUserAccountInfo(
      {
        firstName: 'teste',
        lastName: 'example',
        email: 'teste@example.com',
        password: '12345678'
      }).execute()
    
    expect(validate).toHaveProperty('isValidate',true)
  })
  
  it('should return isValidate false in validate info account', () => {
    const validate = new ValidateUserAccountInfo(
      {
        firstName: 'teste1',
        lastName: 'example',
        email: 'teste@example.com',
        password: '12345678'
      }).execute()
    
    expect(validate).toHaveProperty('isValidate',false)
  })
  
  it('should to have property message about error of firstName or lastName in validate info account', () => {
    const validate = new ValidateUserAccountInfo(
      {
        firstName: 'teste1',
        lastName: 'example',
        email: 'teste@example.com',
        password: '12345678'
      }).execute()
    
    expect(validate).toHaveProperty('message','Firstname or lastName are erro')
  })
  
  it('should to have property message about error of email in validate info account', () => {
    const validate = new ValidateUserAccountInfo(
      {
        firstName: 'teste',
        lastName: 'example',
        email: 'Teste@example.com',
        password: '12345678'
      }).execute()
    
    expect(validate).toHaveProperty('message','Email is not valid')
  })
  
  it('should to have property message about error of passoword in validate info account', () => {
    const validate = new ValidateUserAccountInfo(
      {
        firstName: 'teste',
        lastName: 'example',
        email: 'teste@example.com',
        password: '1234567'
      }).execute()
    
    expect(validate).toHaveProperty('message','Password must be at least 8 characters long')
  })
  
})